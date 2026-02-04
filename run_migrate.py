#!/usr/bin/env python
import os
import sys
import django
from django.conf import settings
from django.core.management import execute_from_command_line

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'buildbridge.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

execute_from_command_line(['manage.py', 'migrate', '--verbosity=0'])
print("Migrations completed successfully!")
