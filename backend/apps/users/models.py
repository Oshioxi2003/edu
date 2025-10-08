"""
User models for authentication and enrollment.
"""
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
from apps.common.enums import UserRole
from apps.common.mixins import TimestampMixin


class UserManager(BaseUserManager):
    """Custom user manager."""

    def create_user(self, email, password=None, **extra_fields):
        """Create and return a regular user."""
        if not email:
            raise ValueError('Users must have an email address')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Create and return a superuser."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', UserRole.ADMIN)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin, TimestampMixin):
    """Custom user model using email as username."""
    
    email = models.EmailField(unique=True, db_index=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.STUDENT,
        db_index=True
    )
    
    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        db_table = 'users_user'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.email

    @property
    def is_admin(self):
        return self.role == UserRole.ADMIN

    @property
    def is_student(self):
        return self.role == UserRole.STUDENT


class Profile(TimestampMixin):
    """User profile with additional information."""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile', primary_key=True)
    display_name = models.CharField(max_length=100, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    bio = models.TextField(blank=True)
    
    class Meta:
        db_table = 'users_profile'
        verbose_name = 'Profile'
        verbose_name_plural = 'Profiles'

    def __str__(self):
        return f"Profile of {self.user.email}"

    @property
    def name(self):
        """Return display name or email."""
        return self.display_name or self.user.email


class Enrollment(TimestampMixin):
    """User enrollment in books/courses."""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrollments')
    book = models.ForeignKey('catalog.Book', on_delete=models.CASCADE, related_name='enrollments')
    active_from = models.DateTimeField(default=timezone.now)
    active_until = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True, db_index=True)
    
    class Meta:
        db_table = 'users_enrollment'
        verbose_name = 'Enrollment'
        verbose_name_plural = 'Enrollments'
        unique_together = [['user', 'book']]
        indexes = [
            models.Index(fields=['user', 'book']),
            models.Index(fields=['user', 'is_active']),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.book.title}"

    @property
    def is_expired(self):
        """Check if enrollment is expired."""
        if self.active_until is None:
            return False
        return timezone.now() > self.active_until

    def save(self, *args, **kwargs):
        """Override save to check expiration."""
        if self.is_expired:
            self.is_active = False
        super().save(*args, **kwargs)
