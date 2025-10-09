"""
Security utilities for signed URLs and media protection.
"""
from datetime import timedelta
from django.utils import timezone
from django.conf import settings
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature


class SignedURLGenerator:
    """Generate time-limited signed URLs for protected media."""
    
    def __init__(self, secret_key=None):
        self.secret_key = secret_key or settings.SECRET_KEY
        self.serializer = URLSafeTimedSerializer(self.secret_key)
    
    def generate_signed_url(self, file_path, expires_in_seconds=300):
        """
        Generate a signed URL for a file.
        
        Args:
            file_path: Path to the file
            expires_in_seconds: URL expiration time in seconds (default: 5 minutes)
        
        Returns:
            Signed token that can be used to access the file
        """
        data = {
            'file_path': file_path,
            'expires_at': (timezone.now() + timedelta(seconds=expires_in_seconds)).isoformat()
        }
        return self.serializer.dumps(data)
    
    def verify_signed_url(self, token, max_age=300):
        """
        Verify a signed URL token.
        
        Args:
            token: The signed token
            max_age: Maximum age in seconds
        
        Returns:
            Dictionary with file_path and expires_at, or None if invalid
        """
        try:
            data = self.serializer.loads(token, max_age=max_age)
            return data
        except (SignatureExpired, BadSignature):
            return None


def generate_audio_signed_url(asset, expires_in_minutes=5):
    """
    Generate a signed URL for audio asset.
    
    Args:
        asset: Asset instance
        expires_in_minutes: URL expiration time in minutes
    
    Returns:
        Full signed URL
    """
    from django.urls import reverse
    
    generator = SignedURLGenerator()
    token = generator.generate_signed_url(
        asset.file.name if asset.file else asset.file_path,
        expires_in_seconds=expires_in_minutes * 60
    )
    
    # Return the token that can be appended to URLs
    return token


def verify_media_access(user, asset):
    """
    Verify if user has access to a protected asset.
    
    Args:
        user: User instance
        asset: Asset instance
    
    Returns:
        Boolean indicating if user has access
    """
    # Admin users always have access
    if user.is_staff or user.is_superuser:
        return True
    
    # Check if user is enrolled in the book
    book = asset.unit.book
    
    # If unit is free, allow access
    if asset.unit.is_free:
        return True
    
    # Check enrollment
    from apps.users.models import Enrollment
    has_enrollment = Enrollment.objects.filter(
        user=user,
        book=book,
        is_active=True
    ).exists()
    
    return has_enrollment


def extract_audio_metadata(file_path):
    """
    Extract metadata from audio file.
    
    Args:
        file_path: Path to audio file
    
    Returns:
        Dictionary with duration_sec and other metadata
    """
    try:
        from mutagen import File
        
        audio = File(file_path)
        if audio is None:
            return {'duration_sec': 0}
        
        duration = int(audio.info.length) if hasattr(audio.info, 'length') else 0
        
        return {
            'duration_sec': duration,
            'bitrate': getattr(audio.info, 'bitrate', 0),
            'sample_rate': getattr(audio.info, 'sample_rate', 0),
            'channels': getattr(audio.info, 'channels', 0),
        }
    except Exception as e:
        # Log error in production
        return {'duration_sec': 0}

