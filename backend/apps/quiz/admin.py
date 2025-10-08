"""
Admin configuration for quiz app.
"""
from django.contrib import admin
from django.core.exceptions import ValidationError
from django.utils.html import format_html
from .models import Question, Choice, Attempt, AttemptAnswer
from apps.common.enums import QuestionType


class ChoiceInline(admin.TabularInline):
    """Inline admin for choices."""
    model = Choice
    extra = 2
    fields = ['order', 'text', 'is_correct']
    ordering = ['order']


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    """Admin for Question model."""
    
    list_display = ['text_preview', 'unit', 'type', 'order', 'created_at']
    list_filter = ['type', 'unit__book', 'created_at']
    search_fields = ['text', 'unit__title']
    autocomplete_fields = ['unit']
    readonly_fields = ['created_at', 'updated_at', 'correct_choices']
    
    fieldsets = (
        (None, {
            'fields': ('unit', 'type', 'order')
        }),
        ('Question', {
            'fields': ('text', 'explanation')
        }),
        ('Metadata', {
            'fields': ('correct_choices', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [ChoiceInline]
    
    def text_preview(self, obj):
        """Return truncated question text."""
        return obj.text[:60] + '...' if len(obj.text) > 60 else obj.text
    text_preview.short_description = 'Question'
    
    def save_formset(self, request, form, formset, change):
        """Validate choices before saving."""
        instances = formset.save(commit=False)
        
        # Save instances first
        for instance in instances:
            instance.save()
        formset.save_m2m()
        
        # Now validate the question
        question = form.instance
        if question.type == QuestionType.SINGLE:
            correct_count = question.choices.filter(is_correct=True).count()
            if correct_count != 1:
                raise ValidationError(
                    f'Single choice question must have exactly 1 correct answer, found {correct_count}.'
                )


@admin.register(Choice)
class ChoiceAdmin(admin.ModelAdmin):
    """Admin for Choice model."""
    
    list_display = ['text_preview', 'question', 'order', 'is_correct_display']
    list_filter = ['is_correct']
    search_fields = ['text', 'question__text']
    autocomplete_fields = ['question']
    
    def text_preview(self, obj):
        """Return truncated choice text."""
        return obj.text[:50] + '...' if len(obj.text) > 50 else obj.text
    text_preview.short_description = 'Choice'
    
    def is_correct_display(self, obj):
        """Display correct status with color."""
        if obj.is_correct:
            return format_html('<span style="color: green;">✓ Correct</span>')
        return format_html('<span style="color: red;">✗ Wrong</span>')
    is_correct_display.short_description = 'Correctness'


class AttemptAnswerInline(admin.TabularInline):
    """Inline admin for attempt answers."""
    model = AttemptAnswer
    extra = 0
    fields = ['question', 'selected_choices', 'is_correct']
    readonly_fields = ['question', 'selected_choices', 'is_correct']
    can_delete = False


@admin.register(Attempt)
class AttemptAdmin(admin.ModelAdmin):
    """Admin for Attempt model."""
    
    list_display = ['user', 'unit', 'score_pct', 'is_passed_display', 'submitted_at', 'created_at']
    list_filter = ['submitted_at', 'created_at']
    search_fields = ['user__email', 'unit__title']
    autocomplete_fields = ['user', 'unit']
    readonly_fields = ['started_at', 'submitted_at', 'score_raw', 'score_pct', 'created_at', 'updated_at']
    
    fieldsets = (
        (None, {
            'fields': ('user', 'unit')
        }),
        ('Results', {
            'fields': ('score_raw', 'score_pct', 'started_at', 'submitted_at')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [AttemptAnswerInline]
    
    def is_passed_display(self, obj):
        """Display passed status with color."""
        if obj.is_passed:
            return format_html('<span style="color: green;">✓ Passed</span>')
        return format_html('<span style="color: red;">✗ Failed</span>')
    is_passed_display.short_description = 'Status'
    
    def has_add_permission(self, request):
        """Disable manual creation of attempts."""
        return False


@admin.register(AttemptAnswer)
class AttemptAnswerAdmin(admin.ModelAdmin):
    """Admin for AttemptAnswer model."""
    
    list_display = ['attempt', 'question_preview', 'is_correct_display']
    list_filter = ['is_correct']
    search_fields = ['attempt__user__email', 'question__text']
    autocomplete_fields = ['attempt', 'question']
    readonly_fields = ['selected_choices', 'is_correct']
    
    def question_preview(self, obj):
        """Return truncated question text."""
        return obj.question.text[:50] + '...' if len(obj.question.text) > 50 else obj.question.text
    question_preview.short_description = 'Question'
    
    def is_correct_display(self, obj):
        """Display correct status with color."""
        if obj.is_correct:
            return format_html('<span style="color: green;">✓ Correct</span>')
        return format_html('<span style="color: red;">✗ Wrong</span>')
    is_correct_display.short_description = 'Result'
    
    def has_add_permission(self, request):
        """Disable manual creation of attempt answers."""
        return False

