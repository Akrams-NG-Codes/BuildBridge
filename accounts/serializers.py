from rest_framework import serializers
from .models import User, Developer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'phone', 'verified', 'profile_image']
        read_only_fields = ['id']


class DeveloperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Developer
        fields = ['id', 'name', 'email', 'phone', 'verified', 'logo', 'primary_color', 'secondary_color']
        read_only_fields = ['id']
