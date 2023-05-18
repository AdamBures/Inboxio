from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('create', views.create, name='create'),
    path('login', views.login_view, name='login'),
    path('profile/<str:username>/', views.my_view, name='profile'),
    path('logout', views.logout_view, name='logout'),
    path('register', views.register, name='register'),
]
