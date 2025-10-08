"""
Business logic for progress tracking.
"""
from django.db import transaction
from django.db.models import Sum, Count, Avg
from .models import UserProgress, ListeningSession


class ProgressService:
    """Service for managing user progress."""
    
    @staticmethod
    @transaction.atomic
    def record_listening_time(user, unit, duration_sec, completed=False):
        """
        Record listening time for a unit.
        
        Args:
            user: User instance
            unit: Unit instance
            duration_sec: Duration in seconds
            completed: Whether the unit was completed
        
        Returns:
            ListeningSession instance
        """
        # Create listening session
        session = ListeningSession.objects.create(
            user=user,
            unit=unit,
            duration_sec=duration_sec,
            completed=completed
        )
        
        # Update user progress for the book
        progress, created = UserProgress.objects.get_or_create(
            user=user,
            book=unit.book,
            defaults={'last_unit': unit}
        )
        
        # Update total listening time
        progress.total_listen_sec += duration_sec
        progress.last_unit = unit
        
        # If unit completed, increment completed units
        if completed:
            # Check if this unit was already completed
            previous_completions = ListeningSession.objects.filter(
                user=user,
                unit=unit,
                completed=True
            ).exclude(id=session.id).exists()
            
            if not previous_completions:
                progress.completed_units += 1
        
        progress.save()
        
        return session
    
    @staticmethod
    @transaction.atomic
    def update_quiz_score(user, unit, score_pct):
        """
        Update quiz score in user progress.
        
        Args:
            user: User instance
            unit: Unit instance
            score_pct: Score percentage
        """
        progress, created = UserProgress.objects.get_or_create(
            user=user,
            book=unit.book,
            defaults={'last_unit': unit}
        )
        
        progress.last_score_pct = score_pct
        progress.last_unit = unit
        progress.save()
    
    @staticmethod
    def get_user_analytics(user):
        """
        Get analytics for a user.
        
        Args:
            user: User instance
        
        Returns:
            Dictionary with analytics data
        """
        # Total progress
        total_progress = UserProgress.objects.filter(user=user).aggregate(
            total_listen_time=Sum('total_listen_sec'),
            avg_score=Avg('last_score_pct'),
            books_started=Count('id')
        )
        
        # Recent sessions
        recent_sessions = ListeningSession.objects.filter(user=user).order_by('-created_at')[:10]
        
        # Progress per book
        book_progress = UserProgress.objects.filter(user=user).select_related('book')
        
        return {
            'total_listen_time': total_progress['total_listen_time'] or 0,
            'avg_score': round(total_progress['avg_score'] or 0, 2),
            'books_started': total_progress['books_started'],
            'recent_sessions': recent_sessions,
            'book_progress': book_progress,
        }
    
    @staticmethod
    def get_book_analytics(book):
        """
        Get analytics for a book.
        
        Args:
            book: Book instance
        
        Returns:
            Dictionary with analytics data
        """
        progress_data = UserProgress.objects.filter(book=book).aggregate(
            total_users=Count('user', distinct=True),
            avg_completion=Avg('completed_units'),
            total_listen_time=Sum('total_listen_sec')
        )
        
        return {
            'total_users': progress_data['total_users'] or 0,
            'avg_completion': round(progress_data['avg_completion'] or 0, 2),
            'total_listen_time': progress_data['total_listen_time'] or 0,
        }

