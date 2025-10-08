"""
Serializers for quiz app.
"""
from rest_framework import serializers
from .models import Question, Choice, Attempt, AttemptAnswer


class ChoiceSerializer(serializers.ModelSerializer):
    """
    Serializer for choices.
    IMPORTANT: Does NOT expose is_correct to prevent answer leakage.
    """
    
    class Meta:
        model = Choice
        fields = ['id', 'text', 'order']


class QuestionSerializer(serializers.ModelSerializer):
    """
    Serializer for questions.
    Does NOT expose correct answers.
    """
    
    choices = ChoiceSerializer(many=True, read_only=True)
    
    class Meta:
        model = Question
        fields = ['id', 'type', 'text', 'order', 'choices']


class AnswerSubmitSerializer(serializers.Serializer):
    """Serializer for submitting an answer."""
    
    question_id = serializers.IntegerField()
    choice_ids = serializers.ListField(
        child=serializers.IntegerField(),
        allow_empty=False
    )


class QuizSubmitSerializer(serializers.Serializer):
    """Serializer for submitting a quiz."""
    
    answers = AnswerSubmitSerializer(many=True)


class AttemptAnswerResultSerializer(serializers.ModelSerializer):
    """Serializer for attempt answer results (shown after submission)."""
    
    question_text = serializers.CharField(source='question.text', read_only=True)
    correct_choice_ids = serializers.ReadOnlyField(source='question.correct_choices')
    explanation = serializers.CharField(source='question.explanation', read_only=True)
    
    class Meta:
        model = AttemptAnswer
        fields = [
            'question', 'question_text', 'selected_choices',
            'is_correct', 'correct_choice_ids', 'explanation'
        ]


class AttemptSerializer(serializers.ModelSerializer):
    """Serializer for quiz attempts."""
    
    unit_title = serializers.CharField(source='unit.title', read_only=True)
    is_submitted = serializers.ReadOnlyField()
    is_passed = serializers.ReadOnlyField()
    answers = AttemptAnswerResultSerializer(many=True, read_only=True)
    
    class Meta:
        model = Attempt
        fields = [
            'id', 'unit', 'unit_title', 'started_at', 'submitted_at',
            'score_raw', 'score_pct', 'is_submitted', 'is_passed',
            'answers', 'created_at'
        ]
        read_only_fields = ['id', 'score_raw', 'score_pct', 'created_at']


class AttemptListSerializer(serializers.ModelSerializer):
    """Simplified serializer for attempt list."""
    
    unit_title = serializers.CharField(source='unit.title', read_only=True)
    is_submitted = serializers.ReadOnlyField()
    is_passed = serializers.ReadOnlyField()
    
    class Meta:
        model = Attempt
        fields = [
            'id', 'unit', 'unit_title', 'started_at', 'submitted_at',
            'score_raw', 'score_pct', 'is_submitted', 'is_passed', 'created_at'
        ]

