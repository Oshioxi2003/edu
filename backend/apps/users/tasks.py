"""
Celery tasks for users app.
"""
from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from .models import User


@shared_task
def send_welcome_email(user_id):
    """
    Send welcome email to new user.
    
    Args:
        user_id: User ID
    """
    try:
        user = User.objects.get(id=user_id)
        
        subject = 'Welcome to Education Platform!'
        message = f"""
        Dear {user.email},
        
        Welcome to our Education Platform!
        
        Thank you for registering. You can now browse our catalog and start learning.
        
        Get started by exploring our free content or purchasing a book to unlock premium features.
        
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
        
        return f'Welcome email sent to {user.email}'
    except User.DoesNotExist:
        return f'User {user_id} not found'
    except Exception as e:
        return f'Error sending email: {str(e)}'


@shared_task
def cleanup_expired_enrollments():
    """
    Cleanup expired enrollments (mark as inactive).
    This should be run periodically (e.g., daily).
    """
    from .models import Enrollment
    from django.utils import timezone
    
    expired_count = Enrollment.objects.filter(
        is_active=True,
        active_until__lt=timezone.now()
    ).update(is_active=False)
    
    return f'Deactivated {expired_count} expired enrollments'

