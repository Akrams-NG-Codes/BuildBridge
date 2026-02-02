from django.db import models
from django.contrib.auth.models import AbstractUser
from django_tenants.models import TenantMixin, DomainMixin


class Developer(TenantMixin):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    company_registration = models.CharField(max_length=100, blank=True)
    verified = models.BooleanField(default=False)
    logo = models.ImageField(upload_to='logos/', blank=True)
    primary_color = models.CharField(max_length=7, default='#2563eb')
    secondary_color = models.CharField(max_length=7, default='#1e40af')
    created_at = models.DateTimeField(auto_now_add=True)
    
    auto_create_schema = True

    def __str__(self):
        return self.name


class Domain(DomainMixin):
    pass


class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Platform Admin'),
        ('developer_admin', 'Developer Admin'),
        ('developer_staff', 'Developer Staff'),
        ('client', 'Client'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='client')
    phone = models.CharField(max_length=20, blank=True)
    verified = models.BooleanField(default=False)
    developer = models.ForeignKey(Developer, on_delete=models.CASCADE, null=True, blank=True, related_name='users')
    profile_image = models.ImageField(upload_to='profiles/', blank=True)

    def __str__(self):
        return self.username


class ClientProjectLink(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='project_links')
    project = models.ForeignKey('projects.Project', on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    permissions = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('client', 'project')

    def __str__(self):
        return f"{self.client.username} - {self.project.name}"
