# API Documentation - Education Platform

## Tổng quan

API Backend cho nền tảng học tập trực tuyến với hệ thống thanh toán tích hợp, bài kiểm tra và theo dõi tiến độ.

**Base URL**: `http://localhost:8000/api`

**Version**: 1.0

**Documentation**: 
- Swagger UI: `http://localhost:8000/api/docs/`
- OpenAPI Schema: `http://localhost:8000/api/schema/`

## Authentication

### Phương thức xác thực

API sử dụng JWT (JSON Web Tokens) cho authentication:

- **Access Token**: Sử dụng cho các requests (expires sau 1 giờ)
- **Refresh Token**: Sử dụng để lấy access token mới (expires sau 7 ngày)

### Header format

```http
Authorization: Bearer {access_token}
```

### Endpoints không yêu cầu authentication

- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/refresh/`
- `GET /api/catalog/books/`
- `GET /api/catalog/books/{slug}/`
- `POST /api/payments/vnpay/ipn/`
- `POST /api/payments/momo/ipn/`

---

## 1. Authentication & Users API

Base path: `/api/auth/`

### 1.1. Đăng ký tài khoản

**Endpoint**: `POST /api/auth/register/`

**Permission**: AllowAny

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "password_confirm": "SecurePass123!",
  "display_name": "John Doe"
}
```

**Response** (201 Created):
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "student",
    "is_active": true,
    "created_at": "2024-01-15T10:30:00Z",
    "profile": {
      "display_name": "John Doe",
      "name": "John Doe",
      "avatar": null,
      "phone": null,
      "date_of_birth": null,
      "bio": ""
    }
  },
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Validation Rules**:
- Email phải hợp lệ và duy nhất
- Password phải có ít nhất 8 ký tự
- password và password_confirm phải khớp nhau

---

### 1.2. Đăng nhập

**Endpoint**: `POST /api/auth/login/`

**Permission**: AllowAny

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200 OK):
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Error Response** (401 Unauthorized):
```json
{
  "detail": "No active account found with the given credentials"
}
```

---

### 1.3. Làm mới Access Token

**Endpoint**: `POST /api/auth/refresh/`

**Permission**: AllowAny

**Request Body**:
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response** (200 OK):
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

### 1.4. Đăng xuất

**Endpoint**: `POST /api/auth/logout/`

**Permission**: IsAuthenticated

**Request Body**:
```json
{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response** (200 OK):
```json
{
  "detail": "Successfully logged out."
}
```

---

### 1.5. Thông tin người dùng hiện tại

**Endpoint**: `GET /api/auth/me/`

**Permission**: IsAuthenticated

**Response** (200 OK):
```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "student",
  "is_active": true,
  "created_at": "2024-01-15T10:30:00Z",
  "profile": {
    "display_name": "John Doe",
    "name": "John Doe",
    "avatar": "http://localhost:8000/media/avatars/user1.jpg",
    "phone": "+84123456789",
    "date_of_birth": "1990-01-15",
    "bio": "Học viên đam mê học tập"
  }
}
```

---

### 1.6. Xem/Cập nhật Profile

**Endpoint**: `GET /api/auth/profile/`

**Endpoint**: `PUT /api/auth/profile/` hoặc `PATCH /api/auth/profile/`

**Permission**: IsAuthenticated

**Request Body** (PUT/PATCH):
```json
{
  "display_name": "Jane Smith",
  "phone": "+84987654321",
  "date_of_birth": "1995-05-20",
  "bio": "Passionate learner",
  "avatar": "<file upload>"
}
```

**Response** (200 OK):
```json
{
  "display_name": "Jane Smith",
  "name": "Jane Smith",
  "avatar": "http://localhost:8000/media/avatars/user1_updated.jpg",
  "phone": "+84987654321",
  "date_of_birth": "1995-05-20",
  "bio": "Passionate learner"
}
```

---

### 1.7. Đổi mật khẩu

**Endpoint**: `POST /api/auth/change-password/`

**Permission**: IsAuthenticated

**Request Body**:
```json
{
  "old_password": "OldPass123!",
  "new_password": "NewSecurePass456!",
  "new_password_confirm": "NewSecurePass456!"
}
```

**Response** (200 OK):
```json
{
  "detail": "Password updated successfully."
}
```

**Error Response** (400 Bad Request):
```json
{
  "old_password": ["Old password is incorrect."]
}
```

---

### 1.8. Danh sách khóa học đã đăng ký

**Endpoint**: `GET /api/auth/enrollments/`

**Permission**: IsAuthenticated

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "book": 1,
    "book_title": "TOEIC 600+",
    "book_slug": "toeic-600-plus",
    "active_from": "2024-01-15T10:00:00Z",
    "active_until": "2025-01-15T10:00:00Z",
    "is_active": true,
    "is_expired": false,
    "created_at": "2024-01-15T10:00:00Z"
  }
]
```

---

## 2. Catalog API (Books & Units)

Base path: `/api/catalog/`

### 2.1. Danh sách sách/khóa học

**Endpoint**: `GET /api/catalog/books/`

**Permission**: AllowAny (chỉ hiện sách đã published)

**Query Parameters**:
- `search`: Tìm kiếm theo title
- `ordering`: Sắp xếp (-created_at, price, title)

**Response** (200 OK):
```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "TOEIC 600+",
      "slug": "toeic-600-plus",
      "description": "Khóa học luyện thi TOEIC cơ bản...",
      "cover": "http://localhost:8000/media/covers/toeic600.jpg",
      "price": "299000.00",
      "is_published": true,
      "unit_count": 30,
      "free_units_count": 3,
      "is_owned": false,
      "created_at": "2024-01-10T08:00:00Z"
    }
  ]
}
```

---

### 2.2. Chi tiết sách

**Endpoint**: `GET /api/catalog/books/{slug}/`

**Permission**: AllowAny

**Response** (200 OK):
```json
{
  "id": 1,
  "title": "TOEIC 600+",
  "slug": "toeic-600-plus",
  "description": "Khóa học luyện thi TOEIC cơ bản với 30 bài học chi tiết...",
  "cover": "http://localhost:8000/media/covers/toeic600.jpg",
  "price": "299000.00",
  "is_published": true,
  "unit_count": 30,
  "free_units_count": 3,
  "is_owned": true,
  "units": [
    {
      "id": 1,
      "title": "Part 1: Photographs - Lesson 1",
      "order": 1,
      "is_free": true,
      "duration_sec": 180,
      "duration_formatted": "03:00",
      "has_quiz": true
    }
  ],
  "created_at": "2024-01-10T08:00:00Z"
}
```

**Note**: 
- Nếu user chưa sở hữu, chỉ hiển thị 3 units miễn phí đầu tiên
- Nếu đã sở hữu, hiển thị tất cả units

---

### 2.3. Danh sách units của sách

**Endpoint**: `GET /api/catalog/books/{slug}/units/`

**Permission**: IsAuthenticated

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "title": "Part 1: Photographs - Lesson 1",
    "order": 1,
    "is_free": true,
    "duration_sec": 180,
    "duration_formatted": "03:00",
    "has_quiz": true
  },
  {
    "id": 2,
    "title": "Part 1: Photographs - Lesson 2",
    "order": 2,
    "is_free": false,
    "duration_sec": 240,
    "duration_formatted": "04:00",
    "has_quiz": true
  }
]
```

**Note**: 
- Nếu user sở hữu sách → trả về tất cả units
- Nếu chưa sở hữu → chỉ trả về units miễn phí (is_free=true)

---

### 2.4. Chi tiết unit

**Endpoint**: `GET /api/catalog/units/{id}/`

**Permission**: IsAuthenticated

**Access Control**: 
- Units miễn phí: Tất cả user đã đăng nhập
- Units trả phí: Chỉ user có enrollment hoặc staff

**Response** (200 OK):
```json
{
  "id": 1,
  "title": "Part 1: Photographs - Lesson 1",
  "order": 1,
  "transcript": "## Introduction\n\nIn this lesson, you will learn...",
  "is_free": true,
  "duration_sec": 180,
  "duration_formatted": "03:00",
  "has_quiz": true,
  "assets": [
    {
      "id": 1,
      "type": "audio",
      "bytes": 5242880,
      "size_formatted": "5.00 MB",
      "url": "/api/catalog/assets/1/url/"
    },
    {
      "id": 2,
      "type": "subtitle",
      "bytes": 8192,
      "size_formatted": "8.00 KB",
      "url": "/api/catalog/assets/2/url/"
    }
  ],
  "created_at": "2024-01-10T09:00:00Z"
}
```

**Error Response** (403 Forbidden):
```json
{
  "detail": "You don't have access to this content."
}
```

---

### 2.5. Lấy signed URL cho asset

**Endpoint**: `POST /api/catalog/units/{id}/asset_url/`

**Permission**: IsAuthenticated + HasBookAccess

**Rate Limit**: 50 requests/hour

**Request Body**:
```json
{
  "asset_type": "audio"
}
```

**Valid asset_type values**: `audio`, `pdf`, `subtitle`

**Response** (200 OK):
```json
{
  "url": "http://localhost:8000/media/assets/audio1.mp3?token=abc123&expires=1705320000&user=1",
  "expires_in": 300
}
```

**Note**: 
- URL có hiệu lực trong 5 phút (300 giây)
- Bảo vệ tài nguyên audio/pdf khỏi truy cập trực tiếp

**Error Response** (404 Not Found):
```json
{
  "detail": "Asset of type audio not found."
}
```

---

## 3. Quiz API

Base path: `/api/quiz/`

### 3.1. Lấy câu hỏi của unit

**Endpoint**: `GET /api/quiz/units/{unit_id}/questions/`

**Permission**: IsAuthenticated + HasBookAccess

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "text": "What is the main topic of this conversation?",
    "question_type": "single",
    "explanation": "The conversation focuses on...",
    "choices": [
      {
        "id": 1,
        "text": "Booking a hotel room"
      },
      {
        "id": 2,
        "text": "Making a restaurant reservation"
      },
      {
        "id": 3,
        "text": "Scheduling a meeting"
      }
    ]
  },
  {
    "id": 2,
    "text": "Select all activities mentioned. (Multiple choice)",
    "question_type": "multiple",
    "explanation": "",
    "choices": [
      {
        "id": 4,
        "text": "Swimming"
      },
      {
        "id": 5,
        "text": "Hiking"
      },
      {
        "id": 6,
        "text": "Shopping"
      },
      {
        "id": 7,
        "text": "Cooking"
      }
    ]
  }
]
```

**Important**: 
- Không trả về trường `is_correct` để bảo mật
- Client không biết đáp án đúng cho đến khi submit

---

### 3.2. Nộp bài quiz

**Endpoint**: `POST /api/quiz/units/{unit_id}/submit/`

**Permission**: IsAuthenticated + HasBookAccess

**Request Body**:
```json
{
  "answers": [
    {
      "question_id": 1,
      "choice_ids": [2]
    },
    {
      "question_id": 2,
      "choice_ids": [4, 5]
    }
  ]
}
```

**Response** (201 Created):
```json
{
  "id": 15,
  "unit": 1,
  "score": 75.50,
  "total_questions": 10,
  "correct_count": 8,
  "submitted_at": "2024-01-20T14:30:00Z",
  "answers": [
    {
      "id": 50,
      "question": {
        "id": 1,
        "text": "What is the main topic of this conversation?",
        "explanation": "The conversation focuses on making a restaurant reservation."
      },
      "selected_choices": [
        {
          "id": 2,
          "text": "Making a restaurant reservation",
          "is_correct": true
        }
      ],
      "correct_choices": [2],
      "is_correct": true
    },
    {
      "id": 51,
      "question": {
        "id": 2,
        "text": "Select all activities mentioned.",
        "explanation": "They talked about swimming and hiking only."
      },
      "selected_choices": [
        {
          "id": 4,
          "text": "Swimming",
          "is_correct": true
        },
        {
          "id": 5,
          "text": "Hiking",
          "is_correct": true
        }
      ],
      "correct_choices": [4, 5],
      "is_correct": true
    }
  ]
}
```

**Scoring Logic**:
- Single choice: 100% điểm nếu đúng, 0% nếu sai
- Multiple choice: Tính theo tỷ lệ đúng (partial credit)
- Score tổng = trung bình điểm các câu

---

### 3.3. Danh sách attempts của user

**Endpoint**: `GET /api/quiz/attempts/`

**Permission**: IsAuthenticated

**Response** (200 OK):
```json
{
  "count": 25,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 15,
      "unit": 1,
      "unit_title": "Part 1: Photographs - Lesson 1",
      "score": 75.50,
      "total_questions": 10,
      "correct_count": 8,
      "submitted_at": "2024-01-20T14:30:00Z"
    }
  ]
}
```

---

### 3.4. Chi tiết attempt

**Endpoint**: `GET /api/quiz/attempts/{id}/`

**Permission**: IsAuthenticated (chỉ xem được attempt của mình)

**Response**: Giống như response của submit quiz (3.2)

---

### 3.5. Attempt tốt nhất của unit

**Endpoint**: `GET /api/quiz/attempts/units/{unit_id}/best/`

**Permission**: IsAuthenticated

**Response** (200 OK): Giống response 3.2 (attempt có score cao nhất)

**Error Response** (404 Not Found):
```json
{
  "detail": "No attempts found for this unit."
}
```

---

## 4. Payments API

Base path: `/api/payments/`

### 4.1. Tạo đơn hàng

**Endpoint**: `POST /api/payments/orders/create_order/`

**Permission**: IsAuthenticated

**Request Body**:
```json
{
  "book_id": 1,
  "provider": "vnpay"
}
```

**Valid providers**: `vnpay`, `momo`

**Response** (201 Created):
```json
{
  "id": 123,
  "order_code": "ORD-20240120-123",
  "book": {
    "id": 1,
    "title": "TOEIC 600+",
    "slug": "toeic-600-plus"
  },
  "amount": "299000.00",
  "status": "pending",
  "provider": "vnpay",
  "created_at": "2024-01-20T15:00:00Z",
  "paid_at": null
}
```

**Error Response** (400 Bad Request):
```json
{
  "detail": "You already own this book."
}
```

---

### 4.2. Tạo payment URL cho VNPay

**Endpoint**: `POST /api/payments/vnpay/checkout/`

**Permission**: IsAuthenticated

**Request Body**:
```json
{
  "order_id": 123
}
```

**Response** (200 OK):
```json
{
  "payment_url": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=29900000&vnp_Command=pay&..."
}
```

**Flow**:
1. Redirect user đến `payment_url`
2. User thanh toán trên VNPay
3. VNPay gọi IPN endpoint
4. User được redirect về frontend với kết quả

---

### 4.3. Tạo payment request cho MoMo

**Endpoint**: `POST /api/payments/momo/checkout/`

**Permission**: IsAuthenticated

**Request Body**:
```json
{
  "order_id": 123
}
```

**Response** (200 OK):
```json
{
  "pay_url": "https://test-payment.momo.vn/gw_payment/transactionProcessor?partnerCode=...",
  "qr_code_url": "https://test-payment.momo.vn/qr/...",
  "deeplink": "momo://app?action=payment&..."
}
```

**Usage**:
- Desktop/Web: Redirect đến `pay_url`
- Mobile app: Sử dụng `deeplink`
- QR Code: Hiển thị `qr_code_url`

---

### 4.4. VNPay IPN (Webhook)

**Endpoint**: `POST /api/payments/vnpay/ipn/`

**Permission**: AllowAny (signature verification required)

**Note**: 
- Endpoint này được VNPay server gọi, không dùng từ client
- Thực hiện verify signature và cập nhật order status
- Tạo enrollment nếu payment thành công

**Response to VNPay** (200 OK):
```json
{
  "RspCode": "00",
  "Message": "Confirm Success"
}
```

---

### 4.5. MoMo IPN (Webhook)

**Endpoint**: `POST /api/payments/momo/ipn/`

**Permission**: AllowAny (signature verification required)

**Note**: Tương tự VNPay IPN

**Response to MoMo** (200 OK):
```json
{
  "resultCode": 0,
  "message": "Success"
}
```

---

### 4.6. Danh sách đơn hàng

**Endpoint**: `GET /api/payments/orders/`

**Permission**: IsAuthenticated

**Response** (200 OK):
```json
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 123,
      "order_code": "ORD-20240120-123",
      "book": {
        "id": 1,
        "title": "TOEIC 600+",
        "slug": "toeic-600-plus"
      },
      "amount": "299000.00",
      "status": "paid",
      "provider": "vnpay",
      "created_at": "2024-01-20T15:00:00Z",
      "paid_at": "2024-01-20T15:05:30Z"
    }
  ]
}
```

**Order Status Values**:
- `pending`: Chờ thanh toán
- `paid`: Đã thanh toán thành công
- `failed`: Thanh toán thất bại
- `cancelled`: Đã hủy

---

## 5. Progress Tracking API

Base path: `/api/progress/`

### 5.1. Danh sách tiến độ học tập

**Endpoint**: `GET /api/progress/`

**Permission**: IsAuthenticated

**Response** (200 OK):
```json
{
  "count": 3,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "book": {
        "id": 1,
        "title": "TOEIC 600+",
        "slug": "toeic-600-plus"
      },
      "completion_percentage": 45.50,
      "total_units": 30,
      "completed_units": 13,
      "total_listen_time": 3600,
      "last_unit": {
        "id": 14,
        "title": "Part 2: Question-Response - Lesson 4"
      },
      "started_at": "2024-01-15T10:00:00Z",
      "last_activity": "2024-01-20T16:30:00Z"
    }
  ]
}
```

---

### 5.2. Analytics tổng hợp

**Endpoint**: `GET /api/progress/analytics/`

**Permission**: IsAuthenticated

**Response** (200 OK):
```json
{
  "total_listen_time": 18000,
  "avg_score": 78.5,
  "books_started": 3,
  "recent_sessions": [
    {
      "id": 150,
      "unit": {
        "id": 14,
        "title": "Part 2: Question-Response - Lesson 4"
      },
      "duration_sec": 240,
      "completed": true,
      "started_at": "2024-01-20T16:30:00Z",
      "ended_at": "2024-01-20T16:34:00Z"
    }
  ],
  "book_progress": [
    {
      "id": 1,
      "book": {
        "id": 1,
        "title": "TOEIC 600+",
        "slug": "toeic-600-plus"
      },
      "completion_percentage": 45.50,
      "total_units": 30,
      "completed_units": 13,
      "total_listen_time": 3600,
      "last_unit": {
        "id": 14,
        "title": "Part 2: Question-Response - Lesson 4"
      },
      "started_at": "2024-01-15T10:00:00Z",
      "last_activity": "2024-01-20T16:30:00Z"
    }
  ]
}
```

---

### 5.3. Ghi nhận thời gian nghe

**Endpoint**: `POST /api/progress/sessions/units/{unit_id}/tick/`

**Permission**: IsAuthenticated + HasBookAccess

**Request Body**:
```json
{
  "duration_sec": 30,
  "completed": false
}
```

**Parameters**:
- `duration_sec`: Số giây đã nghe (thường gửi mỗi 30s)
- `completed`: true nếu user đã nghe xong unit

**Response** (201 Created):
```json
{
  "id": 150,
  "unit": {
    "id": 14,
    "title": "Part 2: Question-Response - Lesson 4"
  },
  "duration_sec": 30,
  "completed": false,
  "started_at": "2024-01-20T16:30:00Z",
  "ended_at": "2024-01-20T16:30:30Z"
}
```

**Usage Example**:
```javascript
// Gửi tick mỗi 30 giây khi user đang nghe
setInterval(() => {
  if (isPlaying) {
    fetch(`/api/progress/sessions/units/${unitId}/tick/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        duration_sec: 30,
        completed: false
      })
    });
  }
}, 30000);

// Khi nghe xong unit
fetch(`/api/progress/sessions/units/${unitId}/tick/`, {
  method: 'POST',
  body: JSON.stringify({
    duration_sec: remainingSeconds,
    completed: true
  })
});
```

---

## Error Responses

### Standard Error Format

```json
{
  "detail": "Error message here"
}
```

hoặc với field-specific errors:

```json
{
  "email": ["This field is required."],
  "password": ["This password is too short."]
}
```

### HTTP Status Codes

| Code | Meaning | Ví dụ |
|------|---------|-------|
| 200 | OK | Request thành công |
| 201 | Created | Tạo resource thành công |
| 400 | Bad Request | Dữ liệu không hợp lệ |
| 401 | Unauthorized | Chưa đăng nhập hoặc token hết hạn |
| 403 | Forbidden | Không có quyền truy cập |
| 404 | Not Found | Resource không tồn tại |
| 429 | Too Many Requests | Vượt quá rate limit |
| 500 | Internal Server Error | Lỗi server |

### Common Error Responses

**401 Unauthorized**:
```json
{
  "detail": "Authentication credentials were not provided."
}
```

```json
{
  "detail": "Given token not valid for any token type",
  "code": "token_not_valid"
}
```

**403 Forbidden**:
```json
{
  "detail": "You don't have access to this content."
}
```

**404 Not Found**:
```json
{
  "detail": "Not found."
}
```

**429 Too Many Requests**:
```json
{
  "detail": "Request was throttled. Expected available in 3600 seconds."
}
```

---

## Data Models

### User
```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "student",
  "is_active": true,
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Roles**: `admin`, `staff`, `student`

### Profile
```json
{
  "display_name": "John Doe",
  "name": "John Doe",
  "avatar": "http://localhost:8000/media/avatars/user1.jpg",
  "phone": "+84123456789",
  "date_of_birth": "1990-01-15",
  "bio": "Passionate learner"
}
```

### Book
```json
{
  "id": 1,
  "title": "TOEIC 600+",
  "slug": "toeic-600-plus",
  "description": "Khóa học luyện thi TOEIC...",
  "cover": "http://localhost:8000/media/covers/toeic600.jpg",
  "price": "299000.00",
  "is_published": true,
  "unit_count": 30,
  "free_units_count": 3,
  "is_owned": false,
  "created_at": "2024-01-10T08:00:00Z"
}
```

### Unit
```json
{
  "id": 1,
  "title": "Part 1: Photographs - Lesson 1",
  "order": 1,
  "transcript": "## Introduction\n\nIn this lesson...",
  "is_free": true,
  "duration_sec": 180,
  "duration_formatted": "03:00",
  "has_quiz": true,
  "created_at": "2024-01-10T09:00:00Z"
}
```

### Asset
```json
{
  "id": 1,
  "type": "audio",
  "bytes": 5242880,
  "size_formatted": "5.00 MB",
  "url": "/api/catalog/assets/1/url/"
}
```

**Asset Types**: `audio`, `pdf`, `subtitle`

### Question
```json
{
  "id": 1,
  "text": "What is the main topic?",
  "question_type": "single",
  "explanation": "Explanation text...",
  "choices": [...]
}
```

**Question Types**: `single` (single choice), `multiple` (multiple choice)

### Choice
```json
{
  "id": 1,
  "text": "Answer option",
  "is_correct": true
}
```

**Note**: `is_correct` chỉ hiển thị sau khi submit quiz

### Order
```json
{
  "id": 123,
  "order_code": "ORD-20240120-123",
  "book": {...},
  "amount": "299000.00",
  "status": "paid",
  "provider": "vnpay",
  "created_at": "2024-01-20T15:00:00Z",
  "paid_at": "2024-01-20T15:05:30Z"
}
```

**Status**: `pending`, `paid`, `failed`, `cancelled`
**Provider**: `vnpay`, `momo`

### Enrollment
```json
{
  "id": 1,
  "book": 1,
  "book_title": "TOEIC 600+",
  "book_slug": "toeic-600-plus",
  "active_from": "2024-01-15T10:00:00Z",
  "active_until": "2025-01-15T10:00:00Z",
  "is_active": true,
  "is_expired": false,
  "created_at": "2024-01-15T10:00:00Z"
}
```

---

## Rate Limiting

### Default Limits
- Anonymous users: 100 requests/hour
- Authenticated users: 1000 requests/hour

### Special Limits
- Asset URL generation: 50 requests/hour
- Quiz submission: 10 requests/minute per unit

### Headers
Mỗi response bao gồm rate limit headers:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1705324800
```

---

## Pagination

### Default Pagination
Tất cả list endpoints sử dụng page-based pagination:

**Query Parameters**:
- `page`: Số trang (default: 1)
- `page_size`: Số items mỗi trang (default: 20, max: 100)

**Response Format**:
```json
{
  "count": 150,
  "next": "http://localhost:8000/api/catalog/books/?page=2",
  "previous": null,
  "results": [...]
}
```

---

## Filtering & Searching

### Books
```
GET /api/catalog/books/?search=toeic&ordering=-created_at
```

**Parameters**:
- `search`: Tìm trong title và description
- `ordering`: Sắp xếp theo field (prefix `-` cho descending)

### Orders
```
GET /api/payments/orders/?status=paid&provider=vnpay
```

**Parameters**:
- `status`: Lọc theo status
- `provider`: Lọc theo payment provider

---

## File Uploads

### Profile Avatar

**Endpoint**: `PUT /api/auth/profile/`

**Content-Type**: `multipart/form-data`

**Example**:
```bash
curl -X PUT http://localhost:8000/api/auth/profile/ \
  -H "Authorization: Bearer {token}" \
  -F "display_name=John Doe" \
  -F "avatar=@/path/to/image.jpg"
```

**Supported formats**: JPG, PNG, GIF, WEBP
**Max size**: 5MB

---

## CORS

### Development
CORS được enable cho `http://localhost:3000` (Next.js frontend)

### Production
Cấu hình CORS trong settings cho production domain

---

## Security

### Content Protection
1. **Signed URLs**: Assets được bảo vệ bằng time-limited signed URLs
2. **Access Control**: Kiểm tra enrollment trước khi cho phép truy cập
3. **Rate Limiting**: Giới hạn số lần request asset URLs

### Payment Security
1. **Signature Verification**: Verify HMAC signature từ payment gateways
2. **Server-side Processing**: Chỉ tin tưởng IPN callback, không tin client
3. **Atomic Transactions**: Đảm bảo consistency trong payment processing

### Authentication
1. **JWT Tokens**: Short-lived access tokens + refresh tokens
2. **Token Blacklist**: Logout invalidates tokens
3. **Password Validation**: Django's built-in password validators

---

## Webhooks

### VNPay IPN
```
POST /api/payments/vnpay/ipn/
```

Backend sẽ verify:
- Signature (vnp_SecureHash)
- Amount matching order
- Transaction status

### MoMo IPN
```
POST /api/payments/momo/ipn/
```

Backend sẽ verify:
- Signature (signature field)
- Amount matching order
- resultCode

---

## Testing

### Test Accounts

**Admin**:
- Email: admin@edu.vn
- Password: admin123

**Student**:
- Email: student@edu.vn
- Password: student123

### Payment Testing

**VNPay Sandbox**:
- Card: 9704198526191432198
- Name: NGUYEN VAN A
- Date: 07/15
- OTP: 123456

**MoMo Test**:
- Phone: 0909000000
- OTP: Nhận từ MoMo test environment

---

## Support

### API Documentation
- Swagger UI: http://localhost:8000/api/docs/
- OpenAPI Schema: http://localhost:8000/api/schema/

### Contact
Email: admin@edu.vn

### Version History

**v1.0.0** (2024-01-20)
- Initial API release
- Authentication & User management
- Catalog with Books & Units
- Quiz system
- Payment integration (VNPay, MoMo)
- Progress tracking

