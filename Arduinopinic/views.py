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
	server = dict() # dict to be sent via Json
	###### Test if DB populated and taking last entry######################
	if temp_db.objects.last():
		last_entry = temp_db.objects.last()
		server["isnotempty"] = True
		server["date"] = last_entry.date
		server["tempext"] = last_entry.tempext
		server["tempeau"] = last_entry.tempeau
		server["humid"] = last_entry.humid
	else:
		server["isempty"] = False
	#########################################################################
	###### Test if daemon is running ########################################
	if	(len(os.popen("pgrep -f piserver.py").readlines())) > 1:
		server["status"] = True
	else:
		server["status"] = False
	#########################################################################
	return JsonResponse(server)
