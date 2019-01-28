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
