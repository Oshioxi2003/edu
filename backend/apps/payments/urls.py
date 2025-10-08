"""
URL configuration for payments app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, PaymentViewSet, vnpay_ipn, momo_ipn

app_name = 'payments'

router = DefaultRouter()
router.register('orders', OrderViewSet, basename='order')
router.register('', PaymentViewSet, basename='payment')

urlpatterns = [
    # IPN endpoints (no authentication required)
    path('vnpay/ipn/', vnpay_ipn, name='vnpay_ipn'),
    path('momo/ipn/', momo_ipn, name='momo_ipn'),
    
    # Other endpoints
    path('', include(router.urls)),
]

