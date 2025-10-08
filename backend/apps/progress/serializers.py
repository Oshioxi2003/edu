"""
Serializers for progress app.
"""
from rest_framework import serializers
from .models import UserProgress, ListeningSession


class UserProgressSerializer(serializers.ModelSerializer):
    """Serializer for user progress."""
    
    book_title = serializers.CharField(source='book.title', read_only=True)
    book_slug = serializers.CharField(source='book.slug', read_only=True)
    last_unit_title = serializers.CharField(source='last_unit.title', read_only=True)
    completion_pct = serializers.ReadOnlyField()
    
    class Meta:
        model = UserProgress
        fields = [
            'id', 'book', 'book_title', 'book_slug',
            'completed_units', 'last_unit', 'last_unit_title',
            'last_score_pct', 'total_listen_sec', 'completion_pct',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ListeningSessionSerializer(serializers.ModelSerializer):
    """Serializer for listening sessions."""
    
    unit_title = serializers.CharField(source='unit.title', read_only=True)
    
    class Meta:
        model = ListeningSession
        fields = [
            'id', 'unit', 'unit_title', 'duration_sec',
            'completed', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class ListenTickSerializer(serializers.Serializer):
    """Serializer for recording listening time."""
    
    duration_sec = serializers.IntegerField(min_value=1)
    completed = serializers.BooleanField(default=False)

