"""
Admin configuration for progress app.
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import UserProgress, ListeningSession


@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    """Admin for UserProgress model."""
    
    list_display = ['user', 'book', 'completed_units', 'completion_pct_display', 'total_listen_time', 'last_score_pct']
    list_filter = ['book', 'created_at']
    search_fields = ['user__email', 'book__title']
    autocomplete_fields = ['user', 'book', 'last_unit']
    readonly_fields = ['created_at', 'updated_at', 'completion_pct']
    
    fieldsets = (
        (None, {
            'fields': ('user', 'book')
        }),
        ('Progress', {
            'fields': ('completed_units', 'completion_pct', 'last_unit', 'last_score_pct')
        }),
        ('Statistics', {
            'fields': ('total_listen_sec',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def completion_pct_display(self, obj):
        """Display completion percentage with progress bar."""
        pct = obj.completion_pct
        color = 'green' if pct >= 70 else 'orange' if pct >= 40 else 'red'
        return format_html(
            '<div style="width:100px; background:#f0f0f0; border-radius:3px;">'
            '<div style="width:{}%; background:{}; padding:2px; border-radius:3px; color:white; text-align:center;">'
            '{}%'
            '</div></div>',
            pct, color, pct
        )
    completion_pct_display.short_description = 'Completion'
    
    def total_listen_time(self, obj):
        """Display total listening time in formatted way."""
        hours = obj.total_listen_sec // 3600
        minutes = (obj.total_listen_sec % 3600) // 60
        return f"{hours}h {minutes}m"
    total_listen_time.short_description = 'Total Time'


@admin.register(ListeningSession)
class ListeningSessionAdmin(admin.ModelAdmin):
    """Admin for ListeningSession model."""
    
    list_display = ['user', 'unit', 'duration_formatted', 'completed_display', 'created_at']
    list_filter = ['completed', 'created_at']
    search_fields = ['user__email', 'unit__title']
    autocomplete_fields = ['user', 'unit']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        (None, {
            'fields': ('user', 'unit')
        }),
        ('Session', {
            'fields': ('duration_sec', 'completed')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def duration_formatted(self, obj):
        """Display duration in MM:SS format."""
        minutes = obj.duration_sec // 60
        seconds = obj.duration_sec % 60
        return f"{minutes:02d}:{seconds:02d}"
    duration_formatted.short_description = 'Duration'
    
    def completed_display(self, obj):
        """Display completed status with icon."""
        if obj.completed:
            return format_html('<span style="color: green;">✓ Yes</span>')
        return format_html('<span style="color: gray;">○ No</span>')
    completed_display.short_description = 'Completed'
    
    def has_add_permission(self, request):
        """Disable manual creation of sessions."""
        return False

