from django.db import models
from django.core.validators import MinLengthValidator, MaxLengthValidator, FileExtensionValidator

# Create your models here.
class Component(models.Model):
	name = models.CharField(max_length=30)
	icon = models.ImageField(upload_to ='static/images/')

class User(models.Model):
	username = models.CharField(max_length=30)
	password = models.CharField(max_length=15, validators=[MinLengthValidator(8), MaxLengthValidator(15)])
	created_at = models.DateTimeField(auto_now_add=True)
	
	def get_user_projects(self):
		projects = {}
		for project in self.projects.all():
			projects[project.name] = project.description
		return projects

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

