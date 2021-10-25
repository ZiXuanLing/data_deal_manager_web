"""StudentV4BE URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

import apps.student.views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('students/', apps.student.views.get_student),
    path('students/query', apps.student.views.query_students),
    path('sno/check', apps.student.views.is_exist_sno),
    path('student/add', apps.student.views.add_student),
    path('student/update', apps.student.views.update_student),
    path('student/delete', apps.student.views.delete_student),
    path('students/delete', apps.student.views.delete_students),
    path('upload/', apps.student.views.upload),
    path('excel/import/', apps.student.views.import_student_excel),
    path('excel/export/', apps.student.views.export_student_excel),
]
# 允许所有的media文件被访问
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
