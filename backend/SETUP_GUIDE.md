# Setup Guide - Education Platform Backend

Complete guide to get the backend up and running.

## 🎯 Quick Start (5 minutes)

### Using Docker (Recommended)

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Start all services**
   ```bash
   docker-compose up -d --build
   ```

3. **Create superuser**
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```
   
   Or use the seed command (creates admin@edu.vn / admin123):
   ```bash
   docker-compose exec backend python manage.py seed_demo
   ```

4. **Access the application**
   - API: http://localhost:8000/api
   - Admin: http://localhost:8000/admin
   - API Docs: http://localhost:8000/api/docs

**That's it! 🎉**

---

## 📋 Prerequisites

### For Docker Setup
- Docker 20.10+
- Docker Compose 1.29+

### For Local Setup
- Python 3.12+
- MySQL 8.0+
- Redis 7+
- pip

---

## 🐳 Docker Setup (Detailed)

### Services Overview

The docker-compose configuration includes:

1. **MySQL** - Database (port 3306)
2. **Redis** - Cache & message broker (port 6379)
3. **Backend** - Django app (port 8000)
4. **Celery Worker** - Background tasks
5. **Celery Beat** - Scheduled tasks
6. **Nginx** - Reverse proxy & static files (port 80)

### Step-by-Step

1. **Build images**
   ```bash
   docker-compose build
   ```

2. **Start services**
   ```bash
   docker-compose up -d
   ```

3. **View logs**
   ```bash
   docker-compose logs -f
   # Or for specific service
   docker-compose logs -f backend
   ```

4. **Run migrations** (if not auto-run)
   ```bash
   docker-compose exec backend python manage.py migrate
   ```

5. **Create superuser**
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

6. **Seed demo data**
   ```bash
   docker-compose exec backend python manage.py seed_demo
   ```

7. **Collect static files** (if needed)
   ```bash
   docker-compose exec backend python manage.py collectstatic --noinput
   ```

### Docker Commands

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes database)
docker-compose down -v

# Restart a service
docker-compose restart backend

# View running containers
docker-compose ps

# Execute command in container
docker-compose exec backend python manage.py shell

# View database
docker-compose exec db mysql -u edu_user -pedu_password edu_db
```

---

## 💻 Local Development Setup

### 1. Install Dependencies

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install packages
pip install -r requirements/dev.txt
```

### 2. Setup MySQL

```bash
# Login to MySQL
mysql -u root -p

# Create database and user
CREATE DATABASE edu_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'edu_user'@'localhost' IDENTIFIED BY 'edu_password';
GRANT ALL PRIVILEGES ON edu_db.* TO 'edu_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Setup Redis

**Windows:**
- Download from: https://github.com/microsoftarchive/redis/releases
- Or use WSL2

**Mac:**
```bash
brew install redis
brew services start redis
```

**Linux:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

### 4. Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your settings
# Minimum required:
DJANGO_ENV=dev
DEBUG=True
SECRET_KEY=your-secret-key
DB_HOST=localhost
DB_PORT=3306
DB_NAME=edu_db
DB_USER=edu_user
DB_PASSWORD=edu_password
```

### 5. Run Migrations

```bash
python manage.py migrate
```

### 6. Create Superuser

```bash
python manage.py createsuperuser
```

### 7. Seed Demo Data (Optional)

```bash
python manage.py seed_demo
```

### 8. Run Development Server

You'll need 3 terminal windows:

**Terminal 1 - Django Server:**
```bash
python manage.py runserver
```

**Terminal 2 - Celery Worker:**
```bash
celery -A config worker -l info
```

**Terminal 3 - Celery Beat:**
```bash
celery -A config beat -l info
```

---

## 🔧 Configuration

### Environment Variables

Key variables in `.env`:

```bash
# Django
DJANGO_ENV=dev|prod
DEBUG=True|False
SECRET_KEY=<random-secret-key>

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=edu_db
DB_USER=edu_user
DB_PASSWORD=edu_password

# Redis
REDIS_URL=redis://localhost:6379/1

# Celery
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@edu.vn

# Payment Gateways
VNPAY_TMN_CODE=<your-code>
VNPAY_HASH_SECRET=<your-secret>
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html

MOMO_PARTNER_CODE=<your-code>
MOMO_ACCESS_KEY=<your-key>
MOMO_SECRET_KEY=<your-secret>
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create

# Frontend
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Generate Secret Key

```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

---

## 🧪 Testing

### Run All Tests

```bash
pytest
```

### Run with Coverage

```bash
pytest --cov
pytest --cov --cov-report=html
```

### Run Specific Tests

```bash
# Test a specific app
pytest apps/users/tests/

# Test a specific file
pytest apps/users/tests/test_models.py

# Test a specific function
pytest apps/users/tests/test_models.py::test_user_creation
```

---

## 📊 Database Migrations

### Create Migrations

```bash
# For all apps
python manage.py makemigrations

# For specific app
python manage.py makemigrations users
```

### Apply Migrations

```bash
python manage.py migrate
```

### View Migration Status

```bash
python manage.py showmigrations
```

### Rollback Migration

```bash
# Rollback specific app to specific migration
python manage.py migrate users 0001_initial
```

---

## 🔍 Debugging

### Django Shell

```bash
python manage.py shell
```

```python
# Example: Check user count
from apps.users.models import User
User.objects.count()

# Check books
from apps.catalog.models import Book
Book.objects.filter(is_published=True)
```

### Database Shell

```bash
python manage.py dbshell
```

### View Logs

Docker:
```bash
docker-compose logs -f backend
```

Local:
Check `backend/logs/django.log`

---

## 🚀 Production Deployment

### Checklist

- [ ] Set `DJANGO_ENV=prod`
- [ ] Set `DEBUG=False`
- [ ] Generate strong `SECRET_KEY`
- [ ] Configure real payment gateway credentials
- [ ] Set up proper email service
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Configure `CORS_ALLOWED_ORIGINS`
- [ ] Use production database credentials
- [ ] Set up SSL/HTTPS
- [ ] Configure static file serving (S3, CDN)
- [ ] Set up monitoring (Sentry)
- [ ] Configure backups
- [ ] Set up logging aggregation

### Build for Production

```bash
# Collect static files
python manage.py collectstatic --noinput

# Run with Gunicorn
gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 4
```

### Using Docker in Production

Update `docker-compose.yml` environment variables, then:

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 📝 Common Issues

### Issue: Can't connect to MySQL

**Solution:**
```bash
# Check MySQL is running
docker-compose ps db
# Or locally
sudo systemctl status mysql

# Check connection
mysql -h localhost -u edu_user -pedu_password edu_db
```

### Issue: Celery not processing tasks

**Solution:**
```bash
# Check Redis is running
redis-cli ping
# Should return PONG

# Check Celery worker logs
docker-compose logs celery
```

### Issue: Static files not loading

**Solution:**
```bash
# Collect static files
python manage.py collectstatic --noinput

# Check STATIC_ROOT and STATIC_URL in settings
```

### Issue: Migration conflicts

**Solution:**
```bash
# Reset migrations (WARNING: development only)
python manage.py migrate <app> zero
rm -rf apps/<app>/migrations/
python manage.py makemigrations <app>
python manage.py migrate
```

---

## 🛠️ Development Tools

### Code Formatting

```bash
# Format with Black
black .

# Sort imports
isort .

# Lint
flake8
```

### Django Debug Toolbar

Already installed in dev. Access at: http://localhost:8000 (right panel)

### API Testing

Use the interactive docs: http://localhost:8000/api/docs/

Or use curl:
```bash
# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@edu.vn","password":"admin123"}'

# Get books (with token)
curl http://localhost:8000/api/catalog/books/ \
  -H "Authorization: Bearer <access_token>"
```

---

## 📚 Additional Resources

- Django Docs: https://docs.djangoproject.com/
- DRF Docs: https://www.django-rest-framework.org/
- Celery Docs: https://docs.celeryq.dev/
- VNPay Docs: Contact VNPay for documentation
- MoMo Docs: https://developers.momo.vn/

---

## 🆘 Getting Help

1. Check the logs
2. Review this guide
3. Check API documentation at `/api/docs/`
4. Review Django/DRF documentation
5. Contact: admin@edu.vn

