from rest_framework import viewsets, permissions, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from .models import Update, Comment
from .serializers import UpdateSerializer, CommentSerializer


class UpdateViewSet(viewsets.ModelViewSet):
    serializer_class = UpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        project_id = self.request.query_params.get('project')
        if project_id:
            return Update.objects.filter(project_id=project_id)
        return Update.objects.none()
    
    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        update_id = self.request.query_params.get('update')
        if update_id:
            return Comment.objects.filter(update_id=update_id)
        return Comment.objects.none()
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
