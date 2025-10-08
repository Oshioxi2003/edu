"""
Views for payments app.
"""
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from apps.catalog.models import Book
from apps.common.enums import PaymentProvider
from .models import Order
from .serializers import OrderSerializer, CreateOrderSerializer, TransactionSerializer
from .services import VNPayService, MoMoService, OrderService


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for orders."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSerializer
    
    def get_queryset(self):
        """Return current user's orders."""
        return Order.objects.filter(
            user=self.request.user
        ).select_related('book')

    @action(detail=False, methods=['post'])
    def create_order(self, request):
        """Create a new order."""
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Get book
        book = get_object_or_404(Book, id=serializer.validated_data['book_id'])
        provider = serializer.validated_data['provider']
        
        # Create order
        try:
            order = OrderService.create_order(request.user, book, provider)
        except ValueError as e:
            return Response(
                {'detail': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Return order
        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED
        )


class PaymentViewSet(viewsets.ViewSet):
    """ViewSet for payment operations."""
    
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'], url_path='vnpay/checkout')
    def vnpay_checkout(self, request):
        """
        Create VNPay payment URL.
        
        Request body:
        {
            "order_id": 123
        }
        
        Returns:
        {
            "payment_url": "https://..."
        }
        """
        order_id = request.data.get('order_id')
        if not order_id:
            return Response(
                {'detail': 'order_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get order
        order = get_object_or_404(
            Order,
            id=order_id,
            user=request.user,
            provider=PaymentProvider.VNPAY
        )
        
        # Generate payment URL
        payment_url = VNPayService.create_payment_url(order, request)
        
        return Response({'payment_url': payment_url})

    @action(detail=False, methods=['post'], url_path='momo/checkout')
    def momo_checkout(self, request):
        """
        Create MoMo payment request.
        
        Request body:
        {
            "order_id": 123
        }
        
        Returns:
        {
            "pay_url": "https://...",
            "qr_code_url": "https://...",
            "deeplink": "..."
        }
        """
        order_id = request.data.get('order_id')
        if not order_id:
            return Response(
                {'detail': 'order_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get order
        order = get_object_or_404(
            Order,
            id=order_id,
            user=request.user,
            provider=PaymentProvider.MOMO
        )
        
        # Create payment
        try:
            result = MoMoService.create_payment(order, request)
            return Response(result)
        except Exception as e:
            return Response(
                {'detail': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


@csrf_exempt
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def vnpay_ipn(request):
    """
    VNPay IPN (Instant Payment Notification) endpoint.
    Called by VNPay server-to-server.
    """
    payload = request.GET.dict() if request.method == 'GET' else request.data
    
    success, order, message = OrderService.confirm_payment(PaymentProvider.VNPAY, payload)
    
    if success:
        return Response({'RspCode': '00', 'Message': 'Confirm Success'})
    else:
        return Response({'RspCode': '99', 'Message': message})


@csrf_exempt
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def momo_ipn(request):
    """
    MoMo IPN (Instant Payment Notification) endpoint.
    Called by MoMo server-to-server.
    """
    payload = request.data
    
    success, order, message = OrderService.confirm_payment(PaymentProvider.MOMO, payload)
    
    if success:
        return Response({'resultCode': 0, 'message': 'Success'})
    else:
        return Response({'resultCode': 1, 'message': message})

