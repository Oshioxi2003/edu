"""
Admin configuration for catalog app.
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import Book, Unit, Asset


class UnitInline(admin.TabularInline):
    """Inline admin for units."""
    model = Unit
    extra = 0
    fields = ['order', 'title', 'is_free', 'duration_sec']
    ordering = ['order']


class AssetInline(admin.TabularInline):
    """Inline admin for assets."""
    model = Asset
    extra = 0
    fields = ['type', 'file', 'is_protected', 'bytes']
    readonly_fields = ['bytes']


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    """Admin for Book model."""
    
    list_display = ['title', 'slug', 'price', 'is_published', 'unit_count', 'created_at']
    list_filter = ['is_published', 'created_at']
    search_fields = ['title', 'slug', 'description']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['created_at', 'updated_at', 'unit_count', 'free_units_count']
    
    fieldsets = (
        (None, {
            'fields': ('title', 'slug', 'description', 'cover')
        }),
        ('Pricing & Status', {
            'fields': ('price', 'is_published')
        }),
        ('Statistics', {
            'fields': ('unit_count', 'free_units_count'),
            'classes': ('collapse',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [UnitInline]


@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    """Admin for Unit model."""
    
    list_display = ['title', 'book', 'order', 'is_free', 'duration_formatted', 'created_at']
    list_filter = ['book', 'is_free', 'created_at']
    search_fields = ['title', 'book__title', 'transcript']
    autocomplete_fields = ['book']
    readonly_fields = ['created_at', 'updated_at', 'duration_formatted']
    
    fieldsets = (
        (None, {
            'fields': ('book', 'title', 'order')
        }),
        ('Content', {
            'fields': ('transcript', 'duration_sec', 'duration_formatted')
        }),
        ('Settings', {
            'fields': ('is_free',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [AssetInline]
    
    class Media:
        css = {
            'all': ('admin/css/unit_admin.css',)
        }


@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    """Admin for Asset model."""
    
    list_display = ['unit', 'type', 'size_formatted', 'is_protected', 'created_at']
    list_filter = ['type', 'is_protected', 'created_at']
    search_fields = ['unit__title', 'file_path']
    autocomplete_fields = ['unit']
    readonly_fields = ['created_at', 'updated_at', 'size_formatted', 'checksum']
    
    fieldsets = (
        (None, {
            'fields': ('unit', 'type', 'file', 'file_path')
        }),
        ('Metadata', {
            'fields': ('bytes', 'size_formatted', 'checksum', 'is_protected')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        """Auto-populate bytes from file."""
        if obj.file and not obj.bytes:
            obj.bytes = obj.file.size
        super().save_model(request, obj, form, change)

