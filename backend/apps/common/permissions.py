"""
Custom permissions
"""
from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner
        return obj.owner == request.user or obj.user == request.user


class IsStaffOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow staff to edit.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff


class IsAdminUser(permissions.BasePermission):
    """
    Permission to only allow admin users.
    """

    def has_permission(self, request, view):
        from apps.common.enums import UserRole
        return request.user and request.user.is_authenticated and request.user.role == UserRole.ADMIN


class IsStaffOrAdmin(permissions.BasePermission):
    """
    Permission to only allow staff or admin users.
    """

    def has_permission(self, request, view):
        from apps.common.enums import UserRole
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role in [UserRole.ADMIN, UserRole.STAFF]
        )


class HasBookAccess(permissions.BasePermission):
    """
    Permission to check if user has access to a book (via enrollment).
    """

    def has_object_permission(self, request, view, obj):
        from apps.common.enums import UserRole
        
        # Allow if user is staff or admin
        if request.user.role in [UserRole.ADMIN, UserRole.STAFF]:
            return True
        
        # Check if user has enrollment for this book
        from apps.users.models import Enrollment
        book = getattr(obj, 'book', obj)
        return Enrollment.objects.filter(
            user=request.user,
            book=book,
            is_active=True
        ).exists()