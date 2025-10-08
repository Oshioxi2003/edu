"""
Models for quiz system.
"""
from django.db import models
from django.contrib.postgres.fields import JSONField as PostgresJSONField
from django.core.exceptions import ValidationError
from apps.common.enums import QuestionType
from apps.common.mixins import TimestampMixin, OrderingMixin


# Use JSONField based on Django version
try:
    JSONField = models.JSONField
except AttributeError:
    JSONField = PostgresJSONField


class Question(TimestampMixin, OrderingMixin):
    """Quiz question for a unit."""
    
    unit = models.ForeignKey('catalog.Unit', on_delete=models.CASCADE, related_name='questions')
    type = models.CharField(max_length=20, choices=QuestionType.choices, default=QuestionType.SINGLE)
    text = models.TextField()
    explanation = models.TextField(blank=True, help_text='Explanation shown after answer')
    
    class Meta:
        db_table = 'quiz_question'
        verbose_name = 'Question'
        verbose_name_plural = 'Questions'
        ordering = ['unit', 'order']
        unique_together = [['unit', 'order']]
        indexes = [
            models.Index(fields=['unit', 'order']),
        ]

    def __str__(self):
        return f"{self.unit.title} - Q{self.order}: {self.text[:50]}"

    def clean(self):
        """Validate question based on type."""
        super().clean()
        
        # Validate that SINGLE choice has exactly one correct answer
        if self.type == QuestionType.SINGLE:
            correct_count = self.choices.filter(is_correct=True).count()
            if correct_count != 1:
                raise ValidationError(
                    f'Single choice question must have exactly 1 correct answer, found {correct_count}.'
                )

    @property
    def correct_choices(self):
        """Return list of correct choice IDs."""
        return list(self.choices.filter(is_correct=True).values_list('id', flat=True))


class Choice(OrderingMixin):
    """Choice for a quiz question."""
    
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='choices')
    text = models.TextField()
    is_correct = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'quiz_choice'
        verbose_name = 'Choice'
        verbose_name_plural = 'Choices'
        ordering = ['question', 'order']
        unique_together = [['question', 'order']]

    def __str__(self):
        return f"{self.question.text[:30]} - {self.text[:30]}"


class Attempt(TimestampMixin):
    """User's quiz attempt for a unit."""
    
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='attempts')
    unit = models.ForeignKey('catalog.Unit', on_delete=models.CASCADE, related_name='attempts')
    started_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    score_raw = models.PositiveIntegerField(default=0, help_text='Number of correct answers')
    score_pct = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        help_text='Percentage score'
    )
    
    class Meta:
        db_table = 'quiz_attempt'
        verbose_name = 'Attempt'
        verbose_name_plural = 'Attempts'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'unit']),
            models.Index(fields=['user', '-created_at']),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.unit.title} ({self.score_pct}%)"

    @property
    def is_submitted(self):
        """Check if attempt is submitted."""
        return self.submitted_at is not None

    @property
    def is_passed(self):
        """Check if attempt passed (>= 70%)."""
        return self.score_pct >= 70


class AttemptAnswer(models.Model):
    """Individual answer within an attempt."""
    
    attempt = models.ForeignKey(Attempt, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_choices = JSONField(default=list, help_text='List of selected choice IDs')
    is_correct = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'quiz_attempt_answer'
        verbose_name = 'Attempt Answer'
        verbose_name_plural = 'Attempt Answers'
        unique_together = [['attempt', 'question']]

    def __str__(self):
        return f"Answer to {self.question.text[:30]} - {'Correct' if self.is_correct else 'Wrong'}"

    def grade(self):
        """Grade this answer based on selected choices."""
        correct_choice_ids = set(self.question.correct_choices)
        selected_choice_ids = set(self.selected_choices)
        
        # Answer is correct only if selected choices exactly match correct choices
        self.is_correct = correct_choice_ids == selected_choice_ids
        return self.is_correct

