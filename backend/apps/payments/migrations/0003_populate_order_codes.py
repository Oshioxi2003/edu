# Generated manually - Populate order codes for existing orders

from django.db import migrations
import datetime


def populate_order_codes(apps, schema_editor):
    """Generate order_code for existing orders."""
    Order = apps.get_model('payments', 'Order')
    
    for order in Order.objects.all():
        if not order.order_code:
            timestamp = order.created_at.strftime('%Y%m%d')
            # Use order ID as unique number
            order_number = order.id
            order.order_code = f'ORD-{timestamp}-{order_number:04d}'
            order.save(update_fields=['order_code'])


def reverse_populate_order_codes(apps, schema_editor):
    """Reverse migration - do nothing."""
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0002_order_order_code_and_paid_at'),
    ]

    operations = [
        migrations.RunPython(populate_order_codes, reverse_populate_order_codes),
    ]


