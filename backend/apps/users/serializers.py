"""
Serializers for user authentication and profile.
"""
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, Profile, Enrollment


class ProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile."""
    
    name = serializers.ReadOnlyField()
    
    class Meta:
        model = Profile
        fields = ['display_name', 'name', 'avatar', 'phone', 'date_of_birth', 'bio']


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user details."""
    
    profile = ProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'email', 'role', 'is_active', 'created_at', 'profile']
        read_only_fields = ['id', 'role', 'is_active', 'created_at']


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)
    display_name = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ['email', 'password', 'password_confirm', 'display_name']

    def validate(self, attrs):
        """Validate password confirmation."""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        """Create user and profile."""
        validated_data.pop('password_confirm')
        display_name = validated_data.pop('display_name', '')
        
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password']
        )
        
        # Update profile (created by signal) with display_name
        if display_name:
            user.profile.display_name = display_name
            user.profile.save()
        
        return user


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change."""
    
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        """Validate password confirmation."""
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({"new_password": "Password fields didn't match."})
        return attrs

    def validate_old_password(self, value):
        """Validate old password."""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value


class EnrollmentSerializer(serializers.ModelSerializer):
    """Serializer for enrollment."""
    
    book_title = serializers.CharField(source='book.title', read_only=True)
    book_slug = serializers.CharField(source='book.slug', read_only=True)
    is_expired = serializers.ReadOnlyField()
    
    class Meta:
        model = Enrollment
        fields = [
            'id', 'book', 'book_title', 'book_slug',
            'active_from', 'active_until', 'is_active', 
            'is_expired', 'created_at'
        ]
        read_only_fields = ['id', 'is_active', 'created_at']
