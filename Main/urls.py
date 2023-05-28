from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('upload', views.create, name='upload'),
    path('login', views.login_view, name='login'),
    path('profile/<str:username>/', views.my_view, name='profile'),
    path('logout', views.logout_view, name='logout'),
    path('register', views.register, name='register'),
    path('files/<str:username>/<str:filename>/', views.download_file, name='download_file'),
]

