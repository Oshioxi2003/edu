"""
MoMo payment gateway integration.
"""
import hashlib
import hmac
import json
import requests
from django.conf import settings


class MoMoService:
    """Service for MoMo payment gateway."""
    
    @staticmethod
    def create_payment(order, request):
        """
        Create MoMo payment request.
        
        Args:
            order: Order instance
            request: HTTP request object
        
        Returns:
            Dictionary with payment URL and QR code URL
        """
        # MoMo parameters
        order_id = str(order.id)
        request_id = f"{order_id}_{int(request.user.id)}"
        
        raw_data = (
            f"accessKey={settings.MOMO_ACCESS_KEY}"
            f"&amount={int(order.amount)}"
            f"&extraData="
            f"&ipnUrl={settings.MOMO_NOTIFY_URL}"
            f"&orderId={order_id}"
            f"&orderInfo=Payment for {order.book.title}"
            f"&partnerCode={settings.MOMO_PARTNER_CODE}"
            f"&redirectUrl={settings.MOMO_RETURN_URL}"
            f"&requestId={request_id}"
            f"&requestType=captureWallet"
        )
        
        # Create signature
        signature = hmac.new(
            settings.MOMO_SECRET_KEY.encode('utf-8'),
            raw_data.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        # Build request payload
        payload = {
            'partnerCode': settings.MOMO_PARTNER_CODE,
            'accessKey': settings.MOMO_ACCESS_KEY,
            'requestId': request_id,
            'amount': str(int(order.amount)),
            'orderId': order_id,
            'orderInfo': f'Payment for {order.book.title}',
            'redirectUrl': settings.MOMO_RETURN_URL,
            'ipnUrl': settings.MOMO_NOTIFY_URL,
            'requestType': 'captureWallet',
            'extraData': '',
            'signature': signature,
            'lang': 'vi'
        }
        
        # Send request to MoMo
        try:
            response = requests.post(
                settings.MOMO_ENDPOINT,
                json=payload,
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            response.raise_for_status()
            result = response.json()
            
            return {
                'pay_url': result.get('payUrl'),
                'qr_code_url': result.get('qrCodeUrl'),
                'deeplink': result.get('deeplink'),
            }
        except Exception as e:
            raise Exception(f'MoMo API error: {str(e)}')
    
    @staticmethod
    def verify_ipn(payload):
        """
        Verify MoMo IPN (Instant Payment Notification).
        
        Args:
            payload: Dictionary of IPN parameters
        
        Returns:
            Tuple of (is_valid, order_id, amount, status)
        """
        # Extract signature
        received_signature = payload.get('signature', '')
        
        # Create raw data for signature verification
        raw_data = (
            f"accessKey={settings.MOMO_ACCESS_KEY}"
            f"&amount={payload.get('amount', '')}"
            f"&extraData={payload.get('extraData', '')}"
            f"&message={payload.get('message', '')}"
            f"&orderId={payload.get('orderId', '')}"
            f"&orderInfo={payload.get('orderInfo', '')}"
            f"&orderType={payload.get('orderType', '')}"
            f"&partnerCode={payload.get('partnerCode', '')}"
            f"&payType={payload.get('payType', '')}"
            f"&requestId={payload.get('requestId', '')}"
            f"&responseTime={payload.get('responseTime', '')}"
            f"&resultCode={payload.get('resultCode', '')}"
            f"&transId={payload.get('transId', '')}"
        )
        
        # Calculate signature
        expected_signature = hmac.new(
            settings.MOMO_SECRET_KEY.encode('utf-8'),
            raw_data.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        is_valid = hmac.compare_digest(received_signature, expected_signature)
        
        # Extract order info
        order_id = int(payload.get('orderId', 0))
        amount = float(payload.get('amount', 0))
        result_code = int(payload.get('resultCode', -1))
        status = 'success' if result_code == 0 else 'failed'
        
        return is_valid, order_id, amount, status

