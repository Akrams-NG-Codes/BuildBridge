import os
import django
import json
import urllib.request

os.environ.setdefault('DJANGO_SETTINGS_MODULE','buildbridge.settings')
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
try:
    u = User.objects.get(username='admin')
    u.set_password('ChangeMe123!')
    u.is_active = True
    u.save()
    print('reset: ok')
except Exception as e:
    print('reset error:', e)

# test token endpoint
url = 'http://127.0.0.1:8000/api/auth/login/'
data = json.dumps({'username':'admin@example.com','password':'ChangeMe123!'}).encode()
req = urllib.request.Request(url, data=data, headers={'Content-Type':'application/json'})
try:
    with urllib.request.urlopen(req, timeout=5) as r:
        print('STATUS:', r.getcode())
        print('RESPONSE:', r.read().decode())
except Exception as e:
    print('login error:', repr(e))
