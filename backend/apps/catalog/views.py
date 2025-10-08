"""
Views for catalog app.
"""
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.utils import timezone
import time

from .models import Book, Unit, Asset
from .serializers import (
    BookListSerializer, BookDetailSerializer,
    UnitListSerializer, UnitDetailSerializer
)
from apps.common.permissions import HasBookAccess
from apps.common.exceptions import NoAccessException
from apps.common.utils.helpers import generate_secure_token
from apps.users.models import Enrollment


class AssetURLThrottle(UserRateThrottle):
    """Custom throttle for asset URL generation."""
    rate = '50/hour'


class BookViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for books."""
    
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    
    def get_queryset(self):
        """Return published books or all for staff."""
        queryset = Book.objects.all()
        
        # Non-staff users only see published books
        if not self.request.user.is_authenticated or not self.request.user.is_staff:
            queryset = queryset.filter(is_published=True)
        
        return queryset.prefetch_related('units')

    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'retrieve':
            return BookDetailSerializer
        return BookListSerializer

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def units(self, request, slug=None):
        """Get all units for a book (requires access)."""
        book = self.get_object()
        
        # Check if user has access
        is_owned = Enrollment.objects.filter(
            user=request.user,
            book=book,
            is_active=True
        ).exists()
        
        # Get units based on access
        if is_owned or request.user.is_staff:
            units = book.units.all()
        else:
            units = book.units.filter(is_free=True)
        
        serializer = UnitListSerializer(units, many=True, context={'request': request})
        return Response(serializer.data)


class UnitViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for units."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Return units accessible to user."""
        return Unit.objects.select_related('book').prefetch_related('assets')

    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'retrieve':
            return UnitDetailSerializer
        return UnitListSerializer

    def retrieve(self, request, *args, **kwargs):
        """Get unit detail (check access)."""
        unit = self.get_object()
        
        # Check access
        if not unit.is_free:
            has_access = Enrollment.objects.filter(
                user=request.user,
                book=unit.book,
                is_active=True
            ).exists()
            
            if not has_access and not request.user.is_staff:
                raise NoAccessException()
        
        serializer = self.get_serializer(unit)
        return Response(serializer.data)

    @action(
        detail=True,
        methods=['post'],
        permission_classes=[permissions.IsAuthenticated],
        throttle_classes=[AssetURLThrottle]
    )
    def asset_url(self, request, pk=None):
        """
        Generate signed URL for unit asset.
        
        Request body:
        {
            "asset_type": "audio"  # or "pdf", "subtitle"
        }
        
        Returns:
        {
            "url": "signed_url",
            "expires_in": 300
        }
        """
        unit = self.get_object()
        asset_type = request.data.get('asset_type', 'audio')
        
        # Check access
        if not unit.is_free:
            has_access = Enrollment.objects.filter(
                user=request.user,
                book=unit.book,
                is_active=True
            ).exists()
            
            if not has_access and not request.user.is_staff:
                raise NoAccessException()
        
        # Get asset
        try:
            asset = unit.assets.get(type=asset_type)
        except Asset.DoesNotExist:
            return Response(
                {'detail': f'Asset of type {asset_type} not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Generate signed URL
        expiration = int(time.time()) + settings.SIGNED_URL_EXPIRATION
        data = f"{asset.id}:{request.user.id}"
        token = generate_secure_token(data, settings.SECRET_KEY, expiration)
        
        # Build signed URL
        base_url = request.build_absolute_uri(asset.file.url)
        signed_url = f"{base_url}?token={token}&expires={expiration}&user={request.user.id}"
        
        return Response({
            'url': signed_url,
            'expires_in': settings.SIGNED_URL_EXPIRATION
        })

