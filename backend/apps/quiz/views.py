"""
Views for quiz app.
"""
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from apps.catalog.models import Unit
from apps.users.models import Enrollment
from apps.common.exceptions import NoAccessException
from .models import Question, Attempt
from .serializers import (
    QuestionSerializer, QuizSubmitSerializer,
    AttemptSerializer, AttemptListSerializer
)
from .services import QuizGradingService


class QuizViewSet(viewsets.ViewSet):
    """ViewSet for quiz operations."""
    
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='units/(?P<unit_id>[^/.]+)/questions')
    def unit_questions(self, request, unit_id=None):
        """
        Get questions for a unit.
        Does NOT expose correct answers.
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
        
        # Get questions (without correct answers)
        questions = Question.objects.filter(unit=unit).prefetch_related('choices')
        serializer = QuestionSerializer(questions, many=True)
        
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='units/(?P<unit_id>[^/.]+)/submit')
    def submit_quiz(self, request, unit_id=None):
        """
        Submit quiz answers and get graded results.
        
        Request body:
        {
            "answers": [
                {"question_id": 1, "choice_ids": [1]},
                {"question_id": 2, "choice_ids": [3, 4]}
            ]
        }
        
        Response includes correct/incorrect for each question and overall score.
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
        serializer = QuizSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Grade quiz
        attempt = QuizGradingService.submit_quiz(
            user=request.user,
            unit=unit,
            answers_data=serializer.validated_data['answers']
        )
        
        # Return results
        result_serializer = AttemptSerializer(attempt)
        return Response(result_serializer.data, status=status.HTTP_201_CREATED)


class AttemptViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing quiz attempts."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Return current user's attempts."""
        return Attempt.objects.filter(
            user=self.request.user
        ).select_related('unit').prefetch_related('answers__question')

    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'retrieve':
            return AttemptSerializer
        return AttemptListSerializer

    @action(detail=False, methods=['get'], url_path='units/(?P<unit_id>[^/.]+)/best')
    def best_attempt(self, request, unit_id=None):
        """Get user's best attempt for a unit."""
        unit = get_object_or_404(Unit, id=unit_id)
        
        attempt = QuizGradingService.get_best_attempt(request.user, unit)
        
        if not attempt:
            return Response(
                {'detail': 'No attempts found for this unit.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = AttemptSerializer(attempt)
        return Response(serializer.data)

