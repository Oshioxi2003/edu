"""
Helper utilities.
"""
import hashlib
import hmac
import time
from urllib.parse import urlencode, quote
from typing import Dict, Any


def generate_signature(data: Dict[str, Any], secret_key: str, hash_algorithm='sha256') -> str:
    """
    Generate HMAC signature for payment gateways.
    
    Args:
        data: Dictionary of parameters
        secret_key: Secret key for signing
        hash_algorithm: Hash algorithm to use (default: sha256)
    
    Returns:
        Hex string of the signature
    """
    # Sort parameters by key
    sorted_params = sorted(data.items())
    
    # Create query string
    query_string = '&'.join([f"{k}={v}" for k, v in sorted_params if v is not None and v != ''])
    
    # Generate HMAC
    signature = hmac.new(
        secret_key.encode('utf-8'),
        query_string.encode('utf-8'),
        hashlib.__dict__[hash_algorithm]
    ).hexdigest()
    
    return signature


def verify_signature(data: Dict[str, Any], signature: str, secret_key: str, hash_algorithm='sha256') -> bool:
    """
    Verify HMAC signature.
    
    Args:
        data: Dictionary of parameters
        signature: Signature to verify
        secret_key: Secret key for verification
        hash_algorithm: Hash algorithm to use
    
    Returns:
        True if signature is valid, False otherwise
    """
    expected_signature = generate_signature(data, secret_key, hash_algorithm)
    return hmac.compare_digest(signature.lower(), expected_signature.lower())


def generate_order_id(user_id: int, timestamp: int = None) -> str:
    """
    Generate unique order ID.
    
    Args:
        user_id: User ID
        timestamp: Unix timestamp (optional, uses current time if not provided)
    
    Returns:
        Order ID string
    """
    if timestamp is None:
        timestamp = int(time.time())
    
    return f"ORD{user_id:06d}{timestamp}"


def generate_secure_token(data: str, secret_key: str, expiration: int = None) -> str:
    """
    Generate secure token for signed URLs.
    
    Args:
        data: Data to sign
        secret_key: Secret key
        expiration: Expiration timestamp (optional)
    
    Returns:
        Secure token
    """
    if expiration:
        data = f"{data}:{expiration}"
    
    token = hmac.new(
        secret_key.encode('utf-8'),
        data.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    return token


def verify_secure_token(data: str, token: str, secret_key: str, expiration: int = None) -> bool:
    """
    Verify secure token.
    
    Args:
        data: Data that was signed
        token: Token to verify
        secret_key: Secret key
        expiration: Expiration timestamp
    
    Returns:
        True if token is valid and not expired, False otherwise
    """
    # Check expiration
    if expiration and int(time.time()) > expiration:
        return False
    
    expected_token = generate_secure_token(data, secret_key, expiration)
    return hmac.compare_digest(token, expected_token)


def calculate_file_checksum(file_path: str, algorithm='md5') -> str:
    """
    Calculate checksum of a file.
    
    Args:
        file_path: Path to file
        algorithm: Hash algorithm (default: md5)
    
    Returns:
        Hex string of checksum
    """
    hash_func = hashlib.__dict__[algorithm]()
    
    with open(file_path, 'rb') as f:
        for chunk in iter(lambda: f.read(4096), b''):
            hash_func.update(chunk)
    
    return hash_func.hexdigest()


def format_currency(amount: int, currency: str = 'VND') -> str:
    """
    Format currency amount.
    
    Args:
        amount: Amount in smallest currency unit
        currency: Currency code
    
    Returns:
        Formatted currency string
    """
    if currency == 'VND':
        return f"{amount:,} ₫"
    return f"{amount:,.2f} {currency}"
