from django.shortcuts import render, redirect
from django.http import HttpResponse, FileResponse
from .models import File, User
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.conf import settings
from django.core.files.base import ContentFile
# Create your views here.

import os

import gzip
import shutil

def compress_file(file):
    compressed_data = gzip.compress(file.read())

    compressed_file = ContentFile(compressed_data)
    compressed_file.name = file.name + '.gz'

    return compressed_file

def get_gzip_filename(file_path):
    with gzip.open(file_path, 'rb') as gz_file:
        filename = gz_file.name
    return filename

def extract_gzip_file(gzip_file_path, output_file_path):
    with gzip.open(gzip_file_path, 'rb') as gz:
        with open(output_file_path, 'wb') as output_file:
            shutil.copyfileobj(gz, output_file)
    return output_file_path

def download_file(request, username, filename):
    file_path = os.path.join(settings.MEDIA_ROOT, f"files/{username}/{filename}")
    if os.path.exists(file_path):
        if filename.endswith('.gz'):  # Check if the file is compressed with GZ
            output_file_path = os.path.join(settings.MEDIA_ROOT, f"{get_gzip_filename(file_path)[:-3]}")
            file_path = extract_gzip_file(file_path, output_file_path)
        
        with open(file_path, 'rb') as file:
            response = HttpResponse(file.read(), content_type="application/octet-stream")
            response['Content-Disposition'] = 'attachment; filename=' + os.path.basename(file_path)
            return response
    return HttpResponse('File not found', status=404)

def get_files_in_folder(folder_path):
    file_list = []
    for filename in os.listdir(folder_path):
        file_list.append({"name": filename, "file_path": folder_path + "/" + filename})
    return file_list

def index(request):
    return render(request, "index.html")

def create(request, **kwargs):
    if request.session.get('LOGGED', True):
        if request.method == "POST":
            print("POSTING")
            myfile = request.FILES.get('myfile')
            
            user = User.objects.get(username=request.session["username"])
            instance = File(user=user, myfile=compress_file(myfile))
            instance.save()
            print(instance)
            
            return render(request, "index.html")
        return render(request, "create.html")
    else:
        return render(request, "login.html")

def my_view(request, **kwargs):
    username = kwargs.get('username')
    if request.session.get('LOGGED', True):
        return render(request, 'profile.html', {'username': username, 'files': get_files_in_folder(f"files/{username}")})
    else:
        return redirect('login')

def register(request):
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = User.objects.create(username=username, password=password)
        user.save()
        os.mkdir(f"files/{username}")
        return redirect('login')
    else:
        return render(request, "register.html")

def logout_view(request):
    logout(request)
    return redirect('login')

@csrf_protect
def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        try:
            user = User.objects.get(username=username)
            found_user = User.objects.get(id=user.id)

            if (found_user.password == password):
                request.session['LOGGED'] = True
                request.session['username'] = username
                return redirect(f'profile/{username}')
            else:
                request.session['LOGGED'] = False
                messages.error(request, 'Invalid password.')
                return redirect('login')
        
        except User.DoesNotExist:
            request.session['LOGGED'] = False
            messages.error(request, 'Invalid username.')

            return redirect('login')
    else:
        username = request.session.get('username')
        print(username)
        if username == None:
            request.session['LOGGED'] = False
            return render(request, 'login.html')
        else:
            return redirect(f'profile/{username}')
