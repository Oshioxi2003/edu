"""
Enhanced admin configuration for quiz app.
"""
from django.contrib import admin
from django.core.exceptions import ValidationError
from django.utils.html import format_html
from django.contrib import messages
from django.db.models import Count, Q
import random
from .models import Question, Choice, Attempt, AttemptAnswer
from apps.common.enums import QuestionType


class ChoiceInline(admin.TabularInline):
    """Inline admin for choices."""
    model = Choice
    extra = 4
    fields = ['order', 'text', 'is_correct', 'correct_display']
    readonly_fields = ['correct_display']
    ordering = ['order']
    
    def correct_display(self, obj):
        """Display correct status with visual indicator."""
        if obj.id and obj.is_correct:
            return format_html('<span style="color: green; font-size: 18px; font-weight: bold;">✓</span>')
        return format_html('<span style="color: #ccc; font-size: 18px;">○</span>')
    correct_display.short_description = ''


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    """Enhanced admin for Question model."""
    
    list_display = ['text_preview', 'unit', 'type_display', 'order', 'choices_count', 'validation_status', 'created_at']
    list_filter = ['type', 'unit__book', 'unit', 'created_at']
    search_fields = ['text', 'unit__title', 'explanation']
    autocomplete_fields = ['unit']
    readonly_fields = ['created_at', 'updated_at', 'correct_choices', 'validation_details']
    list_editable = ['order']
    
    fieldsets = (
        ('Question Info', {
            'fields': ('unit', 'type', 'order')
        }),
        ('Content', {
            'fields': ('text', 'explanation')
        }),
        ('Validation', {
            'fields': ('validation_details',),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('correct_choices', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [ChoiceInline]
    actions = [
        'shuffle_choices',
        'convert_to_single',
        'convert_to_multi',
        'duplicate_questions',
        'validate_all'
    ]
    
    def get_queryset(self, request):
        """Optimize queryset."""
        qs = super().get_queryset(request)
        qs = qs.select_related('unit', 'unit__book').annotate(
            _choices_count=Count('choices', distinct=True),
            _correct_count=Count('choices', filter=Q(choices__is_correct=True), distinct=True)
        )
        return qs
    
    def text_preview(self, obj):
        """Return truncated question text."""
        text = obj.text[:80] + '...' if len(obj.text) > 80 else obj.text
        return format_html('<span title="{}">{}</span>', obj.text, text)
    text_preview.short_description = 'Question'
    
    def type_display(self, obj):
        """Display question type with icon."""
        if obj.type == QuestionType.SINGLE:
            return format_html('<span style="color: blue;">◉ Single</span>')
        return format_html('<span style="color: purple;">☑ Multi</span>')
    type_display.short_description = 'Type'
    type_display.admin_order_field = 'type'
    
    def choices_count(self, obj):
        """Display choices count."""
        count = getattr(obj, '_choices_count', 0)
        correct = getattr(obj, '_correct_count', 0)
        
        if count == 0:
            return format_html('<span style="color: red;">0</span>')
        
        return format_html(
            '<span title="{} correct out of {}">{} <small>({}✓)</small></span>',
            correct, count, count, correct
        )
    choices_count.short_description = 'Choices'
    
    def validation_status(self, obj):
        """Show validation status for the question."""
        choices_count = getattr(obj, '_choices_count', 0)
        correct_count = getattr(obj, '_correct_count', 0)
        
        errors = []
        
        # Check if question has choices
        if choices_count == 0:
            return format_html('<span style="color: red; font-weight: bold;">✗ No choices</span>')
        
        # Validate based on question type
        if obj.type == QuestionType.SINGLE:
            if correct_count != 1:
                return format_html(
                    '<span style="color: red; font-weight: bold;">⚠ Need exactly 1 correct (found {})</span>',
                    correct_count
                )
        elif obj.type == QuestionType.MULTI:
            if correct_count == 0:
                return format_html('<span style="color: red; font-weight: bold;">⚠ Need ≥1 correct</span>')
        
        return format_html('<span style="color: green; font-weight: bold;">✓ Valid</span>')
    validation_status.short_description = 'Status'
    
    def validation_details(self, obj):
        """Detailed validation information."""
        if not obj.id:
            return '-'
        
        choices_count = obj.choices.count()
        correct_count = obj.choices.filter(is_correct=True).count()
        
        html = '<div style="padding: 10px; background: #f5f5f5; border-radius: 5px;">'
        html += f'<p><strong>Total Choices:</strong> {choices_count}</p>'
        html += f'<p><strong>Correct Answers:</strong> {correct_count}</p>'
        
        # Type-specific validation
        if obj.type == QuestionType.SINGLE:
            if correct_count == 1:
                html += '<p style="color: green;"><strong>✓ Valid:</strong> Exactly 1 correct answer for SINGLE choice</p>'
            else:
                html += f'<p style="color: red;"><strong>✗ Invalid:</strong> SINGLE choice must have exactly 1 correct answer (found {correct_count})</p>'
        else:
            if correct_count >= 1:
                html += '<p style="color: green;"><strong>✓ Valid:</strong> Has at least 1 correct answer for MULTI choice</p>'
            else:
                html += '<p style="color: red;"><strong>✗ Invalid:</strong> MULTI choice must have at least 1 correct answer</p>'
        
        if choices_count < 2:
            html += '<p style="color: orange;"><strong>⚠ Warning:</strong> Consider adding more choices (minimum 2 recommended)</p>'
        
        html += '</div>'
        return format_html(html)
    validation_details.short_description = 'Validation Details'
    
    def save_formset(self, request, form, formset, change):
        """Validate choices before saving."""
        instances = formset.save(commit=False)
        
        # Delete marked instances
        for obj in formset.deleted_objects:
            obj.delete()
        
        # Save new/updated instances
        for instance in instances:
            instance.save()
        formset.save_m2m()
        
        # Validate the question after saving choices
        question = form.instance
        choices_count = question.choices.count()
        correct_count = question.choices.filter(is_correct=True).count()
        
        # Show warnings
        if question.type == QuestionType.SINGLE and correct_count != 1:
            messages.warning(
                request,
                f'⚠ SINGLE choice question should have exactly 1 correct answer (currently has {correct_count}). Please fix before publishing.'
            )
        
        if choices_count == 0:
            messages.error(
                request,
                '✗ Question has no choices. Please add at least 2 choices.'
            )
        elif choices_count < 2:
            messages.warning(
                request,
                '⚠ Question has only 1 choice. Consider adding more choices for better testing.'
            )
    
    # Actions
    def shuffle_choices(self, request, queryset):
        """Shuffle the order of choices for selected questions."""
        shuffled = 0
        for question in queryset:
            choices = list(question.choices.all())
            random.shuffle(choices)
            for idx, choice in enumerate(choices, start=1):
                choice.order = idx
                choice.save()
            shuffled += 1
        
        self.message_user(
            request,
            f'Shuffled choices for {shuffled} questions.',
            messages.SUCCESS
        )
    shuffle_choices.short_description = '🔀 Shuffle choices order'
    
    def convert_to_single(self, request, queryset):
        """Convert selected questions to SINGLE choice."""
        updated = 0
        for question in queryset:
            if question.type != QuestionType.SINGLE:
                question.type = QuestionType.SINGLE
                
                # Ensure only one correct answer
                correct_choices = list(question.choices.filter(is_correct=True))
                if len(correct_choices) != 1:
                    # Keep only the first correct choice
                    for choice in correct_choices[1:]:
                        choice.is_correct = False
                        choice.save()
                    
                    # If no correct choices, make the first one correct
                    if len(correct_choices) == 0:
                        first_choice = question.choices.first()
                        if first_choice:
                            first_choice.is_correct = True
                            first_choice.save()
                
                question.save()
                updated += 1
        
        self.message_user(
            request,
            f'Converted {updated} questions to SINGLE choice.',
            messages.SUCCESS
        )
    convert_to_single.short_description = '◉ Convert to SINGLE choice'
    
    def convert_to_multi(self, request, queryset):
        """Convert selected questions to MULTI choice."""
        updated = queryset.update(type=QuestionType.MULTI)
        self.message_user(
            request,
            f'Converted {updated} questions to MULTI choice.',
            messages.SUCCESS
        )
    convert_to_multi.short_description = '☑ Convert to MULTI choice'
    
    def duplicate_questions(self, request, queryset):
        """Duplicate selected questions."""
        duplicated = 0
        for question in queryset:
            # Get max order for the unit
            max_order = Question.objects.filter(unit=question.unit).aggregate(
                max_order=Count('order')
            )['max_order'] or 0
            
            # Create duplicate
            new_question = Question.objects.create(
                unit=question.unit,
                type=question.type,
                text=f"{question.text} (Copy)",
                explanation=question.explanation,
                order=max_order + 1
            )
            
            # Copy choices
            for choice in question.choices.all():
                Choice.objects.create(
                    question=new_question,
                    text=choice.text,
                    is_correct=choice.is_correct,
                    order=choice.order
                )
            
            duplicated += 1
        
        self.message_user(
            request,
            f'Duplicated {duplicated} questions.',
            messages.SUCCESS
        )
    duplicate_questions.short_description = '📋 Duplicate questions'
    
    def validate_all(self, request, queryset):
        """Validate all selected questions and show results."""
        valid = 0
        invalid = 0
        
        for question in queryset:
            choices_count = question.choices.count()
            correct_count = question.choices.filter(is_correct=True).count()
            
            is_valid = False
            if question.type == QuestionType.SINGLE:
                is_valid = correct_count == 1 and choices_count >= 2
            else:
                is_valid = correct_count >= 1 and choices_count >= 2
            
            if is_valid:
                valid += 1
            else:
                invalid += 1
        
        if invalid == 0:
            self.message_user(
                request,
                f'✓ All {valid} questions are valid!',
                messages.SUCCESS
            )
        else:
            self.message_user(
                request,
                f'Validation: {valid} valid, {invalid} invalid. Check individual questions for details.',
                messages.WARNING
            )
    validate_all.short_description = '✓ Validate selected questions'


@admin.register(Choice)
class ChoiceAdmin(admin.ModelAdmin):
    """Enhanced admin for Choice model."""
    
    list_display = ['text_preview', 'question_preview', 'order', 'is_correct', 'is_correct_display']
    list_filter = ['is_correct', 'question__type', 'question__unit__book']
    search_fields = ['text', 'question__text']
    autocomplete_fields = ['question']
    list_editable = ['order', 'is_correct']
    
    def text_preview(self, obj):
        """Return truncated choice text."""
        text = obj.text[:60] + '...' if len(obj.text) > 60 else obj.text
        return format_html('<span title="{}">{}</span>', obj.text, text)
    text_preview.short_description = 'Choice Text'
    
    def question_preview(self, obj):
        """Return truncated question text."""
        text = obj.question.text[:50] + '...' if len(obj.question.text) > 50 else obj.question.text
        return format_html('<span title="{}">{}</span>', obj.question.text, text)
    question_preview.short_description = 'Question'
    
    def is_correct_display(self, obj):
        """Display correct status with color."""
        if obj.is_correct:
            return format_html('<span style="color: green; font-weight: bold; font-size: 16px;">✓ Correct</span>')
        return format_html('<span style="color: #999; font-size: 16px;">✗ Wrong</span>')
    is_correct_display.short_description = 'Correctness'


class AttemptAnswerInline(admin.TabularInline):
    """Inline admin for attempt answers."""
    model = AttemptAnswer
    extra = 0
    fields = ['question', 'selected_choices', 'is_correct_display']
    readonly_fields = ['question', 'selected_choices', 'is_correct_display']
    can_delete = False
    
    def is_correct_display(self, obj):
        """Display correctness with icon."""
        if obj.is_correct:
            return format_html('<span style="color: green; font-size: 16px;">✓</span>')
        return format_html('<span style="color: red; font-size: 16px;">✗</span>')
    is_correct_display.short_description = 'Correct'


@admin.register(Attempt)
class AttemptAdmin(admin.ModelAdmin):
    """Enhanced admin for Attempt model."""
    
    list_display = ['user', 'unit', 'score_display', 'is_passed_display', 'is_submitted_display', 'submitted_at', 'created_at']
    list_filter = ['submitted_at', 'created_at', 'unit__book']
    search_fields = ['user__email', 'unit__title', 'unit__book__title']
    autocomplete_fields = ['user', 'unit']
    readonly_fields = ['started_at', 'submitted_at', 'score_raw', 'score_pct', 'created_at', 'updated_at', 'grade_details']
    
    fieldsets = (
        ('Attempt Info', {
            'fields': ('user', 'unit')
        }),
        ('Timing', {
            'fields': ('started_at', 'submitted_at')
        }),
        ('Results', {
            'fields': ('score_raw', 'score_pct', 'grade_details')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [AttemptAnswerInline]
    actions = ['regrade_attempts']
    
    def score_display(self, obj):
        """Display score with visual indicator."""
        pct = obj.score_pct
        color = 'green' if pct >= 70 else 'orange' if pct >= 50 else 'red'
        
        return format_html(
            '<div style="display: inline-block; min-width: 100px;">'
            '<div style="background: #f0f0f0; border-radius: 3px; overflow: hidden;">'
            '<div style="width: {}%; background: {}; padding: 3px 5px; color: white; font-weight: bold; text-align: center;">'
            '{:.1f}%'
            '</div></div></div>',
            pct, color, pct
        )
    score_display.short_description = 'Score'
    score_display.admin_order_field = 'score_pct'
    
    def is_passed_display(self, obj):
        """Display passed status with color."""
        if not obj.is_submitted:
            return format_html('<span style="color: gray;">-</span>')
        
        if obj.is_passed:
            return format_html('<span style="color: green; font-weight: bold;">✓ Passed</span>')
        return format_html('<span style="color: red; font-weight: bold;">✗ Failed</span>')
    is_passed_display.short_description = 'Status'
    
    def is_submitted_display(self, obj):
        """Display submission status."""
        if obj.is_submitted:
            return format_html('<span style="color: green;">✓ Yes</span>')
        return format_html('<span style="color: orange;">⏳ In Progress</span>')
    is_submitted_display.short_description = 'Submitted'
    
    def grade_details(self, obj):
        """Show grading details."""
        if not obj.id:
            return '-'
        
        total_questions = obj.answers.count()
        correct_answers = obj.answers.filter(is_correct=True).count()
        
        html = '<div style="padding: 10px; background: #f5f5f5; border-radius: 5px;">'
        html += f'<p><strong>Total Questions:</strong> {total_questions}</p>'
        html += f'<p><strong>Correct Answers:</strong> {correct_answers}</p>'
        html += f'<p><strong>Wrong Answers:</strong> {total_questions - correct_answers}</p>'
        html += f'<p><strong>Score:</strong> {obj.score_pct}%</p>'
        html += f'<p><strong>Status:</strong> {"PASSED ✓" if obj.is_passed else "FAILED ✗"}</p>'
        html += '</div>'
        
        return format_html(html)
    grade_details.short_description = 'Grade Details'
    
    def has_add_permission(self, request):
        """Disable manual creation of attempts."""
        return False
    
    def regrade_attempts(self, request, queryset):
        """Regrade selected attempts."""
        regraded = 0
        for attempt in queryset:
            # Regrade all answers
            for answer in attempt.answers.all():
                answer.grade()
                answer.save()
            
            # Recalculate score
            total = attempt.answers.count()
            if total > 0:
                correct = attempt.answers.filter(is_correct=True).count()
                attempt.score_raw = correct
                attempt.score_pct = (correct / total) * 100
                attempt.save()
                regraded += 1
        
        self.message_user(
            request,
            f'Regraded {regraded} attempts.',
            messages.SUCCESS
        )
    regrade_attempts.short_description = '🔄 Regrade selected attempts'


@admin.register(AttemptAnswer)
class AttemptAnswerAdmin(admin.ModelAdmin):
    """Admin for AttemptAnswer model."""
    
    list_display = ['attempt', 'question_preview', 'selected_display', 'is_correct_display']
    list_filter = ['is_correct', 'attempt__unit__book']
    search_fields = ['attempt__user__email', 'question__text']
    autocomplete_fields = ['attempt', 'question']
    readonly_fields = ['selected_choices', 'is_correct']
    
    def question_preview(self, obj):
        """Return truncated question text."""
        text = obj.question.text[:60] + '...' if len(obj.question.text) > 60 else obj.question.text
        return format_html('<span title="{}">{}</span>', obj.question.text, text)
    question_preview.short_description = 'Question'
    
    def selected_display(self, obj):
        """Display selected choices."""
        if isinstance(obj.selected_choices, list):
            count = len(obj.selected_choices)
            return f'{count} choice(s)'
        return '-'
    selected_display.short_description = 'Selected'
    
    def is_correct_display(self, obj):
        """Display correct status with color."""
        if obj.is_correct:
            return format_html('<span style="color: green; font-weight: bold; font-size: 16px;">✓ Correct</span>')
        return format_html('<span style="color: red; font-weight: bold; font-size: 16px;">✗ Wrong</span>')
    is_correct_display.short_description = 'Result'
    
    def has_add_permission(self, request):
        """Disable manual creation of attempt answers."""
        return False
