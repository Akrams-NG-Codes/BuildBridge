from django.test import TestCase
from datetime import date
from accounts.models import Developer, User
from projects.models import Project, ProjectMember


class ProjectModelTest(TestCase):
    def setUp(self):
        """Set up test data"""
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpass123',
            role='developer_admin',
            verified=True
        )
        self.project = Project.objects.create(
            name='Test Project',
            location='Test Location',
            description='A test project',
            start_date=date.today(),
            status='active'
        )

    def test_project_creation(self):
        """Test that project is created successfully"""
        self.assertEqual(self.project.name, 'Test Project')
        self.assertEqual(self.project.description, 'A test project')
        self.assertEqual(self.project.status, 'active')

    def test_project_string_representation(self):
        """Test project string representation"""
        self.assertEqual(str(self.project), 'Test Project')

    def test_project_member_relationship(self):
        """Test project members can be assigned"""
        member = ProjectMember.objects.create(
            project=self.project,
            user=self.user,
            role='manager'
        )
        self.assertEqual(member.project, self.project)
        self.assertEqual(member.user, self.user)
