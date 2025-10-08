"""
URL configuration for progress app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProgressViewSet, ListeningSessionViewSet

app_name = 'progress'

router = DefaultRouter()
router.register('', ProgressViewSet, basename='progress')
router.register('sessions', ListeningSessionViewSet, basename='session')

urlpatterns = [
    path('', include(router.urls)),
]

