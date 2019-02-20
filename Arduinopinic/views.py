# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.utils import timezone
from datetime import datetime, timedelta
from Arduinopinic.models import temp_db, config, session
from django.core.paginator import Paginator, EmptyPage
import os, csv

version_global ='0.01a'
def index(request):
	version = version_global
	view = "index"
	return render(request, 'index.html', locals())

def listing(request, page=1):
	version = version_global
	view = "listing"
	entries = temp_db.objects.all().order_by('-date')
	paginator = Paginator(entries, 50)
	try:
		page_obj = paginator.page(page)
	except EmptyPage:
		page_obj = paginator.page(paginator.num_pages)
	return render(request, 'listing.html', locals())

def export_temp_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="export_temp.csv"'
    writer = csv.writer(response)
    writer.writerow(['Date', 'Temperature exterieure', 'Humidite', 'Temperature eau'])
    temp = temp_db.objects.all().order_by('-date').values_list('date', 'tempext', 'humid', 'tempeau')
    for temps in temp:
        writer.writerow(temps)
    return response

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
	if	(len(os.popen("pgrep -f daemon.py").readlines())) > 1:
		server["status"] = True
	else:
		server["status"] = False
	#########################################################################
	return JsonResponse(server)

def updateStats(request):
	stats = dict() # dict to be sent via Json
	last_entry = session.objects.last()
	stats["rundate"] = last_entry.runtime
	stats["success"] = last_entry.success
	stats["attempts"] = last_entry.attempts
	stats["loop"] = last_entry.loop
	return JsonResponse(stats)

def updateChart(request,type):
	###### Taking last 24h/7d/30d ###########################################
	end_range = timezone.localtime()
	if type == '1':
		range = timedelta(days=1)
	elif type == '2':
		range = timedelta(days=7)
	elif type == '3':
		range = timedelta(days=30)
	beg_range = end_range - range
	chart = list(temp_db.objects.filter(date__gte=beg_range).filter(id__iregex='^\d*[1]$').values()) # only get one of tenth ie: only xith id finishing by 1
	return JsonResponse(chart, safe=False)
