"""
Enhanced admin configuration for catalog app.
"""
from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse, path
from django.shortcuts import redirect
from django.contrib import messages
from django.http import JsonResponse
from django.db.models import Count, Q
import nested_admin
from adminsortable2.admin import SortableAdminMixin, SortableInlineAdminMixin, SortableAdminBase
from .models import Book, Unit, Asset
from apps.quiz.models import Question, Choice
from apps.common.utils.security import generate_audio_signed_url, extract_audio_metadata


# ============================================================================
# INLINE ADMINS
# ============================================================================

class ChoiceNestedInline(SortableInlineAdminMixin, nested_admin.NestedTabularInline):
    """Nested inline for Choices within Questions."""
    model = Choice
    extra = 4
    fields = ['order', 'text', 'is_correct', 'correct_icon']
    readonly_fields = ['correct_icon']
    ordering = ['order']
    
    def correct_icon(self, obj):
        """Show visual indicator for correct answer."""
        if obj.id and obj.is_correct:
            return format_html('<span style="color: green; font-size: 18px;">✓</span>')
        return format_html('<span style="color: #ccc; font-size: 18px;">○</span>')
    correct_icon.short_description = ''


class QuestionNestedInline(SortableInlineAdminMixin, nested_admin.NestedTabularInline):
    """Nested inline for Questions within Units."""
    model = Question
    extra = 0
    fields = ['order', 'type', 'text', 'explanation', 'validation_status']
    readonly_fields = ['validation_status']
    ordering = ['order']
    inlines = [ChoiceNestedInline]
    
    def validation_status(self, obj):
        """Show validation status for the question."""
        if not obj.id:
            return '-'
        
        from apps.common.enums import QuestionType
        choices_count = obj.choices.count()
        correct_count = obj.choices.filter(is_correct=True).count()
        
        errors = []
        
        # Check if question has choices
        if choices_count == 0:
            errors.append('No choices')
        
        # Validate based on question type
        if obj.type == QuestionType.SINGLE:
            if correct_count != 1:
                errors.append(f'Need exactly 1 correct answer (found {correct_count})')
        elif obj.type == QuestionType.MULTI:
            if correct_count == 0:
                errors.append('Need at least 1 correct answer')
        
        if errors:
            return format_html(
                '<span style="color: red; font-weight: bold;">⚠ {}</span>',
                ', '.join(errors)
            )
        return format_html('<span style="color: green;">✓ OK</span>')
    validation_status.short_description = 'Validation'


class AssetInline(admin.TabularInline):
    """Inline admin for assets."""
    model = Asset
    extra = 0
    fields = ['type', 'file', 'file_path', 'file_info', 'is_protected', 'signed_url_btn']
    readonly_fields = ['file_info', 'signed_url_btn']
    
    def file_info(self, obj):
        """Display file information."""
        if not obj.id:
            return '-'
        
        info_parts = []
        if obj.bytes:
            info_parts.append(f'Size: {obj.size_formatted}')
        if obj.checksum:
            info_parts.append(f'Hash: {obj.checksum[:8]}...')
        
        return format_html('<small>{}</small>', ' | '.join(info_parts) if info_parts else 'No metadata')
    file_info.short_description = 'File Info'
    
    def signed_url_btn(self, obj):
        """Button to generate signed URL."""
        if not obj.id or obj.type != 'audio':
            return '-'
        
        return format_html(
            '<button type="button" class="button" onclick="generateSignedURL({})">Generate 5-min Test URL</button>',
            obj.id
        )
    signed_url_btn.short_description = 'Test Access'


class UnitInline(SortableInlineAdminMixin, admin.TabularInline):
    """Inline admin for units within Book."""
    model = Unit
    extra = 0
    fields = ['order', 'title', 'is_free', 'duration_formatted', 'is_published_icon', 'quick_edit']
    readonly_fields = ['duration_formatted', 'is_published_icon', 'quick_edit']
    ordering = ['order']
    show_change_link = True
    
    def duration_formatted(self, obj):
        """Display formatted duration."""
        if obj.duration_sec:
            return obj.duration_formatted
        return '-'
    duration_formatted.short_description = 'Duration'
    
    def is_published_icon(self, obj):
        """Show publication status icon."""
        if obj.id:
            # Check if unit is ready to publish
            has_audio = obj.assets.filter(type='audio').exists()
            has_questions = obj.questions.exists()
            
            if has_audio and has_questions:
                return format_html('<span style="color: green;">✓</span>')
            else:
                return format_html('<span style="color: orange;">○</span>')
        return '-'
    is_published_icon.short_description = 'Ready'
    
    def quick_edit(self, obj):
        """Quick edit button."""
        if obj.id:
            url = reverse('admin:catalog_unit_change', args=[obj.id])
            return format_html('<a class="button" href="{}">Edit</a>', url)
        return '-'
    quick_edit.short_description = ''


# ============================================================================
# MODEL ADMINS
# ============================================================================

@admin.register(Book)
class BookAdmin(SortableAdminBase, admin.ModelAdmin):
    """Enhanced admin for Book model."""
    
    list_display = ['title', 'is_published_display', 'price_display', 'units_count', 'enrollments_count', 'updated_at']
    list_filter = ['is_published', 'created_at']
    search_fields = ['title', 'slug', 'description']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['created_at', 'updated_at', 'unit_count', 'free_units_count', 'stats_display']
    
    fieldsets = (
        (None, {
            'fields': ('title', 'slug', 'description', 'cover')
        }),
        ('Pricing & Status', {
            'fields': ('price', 'is_published')
        }),
        ('Statistics', {
            'fields': ('stats_display',),
            'classes': ('collapse',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [UnitInline]
    actions = ['publish_books', 'unpublish_books', 'duplicate_book']
    
    def get_queryset(self, request):
        """Optimize queryset with annotations."""
        qs = super().get_queryset(request)
        qs = qs.annotate(
            _units_count=Count('units', distinct=True),
            _enrollments_count=Count('enrollments', distinct=True)
        )
        return qs
    
    def units_count(self, obj):
        """Display units count."""
        count = getattr(obj, '_units_count', obj.unit_count)
        return format_html(
            '<a href="{}?book__id__exact={}">{} units</a>',
            reverse('admin:catalog_unit_changelist'),
            obj.id,
            count
        )
    units_count.short_description = 'Units'
    units_count.admin_order_field = '_units_count'
    
    def enrollments_count(self, obj):
        """Display enrollments count."""
        count = getattr(obj, '_enrollments_count', 0)
        if count > 0:
            return format_html(
                '<a href="{}?book__id__exact={}">{} students</a>',
                reverse('admin:users_enrollment_changelist'),
                obj.id,
                count
            )
        return '0'
    enrollments_count.short_description = 'Enrollments'
    enrollments_count.admin_order_field = '_enrollments_count'
    
    def is_published_display(self, obj):
        """Display publication status with color."""
        if obj.is_published:
            return format_html('<span style="color: green; font-weight: bold;">✓ Published</span>')
        return format_html('<span style="color: orange;">○ Draft</span>')
    is_published_display.short_description = 'Status'
    is_published_display.admin_order_field = 'is_published'
    
    def price_display(self, obj):
        """Display price with currency."""
        if obj.price > 0:
            return format_html('<strong>{:,.0f} VND</strong>', obj.price)
        return format_html('<span style="color: green;">Free</span>')
    price_display.short_description = 'Price'
    price_display.admin_order_field = 'price'
    
    def stats_display(self, obj):
        """Display detailed statistics."""
        if not obj.id:
            return '-'
        
        total_units = obj.units.count()
        free_units = obj.units.filter(is_free=True).count()
        units_with_audio = obj.units.filter(assets__type='audio').distinct().count()
        units_with_quiz = obj.units.filter(questions__isnull=False).distinct().count()
        
        return format_html(
            '<ul style="margin: 0; padding-left: 20px;">'
            '<li>Total Units: {}</li>'
            '<li>Free Units: {}</li>'
            '<li>Units with Audio: {} ({:.0f}%)</li>'
            '<li>Units with Quiz: {} ({:.0f}%)</li>'
            '</ul>',
            total_units,
            free_units,
            units_with_audio,
            (units_with_audio / total_units * 100) if total_units > 0 else 0,
            units_with_quiz,
            (units_with_quiz / total_units * 100) if total_units > 0 else 0,
        )
    stats_display.short_description = 'Content Statistics'
    
    # Actions
    def publish_books(self, request, queryset):
        """Publish selected books."""
        updated = queryset.update(is_published=True)
        self.message_user(request, f'{updated} books published.', messages.SUCCESS)
    publish_books.short_description = '✓ Publish selected books'
    
    def unpublish_books(self, request, queryset):
        """Unpublish selected books."""
        updated = queryset.update(is_published=False)
        self.message_user(request, f'{updated} books unpublished.', messages.SUCCESS)
    unpublish_books.short_description = '○ Unpublish selected books'
    
    def duplicate_book(self, request, queryset):
        """Duplicate selected book (template)."""
        if queryset.count() != 1:
            self.message_user(request, 'Please select exactly one book to duplicate.', messages.ERROR)
            return
        
        book = queryset.first()
        new_book = Book.objects.create(
            title=f"{book.title} (Copy)",
            slug=f"{book.slug}-copy",
            description=book.description,
            price=book.price,
            is_published=False
        )
        
        # Copy units
        for unit in book.units.all():
            Unit.objects.create(
                book=new_book,
                title=unit.title,
                transcript=unit.transcript,
                is_free=unit.is_free,
                order=unit.order
            )
        
        self.message_user(
            request,
            f'Book duplicated as "{new_book.title}". Edit it now.',
            messages.SUCCESS
        )
        return redirect('admin:catalog_book_change', new_book.id)
    duplicate_book.short_description = '📋 Duplicate book (template)'


@admin.register(Unit)
class UnitAdmin(SortableAdminBase, nested_admin.NestedModelAdmin):
    """Enhanced admin for Unit model with nested Questions and Choices."""
    
    list_display = ['title', 'book', 'order', 'is_free_icon', 'has_audio_icon', 'duration_formatted', 'questions_count', 'status_display']
    list_filter = ['book', 'is_free', 'created_at']
    search_fields = ['title', 'book__title', 'transcript']
    autocomplete_fields = ['book']
    readonly_fields = ['created_at', 'updated_at', 'duration_formatted', 'content_status']
    list_editable = ['order']
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('book', 'title', 'order', 'is_free')
        }),
        ('Content', {
            'fields': ('transcript',),
            'classes': ('collapse',)
        }),
        ('Status', {
            'fields': ('content_status',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [AssetInline, QuestionNestedInline]
    actions = ['set_free', 'set_paid', 'recompute_audio_duration', 'publish_units', 'unpublish_units']
    
    change_form_template = 'admin/catalog/unit_change_form.html'
    
    def get_queryset(self, request):
        """Optimize queryset."""
        qs = super().get_queryset(request)
        qs = qs.select_related('book').annotate(
            _questions_count=Count('questions', distinct=True),
            _has_audio=Count('assets', filter=Q(assets__type='audio'), distinct=True)
        )
        return qs
    
    def is_free_icon(self, obj):
        """Display free status."""
        if obj.is_free:
            return format_html('<span style="color: green;" title="Free">🆓</span>')
        return format_html('<span style="color: orange;" title="Paid">💰</span>')
    is_free_icon.short_description = 'Access'
    
    def has_audio_icon(self, obj):
        """Display audio status."""
        has_audio = getattr(obj, '_has_audio', 0) > 0
        if has_audio:
            return format_html('<span style="color: green;" title="Has audio">🔊</span>')
        return format_html('<span style="color: red;" title="No audio">🔇</span>')
    has_audio_icon.short_description = 'Audio'
    
    def duration_formatted(self, obj):
        """Display formatted duration."""
        if obj.duration_sec:
            return obj.duration_formatted
        return format_html('<span style="color: #999;">-</span>')
    duration_formatted.short_description = 'Duration'
    
    def questions_count(self, obj):
        """Display questions count."""
        count = getattr(obj, '_questions_count', 0)
        if count > 0:
            return format_html(
                '<a href="{}?unit__id__exact={}">{} Qs</a>',
                reverse('admin:quiz_question_changelist'),
                obj.id,
                count
            )
        return format_html('<span style="color: #999;">0</span>')
    questions_count.short_description = 'Questions'
    
    def status_display(self, obj):
        """Display overall status."""
        has_audio = getattr(obj, '_has_audio', 0) > 0
        has_questions = getattr(obj, '_questions_count', 0) > 0
        
        if has_audio and has_questions:
            return format_html('<span style="color: green; font-weight: bold;">✓ Complete</span>')
        elif has_audio or has_questions:
            return format_html('<span style="color: orange;">⚠ Partial</span>')
        return format_html('<span style="color: red;">✗ Empty</span>')
    status_display.short_description = 'Status'
    
    def content_status(self, obj):
        """Detailed content status."""
        if not obj.id:
            return '-'
        
        has_audio = obj.assets.filter(type='audio').exists()
        has_transcript = bool(obj.transcript)
        questions_count = obj.questions.count()
        
        items = []
        items.append(f"{'✓' if has_audio else '✗'} Audio: {'Yes' if has_audio else 'No'}")
        items.append(f"{'✓' if has_transcript else '✗'} Transcript: {'Yes' if has_transcript else 'No'}")
        items.append(f"{'✓' if questions_count > 0 else '✗'} Questions: {questions_count}")
        
        return format_html('<ul style="margin: 0; padding-left: 20px;">' + ''.join([f'<li>{item}</li>' for item in items]) + '</ul>')
    content_status.short_description = 'Content Status'
    
    # Actions
    def set_free(self, request, queryset):
        """Set units as free."""
        updated = queryset.update(is_free=True)
        self.message_user(request, f'{updated} units set as free.', messages.SUCCESS)
    set_free.short_description = '🆓 Set as FREE'
    
    def set_paid(self, request, queryset):
        """Set units as paid."""
        updated = queryset.update(is_free=False)
        self.message_user(request, f'{updated} units set as paid.', messages.SUCCESS)
    set_paid.short_description = '💰 Set as PAID'
    
    def recompute_audio_duration(self, request, queryset):
        """Recompute audio duration from files."""
        updated = 0
        for unit in queryset:
            audio_asset = unit.assets.filter(type='audio').first()
            if audio_asset and audio_asset.file:
                try:
                    metadata = extract_audio_metadata(audio_asset.file.path)
                    if metadata.get('duration_sec'):
                        unit.duration_sec = metadata['duration_sec']
                        unit.save()
                        updated += 1
                except Exception as e:
                    pass
        
        self.message_user(request, f'{updated} units updated with audio duration.', messages.SUCCESS)
    recompute_audio_duration.short_description = '⏱ Recompute audio duration'
    
    def publish_units(self, request, queryset):
        """Publish units (placeholder for future feature)."""
        self.message_user(request, 'Publish feature coming soon.', messages.INFO)
    publish_units.short_description = '✓ Publish selected units'
    
    def unpublish_units(self, request, queryset):
        """Unpublish units (placeholder for future feature)."""
        self.message_user(request, 'Unpublish feature coming soon.', messages.INFO)
    unpublish_units.short_description = '○ Unpublish selected units'
    
    def get_urls(self):
        """Add custom URLs."""
        urls = super().get_urls()
        custom_urls = [
            path('<int:unit_id>/preview/', self.admin_site.admin_view(self.preview_unit), name='catalog_unit_preview'),
            path('<int:unit_id>/generate-signed-url/', self.admin_site.admin_view(self.generate_signed_url_view), name='catalog_unit_signed_url'),
        ]
        return custom_urls + urls
    
    def preview_unit(self, request, unit_id):
        """Preview unit as student (placeholder)."""
        # In production, redirect to frontend URL
        unit = Unit.objects.get(id=unit_id)
        messages.info(request, f'Preview feature for unit "{unit.title}" coming soon.')
        return redirect('admin:catalog_unit_change', unit_id)
    
    def generate_signed_url_view(self, request, unit_id):
        """Generate signed URL for audio."""
        unit = Unit.objects.get(id=unit_id)
        audio_asset = unit.assets.filter(type='audio').first()
        
        if not audio_asset:
            return JsonResponse({'error': 'No audio found'}, status=404)
        
        token = generate_audio_signed_url(audio_asset, expires_in_minutes=5)
        
        return JsonResponse({
            'success': True,
            'token': token,
            'expires_in': '5 minutes',
            'message': 'Signed URL generated successfully'
        })


@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    """Enhanced admin for Asset model."""
    
    list_display = ['unit', 'type', 'size_formatted', 'is_protected_icon', 'checksum_short', 'created_at']
    list_filter = ['type', 'is_protected', 'created_at']
    search_fields = ['unit__title', 'file_path', 'checksum']
    autocomplete_fields = ['unit']
    readonly_fields = ['created_at', 'updated_at', 'size_formatted', 'checksum', 'file_preview']
    
    fieldsets = (
        (None, {
            'fields': ('unit', 'type', 'file', 'file_path')
        }),
        ('Security', {
            'fields': ('is_protected',)
        }),
        ('Metadata', {
            'fields': ('bytes', 'size_formatted', 'checksum'),
            'classes': ('collapse',)
        }),
        ('Preview', {
            'fields': ('file_preview',),
            'classes': ('collapse',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def is_protected_icon(self, obj):
        """Display protection status."""
        if obj.is_protected:
            return format_html('<span style="color: green;" title="Protected">🔒</span>')
        return format_html('<span style="color: orange;" title="Public">🔓</span>')
    is_protected_icon.short_description = 'Protected'
    
    def checksum_short(self, obj):
        """Display shortened checksum."""
        if obj.checksum:
            return format_html('<code>{}</code>', obj.checksum[:12] + '...')
        return '-'
    checksum_short.short_description = 'Checksum'
    
    def file_preview(self, obj):
        """Preview file information."""
        if not obj.id:
            return '-'
        
        info = f'<strong>File:</strong> {obj.file.name if obj.file else obj.file_path}<br>'
        info += f'<strong>Size:</strong> {obj.size_formatted}<br>'
        info += f'<strong>Protected:</strong> {"Yes" if obj.is_protected else "No"}<br>'
        
        if obj.type == 'audio' and obj.file:
            token = generate_audio_signed_url(obj, expires_in_minutes=5)
            info += f'<br><strong>Test URL Token:</strong><br><code>{token}</code>'
        
        return format_html(info)
    file_preview.short_description = 'File Details'
    
    def save_model(self, request, obj, form, change):
        """Auto-populate metadata from file."""
        if obj.file:
            # Set bytes
            if not obj.bytes:
                obj.bytes = obj.file.size
            
            # Extract audio metadata
            if obj.type == 'audio':
                try:
                    metadata = extract_audio_metadata(obj.file.path)
                    # Update unit duration if this is the primary audio
                    if metadata.get('duration_sec') and not obj.unit.duration_sec:
                        obj.unit.duration_sec = metadata['duration_sec']
                        obj.unit.save()
                except Exception:
                    pass
            
            # Generate checksum
            if not obj.checksum:
                import hashlib
                obj.file.seek(0)
                obj.checksum = hashlib.sha256(obj.file.read()).hexdigest()
                obj.file.seek(0)
        
        super().save_model(request, obj, form, change)
