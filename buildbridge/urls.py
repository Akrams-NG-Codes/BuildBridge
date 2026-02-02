from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.shortcuts import redirect

urlpatterns = [
    # In development, redirect root to the frontend dev server
    # (keeps Django API on :8000 and React dev server on :3000)
    *([path('', lambda request: redirect('http://localhost:3000', permanent=False))] if settings.DEBUG else []),
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/projects/', include('projects.urls')),
    path('api/updates/', include('updates.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
