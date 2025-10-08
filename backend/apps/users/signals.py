"""
Signals for users app.
"""
from django.db.models.signals import post_save
from django.dispatch import receiver, Signal
from .models import User, Profile

# Custom signals
user_registered = Signal()


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Create profile when user is created."""
    if created:
        Profile.objects.get_or_create(user=instance)
        user_registered.send(sender=sender, user=instance)
