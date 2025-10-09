# 🚀 Hướng dẫn Setup Frontend

## Bước 1: Cài đặt Dependencies

Chạy lệnh sau để cài đặt tất cả packages cần thiết:

```bash
npm install
```

**Lưu ý**: Nếu gặp lỗi về execution policy trên Windows PowerShell, bạn có thể:
1. Chạy PowerShell với quyền Administrator
2. Chạy lệnh: `Set-ExecutionPolicy RemoteSigned`
3. Hoặc sử dụng Command Prompt thay vì PowerShell

## Bước 2: Tạo file Environment

```bash
# Tạo file .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
```

Hoặc tạo thủ công file `.env.local` với nội dung:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=IELTS Listening Platform
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Bước 3: Chạy Development Server

```bash
npm run dev
```

Mở trình duyệt tại: **http://localhost:3000**

## 🎨 Công nghệ đã tích hợp

✅ **Tailwind CSS** - Styled với theme IELTS (Navy #003A70 + Gold #FFD700)  
✅ **Zustand** - State management cho auth và app state  
✅ **React Query** - Data fetching và caching  
✅ **React Hook Form + Yup** - Form validation  
✅ **Plyr React** - Audio player với nhiều tính năng  
✅ **Recharts** - Data visualization  
✅ **React Hot Toast** - Notifications  
✅ **Axios** - HTTP client với interceptors

## 📱 Pages đã xây dựng

1. **/** - Trang chủ (Hero, Features, Testimonials, CTA)
2. **/sign-in** - Đăng nhập
3. **/register** - Đăng ký
4. **/courses** - Danh sách khóa học (Grid + Filters)
5. **/course/[id]** - Chi tiết khóa học + Units
6. **/course/[courseId]/unit/[unitId]** - Học Unit (Audio + Quiz)
7. **/course/[courseId]/unit/[unitId]/results** - Kết quả quiz
8. **/payment** - Thanh toán (VNPay/Momo)
9. **/payment/result** - Kết quả thanh toán
10. **/profile** - Hồ sơ người dùng (4 tabs)

## 🎯 Tính năng nổi bật

### Audio Player (Plyr.js)
- Tốc độ phát tùy chỉnh (0.5x - 1.5x)
- Ghi nhớ vị trí nghe
- Transcript ẩn/hiện
- Controls đầy đủ

### Quiz System
- Real-time validation
- Multiple choice + Text input
- Highlight đúng/sai
- Giải thích chi tiết
- Auto-save progress

### Charts & Analytics
- Line chart - Tiến bộ theo thời gian
- Bar chart - Phân bổ điểm số
- Summary cards - Thống kê tổng quan

### Payment Flow
- Select payment method
- Redirect to gateway
- Verify payment
- Show result

## 🎨 UI Components

Tất cả components trong `src/components/ui/`:
- `Button` - 4 variants (primary, accent, outline, ghost)
- `Card` - With hover effects
- `Badge` - 4 colors (primary, success, warning, error)
- `ProgressBar` - Animated with gradient
- `Input` - With error states
- `Modal` - Accessible dialog
- `Skeleton` - Loading states

## 🔧 API Integration

File `src/lib/api.js` chứa tất cả API calls:

```javascript
// Auth
authAPI.login(credentials)
authAPI.register(userData)
authAPI.getCurrentUser()

// Courses
catalogAPI.getBooks(filters)
catalogAPI.getBook(id)
catalogAPI.getUnits(bookId)

// Quiz
quizAPI.getQuestions(unitId)
quizAPI.submitAnswers(unitId, answers)
quizAPI.getResults(submissionId)

// Payment
paymentAPI.createOrder(bookId, method)
paymentAPI.checkOrderStatus(orderId)
paymentAPI.verifyPayment(params)
```

## 🔐 Authentication Flow

1. User login → API returns tokens
2. Tokens stored in **httpOnly cookies** (secure)
3. Axios interceptor auto-attach tokens
4. Auto refresh when token expires
5. Zustand store manages user state

## 📝 State Management

### Zustand Stores

**authStore.js**
- user
- isAuthenticated
- setUser()
- logout()

**appStore.js**
- isLoading
- Modal states
- Audio progress

### React Query
- Automatic caching
- Background refetching
- Optimistic updates
- Error handling

## 🎨 Tailwind Config

Custom theme colors:
```javascript
primary: '#003A70' // Navy Blue
accent: '#FFD700'  // Gold
success: '#10B981'
error: '#EF4444'
warning: '#F59E0B'
```

Custom animations:
- `animate-fade-in`
- `animate-slide-up`
- `animate-shimmer` (skeleton)

## 🚨 Troubleshooting

### CORS Issues
Backend phải enable CORS cho `http://localhost:3000`

### API Connection Failed
Kiểm tra:
1. Backend đang chạy ở `http://localhost:8000`
2. `.env.local` có đúng URL không
3. Network tab trong DevTools

### Plyr không hiển thị
Đảm bảo đã import CSS trong AudioPlayer.jsx:
```javascript
import 'plyr-react/plyr.css';
```

### Build Error
Clear cache và reinstall:
```bash
rm -rf .next node_modules
npm install
npm run dev
```

## 📚 Tài liệu tham khảo

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Query](https://tanstack.com/query/latest)
- [Zustand](https://docs.pmnd.rs/zustand)
- [Plyr](https://github.com/sampotts/plyr)

## 🎯 Next Steps

Sau khi setup xong frontend, bạn cần:

1. **Chạy Backend**: Đảm bảo Django backend đang chạy
2. **Tạo dữ liệu mẫu**: Populate courses, units, questions
3. **Test các tính năng**:
   - Đăng ký/Đăng nhập
   - Browse courses
   - Học Unit
   - Submit quiz
   - Xem results
   - Thanh toán

Enjoy coding! 🎉

