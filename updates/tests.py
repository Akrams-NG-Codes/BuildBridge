from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from datetime import date
from accounts.models import User
from projects.models import Project
from updates.models import Update, Comment


class UpdateModelTest(TestCase):
    def setUp(self):
        """Set up test data"""
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpass123',
            role='developer_staff',
            verified=True
        )
        self.project = Project.objects.create(
            name='Test Project',
            location='Test Location',
            description='A test project',
            start_date=date.today(),
            status='active'
        )
        self.update = Update.objects.create(
            project=self.project,
            uploaded_by=self.user,
            type='note',
            description='Test update description'
        )

    def test_update_creation(self):
        """Test that update is created successfully"""
        self.assertEqual(self.update.project, self.project)
        self.assertEqual(self.update.type, 'note')

    def test_update_string_representation(self):
        """Test update string representation"""
        expected = f"{self.project.name} - note"
        self.assertEqual(str(self.update), expected)

    def test_update_comment_relationship(self):
        """Test update can have comments"""
        comment = Comment.objects.create(
            update=self.update,
            author=self.user,
            text='Test comment'
        )
        self.assertEqual(comment.update, self.update)
        self.assertEqual(comment.author, self.user)
