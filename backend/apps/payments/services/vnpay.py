"""
VNPay payment gateway integration.
"""
import hashlib
import hmac
import urllib.parse
from datetime import datetime
from django.conf import settings
from apps.common.utils.helpers import generate_signature, verify_signature


class VNPayService:
    """Service for VNPay payment gateway."""
    
    @staticmethod
    def create_payment_url(order, request):
        """
        Create VNPay payment URL.
        
        Args:
            order: Order instance
            request: HTTP request object
        
        Returns:
            Payment URL string
        """
        # VNPay parameters
        vnp_params = {
            'vnp_Version': '2.1.0',
            'vnp_Command': 'pay',
            'vnp_TmnCode': settings.VNPAY_TMN_CODE,
            'vnp_Amount': int(order.amount * 100),  # Convert to smallest unit (cents)
            'vnp_CurrCode': 'VND',
            'vnp_TxnRef': str(order.id),
            'vnp_OrderInfo': f'Payment for {order.book.title}',
            'vnp_OrderType': 'billpayment',
            'vnp_Locale': 'vn',
            'vnp_ReturnUrl': settings.VNPAY_RETURN_URL,
            'vnp_IpAddr': VNPayService._get_client_ip(request),
            'vnp_CreateDate': datetime.now().strftime('%Y%m%d%H%M%S'),
        }
        
        # Sort and create query string
        sorted_params = sorted(vnp_params.items())
        query_string = '&'.join([f"{k}={urllib.parse.quote_plus(str(v))}" for k, v in sorted_params])
        
        # Create signature
        hash_data = '&'.join([f"{k}={v}" for k, v in sorted_params])
        secure_hash = hmac.new(
            settings.VNPAY_HASH_SECRET.encode('utf-8'),
            hash_data.encode('utf-8'),
            hashlib.sha512
        ).hexdigest()
        
        # Build payment URL
        payment_url = f"{settings.VNPAY_URL}?{query_string}&vnp_SecureHash={secure_hash}"
        
        return payment_url
    
    @staticmethod
    def verify_ipn(payload):
        """
        Verify VNPay IPN (Instant Payment Notification).
        
        Args:
            payload: Dictionary of IPN parameters
        
        Returns:
            Tuple of (is_valid, order_id, amount, status)
        """
        # Extract signature
        vnp_secure_hash = payload.get('vnp_SecureHash', '')
        
        # Create params dict without signature
        vnp_params = {k: v for k, v in payload.items() if k != 'vnp_SecureHash'}
        
        # Verify signature
        sorted_params = sorted(vnp_params.items())
        hash_data = '&'.join([f"{k}={v}" for k, v in sorted_params])
        expected_hash = hmac.new(
            settings.VNPAY_HASH_SECRET.encode('utf-8'),
            hash_data.encode('utf-8'),
            hashlib.sha512
        ).hexdigest()
        
        is_valid = hmac.compare_digest(vnp_secure_hash.lower(), expected_hash.lower())
        
        # Extract order info
        order_id = int(payload.get('vnp_TxnRef', 0))
        amount = int(payload.get('vnp_Amount', 0)) / 100  # Convert from cents
        response_code = payload.get('vnp_ResponseCode', '')
        status = 'success' if response_code == '00' else 'failed'
        
        return is_valid, order_id, amount, status
    
    @staticmethod
    def _get_client_ip(request):
        """Get client IP address from request."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

