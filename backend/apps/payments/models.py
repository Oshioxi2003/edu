"""
Models for payment system.
"""
from django.db import models
from django.contrib.postgres.fields import JSONField as PostgresJSONField
from apps.common.enums import OrderStatus, PaymentProvider, TransactionStatus
from apps.common.mixins import TimestampMixin


# Use JSONField based on Django version
try:
    JSONField = models.JSONField
except AttributeError:
    JSONField = PostgresJSONField


class Order(TimestampMixin):
    """Order for purchasing a book."""
    
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='orders')
    book = models.ForeignKey('catalog.Book', on_delete=models.CASCADE, related_name='orders')
    order_code = models.CharField(max_length=50, unique=True, db_index=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='VND')
    status = models.CharField(
        max_length=20,
        choices=OrderStatus.choices,
        default=OrderStatus.PENDING,
        db_index=True
    )
    provider = models.CharField(
        max_length=20,
        choices=PaymentProvider.choices,
        db_index=True
    )
    paid_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'payments_order'
        verbose_name = 'Order'
        verbose_name_plural = 'Orders'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['user', 'book']),
            models.Index(fields=['status', '-created_at']),
        ]

    def __str__(self):
        return f"{self.order_code} - {self.user.email} - {self.book.title} - {self.get_status_display()}"
    
    def save(self, *args, **kwargs):
        """Generate order_code if not exists."""
        if not self.order_code:
            import datetime
            timestamp = datetime.datetime.now().strftime('%Y%m%d')
            # Get last order of the day
            last_order = Order.objects.filter(
                order_code__startswith=f'ORD-{timestamp}'
            ).order_by('-order_code').first()
            
            if last_order:
                try:
                    last_number = int(last_order.order_code.split('-')[-1])
                    new_number = last_number + 1
                except (ValueError, IndexError):
                    new_number = 1
            else:
                new_number = 1
            
            self.order_code = f'ORD-{timestamp}-{new_number:04d}'
        
        super().save(*args, **kwargs)

    @property
    def is_paid(self):
        """Check if order is paid."""
        return self.status == OrderStatus.PAID

    @property
    def is_pending(self):
        """Check if order is pending."""
        return self.status == OrderStatus.PENDING


class Transaction(TimestampMixin):
    """Transaction record from payment gateway."""
    
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='transactions')
    provider_txn_id = models.CharField(max_length=200, blank=True, db_index=True)
    status = models.CharField(
        max_length=20,
        choices=TransactionStatus.choices,
        default=TransactionStatus.PENDING
    )
    raw_payload = JSONField(default=dict, help_text='Raw response from payment gateway')
    signed_ok = models.BooleanField(default=False, help_text='Signature verification passed')
    ipn_verified = models.BooleanField(default=False, help_text='IPN verification completed')
    
    class Meta:
        db_table = 'payments_transaction'
        verbose_name = 'Transaction'
        verbose_name_plural = 'Transactions'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order', '-created_at']),
            models.Index(fields=['provider_txn_id']),
        ]

    def __str__(self):
        return f"Transaction for Order #{self.order.id} - {self.get_status_display()}"

