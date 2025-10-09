# IELTS Listening Platform - Frontend

Nền tảng học IELTS Listening trực tuyến được xây dựng với Next.js 15 và React 19.

## 🚀 Công nghệ sử dụng

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Form Handling**: React Hook Form + Yup
- **Audio Player**: Plyr React
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

## 📦 Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Tạo file `.env.local`:
```bash
cp .env.local.example .env.local
```

3. Cấu hình API URL trong `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

4. Chạy development server:
```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

## 🎨 Cấu trúc dự án

```
src/
├── app/                      # Next.js App Router
│   ├── page.jsx             # Trang chủ
│   ├── sign-in/             # Đăng nhập
│   ├── register/            # Đăng ký
│   ├── courses/             # Danh sách khóa học
│   ├── course/[id]/         # Chi tiết khóa học
│   │   └── unit/[unitId]/   # Học Unit
│   ├── payment/             # Thanh toán
│   └── profile/             # Hồ sơ người dùng
├── components/              # React components
│   ├── ui/                  # UI components (Button, Card, etc.)
│   ├── home/                # Components trang chủ
│   ├── auth/                # Components auth
│   ├── course/              # Components khóa học
│   ├── unit/                # Components Unit
│   └── layout/              # Layout components
├── store/                   # Zustand stores
│   ├── authStore.js         # Auth state
│   └── appStore.js          # App state
├── lib/                     # Libraries
│   ├── axios.js             # Axios instance
│   ├── api.js               # API functions
│   ├── queryClient.js       # React Query config
│   └── validations.js       # Yup schemas
├── hooks/                   # Custom hooks
│   ├── useAuth.js           # Auth hook
│   └── useCourses.js        # Courses hook
├── providers/               # React providers
│   └── AppProviders.jsx     # Query + Toast providers
└── styles/                  # Styles
    └── tailwind.css         # Tailwind imports
```

## 🎯 Tính năng chính

### 1. Authentication
- Đăng nhập / Đăng ký với React Hook Form + Yup validation
- Quản lý session với Zustand + cookies
- Auto refresh token

### 2. Course Management
- Danh sách khóa học với filter và search
- Chi tiết khóa học với danh sách Units
- Progress tracking cho từng khóa học

### 3. Learning Experience
- Audio player với Plyr.js (tốc độ phát, transcript)
- Quiz với real-time validation
- Auto-save progress
- Kết quả chi tiết với charts (Recharts)

### 4. Payment Integration
- Tích hợp VNPay / Momo
- Payment verification
- Lịch sử giao dịch

### 5. User Profile
- Quản lý thông tin cá nhân
- Xem khóa học đã mua
- Thống kê kết quả học tập
- Lịch sử thanh toán

## 🎨 Design System

### Colors (Tailwind Config)
- **Primary**: `#003A70` (Navy Blue) - màu chủ đạo IELTS
- **Accent**: `#FFD700` (Gold) - màu nhấn
- **Success**: `#10B981`
- **Error**: `#EF4444`
- **Warning**: `#F59E0B`

### Components
Tất cả components UI đều tuân theo design system nhất quán:
- `Button`: 3 variants (primary, accent, outline)
- `Card`: Responsive với hover effects
- `Badge`: 4 variants màu sắc
- `ProgressBar`: Với animation
- `Input`: Form controls với validation
- `Modal`: Accessible dialogs

## 🔧 Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm run start

# Linting
npm run lint
```

## 📱 Responsive Design

Frontend được thiết kế mobile-first và responsive hoàn toàn:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🌐 API Integration

API endpoints được định nghĩa trong `src/lib/api.js`:

```javascript
// Auth
authAPI.login(credentials)
authAPI.register(userData)

// Courses
catalogAPI.getBooks(filters)
catalogAPI.getBook(id)
catalogAPI.getUnits(bookId)

// Quiz
quizAPI.getQuestions(unitId)
quizAPI.submitAnswers(unitId, answers)

// Payment
paymentAPI.createOrder(bookId, method)
paymentAPI.checkOrderStatus(orderId)
```

## 🎓 Best Practices

1. **Component Structure**: Functional components với hooks
2. **State Management**: Zustand cho global state, React Query cho server state
3. **Type Safety**: PropTypes hoặc TypeScript (optional)
4. **Performance**: React.memo, useMemo, useCallback khi cần
5. **Accessibility**: ARIA labels, keyboard navigation
6. **SEO**: Next.js metadata, semantic HTML

## 🐛 Troubleshooting

### CORS Issues
Đảm bảo backend đã config CORS cho `http://localhost:3000`

### API Connection
Kiểm tra `NEXT_PUBLIC_API_URL` trong `.env.local`

### Audio Player
Plyr yêu cầu CSS import riêng (đã có trong AudioPlayer.jsx)

## 📄 License

MIT License

