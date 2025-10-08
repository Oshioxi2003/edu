"""
Common enumerations used across the platform.
"""
from django.db import models


class UserRole(models.TextChoices):
    ADMIN = 'admin', 'Admin'
    STAFF = 'staff', 'Staff'
    STUDENT = 'student', 'Student'


class AssetType(models.TextChoices):
    AUDIO = 'audio', 'Audio'
    PDF = 'pdf', 'PDF'
    SUBTITLE = 'subtitle', 'Subtitle'


class QuestionType(models.TextChoices):
    SINGLE = 'single', 'Single Choice'
    MULTI = 'multi', 'Multiple Choice'


class OrderStatus(models.TextChoices):
    PENDING = 'pending', 'Pending'
    PAID = 'paid', 'Paid'
    FAILED = 'failed', 'Failed'
    CANCELLED = 'cancelled', 'Cancelled'


class PaymentProvider(models.TextChoices):
    VNPAY = 'vnpay', 'VNPay'
    MOMO = 'momo', 'MoMo'


class TransactionStatus(models.TextChoices):
    SUCCESS = 'success', 'Success'
    FAILED = 'failed', 'Failed'
    PENDING = 'pending', 'Pending'

