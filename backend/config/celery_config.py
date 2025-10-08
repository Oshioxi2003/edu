"""
Celery beat schedule configuration.
"""
from celery.schedules import crontab

# Celery Beat Schedule
CELERY_BEAT_SCHEDULE = {
    'cleanup-expired-enrollments-daily': {
        'task': 'apps.users.tasks.cleanup_expired_enrollments',
        'schedule': crontab(hour=0, minute=0),  # Daily at midnight
    },
    'generate-daily-statistics': {
        'task': 'apps.progress.tasks.generate_daily_statistics',
        'schedule': crontab(hour=1, minute=0),  # Daily at 1 AM
    },
    # Add more scheduled tasks as needed
}

