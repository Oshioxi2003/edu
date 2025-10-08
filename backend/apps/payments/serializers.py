"""
Serializers for payments app.
"""
from rest_framework import serializers
from .models import Order, Transaction


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for orders."""
    
    book_title = serializers.CharField(source='book.title', read_only=True)
    book_slug = serializers.CharField(source='book.slug', read_only=True)
    is_paid = serializers.ReadOnlyField()
    is_pending = serializers.ReadOnlyField()
    
    class Meta:
        model = Order
        fields = [
            'id', 'book', 'book_title', 'book_slug',
            'amount', 'currency', 'status', 'provider',
            'is_paid', 'is_pending', 'created_at'
        ]
        read_only_fields = ['id', 'amount', 'status', 'created_at']


class CreateOrderSerializer(serializers.Serializer):
    """Serializer for creating an order."""
    
    book_id = serializers.IntegerField()
    provider = serializers.ChoiceField(choices=['vnpay', 'momo'])


class TransactionSerializer(serializers.ModelSerializer):
    """Serializer for transactions."""
    
    class Meta:
        model = Transaction
        fields = [
            'id', 'order', 'provider_txn_id', 'status',
            'signed_ok', 'ipn_verified', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

