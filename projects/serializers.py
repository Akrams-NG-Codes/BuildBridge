from rest_framework import serializers
from .models import Project, ProjectMember
from accounts.serializers import UserSerializer


class ProjectSerializer(serializers.ModelSerializer):
    members_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
    
    def get_members_count(self, obj):
        return obj.members.count()


class ProjectMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = ProjectMember
        fields = '__all__'
        read_only_fields = ['joined_at']
