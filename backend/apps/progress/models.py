"""
Models for progress tracking.
"""
from django.db import models
from apps.common.mixins import TimestampMixin


class UserProgress(TimestampMixin):
    """Track user progress for a book."""
    
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='progress')
    book = models.ForeignKey('catalog.Book', on_delete=models.CASCADE, related_name='user_progress')
    completed_units = models.PositiveIntegerField(default=0)
    last_unit = models.ForeignKey(
        'catalog.Unit',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='+'
    )
    last_score_pct = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        help_text='Last quiz score percentage'
    )
    total_listen_sec = models.PositiveIntegerField(default=0, help_text='Total listening time in seconds')
    
    class Meta:
        db_table = 'progress_userprogress'
        verbose_name = 'User Progress'
        verbose_name_plural = 'User Progress'
        unique_together = [['user', 'book']]
        indexes = [
            models.Index(fields=['user', 'book']),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.book.title} ({self.completion_pct}%)"

    @property
    def completion_pct(self):
        """Calculate completion percentage."""
        total_units = self.book.units.count()
        if total_units == 0:
            return 0
        return round((self.completed_units / total_units) * 100, 2)


class ListeningSession(TimestampMixin):
    """Track individual listening sessions."""
    
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='listening_sessions')
    unit = models.ForeignKey('catalog.Unit', on_delete=models.CASCADE, related_name='listening_sessions')
    duration_sec = models.PositiveIntegerField(default=0)
    completed = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'progress_listening_session'
        verbose_name = 'Listening Session'
        verbose_name_plural = 'Listening Sessions'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['unit', '-created_at']),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.unit.title} ({self.duration_sec}s)"

