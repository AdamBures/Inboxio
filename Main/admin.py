from django.contrib import admin
from .models import File, User, Project
# Register your models here

admin.site.register(File)
admin.site.register(User)
admin.site.register(Project)