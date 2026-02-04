from django.test import TestCase
from accounts.models import Developer, Domain, User


class DeveloperModelTest(TestCase):
    def setUp(self):
        """Set up test data"""
        self.developer = Developer.objects.create(
            name='Test Developer',
            email='testdev@example.com',
            verified=True
        )

    def test_developer_creation(self):
        """Test that developer is created successfully"""
        self.assertEqual(self.developer.name, 'Test Developer')
        self.assertEqual(self.developer.email, 'testdev@example.com')
        self.assertTrue(self.developer.verified)

    def test_developer_string_representation(self):
        """Test developer string representation"""
        self.assertEqual(str(self.developer), 'Test Developer')


class UserModelTest(TestCase):
    def setUp(self):
        """Set up test data"""
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpass123',
            role='client',
            verified=True
        )

    def test_user_creation(self):
        """Test that user is created successfully"""
        self.assertEqual(self.user.username, 'testuser')
        self.assertEqual(self.user.email, 'testuser@example.com')
        self.assertTrue(self.user.verified)

    def test_user_string_representation(self):
        """Test user string representation"""
        self.assertEqual(str(self.user), 'testuser')
