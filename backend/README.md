# Education Platform Backend

Django + DRF backend for an educational listening platform with payment integration, quiz system, and progress tracking.

## 🏗️ Architecture

### Tech Stack
- **Framework**: Django 4.2 + Django REST Framework
- **Database**: MySQL 8.0
- **Cache & Queue**: Redis 7
- **Task Queue**: Celery
- **Server**: Gunicorn + Nginx
- **Container**: Docker + Docker Compose

### Apps Structure

```
backend/
├── config/              # Settings, URLs, WSGI/ASGI
├── apps/
│   ├── common/         # Shared utilities, permissions, mixins
│   ├── users/          # Authentication, profiles, enrollments
│   ├── catalog/        # Books, units, assets (audio/transcript)
│   ├── quiz/           # Questions, choices, attempts, grading
│   ├── payments/       # Orders, transactions, VNPay, MoMo
│   └── progress/       # User progress tracking, analytics
└── scripts/            # Management scripts
```

## 📊 Data Model

### Core Models

**Users**
- `User`: Email-based authentication with roles (admin/staff/student)
- `Profile`: User profile (display name, avatar, bio)
- `Enrollment`: User access to books

**Catalog**
- `Book`: Course/book with price and published status
- `Unit`: Lesson within a book (ordered, with transcript)
- `Asset`: Audio/PDF/subtitle files (protected with signed URLs)

**Quiz**
- `Question`: Single/multiple choice questions
- `Choice`: Answer options with correctness flag
- `Attempt`: User quiz attempt with score
- `AttemptAnswer`: Individual answers within attempt

**Payments**
- `Order`: Purchase order (pending/paid/failed)
- `Transaction`: Payment gateway transaction record

**Progress**
- `UserProgress`: Overall progress per book
- `ListeningSession`: Individual listening session tracking

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Python 3.12+ (for local development)
- MySQL 8.0+ (for local development)
- Redis 7+ (for local development)

### Using Docker (Recommended)

1. **Clone and setup**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. **Build and run**
   ```bash
   docker-compose up -d --build
   ```

3. **Create superuser**
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

4. **Seed demo data**
   ```bash
   docker-compose exec backend python manage.py seed_demo
   ```

5. **Access services**
   - Backend API: http://localhost:8000
   - Admin: http://localhost:8000/admin
   - API Docs: http://localhost:8000/api/docs/
   - Nginx: http://localhost:80

### Local Development

1. **Install dependencies**
   ```bash
   pip install -r requirements/dev.txt
   ```

2. **Setup database**
   ```bash
   mysql -u root -p
   CREATE DATABASE edu_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'edu_user'@'localhost' IDENTIFIED BY 'edu_password';
   GRANT ALL PRIVILEGES ON edu_db.* TO 'edu_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Run migrations**
   ```bash
   python manage.py migrate
   ```

4. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

5. **Seed demo data**
   ```bash
   python manage.py seed_demo
   ```

6. **Run servers**
   ```bash
   # Terminal 1: Django
   python manage.py runserver

   # Terminal 2: Celery worker
   celery -A config worker -l info

   # Terminal 3: Celery beat
   celery -A config beat -l info
   ```

## 📡 API Endpoints

### Authentication (`/api/auth/`)
- `POST /register/` - User registration
- `POST /login/` - Login (get JWT tokens)
- `POST /refresh/` - Refresh access token
- `POST /logout/` - Logout (blacklist token)
- `GET /me/` - Current user details
- `GET /profile/` - Get/update profile
- `POST /change-password/` - Change password

### Catalog (`/api/catalog/`)
- `GET /books/` - List published books
- `GET /books/{slug}/` - Book details
- `GET /books/{slug}/units/` - List units (requires access)
- `GET /units/{id}/` - Unit details (requires access)
- `POST /units/{id}/asset-url/` - Get signed URL for asset

### Quiz (`/api/quiz/`)
- `GET /units/{id}/questions/` - Get quiz questions (no answers)
- `POST /units/{id}/submit/` - Submit quiz and get results
- `GET /attempts/` - List user's attempts
- `GET /attempts/{id}/` - Attempt details with results

### Payments (`/api/payments/`)
- `POST /orders/create_order/` - Create order
- `POST /vnpay/checkout/` - Get VNPay payment URL
- `POST /momo/checkout/` - Get MoMo payment URL
- `POST /vnpay/ipn/` - VNPay IPN endpoint (no auth)
- `POST /momo/ipn/` - MoMo IPN endpoint (no auth)
- `GET /orders/` - List user's orders

### Progress (`/api/progress/`)
- `GET /` - List user's progress
- `GET /analytics/` - User analytics
- `POST /sessions/units/{id}/tick/` - Record listening time

## 🔐 Security Features

### Content Protection
- **Signed URLs**: Audio assets protected with time-limited signed URLs (5 min)
- **Access Control**: Enrollment-based access to units
- **Rate Limiting**: Throttling on asset URL generation

### Payment Security
- **Signature Verification**: HMAC verification for VNPay/MoMo IPNs
- **Atomic Transactions**: Database transactions for payment processing
- **IPN Trust**: Only grant access after IPN verification

### Authentication
- **JWT**: Access + refresh token pattern
- **Token Blacklist**: Logout invalidates tokens
- **Password Validation**: Django's built-in validators

## 💳 Payment Flow

### VNPay/MoMo Integration

1. **Create Order**
   ```
   POST /api/payments/orders/create_order/
   {
     "book_id": 1,
     "provider": "vnpay"
   }
   ```

2. **Get Payment URL**
   ```
   POST /api/payments/vnpay/checkout/
   {
     "order_id": 123
   }
   ```

3. **User Pays** → Redirected to gateway

4. **IPN Callback** → Server verifies signature and amount

5. **Enrollment Created** → User gets access

6. **Email Sent** → Celery task sends confirmation

## 🎯 Quiz System

### Server-Side Grading
- Questions never expose correct answers before submission
- Grading happens entirely on backend
- Results returned after submission with:
  - Correct/incorrect per question
  - Correct answer IDs
  - Explanation text
  - Overall score percentage

### Example Submission
```json
POST /api/quiz/units/1/submit/
{
  "answers": [
    {"question_id": 1, "choice_ids": [2]},
    {"question_id": 2, "choice_ids": [1, 3]}
  ]
}
```

## 📈 Progress Tracking

### Listening Sessions
Track user listening time per unit:
```json
POST /api/progress/sessions/units/1/tick/
{
  "duration_sec": 30,
  "completed": false
}
```

### Analytics
Get comprehensive user analytics:
```
GET /api/progress/analytics/
```

Returns:
- Total listening time
- Average quiz score
- Books started
- Recent sessions
- Per-book progress

## ⚙️ Celery Tasks

### Automatic Tasks
- `send_payment_confirmation_email` - On successful payment
- `send_payment_failed_email` - On failed payment
- `send_welcome_email` - On user registration
- `process_payment_analytics` - Track payment metrics

### Scheduled Tasks
- `cleanup_expired_enrollments` - Daily cleanup
- `generate_daily_statistics` - Daily stats generation
- `send_progress_report_email` - Weekly progress reports

## 🛠️ Development

### Make Commands
```bash
make install          # Install dependencies
make migrate          # Run migrations
make run              # Run dev server
make test             # Run tests
make shell            # Django shell
make superuser        # Create superuser
make celery           # Run Celery worker
make docker-up        # Start Docker
make docker-down      # Stop Docker
```

### Code Quality
```bash
# Format code
black .
isort .

# Lint
flake8

# Tests
pytest
pytest --cov
```

## 📝 Admin Panel

Access at `/admin/` with features:
- Prepopulated slugs for books
- Inline editing for units, assets, questions, choices
- Validation for quiz questions (single choice = 1 correct answer)
- Bulk actions for enrollments
- Manual payment marking (superuser only)
- Read-only transaction records

## 🌐 Environment Variables

See `.env.example` for all configuration options.

Key variables:
- `DJANGO_ENV` - dev/prod
- `SECRET_KEY` - Django secret
- `DB_*` - Database credentials
- `VNPAY_*` - VNPay credentials
- `MOMO_*` - MoMo credentials
- `REDIS_URL` - Redis connection
- `SIGNED_URL_EXPIRATION` - Asset URL expiry

## 📚 API Documentation

Interactive API documentation available at:
- Swagger UI: `/api/docs/`
- OpenAPI Schema: `/api/schema/`

## 🔧 Production Deployment

1. **Environment**
   ```bash
   export DJANGO_ENV=prod
   # Set all production env vars
   ```

2. **Static Files**
   ```bash
   python manage.py collectstatic --noinput
   ```

3. **Migrations**
   ```bash
   python manage.py migrate --noinput
   ```

4. **Run with Gunicorn**
   ```bash
   gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 4
   ```

5. **Use Nginx** for static files and reverse proxy

## 📄 License

Proprietary - All rights reserved

## 👥 Support

For issues or questions, contact: admin@edu.vn
