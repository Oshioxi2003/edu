"""
Enhanced admin configuration for payments app.
"""
from django.contrib import admin
from django.utils.html import format_html
from django.contrib import messages
from django.db.models import Count, Sum, Q
from django.utils import timezone
from .models import Order, Transaction
from apps.common.enums import OrderStatus, TransactionStatus
from apps.users.models import Enrollment


class TransactionInline(admin.TabularInline):
    """Inline admin for transactions."""
    model = Transaction
    extra = 0
    fields = ['provider_txn_id', 'status_display', 'signed_ok', 'ipn_verified', 'created_at']
    readonly_fields = ['provider_txn_id', 'status_display', 'signed_ok', 'ipn_verified', 'created_at']
    can_delete = False
    
    def status_display(self, obj):
        """Display status with color."""
        colors = {
            'success': 'green',
            'failed': 'red',
            'pending': 'orange',
        }
        color = colors.get(obj.status, 'black')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_display.short_description = 'Status'


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """Enhanced admin for Order model."""
    
    list_display = [
        'id',
        'user',
        'book',
        'amount_display',
        'status_display',
        'provider_display',
        'enrollment_status',
        'created_at'
    ]
    list_filter = ['status', 'provider', 'created_at', 'currency']
    search_fields = ['id', 'user__email', 'book__title']
    autocomplete_fields = ['user', 'book']
    readonly_fields = [
        'amount',
        'currency',
        'created_at',
        'updated_at',
        'order_details',
        'payment_timeline'
    ]
    
    fieldsets = (
        ('Order Info', {
            'fields': ('user', 'book')
        }),
        ('Payment Details', {
            'fields': ('amount', 'currency', 'provider', 'status')
        }),
        ('Details', {
            'fields': ('order_details', 'payment_timeline'),
            'classes': ('collapse',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [TransactionInline]
    
    actions = [
        'mark_as_paid',
        'mark_as_failed',
        'mark_as_cancelled',
        'resend_receipt',
        'export_orders'
    ]
    
    def get_queryset(self, request):
        """Optimize queryset."""
        from django.db.models import F
        qs = super().get_queryset(request)
        qs = qs.select_related('user', 'book').annotate(
            _transactions_count=Count('transactions', distinct=True),
            _has_enrollment=Count('book__enrollments', filter=Q(book__enrollments__user_id=F('user_id')), distinct=True)
        )
        return qs
    
    def amount_display(self, obj):
        """Display amount with currency."""
        return format_html(
            '<strong style="font-size: 14px;">{:,.0f} {}</strong>',
            obj.amount,
            obj.currency
        )
    amount_display.short_description = 'Amount'
    amount_display.admin_order_field = 'amount'
    
    def status_display(self, obj):
        """Display status with color and icon."""
        icons = {
            OrderStatus.PENDING: '⏳',
            OrderStatus.PAID: '✓',
            OrderStatus.FAILED: '✗',
            OrderStatus.CANCELLED: '⊘',
        }
        colors = {
            OrderStatus.PENDING: 'orange',
            OrderStatus.PAID: 'green',
            OrderStatus.FAILED: 'red',
            OrderStatus.CANCELLED: 'gray',
        }
        
        icon = icons.get(obj.status, '○')
        color = colors.get(obj.status, 'black')
        
        return format_html(
            '<span style="color: {}; font-weight: bold; font-size: 14px;">{} {}</span>',
            color,
            icon,
            obj.get_status_display()
        )
    status_display.short_description = 'Status'
    status_display.admin_order_field = 'status'
    
    def provider_display(self, obj):
        """Display provider with logo/icon."""
        provider_colors = {
            'vnpay': '#0066CC',
            'momo': '#A50064',
        }
        color = provider_colors.get(obj.provider, '#333')
        
        return format_html(
            '<span style="background: {}; color: white; padding: 3px 8px; border-radius: 3px; font-weight: bold;">{}</span>',
            color,
            obj.get_provider_display()
        )
    provider_display.short_description = 'Provider'
    provider_display.admin_order_field = 'provider'
    
    def enrollment_status(self, obj):
        """Show if user is enrolled."""
        has_enrollment = Enrollment.objects.filter(
            user=obj.user,
            book=obj.book,
            is_active=True
        ).exists()
        
        if has_enrollment:
            return format_html('<span style="color: green;" title="Enrolled">✓</span>')
        elif obj.status == OrderStatus.PAID:
            return format_html('<span style="color: red;" title="Paid but not enrolled">⚠</span>')
        return format_html('<span style="color: gray;" title="Not enrolled">-</span>')
    enrollment_status.short_description = 'Enrolled'
    
    def order_details(self, obj):
        """Display detailed order information."""
        if not obj.id:
            return '-'
        
        html = '<div style="padding: 10px; background: #f5f5f5; border-radius: 5px;">'
        html += f'<p><strong>Order ID:</strong> #{obj.id}</p>'
        html += f'<p><strong>User:</strong> {obj.user.email}</p>'
        html += f'<p><strong>Book:</strong> {obj.book.title}</p>'
        html += f'<p><strong>Amount:</strong> {obj.amount:,.0f} {obj.currency}</p>'
        html += f'<p><strong>Provider:</strong> {obj.get_provider_display()}</p>'
        html += f'<p><strong>Status:</strong> {obj.get_status_display()}</p>'
        
        # Check enrollment
        enrollment = Enrollment.objects.filter(user=obj.user, book=obj.book).first()
        if enrollment:
            html += f'<p><strong>Enrollment:</strong> ✓ Active (since {enrollment.created_at.strftime("%Y-%m-%d %H:%M")})</p>'
        else:
            html += '<p><strong>Enrollment:</strong> ✗ Not enrolled</p>'
        
        # Transaction count
        txn_count = obj.transactions.count()
        html += f'<p><strong>Transactions:</strong> {txn_count}</p>'
        
        html += '</div>'
        return format_html(html)
    order_details.short_description = 'Order Details'
    
    def payment_timeline(self, obj):
        """Display payment timeline."""
        if not obj.id:
            return '-'
        
        html = '<div style="padding: 10px; background: #f5f5f5; border-radius: 5px;">'
        html += '<h4 style="margin-top: 0;">Payment Timeline</h4>'
        html += '<ul style="margin: 0; padding-left: 20px;">'
        html += f'<li><strong>Created:</strong> {obj.created_at.strftime("%Y-%m-%d %H:%M:%S")}</li>'
        
        for txn in obj.transactions.order_by('created_at'):
            html += f'<li><strong>{txn.get_status_display()}:</strong> {txn.created_at.strftime("%Y-%m-%d %H:%M:%S")}'
            if txn.provider_txn_id:
                html += f' (ID: {txn.provider_txn_id})'
            html += '</li>'
        
        html += f'<li><strong>Last Updated:</strong> {obj.updated_at.strftime("%Y-%m-%d %H:%M:%S")}</li>'
        html += '</ul>'
        html += '</div>'
        
        return format_html(html)
    payment_timeline.short_description = 'Timeline'
    
    # Actions
    def mark_as_paid(self, request, queryset):
        """Mark selected orders as paid (admin/manual payment)."""
        if not request.user.is_superuser:
            self.message_user(
                request,
                '⚠ Only superusers can manually mark orders as paid.',
                messages.ERROR
            )
            return
        
        updated = 0
        enrolled = 0
        
        for order in queryset:
            if order.status == OrderStatus.PENDING:
                # Update order status
                order.status = OrderStatus.PAID
                order.save()
                updated += 1
                
                # Create or activate enrollment
                enrollment, created = Enrollment.objects.get_or_create(
                    user=order.user,
                    book=order.book,
                    defaults={
                        'active_from': timezone.now(),
                        'is_active': True
                    }
                )
                
                if not enrollment.is_active:
                    enrollment.is_active = True
                    enrollment.active_from = timezone.now()
                    enrollment.save()
                
                enrolled += 1
                
                # Create success transaction
                Transaction.objects.create(
                    order=order,
                    provider_txn_id=f'MANUAL_{order.id}_{timezone.now().timestamp()}',
                    status=TransactionStatus.SUCCESS,
                    signed_ok=True,
                    ipn_verified=True,
                    raw_payload={'manual': True, 'admin_user': request.user.email}
                )
        
        self.message_user(
            request,
            f'✓ Marked {updated} orders as paid. Created/activated {enrolled} enrollments.',
            messages.SUCCESS
        )
    mark_as_paid.short_description = '✓ Mark as PAID (manual - superuser only)'
    
    def mark_as_failed(self, request, queryset):
        """Mark selected orders as failed."""
        pending_only = queryset.filter(status=OrderStatus.PENDING)
        updated = pending_only.update(status=OrderStatus.FAILED)
        
        self.message_user(
            request,
            f'Marked {updated} pending orders as failed.',
            messages.SUCCESS
        )
    mark_as_failed.short_description = '✗ Mark as FAILED'
    
    def mark_as_cancelled(self, request, queryset):
        """Mark selected orders as cancelled."""
        pending_only = queryset.filter(status=OrderStatus.PENDING)
        updated = pending_only.update(status=OrderStatus.CANCELLED)
        
        self.message_user(
            request,
            f'Cancelled {updated} pending orders.',
            messages.SUCCESS
        )
    mark_as_cancelled.short_description = '⊘ Mark as CANCELLED'
    
    def resend_receipt(self, request, queryset):
        """Resend receipt email (placeholder)."""
        paid_orders = queryset.filter(status=OrderStatus.PAID)
        count = paid_orders.count()
        
        # TODO: Implement email sending logic
        self.message_user(
            request,
            f'Receipt resend feature coming soon ({count} orders selected).',
            messages.INFO
        )
    resend_receipt.short_description = '📧 Resend receipt email'
    
    def export_orders(self, request, queryset):
        """Export orders to CSV (placeholder)."""
        self.message_user(
            request,
            f'Export feature coming soon ({queryset.count()} orders selected).',
            messages.INFO
        )
    export_orders.short_description = '📥 Export to CSV'


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    """Enhanced admin for Transaction model."""
    
    list_display = [
        'id',
        'order_link',
        'provider_txn_id',
        'status_display',
        'verification_status',
        'created_at'
    ]
    list_filter = ['status', 'signed_ok', 'ipn_verified', 'created_at']
    search_fields = ['order__id', 'provider_txn_id', 'order__user__email']
    autocomplete_fields = ['order']
    readonly_fields = [
        'created_at',
        'updated_at',
        'raw_payload_display',
        'verification_details'
    ]
    
    fieldsets = (
        ('Transaction Info', {
            'fields': ('order', 'provider_txn_id', 'status')
        }),
        ('Verification', {
            'fields': ('signed_ok', 'ipn_verified', 'verification_details')
        }),
        ('Raw Data', {
            'fields': ('raw_payload_display',),
            'classes': ('collapse',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['verify_transactions', 'export_transactions']
    
    def order_link(self, obj):
        """Link to order."""
        from django.urls import reverse
        url = reverse('admin:payments_order_change', args=[obj.order.id])
        return format_html(
            '<a href="{}">Order #{}</a>',
            url,
            obj.order.id
        )
    order_link.short_description = 'Order'
    
    def status_display(self, obj):
        """Display status with color."""
        icons = {
            TransactionStatus.SUCCESS: '✓',
            TransactionStatus.FAILED: '✗',
            TransactionStatus.PENDING: '⏳',
        }
        colors = {
            TransactionStatus.SUCCESS: 'green',
            TransactionStatus.FAILED: 'red',
            TransactionStatus.PENDING: 'orange',
        }
        
        icon = icons.get(obj.status, '○')
        color = colors.get(obj.status, 'black')
        
        return format_html(
            '<span style="color: {}; font-weight: bold;">{} {}</span>',
            color,
            icon,
            obj.get_status_display()
        )
    status_display.short_description = 'Status'
    status_display.admin_order_field = 'status'
    
    def verification_status(self, obj):
        """Display verification status."""
        if obj.signed_ok and obj.ipn_verified:
            return format_html('<span style="color: green; font-weight: bold;">✓✓ Verified</span>')
        elif obj.signed_ok:
            return format_html('<span style="color: orange;">✓ Signed only</span>')
        elif obj.ipn_verified:
            return format_html('<span style="color: orange;">✓ IPN only</span>')
        return format_html('<span style="color: red;">✗ Not verified</span>')
    verification_status.short_description = 'Verification'
    
    def raw_payload_display(self, obj):
        """Display raw payload in formatted JSON."""
        if not obj.raw_payload:
            return '-'
        
        import json
        try:
            formatted = json.dumps(obj.raw_payload, indent=2, ensure_ascii=False)
            return format_html('<pre style="background: #f5f5f5; padding: 10px; border-radius: 5px; overflow: auto;">{}</pre>', formatted)
        except Exception:
            return format_html('<pre>{}</pre>', obj.raw_payload)
    raw_payload_display.short_description = 'Raw Payload (JSON)'
    
    def verification_details(self, obj):
        """Display verification details."""
        html = '<div style="padding: 10px; background: #f5f5f5; border-radius: 5px;">'
        html += f'<p><strong>Signature Verified:</strong> {"✓ Yes" if obj.signed_ok else "✗ No"}</p>'
        html += f'<p><strong>IPN Verified:</strong> {"✓ Yes" if obj.ipn_verified else "✗ No"}</p>'
        html += f'<p><strong>Provider Transaction ID:</strong> {obj.provider_txn_id or "N/A"}</p>'
        html += f'<p><strong>Status:</strong> {obj.get_status_display()}</p>'
        html += '</div>'
        return format_html(html)
    verification_details.short_description = 'Verification Details'
    
    def has_add_permission(self, request):
        """Disable manual creation of transactions."""
        return False
    
    def verify_transactions(self, request, queryset):
        """Re-verify selected transactions (placeholder)."""
        self.message_user(
            request,
            f'Re-verification feature coming soon ({queryset.count()} transactions selected).',
            messages.INFO
        )
    verify_transactions.short_description = '🔍 Re-verify transactions'
    
    def export_transactions(self, request, queryset):
        """Export transactions (placeholder)."""
        self.message_user(
            request,
            f'Export feature coming soon ({queryset.count()} transactions selected).',
            messages.INFO
        )
    export_transactions.short_description = '📥 Export to CSV'
