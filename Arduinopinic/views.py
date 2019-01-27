# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

version_global ='0.01'
def index(request):
	version = version_global
	return render(request, 'index.html', locals())
