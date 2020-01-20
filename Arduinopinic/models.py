# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.

class temp_db(models.Model):
	date = models.DateTimeField()
	tempext = models.DecimalField(max_digits=4, decimal_places=2)
	tempeau = models.DecimalField(max_digits=4, decimal_places=2)
	humid = models.DecimalField(max_digits=4, decimal_places=2)

	def __str__(self):
		return str(self.date)

class config(models.Model):
	i2c = models.PositiveIntegerField()
	delay = models.PositiveIntegerField()
	timezone = models.CharField(max_length=100)
	lastmodified = models.DateTimeField()
	check = models.PositiveIntegerField(default=0,unique=True)

	def __str__(self):
		return str(self.lastmodified)

class session(models.Model):
	pid = models.PositiveIntegerField()
	path = models.CharField(max_length=200)
	runtime = models.DateTimeField()
	success = models.PositiveIntegerField(default=0)
	attempts = models.PositiveIntegerField(default=0)
	loop = models.PositiveIntegerField(default=0)
	lastmodified = models.DateTimeField()

	def __str__(self):
		return str(self.runtime)

