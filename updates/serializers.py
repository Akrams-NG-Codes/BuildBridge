from rest_framework import serializers
from .models import Update, Comment
from accounts.serializers import UserSerializer


class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ['created_at', 'author']


class UpdateSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Update
        fields = '__all__'
        read_only_fields = ['created_at', 'uploaded_by']
    
    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
        return None
