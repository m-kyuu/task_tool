from django.urls import path
from . import views


app_name = 'manager'
urlpatterns = [
    path('', views.index, name='index'),
    path('add_task', views.add_task, name='add_task'),
    path('upload_task', views.upload_task, name='upload_task'),
    path('get_info', views.get_info, name='get_info'),
]
