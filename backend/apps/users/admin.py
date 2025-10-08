"""
Admin configuration for users app.
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import User, Profile, Enrollment


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin for User model."""
    
    list_display = ['email', 'role', 'is_active', 'is_staff', 'created_at']
    list_filter = ['role', 'is_active', 'is_staff', 'created_at']
    search_fields = ['email']
    ordering = ['-created_at']
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser')}),
        ('Dates', {'fields': ('last_login', 'created_at', 'updated_at')}),
    )
    
    readonly_fields = ['created_at', 'updated_at', 'last_login']
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'role', 'is_active', 'is_staff'),
        }),
    )


class ProfileInline(admin.StackedInline):
    """Inline admin for Profile."""
    model = Profile
    can_delete = False
    fields = ['display_name', 'avatar', 'phone', 'date_of_birth', 'bio']


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    """Admin for Profile model."""
    
    list_display = ['user', 'display_name', 'phone', 'created_at']
    search_fields = ['user__email', 'display_name', 'phone']
    list_filter = ['created_at']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    """Admin for Enrollment model."""
    
    list_display = ['user', 'book', 'is_active', 'active_from', 'active_until', 'created_at']
    list_filter = ['is_active', 'active_from', 'created_at']
    search_fields = ['user__email', 'book__title']
    autocomplete_fields = ['user', 'book']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        (None, {'fields': ('user', 'book')}),
        ('Status', {'fields': ('is_active', 'active_from', 'active_until')}),
        ('Dates', {'fields': ('created_at', 'updated_at')}),
    )
    
    actions = ['activate_enrollments', 'deactivate_enrollments']
    
    def activate_enrollments(self, request, queryset):
        """Activate selected enrollments."""
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} enrollments activated.')
    activate_enrollments.short_description = 'Activate selected enrollments'
    
    def deactivate_enrollments(self, request, queryset):
        """Deactivate selected enrollments."""
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} enrollments deactivated.')
    deactivate_enrollments.short_description = 'Deactivate selected enrollments'
