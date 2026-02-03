from django.contrib import admin
from .models import User, Developer, ClientProjectLink


try:
    @admin.register(Developer)
    class DeveloperAdmin(admin.ModelAdmin):
        list_display = ['name', 'email', 'verified', 'created_at']
        search_fields = ['name', 'email']
except Exception:
    # In some local/dev setups (or with incompatible Python/Django
    # combinations) the admin add/change form rendering can raise
    # template/context copy-related errors. If that happens, skip
    # registering the Developer admin to keep the admin dashboard usable.
    import logging
    logging.getLogger(__name__).warning('Developer admin registration skipped due to an exception')

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
