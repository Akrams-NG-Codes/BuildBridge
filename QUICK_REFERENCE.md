# Quick Reference

## Start Development Environment (Windows)

### Terminal 1 - Backend
```powershell
cd C:\Users\This Pc\Desktop\BuildBridge
.\venv\Scripts\Activate.ps1
python manage.py runserver
```
Backend: http://localhost:8000
Admin: http://localhost:8000/admin

### Terminal 2 - Frontend
```powershell
cd C:\Users\This Pc\Desktop\BuildBridge\frontend
npm run dev
```
Frontend: http://localhost:3000

---

## Common Commands

### Backend (Python)
```powershell
# Activate venv
.\venv\Scripts\Activate.ps1

# Create migrations
python manage.py makemigrations

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver

# Create new app
python manage.py startapp appname

# Run tests
python manage.py test

# Shell
python manage.py shell

# Collect static files
python manage.py collectstatic
```

### Frontend (Node)
```powershell
# Install dependencies
npm install

# Start dev server (hot reload)
npm run dev

# Build production
npm run build

# Preview production build
npm run preview

# Clean install (if issues)
rm -r node_modules package-lock.json
npm install
```

### Docker
```powershell
# Start all services
docker-compose up --build

# Stop all
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Run command in container
docker-compose exec backend python manage.py shell

# Rebuild specific service
docker-compose up --build backend
```

---

## Initial Setup (First Time Only)

### 1. Create Virtual Environment
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 2. Install Python Packages
```powershell
pip install -r requirements.txt
```

### 3. Initialize Database
```powershell
python manage.py migrate
python manage.py createsuperuser
```

### 4. Install Frontend Packages
```powershell
cd frontend
npm install
cd ..
```

---

## Useful URLs

| Service | URL | Username | Password |
|---------|-----|----------|----------|
| Frontend | http://localhost:3000 | - | - |
| Backend API | http://localhost:8000/api | - | - |
| Django Admin | http://localhost:8000/admin | superuser | (yours) |
| API Docs | http://localhost:8000/api/docs | - | - |

---

## API Testing with curl

### Login
```powershell
$loginData = @{
    username = "admin"
    password = "password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8000/api/auth/login/" `
  -Method POST `
  -Body $loginData `
  -ContentType "application/json"
```

### Get Projects
```powershell
$headers = @{Authorization = "Bearer YOUR_ACCESS_TOKEN"}

Invoke-WebRequest -Uri "http://localhost:8000/api/projects/" `
  -Method GET `
  -Headers $headers
```

---

## File Locations

| Item | Location |
|------|----------|
| Backend | `C:\Users\This Pc\Desktop\BuildBridge\` |
| Frontend | `C:\Users\This Pc\Desktop\BuildBridge\frontend\` |
| Database | `C:\Users\This Pc\Desktop\BuildBridge\db.sqlite3` |
| Media files | `C:\Users\This Pc\Desktop\BuildBridge\media\` |
| Static files | `C:\Users\This Pc\Desktop\BuildBridge\staticfiles\` |
| Settings | `C:\Users\This Pc\Desktop\BuildBridge\buildbridge\settings.py` |
| .env config | `C:\Users\This Pc\Desktop\BuildBridge\.env` |
| Logs | Check PowerShell output |

---

## Troubleshooting Checklist

- [ ] Virtual environment activated? (see `(venv)` in prompt)
- [ ] Dependencies installed? (`pip install -r requirements.txt`)
- [ ] Migrations run? (`python manage.py migrate`)
- [ ] Backend running? (port 8000 available)
- [ ] Frontend running? (port 3000 available)
- [ ] Browser cache cleared? (Ctrl+Shift+Del)
- [ ] Console errors? (F12 in browser)

---

## Git Setup (if using version control)

```powershell
git init
git add .
git commit -m "Initial BuildBridge setup"
git remote add origin https://github.com/yourname/buildbridge.git
git push -u origin main
```

---

## IDE Setup

### VS Code Extensions (Recommended)
- Python
- Django
- Pylance
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- REST Client
- Thunder Client

### IntelliCode
- PyCharm Professional (paid)
- WebStorm + Python plugin (paid)
- VS Code (free, need extensions)

---

## Performance Tips

1. **Development**
   - Hot reload enabled (automatic)
   - Keep dev servers running in background

2. **Database**
   - Use PostgreSQL in production
   - Enable query caching with Redis

3. **Frontend**
   - Use lazy loading for routes
   - Optimize images
   - Enable gzip compression

4. **API**
   - Use pagination (default: 20 items)
   - Add pagination to list views
   - Cache frequently accessed data

---

## Backup & Recovery

### Backup Database
```powershell
# SQLite
copy db.sqlite3 db.sqlite3.backup

# PostgreSQL
pg_dump buildbridge > backup.sql
```

### Backup Code
```powershell
git push  # If using Git
Compress-Archive -Path . -DestinationPath BuildBridge.zip
```

### Reset Database
```powershell
# WARNING: Deletes all data!
del db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

---

Need help? Check the detailed guides:
- **[WINDOWS_SETUP.md](WINDOWS_SETUP.md)** - Full setup guide
- **[README.md](README.md)** - Full documentation
- **[SETUP_COMPLETE.md](SETUP_COMPLETE.md)** - Project overview
