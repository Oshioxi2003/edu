"""
Celery tasks for progress tracking.
"""
from celery import shared_task
from django.db.models import Sum, Count, Avg
from .models import UserProgress, ListeningSession


@shared_task
def generate_daily_statistics():
    """
    Generate daily statistics for all users.
    This should be run once per day.
    """
    from apps.catalog.models import Book
    
    stats = []
    
    # Global statistics
    total_users = UserProgress.objects.values('user').distinct().count()
    total_listen_time = ListeningSession.objects.aggregate(
        total=Sum('duration_sec')
    )['total'] or 0
    
    stats.append({
        'type': 'global',
        'total_users': total_users,
        'total_listen_time': total_listen_time,
    })
    
    # Per-book statistics
    for book in Book.objects.filter(is_published=True):
        book_stats = UserProgress.objects.filter(book=book).aggregate(
            users=Count('user', distinct=True),
            avg_completion=Avg('completed_units'),
            total_time=Sum('total_listen_sec')
        )
        
        stats.append({
            'type': 'book',
            'book_id': book.id,
            'book_title': book.title,
            'users': book_stats['users'] or 0,
            'avg_completion': book_stats['avg_completion'] or 0,
            'total_time': book_stats['total_time'] or 0,
        })
    
    return f'Generated statistics for {len(stats)} items'


@shared_task
def send_progress_report_email(user_id):
    """
    Send weekly progress report to user.
    
    Args:
        user_id: User ID
    """
    from django.core.mail import send_mail
    from django.conf import settings
    from apps.users.models import User
    
    try:
        user = User.objects.get(id=user_id)
        progress_data = UserProgress.objects.filter(user=user)
        
        if not progress_data.exists():
            return 'No progress data found for user'
        
        # Calculate summary
        total_time = sum(p.total_listen_sec for p in progress_data)
        hours = total_time // 3600
        minutes = (total_time % 3600) // 60
        
        subject = 'Your Weekly Learning Progress'
        message = f"""
        Dear {user.email},
        
        Here's your learning progress for this week:
        
        Total Learning Time: {hours}h {minutes}m
        Books Started: {progress_data.count()}
        
        Keep up the great work!
        
        Best regards,
        Education Platform Team
        """
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        
        return f'Progress report sent to {user.email}'
    except User.DoesNotExist:
        return f'User {user_id} not found'
    except Exception as e:
        return f'Error sending report: {str(e)}'

