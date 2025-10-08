# EDU Project - Full Stack Django + Next.js

Educational platform built with Django REST Framework and Next.js 14.

## 🚀 Quick Start

### Backend (Django)
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

- **backend/** - Django REST API
- **frontend/** - Next.js 14 App
- **BACKEND_GUIDE.md** - Detailed backend documentation

## 📚 Documentation

See [BACKEND_GUIDE.md](./BACKEND_GUIDE.md) for detailed backend setup and API documentation.

## 🛠️ Tech Stack

### Backend
- Django 4.2+
- Django REST Framework
- PostgreSQL / SQLite
- Docker

### Frontend
- Next.js 14
- React 18
- SCSS
- Docker

## 🐳 Docker

```bash
# Backend
cd backend
docker-compose up

# Frontend
cd frontend
docker-compose up
```

## 📝 License

MIT
# Edu Platform - Frontend & Backend Integration Guide

## 🚀 Quick Start

### 1. Start Backend Server
```bash
cd backend
python manage.py runserver 8000
```

### 2. Start Frontend Server
```bash
cd frontend
npm install
npm run dev
```

### 3. Or use the batch script (Windows)
```bash
start-dev.bat
```

## 📋 Prerequisites

### Backend Requirements
- Python 3.8+
- Django 4.2+
- SQLite database
- Virtual environment activated

### Frontend Requirements
- Node.js 18+
- npm or yarn
- Next.js 14+

## 🔧 Configuration

### Backend Configuration
The backend is already configured with:
- Django REST Framework
- CORS enabled for frontend
- JWT Authentication
- SQLite database
- Sample data created

### Frontend Configuration
The frontend is configured to connect to:
- API Base URL: `http://localhost:8000/api`
- Dashboard URL: `http://localhost:8000/dashboard/`
- Admin URL: `http://localhost:8000/admin/`

## 🌐 Available Endpoints

### Backend API Endpoints
- **Users**: `/api/users/`
  - `POST /api/users/register/` - Register new user
  - `POST /api/users/login/` - Login user
  - `POST /api/users/logout/` - Logout user
  - `GET /api/users/` - Get user profile
  - `PUT /api/users/` - Update user profile

- **Courses**: `/api/courses/`
  - `GET /api/courses/courses/` - List all courses
  - `GET /api/courses/courses/{id}/` - Get course details
  - `GET /api/courses/lessons/` - List lessons
  - `GET /api/courses/enrollments/` - User enrollments
  - `POST /api/courses/enrollments/` - Enroll in course

- **Dashboard**: `/dashboard/`
  - `GET /dashboard/` - Dashboard UI
  - `GET /dashboard/api/` - Dashboard API
  - `GET /dashboard/api/course/{id}/analytics/` - Course analytics

### Frontend Pages
- **Home**: `http://localhost:3000/`
- **Courses**: `http://localhost:3000/courses`
- **Course Detail**: `http://localhost:3000/course/{id}`
- **Dashboard**: `http://localhost:3000/dashboard`
- **Login**: `http://localhost:3000/login`
- **Register**: `http://localhost:3000/register`

## 🔐 Authentication

### User Authentication Flow
1. User registers/logs in via frontend
2. Backend returns JWT tokens
3. Frontend stores tokens in localStorage
4. API requests include Bearer token
5. Backend validates token for protected routes

### Staff Access
- Dashboard requires staff user
- Admin panel at `/admin/`
- Default admin user: `admin` (password set during setup)

## 📊 Dashboard Features

### Overview Statistics
- Total users, courses, enrollments
- Revenue tracking
- Active users
- Completion rates

### Course Analytics
- Individual course performance
- Enrollment trends
- Revenue per course

### User Analytics
- User growth over time
- Activity tracking
- Top active users

## 🛠️ Development

### Backend Development
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 8000
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Database Management
```bash
# Create sample data
python create_sample_data.py

# Access Django admin
# Visit: http://localhost:8000/admin/
```

## 🔄 API Integration

### Services Available
- `authService` - User authentication
- `courseService` - Course management
- `dashboardService` - Dashboard analytics
- `listeningService` - Listening exercises

### Example Usage
```typescript
import { courseService } from '@/services/courseService';
import { authService } from '@/services/authService';

// Get all courses
const courses = await courseService.getCourses();

// Login user
const { user, tokens } = await authService.login({
  username: 'user@example.com',
  password: 'password'
});
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS settings allow frontend origin
   - Check `CORS_ALLOWED_ORIGINS` in Django settings

2. **Authentication Issues**
   - Verify JWT token is included in requests
   - Check token expiration
   - Ensure user is logged in

3. **API Connection Issues**
   - Verify backend is running on port 8000
   - Check API_BASE_URL in frontend
   - Ensure all required dependencies are installed

4. **Database Issues**
   - Run migrations: `python manage.py migrate`
   - Create sample data: `python create_sample_data.py`

### Debug Mode
- Backend: Set `DEBUG = True` in settings
- Frontend: Check browser console for errors
- Network tab shows API requests/responses

## 📝 Next Steps

1. **Customize UI**: Modify components in `frontend/src/components/`
2. **Add Features**: Create new API endpoints in backend
3. **Database**: Switch to PostgreSQL for production
4. **Deployment**: Use Docker for containerized deployment
5. **Testing**: Add unit tests for both frontend and backend

## 🎯 Production Deployment

### Backend Deployment
- Use Gunicorn for production server
- Configure PostgreSQL database
- Set up environment variables
- Enable HTTPS

### Frontend Deployment
- Build production bundle: `npm run build`
- Deploy to Vercel, Netlify, or similar
- Configure environment variables
- Set up CDN for static assets

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review Django and Next.js documentation
3. Check browser console for frontend errors
4. Check Django logs for backend errors
