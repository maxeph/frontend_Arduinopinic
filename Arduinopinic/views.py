# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import JsonResponse
from datetime import datetime, timedelta
from Arduinopinic.models import temp_db
import os

version_global ='0.01a'
def index(request):
	version = version_global
	return render(request, 'index.html', locals())

def updateWidgets(request):
	server = dict()
	end_range = datetime.now()
	range = timedelta(days=1)
	beg_range = end_range - range
	chart = temp_db.objects.filter(date__gte=beg_range)
	last_entry = chart.latest('date')
	if	(len(os.popen("pgrep -f piserver.py").readlines())) > 1:  # piserver is running
		server["status"] = True
	else:							# piserver is not running
		server["status"] = False
	server["date"] = last_entry.date
	server["tempext"] = last_entry.tempext
	server["tempeau"] = last_entry.tempeau
	server["humid"] = last_entry.humid
	return JsonResponse(server)
