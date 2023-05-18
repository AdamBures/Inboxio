from django.contrib import admin
from .models import Component, User, Project
# Register your models here

admin.site.register(Component)
admin.site.register(User)
admin.site.register(Project)