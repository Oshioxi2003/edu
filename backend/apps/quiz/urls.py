"""
URL configuration for quiz app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QuizViewSet, AttemptViewSet

app_name = 'quiz'

router = DefaultRouter()
router.register('', QuizViewSet, basename='quiz')
router.register('attempts', AttemptViewSet, basename='attempt')

urlpatterns = [
    path('', include(router.urls)),
]

