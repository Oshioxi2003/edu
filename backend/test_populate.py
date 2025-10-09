"""
Test script to populate minimal data.
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.db import transaction
from apps.catalog.models import Book, Unit
from apps.users.models import User
from apps.common.enums import UserRole

def test_create():
    """Test creating minimal data."""
    print("Testing data creation...")
    
    with transaction.atomic():
        # Create 1 user
        user, created = User.objects.get_or_create(
            email='test@example.com',
            defaults={
                'role': UserRole.STUDENT,
                'is_active': True
            }
        )
        if created:
            user.set_password('password123')
            user.save()
        print(f"✓ User: {user.email}")
        
        # Create 1 book
        book, created = Book.objects.get_or_create(
            slug='test-book',
            defaults={
                'title': 'Test Book',
                'description': 'Test description',
                'price': 0,
                'is_published': True
            }
        )
        print(f"✓ Book: {book.title}")
        
        # Create 1 unit
        unit, created = Unit.objects.get_or_create(
            book=book,
            order=1,
            defaults={
                'title': 'Test Unit',
                'transcript': 'Test transcript',
                'is_free': True,
                'duration_sec': 300
            }
        )
        print(f"✓ Unit: {unit.title}")
    
    print("✓ Test completed successfully!")

if __name__ == '__main__':
    test_create()
