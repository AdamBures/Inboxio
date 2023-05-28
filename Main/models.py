from django.db import models
from django.core.validators import MinLengthValidator, MaxLengthValidator, FileExtensionValidator
import os 
# Create your models here.

class User(models.Model):
	username = models.CharField(max_length=30)
	password = models.CharField(max_length=15, validators=[MinLengthValidator(8), MaxLengthValidator(15)])
	created_at = models.DateTimeField(auto_now_add=True)
	
	def get_user_projects(self):
		projects = {}
		for project in self.projects.all():
			projects[project.name] = project.description
		return projects

def user_directory_path(instance, filename):
    username = instance.user.username
    return os.path.join('files', username, filename)

class File(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    myfile = models.FileField(upload_to=user_directory_path)


class Project(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(User, related_name='projects', on_delete=models.CASCADE)
    file = models.FileField(
	    upload_to='project_files/',
	    blank=True,
	    null=True,
	    validators=[FileExtensionValidator(allowed_extensions=["rpy"])]
	)

