from django.urls import path
from . import views
from .views import ImageUploadView

urlpatterns = [
    path('hello/', views.hello_world, name='hello_world'),
    path('upload/', ImageUploadView.as_view(), name='image_upload'),
    path('test-upload/', views.upload_test_page, name='upload_test_page'),
] 