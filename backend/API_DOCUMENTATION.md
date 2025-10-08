# API Documentation

Complete API reference for the Education Platform backend.

## Base URL
```
http://localhost:8000/api
```

## Authentication

All endpoints except registration, login, and IPNs require JWT authentication.

### Headers
```
Authorization: Bearer <access_token>
```

---

## 1. Authentication & Users

### Register
Create a new user account.

**Endpoint:** `POST /auth/register/`

**Request:**
```json
{
  "email": "student@example.com",
  "password": "SecurePass123",
  "password_confirm": "SecurePass123",
  "display_name": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": 1,
    "email": "student@example.com",
    "role": "student",
    "is_active": true,
    "created_at": "2024-01-01T10:00:00Z",
    "profile": {
      "display_name": "John Doe",
      "name": "John Doe",
      "avatar": null,
      "phone": "",
      "date_of_birth": null,
      "bio": ""
    }
  },
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbG...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbG..."
}
```

### Login
Authenticate and get tokens.

**Endpoint:** `POST /auth/login/`

**Request:**
```json
{
  "email": "student@example.com",
  "password": "SecurePass123"
}
```

**Response:** `200 OK`
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbG...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbG..."
}
```

### Refresh Token
Get new access token.

**Endpoint:** `POST /auth/refresh/`

**Request:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbG..."
}
```

**Response:** `200 OK`
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbG..."
}
```

### Logout
Blacklist refresh token.

**Endpoint:** `POST /auth/logout/`

**Request:**
```json
{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbG..."
}
```

**Response:** `200 OK`
```json
{
  "detail": "Successfully logged out."
}
```

### Get Current User
Get authenticated user details.

**Endpoint:** `GET /auth/me/`

**Response:** `200 OK`
```json
{
  "id": 1,
  "email": "student@example.com",
  "role": "student",
  "is_active": true,
  "created_at": "2024-01-01T10:00:00Z",
  "profile": {
    "display_name": "John Doe",
    "name": "John Doe",
    "avatar": "/media/avatars/avatar.jpg",
    "phone": "+84123456789",
    "date_of_birth": "1990-01-01",
    "bio": "IELTS learner"
  }
}
```

### Update Profile
Update user profile.

**Endpoint:** `PUT /auth/profile/` or `PATCH /auth/profile/`

**Request:**
```json
{
  "display_name": "John Smith",
  "phone": "+84987654321",
  "bio": "Learning English"
}
```

**Response:** `200 OK`
```json
{
  "display_name": "John Smith",
  "name": "John Smith",
  "avatar": null,
  "phone": "+84987654321",
  "date_of_birth": null,
  "bio": "Learning English"
}
```

### Change Password
Change user password.

**Endpoint:** `POST /auth/change-password/`

**Request:**
```json
{
  "old_password": "OldPass123",
  "new_password": "NewPass123",
  "new_password_confirm": "NewPass123"
}
```

**Response:** `200 OK`
```json
{
  "detail": "Password updated successfully."
}
```

---

## 2. Catalog (Books & Units)

### List Books
Get all published books.

**Endpoint:** `GET /catalog/books/`

**Query Parameters:**
- `page` - Page number (default: 1)
- `page_size` - Items per page (default: 20, max: 100)
- `search` - Search in title/description

**Response:** `200 OK`
```json
{
  "count": 10,
  "next": "http://localhost:8000/api/catalog/books/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "IELTS Listening Fundamentals",
      "slug": "ielts-listening-fundamentals",
      "description": "Master IELTS Listening...",
      "cover": "/media/covers/book1.jpg",
      "price": "299000.00",
      "is_published": true,
      "unit_count": 12,
      "free_units_count": 3,
      "is_owned": false,
      "created_at": "2024-01-01T10:00:00Z"
    }
  ]
}
```

### Get Book Details
Get book with unit preview.

**Endpoint:** `GET /catalog/books/{slug}/`

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "IELTS Listening Fundamentals",
  "slug": "ielts-listening-fundamentals",
  "description": "Master IELTS Listening...",
  "cover": "/media/covers/book1.jpg",
  "price": "299000.00",
  "is_published": true,
  "unit_count": 12,
  "free_units_count": 3,
  "is_owned": true,
  "units": [
    {
      "id": 1,
      "title": "Introduction",
      "order": 1,
      "is_free": true,
      "duration_sec": 600,
      "duration_formatted": "10:00",
      "has_quiz": true
    }
  ],
  "created_at": "2024-01-01T10:00:00Z"
}
```

### Get Unit Details
Get unit content (requires access if not free).

**Endpoint:** `GET /catalog/units/{id}/`

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Introduction to IELTS Listening",
  "order": 1,
  "transcript": "# Introduction\n\nWelcome...",
  "is_free": true,
  "duration_sec": 600,
  "duration_formatted": "10:00",
  "has_quiz": true,
  "assets": [
    {
      "id": 1,
      "type": "audio",
      "bytes": 5242880,
      "size_formatted": "5.00 MB",
      "url": "/api/catalog/assets/1/url/"
    }
  ],
  "created_at": "2024-01-01T10:00:00Z"
}
```

### Get Asset Signed URL
Get time-limited signed URL for protected asset.

**Endpoint:** `POST /catalog/units/{id}/asset-url/`

**Request:**
```json
{
  "asset_type": "audio"
}
```

**Response:** `200 OK`
```json
{
  "url": "https://cdn.example.com/audio.mp3?token=abc123&expires=1234567890",
  "expires_in": 300
}
```

**Rate Limit:** 50 requests/hour per user

---

## 3. Quiz System

### Get Quiz Questions
Get questions for a unit (without correct answers).

**Endpoint:** `GET /quiz/units/{unit_id}/questions/`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "type": "single",
    "text": "What is the main topic?",
    "order": 1,
    "choices": [
      {"id": 1, "text": "Speaking", "order": 1},
      {"id": 2, "text": "Listening", "order": 2},
      {"id": 3, "text": "Reading", "order": 3},
      {"id": 4, "text": "Writing", "order": 4}
    ]
  },
  {
    "id": 2,
    "type": "multi",
    "text": "Select all strategies:",
    "order": 2,
    "choices": [
      {"id": 5, "text": "Active listening", "order": 1},
      {"id": 6, "text": "Speed reading", "order": 2},
      {"id": 7, "text": "Note-taking", "order": 3}
    ]
  }
]
```

### Submit Quiz
Submit answers and get graded results.

**Endpoint:** `POST /quiz/units/{unit_id}/submit/`

**Request:**
```json
{
  "answers": [
    {
      "question_id": 1,
      "choice_ids": [2]
    },
    {
      "question_id": 2,
      "choice_ids": [5, 7]
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "id": 42,
  "unit": 1,
  "unit_title": "Introduction to IELTS Listening",
  "started_at": "2024-01-01T10:00:00Z",
  "submitted_at": "2024-01-01T10:05:00Z",
  "score_raw": 2,
  "score_pct": "100.00",
  "is_submitted": true,
  "is_passed": true,
  "answers": [
    {
      "question": 1,
      "question_text": "What is the main topic?",
      "selected_choices": [2],
      "is_correct": true,
      "correct_choice_ids": [2],
      "explanation": "Listening is the main focus..."
    },
    {
      "question": 2,
      "question_text": "Select all strategies:",
      "selected_choices": [5, 7],
      "is_correct": true,
      "correct_choice_ids": [5, 7],
      "explanation": "Both strategies are essential..."
    }
  ],
  "created_at": "2024-01-01T10:00:00Z"
}
```

### Get Attempt Details
Retrieve a specific attempt.

**Endpoint:** `GET /quiz/attempts/{id}/`

**Response:** `200 OK` (same structure as submit response)

### List My Attempts
Get all user's attempts.

**Endpoint:** `GET /quiz/attempts/`

**Response:** `200 OK`
```json
{
  "count": 5,
  "results": [
    {
      "id": 42,
      "unit": 1,
      "unit_title": "Introduction",
      "started_at": "2024-01-01T10:00:00Z",
      "submitted_at": "2024-01-01T10:05:00Z",
      "score_raw": 2,
      "score_pct": "100.00",
      "is_submitted": true,
      "is_passed": true,
      "created_at": "2024-01-01T10:00:00Z"
    }
  ]
}
```

---

## 4. Payments

### Create Order
Create a payment order for a book.

**Endpoint:** `POST /payments/orders/create_order/`

**Request:**
```json
{
  "book_id": 1,
  "provider": "vnpay"
}
```

**Response:** `201 Created`
```json
{
  "id": 123,
  "book": 1,
  "book_title": "IELTS Listening Fundamentals",
  "book_slug": "ielts-listening-fundamentals",
  "amount": "299000.00",
  "currency": "VND",
  "status": "pending",
  "provider": "vnpay",
  "is_paid": false,
  "is_pending": true,
  "created_at": "2024-01-01T10:00:00Z"
}
```

### VNPay Checkout
Get VNPay payment URL.

**Endpoint:** `POST /payments/vnpay/checkout/`

**Request:**
```json
{
  "order_id": 123
}
```

**Response:** `200 OK`
```json
{
  "payment_url": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=..."
}
```

### MoMo Checkout
Get MoMo payment information.

**Endpoint:** `POST /payments/momo/checkout/`

**Request:**
```json
{
  "order_id": 123
}
```

**Response:** `200 OK`
```json
{
  "pay_url": "https://test-payment.momo.vn/pay/...",
  "qr_code_url": "https://test-payment.momo.vn/qr/...",
  "deeplink": "momo://..."
}
```

### List My Orders
Get user's orders.

**Endpoint:** `GET /payments/orders/`

**Response:** `200 OK`
```json
{
  "count": 3,
  "results": [
    {
      "id": 123,
      "book": 1,
      "book_title": "IELTS Listening Fundamentals",
      "book_slug": "ielts-listening-fundamentals",
      "amount": "299000.00",
      "currency": "VND",
      "status": "paid",
      "provider": "vnpay",
      "is_paid": true,
      "is_pending": false,
      "created_at": "2024-01-01T10:00:00Z"
    }
  ]
}
```

---

## 5. Progress Tracking

### Get My Progress
List progress for all enrolled books.

**Endpoint:** `GET /progress/`

**Response:** `200 OK`
```json
{
  "count": 2,
  "results": [
    {
      "id": 1,
      "book": 1,
      "book_title": "IELTS Listening Fundamentals",
      "book_slug": "ielts-listening-fundamentals",
      "completed_units": 5,
      "last_unit": 5,
      "last_unit_title": "Section 3",
      "last_score_pct": "85.00",
      "total_listen_sec": 3600,
      "completion_pct": 41.67,
      "created_at": "2024-01-01T10:00:00Z",
      "updated_at": "2024-01-05T15:30:00Z"
    }
  ]
}
```

### Get Analytics
Get comprehensive user analytics.

**Endpoint:** `GET /progress/analytics/`

**Response:** `200 OK`
```json
{
  "total_listen_time": 7200,
  "avg_score": 87.5,
  "books_started": 2,
  "recent_sessions": [
    {
      "id": 42,
      "unit": 5,
      "unit_title": "Section 3",
      "duration_sec": 300,
      "completed": true,
      "created_at": "2024-01-05T15:30:00Z"
    }
  ],
  "book_progress": [
    {
      "id": 1,
      "book": 1,
      "book_title": "IELTS Listening",
      "completion_pct": 41.67
    }
  ]
}
```

### Record Listening Time
Track listening session for a unit.

**Endpoint:** `POST /progress/sessions/units/{unit_id}/tick/`

**Request:**
```json
{
  "duration_sec": 30,
  "completed": false
}
```

**Response:** `201 Created`
```json
{
  "id": 42,
  "unit": 5,
  "unit_title": "Section 3",
  "duration_sec": 30,
  "completed": false,
  "created_at": "2024-01-05T15:30:00Z"
}
```

---

## Error Responses

All errors follow this format:

### 400 Bad Request
```json
{
  "status_code": 400,
  "error": true,
  "detail": "Invalid input",
  "field_name": ["Error message"]
}
```

### 401 Unauthorized
```json
{
  "status_code": 401,
  "error": true,
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "status_code": 403,
  "error": true,
  "detail": "You do not have access to this content."
}
```

### 404 Not Found
```json
{
  "status_code": 404,
  "error": true,
  "detail": "Not found."
}
```

### 429 Too Many Requests
```json
{
  "status_code": 429,
  "error": true,
  "detail": "Request was throttled. Expected available in 3600 seconds."
}
```

---

## Rate Limiting

- Anonymous: 100 requests/hour
- Authenticated: 1000 requests/hour
- Asset URL generation: 50 requests/hour
- Payment endpoints: 10 requests/hour

---

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `page` - Page number (default: 1)
- `page_size` - Items per page (default: 20, max: 100)

**Response Structure:**
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/endpoint/?page=2",
  "previous": null,
  "results": [...]
}
```

