"""
Signals for payments app.
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order
from .services.order import payment_succeeded
from apps.common.enums import OrderStatus


@receiver(payment_succeeded, sender=Order)
def handle_payment_succeeded(sender, order, **kwargs):
    """Handle successful payment."""
    from .tasks import send_payment_confirmation_email, process_payment_analytics
    
    # Send confirmation email (async)
    send_payment_confirmation_email.delay(order.id)
    
    # Process analytics (async)
    process_payment_analytics.delay(order.id)


@receiver(post_save, sender=Order)
def handle_order_status_change(sender, instance, created, **kwargs):
    """Handle order status changes."""
    if not created and instance.status == OrderStatus.FAILED:
        from .tasks import send_payment_failed_email
        send_payment_failed_email.delay(instance.id)

