"""
Business logic services for quiz app.
"""
from django.utils import timezone
from django.db import transaction
from .models import Question, Attempt, AttemptAnswer


class QuizGradingService:
    """Service for grading quiz attempts."""
    
    @staticmethod
    @transaction.atomic
    def submit_quiz(user, unit, answers_data):
        """
        Submit and grade a quiz attempt.
        
        Args:
            user: User submitting the quiz
            unit: Unit being quizzed
            answers_data: List of dicts with question_id and choice_ids
        
        Returns:
            Attempt object with graded results
        """
        # Create attempt
        attempt = Attempt.objects.create(
            user=user,
            unit=unit,
            started_at=timezone.now()
        )
        
        # Get all questions for this unit
        questions = Question.objects.filter(unit=unit).prefetch_related('choices')
        question_dict = {q.id: q for q in questions}
        
        correct_count = 0
        total_questions = len(questions)
        
        # Process each answer
        for answer_data in answers_data:
            question_id = answer_data['question_id']
            selected_choice_ids = answer_data['choice_ids']
            
            # Get question
            question = question_dict.get(question_id)
            if not question:
                continue  # Skip invalid question IDs
            
            # Create attempt answer
            attempt_answer = AttemptAnswer.objects.create(
                attempt=attempt,
                question=question,
                selected_choices=selected_choice_ids
            )
            
            # Grade the answer
            if attempt_answer.grade():
                correct_count += 1
            
            attempt_answer.save()
        
        # Calculate score
        attempt.score_raw = correct_count
        attempt.score_pct = (correct_count / total_questions * 100) if total_questions > 0 else 0
        attempt.submitted_at = timezone.now()
        attempt.save()
        
        return attempt
    
    @staticmethod
    def get_user_attempts(user, unit=None):
        """
        Get user's quiz attempts.
        
        Args:
            user: User
            unit: Optional unit filter
        
        Returns:
            QuerySet of attempts
        """
        attempts = Attempt.objects.filter(user=user).select_related('unit')
        
        if unit:
            attempts = attempts.filter(unit=unit)
        
        return attempts.order_by('-created_at')
    
    @staticmethod
    def get_best_attempt(user, unit):
        """
        Get user's best attempt for a unit.
        
        Args:
            user: User
            unit: Unit
        
        Returns:
            Attempt with highest score or None
        """
        return Attempt.objects.filter(
            user=user,
            unit=unit,
            submitted_at__isnull=False
        ).order_by('-score_pct').first()

