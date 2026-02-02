# BuildBridge Setup Guide for Windows

## Quick Start (5 minutes)

### 1. Create Python Virtual Environment

Open PowerShell and navigate to the project:

```powershell
cd C:\Users\This Pc\Desktop\BuildBridge
python -m venv venv
.\venv\Scripts\Activate.ps1
```

If you get an execution policy error, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 2. Install Backend Dependencies

```powershell
pip install -r requirements.txt
```

This installs Django, DRF, and all required packages.

### 3. Initialize Database

```powershell
python manage.py migrate
```

### 4. Create Admin Account

```powershell
python manage.py createsuperuser
```

Follow the prompts to create your admin account.

### 5. Start Backend Server

```powershell
python manage.py runserver
```

The backend will be available at http://localhost:8000

### 6. Setup Frontend (New PowerShell Window)

```powershell
cd C:\Users\This Pc\Desktop\BuildBridge\frontend
npm install
npm run dev
```

The frontend will be available at http://localhost:3000

### 7. Login

- Go to http://localhost:3000
- Click "Create one" to register or use admin credentials
- Start using the app!

## Detailed Setup

### Install Python (if needed)

1. Download from https://www.python.org/downloads/
2. Run installer, **check "Add Python to PATH"**
3. Verify installation:
   ```powershell
   python --version
   ```

### Install Node.js (if needed)

1. Download from https://nodejs.org/ (LTS version recommended)
2. Run installer with default settings
3. Verify installation:
   ```powershell
   node --version
   npm --version
   ```

### Create Virtual Environment

```powershell
# Navigate to project
cd C:\Users\This Pc\Desktop\BuildBridge

# Create virtual environment
python -m venv venv

# Activate it
.\venv\Scripts\Activate.ps1
```

You should see `(venv)` at the start of your PowerShell prompt.

### Install Dependencies

```powershell
pip install --upgrade pip
pip install -r requirements.txt
```

This may take 2-3 minutes. You should see `Successfully installed ...` at the end.

### Database Setup

```powershell
# Run migrations
python manage.py migrate

# Create superuser (admin account)
python manage.py createsuperuser
# Enter username (e.g., admin)
# Enter email (e.g., admin@example.com)
# Enter password
# Confirm password
```

### Run Backend Server

```powershell
python manage.py runserver
```

Output should show:
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK
```

Access:
- Frontend: http://localhost:3000
- API: http://localhost:8000/api
- Admin: http://localhost:8000/admin

### Run Frontend Development Server

**Open a NEW PowerShell window** (don't close the backend!):

```powershell
cd C:\Users\This Pc\Desktop\BuildBridge\frontend
npm install
npm run dev
```

Output should show:
```
  VITE v5.0.0  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

## Using the App

### Register New User

1. Go to http://localhost:3000
2. Click "Create one" at login page
3. Fill in details:
   - Email: your@email.com
   - Password: at least 8 characters
4. Click "Create account"
5. Login with your credentials

### Create First Project

1. Login to the app
2. Click "New Project" button
3. Fill in:
   - Name: e.g., "Main Building"
   - Location: e.g., "Manhattan, NY"
   - Description: Project details
   - Start Date: Pick a date
4. Click "Create"

### Upload Update

1. Go to Projects
2. Click on a project
3. Click "Upload Update"
4. Select type (Photo, Video, Document)
5. Select file
6. Add description
7. Click "Upload Update"

## Admin Panel

Access admin panel at http://localhost:8000/admin

Login with your superuser credentials created earlier.

You can:
- Manage users
- Create/edit projects
- View updates
- Manage roles and permissions

## Troubleshooting

### "Command not found: python"

Python isn't in your PATH. 

**Solution:**
1. Uninstall Python from Control Panel
2. Reinstall from https://www.python.org/downloads/
3. **Check "Add Python to PATH"** during installation
4. Restart PowerShell

### "Permission denied" or execution policy error

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
# Type: Y and press Enter
```

### Port 8000 or 3000 already in use

If you get "Address already in use" error:

```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Get the PID from output, then:
taskkill /PID <PID> /F

# Or use different port:
python manage.py runserver 8001
# Then update frontend .env:
# VITE_API_URL=http://localhost:8001/api
```

### ModuleNotFoundError

Ensure virtual environment is activated:

```powershell
# Check if (venv) appears in prompt
.\venv\Scripts\Activate.ps1  # Activate if needed
```

### npm install takes forever or fails

```powershell
# Clear npm cache
npm cache clean --force

# Try again
npm install

# If still fails, try with yarn
npm install -g yarn
cd frontend
yarn install
yarn dev
```

### Database errors

```powershell
# Reset database (WARNING: deletes all data)
python manage.py migrate accounts zero  # Unapply migrations
python manage.py migrate                 # Reapply

# Or just delete and recreate:
del db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

## Using PostgreSQL (Optional)

For production or better features:

### Install PostgreSQL

1. Download from https://www.postgresql.org/download/windows/
2. Run installer
3. Remember the password you set for postgres user
4. Keep default port 5432

### Configure BuildBridge

Update `.env`:
```env
DEBUG=False
SECRET_KEY=your-super-secret-key-here-generate-random-chars
DATABASE_URL=postgres://postgres:YOUR_PASSWORD@localhost:5432/buildbridge
REDIS_URL=redis://localhost:6379/0
ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://your-domain.com
```

### Create Database

```powershell
# Connect to PostgreSQL
psql -U postgres

# In psql terminal:
CREATE DATABASE buildbridge;
\q  # Exit psql
```

### Run migrations

```powershell
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## Using Docker (Recommended for Consistent Environment)

Docker ensures everyone uses the same environment.

### Install Docker

1. Download "Docker Desktop for Windows" from https://www.docker.com/products/docker-desktop
2. Run installer, enable WSL 2 (Windows Subsystem for Linux)
3. Restart computer when prompted
4. Open PowerShell and verify:

```powershell
docker --version
docker-compose --version
```

### Start with Docker

From project root:

```powershell
# Start all services (database, backend, frontend)
docker-compose up --build

# On first run, create superuser in new PowerShell:
docker-compose exec backend python manage.py createsuperuser

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop everything
docker-compose down
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000/api
- Admin: http://localhost:8000/admin

## Next Steps

### Add More Features

1. **Push Notifications**: Configure push notification service
2. **Email**: Setup email backend for notifications
3. **S3 Storage**: Use AWS S3 for file storage
4. **CDN**: Add CloudFlare for caching
5. **Analytics**: Integrate analytics service

### Deploy to Production

See [DEPLOYMENT.md](DEPLOYMENT.md) for:
- Server setup
- SSL certificates
- Domain configuration
- Performance tuning
- Monitoring

### Learn More

- Django Docs: https://docs.djangoproject.com/
- React Docs: https://react.dev/
- DRF Docs: https://www.django-rest-framework.org/
- Vite Docs: https://vitejs.dev/

## Support

For issues:
1. Check the Troubleshooting section above
2. Check browser console (F12) for errors
3. Check PowerShell output for error messages
4. Create an issue on GitHub

## Tips

- Keep PowerShell windows organized (use Windows Terminal for tabs)
- Use `ctrl+c` to stop a running server
- Run `python manage.py help` to see all available commands
- Run `npm run dev` with `--host` flag for external network access
- Regularly commit your code to version control

Good luck with BuildBridge! 🚀
