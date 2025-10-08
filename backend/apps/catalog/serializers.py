"""
Serializers for catalog app.
"""
from rest_framework import serializers
from .models import Book, Unit, Asset


class AssetSerializer(serializers.ModelSerializer):
    """Serializer for assets."""
    
    size_formatted = serializers.ReadOnlyField()
    url = serializers.SerializerMethodField()
    
    class Meta:
        model = Asset
        fields = ['id', 'type', 'bytes', 'size_formatted', 'url']

    def get_url(self, obj):
        """
        Return URL for asset.
        For protected assets, this should be a signed URL endpoint.
        """
        if obj.is_protected:
            # Return endpoint to get signed URL
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(f'/api/catalog/assets/{obj.id}/url/')
            return None
        else:
            # Return direct file URL
            if obj.file:
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(obj.file.url)
            return None


class UnitListSerializer(serializers.ModelSerializer):
    """Serializer for unit list (minimal info)."""
    
    duration_formatted = serializers.ReadOnlyField()
    has_quiz = serializers.ReadOnlyField()
    
    class Meta:
        model = Unit
        fields = ['id', 'title', 'order', 'is_free', 'duration_sec', 'duration_formatted', 'has_quiz']


class UnitDetailSerializer(serializers.ModelSerializer):
    """Serializer for unit detail (full info)."""
    
    duration_formatted = serializers.ReadOnlyField()
    has_quiz = serializers.ReadOnlyField()
    assets = AssetSerializer(many=True, read_only=True)
    
    class Meta:
        model = Unit
        fields = [
            'id', 'title', 'order', 'transcript', 'is_free',
            'duration_sec', 'duration_formatted', 'has_quiz',
            'assets', 'created_at'
        ]


class BookListSerializer(serializers.ModelSerializer):
    """Serializer for book list."""
    
    unit_count = serializers.ReadOnlyField()
    free_units_count = serializers.ReadOnlyField()
    is_owned = serializers.SerializerMethodField()
    
    class Meta:
        model = Book
        fields = [
            'id', 'title', 'slug', 'description', 'cover',
            'price', 'is_published', 'unit_count', 'free_units_count',
            'is_owned', 'created_at'
        ]

    def get_is_owned(self, obj):
        """Check if current user owns this book."""
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        
        from apps.users.models import Enrollment
        return Enrollment.objects.filter(
            user=request.user,
            book=obj,
            is_active=True
        ).exists()


class BookDetailSerializer(serializers.ModelSerializer):
    """Serializer for book detail with units."""
    
    unit_count = serializers.ReadOnlyField()
    free_units_count = serializers.ReadOnlyField()
    is_owned = serializers.SerializerMethodField()
    units = serializers.SerializerMethodField()
    
    class Meta:
        model = Book
        fields = [
            'id', 'title', 'slug', 'description', 'cover',
            'price', 'is_published', 'unit_count', 'free_units_count',
            'is_owned', 'units', 'created_at'
        ]

    def get_is_owned(self, obj):
        """Check if current user owns this book."""
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        
        from apps.users.models import Enrollment
        return Enrollment.objects.filter(
            user=request.user,
            book=obj,
            is_active=True
        ).exists()

    def get_units(self, obj):
        """Return units (preview only if not owned)."""
        request = self.context.get('request')
        is_owned = self.get_is_owned(obj)
        
        # If owned, return all units; otherwise only free units
        if is_owned:
            units = obj.units.all()
        else:
            # Return first 3 units or all free units
            units = obj.units.filter(is_free=True)[:3]
        
        return UnitListSerializer(units, many=True, context=self.context).data

