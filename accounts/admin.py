from django.contrib import admin
from .models import User, Developer, Domain, ClientProjectLink


@admin.register(Developer)
class DeveloperAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'verified', 'created_at']
    search_fields = ['name', 'email']


@admin.register(Domain)
class DomainAdmin(admin.ModelAdmin):
    list_display = ['domain', 'tenant']


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'role', 'verified']
    search_fields = ['username', 'email']


@admin.register(ClientProjectLink)
class ClientProjectLinkAdmin(admin.ModelAdmin):
    list_display = ['client', 'project', 'status']
    list_filter = ['status']
