from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Project, ProjectMember
from .serializers import ProjectSerializer, ProjectMemberSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Project.objects.all()
        elif user.role == 'developer_admin' or user.role == 'developer_staff':
            return Project.objects.filter(members__user=user).distinct()
        else:
            # Clients only see approved projects
            from accounts.models import ClientProjectLink
            links = ClientProjectLink.objects.filter(client=user, status='approved')
            project_ids = links.values_list('project_id', flat=True)
            return Project.objects.filter(id__in=project_ids)
    
    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        project = self.get_object()
        user_id = request.data.get('user_id')
        role = request.data.get('role', 'staff')
        
        if not user_id:
            return Response(
                {'error': 'user_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        member, created = ProjectMember.objects.get_or_create(
            project=project,
            user_id=user_id,
            defaults={'role': role}
        )
        
        if not created:
            member.role = role
            member.save()
        
        return Response(ProjectMemberSerializer(member).data)
    
    @action(detail=True, methods=['delete'])
    def remove_member(self, request, pk=None):
        project = self.get_object()
        user_id = request.data.get('user_id')
        
        if not user_id:
            return Response(
                {'error': 'user_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            member = ProjectMember.objects.get(project=project, user_id=user_id)
            member.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProjectMember.DoesNotExist:
            return Response(
                {'error': 'Member not found'},
                status=status.HTTP_404_NOT_FOUND
            )
