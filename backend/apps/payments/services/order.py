"""
Order service for payment processing.
"""
from django.db import transaction
from django.utils import timezone
from django.dispatch import Signal

from apps.common.enums import OrderStatus, PaymentProvider, TransactionStatus
from ..models import Order, Transaction
from apps.users.models import Enrollment


# Custom signal for successful payment
payment_succeeded = Signal()


class OrderService:
    """Service for order management."""
    
    @staticmethod
    @transaction.atomic
    def create_order(user, book, provider):
        """
        Create a new order.
        
        Args:
            user: User instance
            book: Book instance
            provider: Payment provider (vnpay or momo)
        
        Returns:
            Order instance
        """
        # Check if user already has enrollment
        existing_enrollment = Enrollment.objects.filter(
            user=user,
            book=book,
            is_active=True
        ).exists()
        
        if existing_enrollment:
            raise ValueError('User already has access to this book')
        
        # Create order
        order = Order.objects.create(
            user=user,
            book=book,
            amount=book.price,
            provider=provider,
            status=OrderStatus.PENDING
        )
        
        return order
    
    @staticmethod
    @transaction.atomic
    def confirm_payment(provider, payload):
        """
        Confirm payment from IPN.
        
        Args:
            provider: Payment provider (vnpay or momo)
            payload: IPN payload
        
        Returns:
            Tuple of (success, order, message)
        """
        from .vnpay import VNPayService
        from .momo import MoMoService
        
        # Verify signature based on provider
        if provider == PaymentProvider.VNPAY:
            is_valid, order_id, amount, status = VNPayService.verify_ipn(payload)
        elif provider == PaymentProvider.MOMO:
            is_valid, order_id, amount, status = MoMoService.verify_ipn(payload)
        else:
            return False, None, 'Invalid payment provider'
        
        # Get order with lock
        try:
            order = Order.objects.select_for_update().get(id=order_id)
        except Order.DoesNotExist:
            return False, None, 'Order not found'
        
        # Create transaction record
        transaction_obj = Transaction.objects.create(
            order=order,
            provider_txn_id=payload.get('vnp_TransactionNo') or payload.get('transId'),
            status=TransactionStatus.SUCCESS if status == 'success' else TransactionStatus.FAILED,
            raw_payload=payload,
            signed_ok=is_valid,
            ipn_verified=True
        )
        
        # Verify signature
        if not is_valid:
            order.status = OrderStatus.FAILED
            order.save(update_fields=['status'])
            return False, order, 'Signature verification failed'
        
        # Verify amount
        if float(amount) != float(order.amount):
            order.status = OrderStatus.FAILED
            order.save(update_fields=['status'])
            return False, order, 'Amount mismatch'
        
        # Check payment status
        if status != 'success':
            order.status = OrderStatus.FAILED
            order.save(update_fields=['status'])
            return False, order, 'Payment failed'
        
        # Payment successful - update order
        order.status = OrderStatus.PAID
        order.save(update_fields=['status'])
        
        # Create enrollment
        Enrollment.objects.get_or_create(
            user=order.user,
            book=order.book,
            defaults={
                'active_from': timezone.now(),
                'is_active': True
            }
        )
        
        # Send signal for post-payment processing
        payment_succeeded.send(sender=Order, order=order)
        
        return True, order, 'Payment confirmed successfully'
    
    @staticmethod
    def get_user_orders(user, status=None):
        """
        Get user's orders.
        
        Args:
            user: User instance
            status: Optional status filter
        
        Returns:
            QuerySet of orders
        """
        orders = Order.objects.filter(user=user).select_related('book')
        
        if status:
            orders = orders.filter(status=status)
        
        return orders.order_by('-created_at')

