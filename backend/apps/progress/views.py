"""
Views for progress tracking.
"""
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from apps.catalog.models import Unit
from apps.users.models import Enrollment
from apps.common.exceptions import NoAccessException
from .models import UserProgress, ListeningSession
from .serializers import (
    UserProgressSerializer, ListeningSessionSerializer,
    ListenTickSerializer
)
from .services import ProgressService


class ProgressViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for user progress."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserProgressSerializer
    
    def get_queryset(self):
        """Return current user's progress."""
        return UserProgress.objects.filter(
            user=self.request.user
        ).select_related('book', 'last_unit')

    @action(detail=False, methods=['get'])
    def analytics(self, request):
        """Get user analytics."""
        analytics = ProgressService.get_user_analytics(request.user)
        
        return Response({
            'total_listen_time': analytics['total_listen_time'],
            'avg_score': analytics['avg_score'],
            'books_started': analytics['books_started'],
            'recent_sessions': ListeningSessionSerializer(
                analytics['recent_sessions'],
                many=True
            ).data,
            'book_progress': UserProgressSerializer(
                analytics['book_progress'],
                many=True
            ).data,
        })


class ListeningSessionViewSet(viewsets.ViewSet):
    """ViewSet for listening sessions."""
    
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'], url_path='units/(?P<unit_id>[^/.]+)/tick')
    def listen_tick(self, request, unit_id=None):
        """
        Record listening time for a unit.
        
        Request body:
        {
            "duration_sec": 30,
            "completed": false
        }
        """
        unit = get_object_or_404(Unit, id=unit_id)
        
        # Check access
        if not unit.is_free:
            has_access = Enrollment.objects.filter(
                user=request.user,
                book=unit.book,
                is_active=True
            ).exists()
            
            if not has_access and not request.user.is_staff:
                raise NoAccessException()
        
        # Validate request data
        serializer = ListenTickSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Record listening time
        session = ProgressService.record_listening_time(
            user=request.user,
            unit=unit,
            duration_sec=serializer.validated_data['duration_sec'],
            completed=serializer.validated_data.get('completed', False)
        )
        
        return Response(
            ListeningSessionSerializer(session).data,
            status=status.HTTP_201_CREATED
        )

