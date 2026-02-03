from django.contrib import admin
from .models import User, Developer, ClientProjectLink


@admin.register(Developer)
class DeveloperAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'verified', 'created_at']
    search_fields = ['name', 'email']

# Register Domain admin only when the Domain model provides expected fields
# (django-tenants provides these in Postgres deployments). In lightweight
# fallback/dev mode Domain may not have those fields — skip admin then.
try:
    from .models import Domain
    if hasattr(Domain, 'domain') and hasattr(Domain, 'tenant'):
        @admin.register(Domain)
        class DomainAdmin(admin.ModelAdmin):
            list_display = ['domain', 'tenant']
except Exception:
    pass


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'role', 'verified']
    search_fields = ['username', 'email']


@admin.register(ClientProjectLink)
class ClientProjectLinkAdmin(admin.ModelAdmin):
    list_display = ['client', 'project', 'status']
    list_filter = ['status']
