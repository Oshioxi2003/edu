"""
Custom exceptions
"""
from rest_framework.exceptions import APIException
from rest_framework import status


class BusinessLogicError(APIException):
    """Base exception for business logic errors"""
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'A business logic error occurred.'
    default_code = 'business_error'


class ResourceNotFoundError(APIException):
    """Exception when resource is not found"""
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = 'Resource not found.'
    default_code = 'not_found'


class PermissionDeniedError(APIException):
    """Exception when permission is denied"""
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = 'You do not have permission to perform this action.'
    default_code = 'permission_denied'


class InsufficientCreditsException(APIException):
    """Exception when user has insufficient credits"""
    status_code = status.HTTP_402_PAYMENT_REQUIRED
    default_detail = 'Insufficient credits to access this content.'
    default_code = 'insufficient_credits'


class NoAccessException(APIException):
    """Exception when user doesn't have access to content"""
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = 'You do not have access to this content.'
    default_code = 'no_access'


class PaymentException(APIException):
    """Exception for payment processing errors"""
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Payment processing failed.'
    default_code = 'payment_failed'


class SignatureVerificationException(APIException):
    """Exception for signature verification failures"""
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Signature verification failed.'
    default_code = 'signature_verification_failed'


def custom_exception_handler(exc, context):
    """
    Custom exception handler that adds status_code to error responses.
    """
    from rest_framework.views import exception_handler
    
    response = exception_handler(exc, context)

    if response is not None:
        custom_response = {
            'status_code': response.status_code,
            'error': True,
        }
        
        if isinstance(response.data, dict):
            custom_response.update(response.data)
        else:
            custom_response['detail'] = response.data
            
        response.data = custom_response

    return response