from django.shortcuts import render
from django.shortcuts import redirect
from django.http import JsonResponse
from .forms import TaskModelForm
from manager.models import Task, Project
from django.contrib import messages
from io import TextIOWrapper
import csv


def index(request):
    form = TaskModelForm()
    tasks = _get_tasks()
    return render(request, 'manager/index.html', {'form': form, 'tasks': tasks})


def add_task(request):
    if request.method == 'POST':
        data = TaskModelForm(request.POST)
        if data.is_valid():
            data.save()
            messages.add_message(request, messages.INFO, 'add')
    return redirect('manager:index')


def upload_task(request):
    if request.method == 'POST':
        input_file = TextIOWrapper(request.FILES['csv'].file, encoding='utf-8')
        data = csv.reader(input_file)
        for line in data:
            task = Task()
            task.project = _get_project(line[0])
            task.title = line[1]
            task.staff = line[2]
            task.status = line[3]
            task.start_date = line[4]
            task.save()
        messages.add_message(request, messages.INFO, 'upload')
    return redirect('manager:index')


def get_info(request):
    if request.method == 'POST':
        task_id = request.POST.get('id')
        task = Task.objects.filter(id=task_id)[0]
        project = task.project
        data = {
            'detail': project.detail
        }
        return JsonResponse(data)
    else:
        return redirect('manager:index')


def _get_tasks():
    all_tasks = Task.objects.all()
    return all_tasks


def _get_project(input_str):
    all_projects = Project.objects.all()
    for project in all_projects:
        if input_str == str(project):
            return project
