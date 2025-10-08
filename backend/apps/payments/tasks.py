"""
Celery tasks for payments app.
"""
from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from .models import Order


@shared_task
def send_payment_confirmation_email(order_id):
    """
    Send payment confirmation email to user.
    
    Args:
        order_id: Order ID
    """
    try:
        order = Order.objects.select_related('user', 'book').get(id=order_id)
        
        subject = f'Payment Confirmed - {order.book.title}'
        message = f"""
        Dear {order.user.email},
        
        Your payment for "{order.book.title}" has been confirmed.
        
        Amount: {order.amount} {order.currency}
        Order ID: {order.id}
        
        You can now access all content in this book.
        
        Thank you for your purchase!
        
        Best regards,
        Education Platform Team
        """
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [order.user.email],
            fail_silently=False,
        )
        
        return f'Email sent to {order.user.email}'
    except Order.DoesNotExist:
        return f'Order {order_id} not found'
    except Exception as e:
        return f'Error sending email: {str(e)}'


@shared_task
def send_payment_failed_email(order_id):
    """
    Send payment failed notification email.
    
    Args:
        order_id: Order ID
    """
    try:
        order = Order.objects.select_related('user', 'book').get(id=order_id)
        
        subject = f'Payment Failed - {order.book.title}'
        message = f"""
        Dear {order.user.email},
        
        Unfortunately, your payment for "{order.book.title}" was not successful.
        
        Order ID: {order.id}
        
        Please try again or contact support if you need assistance.
        
        Best regards,
        Education Platform Team
        """
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [order.user.email],
            fail_silently=False,
        )
        
        return f'Email sent to {order.user.email}'
    except Order.DoesNotExist:
        return f'Order {order_id} not found'
    except Exception as e:
        return f'Error sending email: {str(e)}'


@shared_task
def process_payment_analytics(order_id):
    """
    Process analytics data for a completed payment.
    
    Args:
        order_id: Order ID
    """
    try:
        order = Order.objects.select_related('book').get(id=order_id)
        
        # Here you would typically:
        # - Log to analytics service (Google Analytics, Mixpanel, etc.)
        # - Update revenue metrics
        # - Track conversion funnels
        # - Update book popularity scores
        
        # For now, just log
        print(f'Analytics: Order {order.id} - Book: {order.book.title} - Amount: {order.amount}')
        
        return f'Analytics processed for order {order_id}'
    except Order.DoesNotExist:
        return f'Order {order_id} not found'
    except Exception as e:
        return f'Error processing analytics: {str(e)}'

