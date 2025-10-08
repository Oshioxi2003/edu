"""
URL configuration for catalog app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookViewSet, UnitViewSet

app_name = 'catalog'

router = DefaultRouter()
router.register('books', BookViewSet, basename='book')
router.register('units', UnitViewSet, basename='unit')

urlpatterns = [
    path('', include(router.urls)),
]

