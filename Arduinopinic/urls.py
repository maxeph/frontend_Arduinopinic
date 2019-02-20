
"""website URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name = 'Index'      ),
    url(r'^updateWidgets/$', views.updateWidgets, name = 'Widgets'),
    url(r'^updateStats/$', views.updateStats, name = 'Stats'),
    url(r'^updateChart/(?P<type>[1-3]{1})/$', views.updateChart, name = 'Chart'),
    url(r'^listing/(?P<page>[0-9]+)', views.listing, name = 'Listing'),
    url(r'^tools/csv/$', views.export_temp_csv, name = 'csvexport'),
]
