from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UpdateViewSet, CommentViewSet

router = DefaultRouter()
router.register(r'', UpdateViewSet, basename='update')
router.register(r'comments', CommentViewSet, basename='comment')

urlpatterns = [
    path('', include(router.urls)),
]
