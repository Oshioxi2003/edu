"""
URL configuration for users app.
"""
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, LoginView, LogoutView,
    ProfileView, ChangePasswordView, MeView,
    MyEnrollmentsView
)

app_name = 'users'

urlpatterns = [
    # Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Profile
    path('me/', MeView.as_view(), name='me'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    
    # Enrollments
    path('enrollments/', MyEnrollmentsView.as_view(), name='my_enrollments'),
]
