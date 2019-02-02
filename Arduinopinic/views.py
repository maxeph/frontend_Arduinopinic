# -*- coding: utf-8 -*-
from __future__ import unicode_literals

######## Test import ###########
from random import randint
################################
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
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
		server["level"] = (33 * randint(0, 3)) + 1 ########TEST
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

def updateChart(request,type):
	###### Taking last 24h/7d/30d ###########################################
	end_range = datetime.now()
	if type == '1':
		range = timedelta(days=1)
	elif type == '2':
		range = timedelta(days=7)
	elif type == '3':
		range = timedelta(days=30)
	beg_range = end_range - range
	chart = list(temp_db.objects.filter(date__gte=beg_range).filter(id__iregex='^\d*[1]$').values()) # only get one of tenth ie: only xith id finishing by 1
	return JsonResponse(chart, safe=False)
