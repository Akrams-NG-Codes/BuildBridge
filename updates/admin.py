from django.contrib import admin
from .models import Update, Comment


@admin.register(Update)
class UpdateAdmin(admin.ModelAdmin):
    list_display = ['project', 'type', 'uploaded_by', 'created_at']
    list_filter = ['type', 'created_at']
    search_fields = ['project__name', 'description']


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['author', 'update', 'created_at']
    search_fields = ['author__username', 'text']
