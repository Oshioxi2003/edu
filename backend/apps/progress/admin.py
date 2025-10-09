"""
Enhanced admin configuration for progress app.
"""
from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Count, Sum
from .models import UserProgress, ListeningSession


@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    """Enhanced admin for UserProgress model."""
    
    list_display = [
        'user',
        'book',
        'completed_units',
        'completion_display',
        'listen_time_display',
        'last_score_display',
        'updated_at'
    ]
    list_filter = ['book', 'created_at', 'updated_at']
    search_fields = ['user__email', 'book__title']
    autocomplete_fields = ['user', 'book', 'last_unit']
    readonly_fields = ['created_at', 'updated_at', 'completion_pct', 'progress_details']
    
    fieldsets = (
        ('User & Book', {
            'fields': ('user', 'book')
        }),
        ('Progress Metrics', {
            'fields': ('completed_units', 'completion_pct', 'last_unit')
        }),
        ('Performance', {
            'fields': ('last_score_pct', 'total_listen_sec')
        }),
        ('Details', {
            'fields': ('progress_details',),
            'classes': ('collapse',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['reset_progress', 'export_progress']
    
    def completion_display(self, obj):
        """Display completion with progress bar."""
        pct = obj.completion_pct
        color = 'green' if pct >= 80 else 'orange' if pct >= 50 else 'red'
        
        return format_html(
            '<div style="width: 120px; background: #f0f0f0; border-radius: 3px; overflow: hidden;">'
            '<div style="width: {}%; background: {}; padding: 3px 5px; color: white; font-weight: bold; text-align: center; min-width: 30px;">'
            '{:.0f}%'
            '</div></div>',
            pct, color, pct
        )
    completion_display.short_description = 'Completion'
    
    def listen_time_display(self, obj):
        """Display total listening time formatted."""
        hours = obj.total_listen_sec // 3600
        minutes = (obj.total_listen_sec % 3600) // 60
        
        if hours > 0:
            return format_html('<strong>{}h {}m</strong>', hours, minutes)
        return format_html('<strong>{}m</strong>', minutes)
    listen_time_display.short_description = 'Listen Time'
    
    def last_score_display(self, obj):
        """Display last score with color."""
        if obj.last_score_pct == 0:
            return format_html('<span style="color: gray;">-</span>')
        
        color = 'green' if obj.last_score_pct >= 70 else 'orange' if obj.last_score_pct >= 50 else 'red'
        return format_html(
            '<span style="color: {}; font-weight: bold;">{:.0f}%</span>',
            color,
            obj.last_score_pct
        )
    last_score_display.short_description = 'Last Score'
    
    def progress_details(self, obj):
        """Display detailed progress information."""
        if not obj.id:
            return '-'
        
        total_units = obj.book.units.count()
        completed = obj.completed_units
        remaining = total_units - completed
        
        html = '<div style="padding: 10px; background: #f5f5f5; border-radius: 5px;">'
        html += f'<h4 style="margin-top: 0;">Progress Summary</h4>'
        html += f'<p><strong>Book:</strong> {obj.book.title}</p>'
        html += f'<p><strong>Total Units:</strong> {total_units}</p>'
        html += f'<p><strong>Completed:</strong> {completed} ({obj.completion_pct:.1f}%)</p>'
        html += f'<p><strong>Remaining:</strong> {remaining}</p>'
        
        if obj.last_unit:
            html += f'<p><strong>Last Unit:</strong> {obj.last_unit.title}</p>'
        
        html += f'<p><strong>Total Listen Time:</strong> {obj.total_listen_sec // 3600}h {(obj.total_listen_sec % 3600) // 60}m</p>'
        
        if obj.last_score_pct > 0:
            html += f'<p><strong>Last Quiz Score:</strong> {obj.last_score_pct:.1f}%</p>'
        
        html += '</div>'
        return format_html(html)
    progress_details.short_description = 'Progress Details'
    
    def reset_progress(self, request, queryset):
        """Reset progress for selected records."""
        from django.contrib import messages
        
        count = 0
        for progress in queryset:
            progress.completed_units = 0
            progress.last_unit = None
            progress.last_score_pct = 0
            progress.total_listen_sec = 0
            progress.save()
            count += 1
        
        self.message_user(
            request,
            f'Reset progress for {count} records.',
            messages.WARNING
        )
    reset_progress.short_description = '🔄 Reset progress (careful!)'
    
    def export_progress(self, request, queryset):
        """Export progress data (placeholder)."""
        from django.contrib import messages
        
        self.message_user(
            request,
            f'Export feature coming soon ({queryset.count()} records selected).',
            messages.INFO
        )
    export_progress.short_description = '📥 Export progress data'


@admin.register(ListeningSession)
class ListeningSessionAdmin(admin.ModelAdmin):
    """Enhanced admin for ListeningSession model."""
    
    list_display = [
        'user',
        'unit',
        'duration_display',
        'completed_display',
        'created_at'
    ]
    list_filter = ['completed', 'created_at', 'unit__book']
    search_fields = ['user__email', 'unit__title', 'unit__book__title']
    autocomplete_fields = ['user', 'unit']
    readonly_fields = ['created_at', 'updated_at', 'session_details']
    
    fieldsets = (
        ('Session Info', {
            'fields': ('user', 'unit')
        }),
        ('Duration', {
            'fields': ('duration_sec', 'completed')
        }),
        ('Details', {
            'fields': ('session_details',),
            'classes': ('collapse',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_completed', 'mark_incomplete', 'export_sessions']
    
    def duration_display(self, obj):
        """Display duration in MM:SS format."""
        minutes = obj.duration_sec // 60
        seconds = obj.duration_sec % 60
        
        # Compare with unit duration
        if obj.unit.duration_sec > 0:
            pct = (obj.duration_sec / obj.unit.duration_sec) * 100
            color = 'green' if pct >= 80 else 'orange' if pct >= 50 else 'gray'
            return format_html(
                '<span style="color: {};">{:02d}:{:02d} <small>({:.0f}%)</small></span>',
                color, minutes, seconds, pct
            )
        
        return format_html('{:02d}:{:02d}', minutes, seconds)
    duration_display.short_description = 'Duration'
    
    def completed_display(self, obj):
        """Display completion status."""
        if obj.completed:
            return format_html('<span style="color: green; font-weight: bold;">✓ Yes</span>')
        return format_html('<span style="color: gray;">○ No</span>')
    completed_display.short_description = 'Completed'
    
    def session_details(self, obj):
        """Display session details."""
        if not obj.id:
            return '-'
        
        unit_duration = obj.unit.duration_sec
        session_duration = obj.duration_sec
        pct = (session_duration / unit_duration * 100) if unit_duration > 0 else 0
        
        html = '<div style="padding: 10px; background: #f5f5f5; border-radius: 5px;">'
        html += f'<p><strong>User:</strong> {obj.user.email}</p>'
        html += f'<p><strong>Unit:</strong> {obj.unit.title}</p>'
        html += f'<p><strong>Unit Duration:</strong> {unit_duration // 60}:{unit_duration % 60:02d}</p>'
        html += f'<p><strong>Listened:</strong> {session_duration // 60}:{session_duration % 60:02d} ({pct:.1f}%)</p>'
        html += f'<p><strong>Completed:</strong> {"✓ Yes" if obj.completed else "○ No"}</p>'
        html += f'<p><strong>Session Time:</strong> {obj.created_at.strftime("%Y-%m-%d %H:%M:%S")}</p>'
        html += '</div>'
        
        return format_html(html)
    session_details.short_description = 'Session Details'
    
    def has_add_permission(self, request):
        """Disable manual creation of sessions."""
        return False
    
    def mark_completed(self, request, queryset):
        """Mark sessions as completed."""
        from django.contrib import messages
        
        updated = queryset.update(completed=True)
        self.message_user(
            request,
            f'Marked {updated} sessions as completed.',
            messages.SUCCESS
        )
    mark_completed.short_description = '✓ Mark as completed'
    
    def mark_incomplete(self, request, queryset):
        """Mark sessions as incomplete."""
        from django.contrib import messages
        
        updated = queryset.update(completed=False)
        self.message_user(
            request,
            f'Marked {updated} sessions as incomplete.',
            messages.SUCCESS
        )
    mark_incomplete.short_description = '○ Mark as incomplete'
    
    def export_sessions(self, request, queryset):
        """Export sessions (placeholder)."""
        from django.contrib import messages
        
        self.message_user(
            request,
            f'Export feature coming soon ({queryset.count()} sessions selected).',
            messages.INFO
        )
    export_sessions.short_description = '📥 Export sessions'
