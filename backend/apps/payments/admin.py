"""
Admin configuration for payments app.
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import Order, Transaction


class TransactionInline(admin.TabularInline):
    """Inline admin for transactions."""
    model = Transaction
    extra = 0
    fields = ['provider_txn_id', 'status', 'signed_ok', 'ipn_verified', 'created_at']
    readonly_fields = ['provider_txn_id', 'status', 'signed_ok', 'ipn_verified', 'created_at']
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """Admin for Order model."""
    
    list_display = ['id', 'user', 'book', 'amount', 'status_display', 'provider', 'created_at']
    list_filter = ['status', 'provider', 'created_at']
    search_fields = ['user__email', 'book__title']
    autocomplete_fields = ['user', 'book']
    readonly_fields = ['amount', 'created_at', 'updated_at']
    
    fieldsets = (
        (None, {
            'fields': ('user', 'book')
        }),
        ('Payment Details', {
            'fields': ('amount', 'currency', 'provider', 'status')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [TransactionInline]
    
    actions = ['mark_as_paid']
    
    def status_display(self, obj):
        """Display status with color."""
        colors = {
            'pending': 'orange',
            'paid': 'green',
            'failed': 'red',
            'cancelled': 'gray',
        }
        color = colors.get(obj.status, 'black')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_display.short_description = 'Status'
    
    def mark_as_paid(self, request, queryset):
        """Mark selected orders as paid (admin only)."""
        if not request.user.is_superuser:
            self.message_user(request, 'Only superusers can manually mark orders as paid.', level='error')
            return
        
        from apps.common.enums import OrderStatus
        from apps.users.models import Enrollment
        from django.utils import timezone
        
        count = 0
        for order in queryset:
            if order.status == OrderStatus.PENDING:
                order.status = OrderStatus.PAID
                order.save()
                
                # Create enrollment
                Enrollment.objects.get_or_create(
                    user=order.user,
                    book=order.book,
                    defaults={
                        'active_from': timezone.now(),
                        'is_active': True
                    }
                )
                count += 1
        
        self.message_user(request, f'{count} orders marked as paid.')
    mark_as_paid.short_description = 'Mark as paid (manual - superuser only)'


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    """Admin for Transaction model."""
    
    list_display = ['id', 'order', 'provider_txn_id', 'status_display', 'signed_ok', 'ipn_verified', 'created_at']
    list_filter = ['status', 'signed_ok', 'ipn_verified', 'created_at']
    search_fields = ['order__id', 'provider_txn_id']
    autocomplete_fields = ['order']
    readonly_fields = ['created_at', 'updated_at', 'raw_payload']
    
    fieldsets = (
        (None, {
            'fields': ('order', 'provider_txn_id', 'status')
        }),
        ('Verification', {
            'fields': ('signed_ok', 'ipn_verified')
        }),
        ('Raw Data', {
            'fields': ('raw_payload',),
            'classes': ('collapse',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
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
    
    def has_add_permission(self, request):
        """Disable manual creation of transactions."""
        return False

