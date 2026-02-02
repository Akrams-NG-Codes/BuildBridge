# BuildBridge PWA - Complete Project

A full-stack Progressive Web App for construction project management, connecting clients with developers.

## Features

- **Multi-tenant Architecture**: Separate workspaces for different developers/organizations
- **Real-time Updates**: Live project and status updates
- **Offline Support**: Service Worker enables offline functionality
- **Push Notifications**: Receive alerts on project updates
- **Background Sync**: Automatic sync when connection returns
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Role-based Access Control**: Admin, Developer, and Client roles

## Tech Stack

### Backend
- **Django 4.2+**: Python web framework
- **Django REST Framework**: REST API
- **PostgreSQL**: Database (SQLite for development)
- **Redis**: Caching and message broker
- **Celery**: Async task queue
- **django-tenants**: Multi-tenant support

### Frontend
- **React 18+**: UI library
- **Vite**: Build tool
- **TailwindCSS**: Styling
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Zustand**: State management
- **React Query**: Server state management

## Project Structure

```
BuildBridge/
├── buildbridge/          # Django project config
├── core/                 # Core app
├── accounts/            # Authentication & users
├── projects/            # Project management
├── updates/             # Project updates & comments
├── frontend/            # React PWA
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── lib/        # Utilities and API
│   │   └── App.tsx     # Main app
│   ├── public/         # Static assets & manifest
│   └── vite.config.ts  # Vite config
├── manage.py           # Django CLI
├── requirements.txt    # Python dependencies
├── Dockerfile          # Backend container
├── docker-compose.yml  # Multi-container setup
└── .env               # Environment variables
```

## Installation

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15 (optional, SQLite works for dev)
- Redis (optional for development)

### Option 1: Local Development (Windows)

1. **Create virtual environment**
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

2. **Install Python dependencies**
   ```powershell
   pip install -r requirements.txt
   ```

3. **Run migrations**
   ```powershell
   python manage.py migrate
   ```

4. **Create superuser**
   ```powershell
   python manage.py createsuperuser
   ```

5. **Start backend** (Terminal 1)
   ```powershell
   python manage.py runserver
   ```

6. **Install frontend dependencies** (Terminal 2)
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

### Option 2: Docker (Recommended for Production)

```powershell
# Build and start all services
docker-compose up --build

# Create superuser in backend container
docker-compose exec backend python manage.py createsuperuser

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

## Usage

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Admin Panel**: http://localhost:8000/admin
- **API Docs**: http://localhost:8000/api/schema (with drf-spectacular)

### API Endpoints

#### Authentication
- `POST /api/auth/login/` - Login
- `POST /api/auth/refresh/` - Refresh token
- `POST /api/auth/register/` - Register new user
- `GET /api/auth/profile/` - Get user profile
- `PUT /api/auth/profile/` - Update profile

#### Projects
- `GET /api/projects/` - List projects
- `POST /api/projects/` - Create project
- `GET /api/projects/{id}/` - Get project details
- `PUT /api/projects/{id}/` - Update project
- `POST /api/projects/{id}/add_member/` - Add team member

#### Updates
- `GET /api/updates/?project={id}` - List updates for project
- `POST /api/updates/` - Upload update (supports files)
- `GET /api/updates/{id}/` - Get update details

#### Comments
- `GET /api/updates/comments/?update={id}` - List comments
- `POST /api/updates/comments/` - Add comment

## Configuration

### Environment Variables

Create `.env` file in project root:

```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///db.sqlite3
REDIS_URL=redis://localhost:6379/0
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend Configuration

Frontend `.env` file:
```env
VITE_API_URL=http://localhost:8000/api
```

## PWA Features

### Service Worker
- Caches static assets on first load
- Network-first strategy for API calls
- Falls back to cached API responses when offline
- Automatic cache cleanup on update

### Offline Support
- View cached projects and updates
- Queue uploads for sync when connection returns
- IndexedDB storage for offline data

### Installation
Users can install BuildBridge on:
- **Mobile**: "Add to Home Screen"
- **Desktop**: Install button in address bar
- **Windows**: Start menu shortcut

## Development

### Creating a New App

```powershell
python manage.py startapp myapp
```

Then add to `INSTALLED_APPS` in `buildbridge/settings.py`.

### Running Tests

```powershell
python manage.py test
```

### Database Migrations

```powershell
# Create migration
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Show migration status
python manage.py showmigrations
```

### Frontend Development

```powershell
cd frontend

# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Using Docker

```bash
# Build production images
docker-compose -f docker-compose.yml build

# Deploy with production settings
docker-compose -f docker-compose.yml up -d
```

### Environment for Production

```env
DEBUG=False
SECRET_KEY=generate-a-random-key-here
DATABASE_URL=postgres://user:password@db-host:5432/buildbridge
REDIS_URL=redis://redis-host:6379/0
ALLOWED_HOSTS=example.com,www.example.com
CORS_ALLOWED_ORIGINS=https://example.com
```

## Troubleshooting

### CORS Issues
- Check `CORS_ALLOWED_ORIGINS` in `.env`
- Ensure frontend URL matches exactly (including protocol and port)

### Database Connection
- Verify PostgreSQL is running: `psql -U postgres`
- Check `DATABASE_URL` in `.env`
- Run `python manage.py migrate` to initialize database

### Redis Connection
- Check Redis is running: `redis-cli ping`
- Update `REDIS_URL` if Redis is on different host

### Service Worker Not Working
- Check browser console for errors
- Clear browser cache and reload
- Ensure HTTPS in production (development HTTP is allowed)

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
