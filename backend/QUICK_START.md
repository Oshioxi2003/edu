# ⚡ Quick Start - EduPlatform Admin Dashboard

## 🚀 Cài Đặt Nhanh (5 phút)

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements/base.txt
```

### 2. Run Setup Script
```bash
python setup_admin.py
```

Script này sẽ tự động:
- ✅ Check packages installed
- ✅ Run migrations
- ✅ Collect static files
- ✅ Verify admin files
- ✅ Create superuser (nếu chưa có)

### 3. Start Server
```bash
python manage.py runserver
```

### 4. Access Admin
```
http://localhost:8000/admin/
```

Login với superuser vừa tạo.

---

## 📋 Workflow Đầu Tiên

### Tạo sách đầu tiên:

**1. Create Book**
- Vào: Catalog Management > Books > Add Book
- Title: "My First Course"
- Price: 199000
- Is Published: ❌ (chưa tick)

**2. Add Units (Inline)**
- Scroll down → Click "Add another Unit" × 3
- Unit 1: "Introduction" - Order: 1 - Free: ✅
- Unit 2: "Lesson 1" - Order: 2 - Free: ❌
- Unit 3: "Lesson 2" - Order: 3 - Free: ❌
- Save

**3. Edit Unit 1**
- Click Unit 1
- Upload Audio: Choose MP3 file
- Add Question:
  - Type: Single Choice
  - Text: "What is the main topic?"
  - Add 4 Choices:
    - A: "Choice 1" ❌
    - B: "Choice 2" ✅ (tick is_correct)
    - C: "Choice 3" ❌
    - D: "Choice 4" ❌
- Save → Check green ✓

**4. Publish**
- Back to Books list
- Select your book
- Actions → "Publish selected books"
- Done! 🎉

---

## 🎯 Tính Năng Nổi Bật

### ⚡ Fast Input
- Nested editing (Unit → Question → Choice)
- Drag & drop sorting
- Bulk actions
- Keyboard shortcuts (Ctrl+S)

### 🛡️ Smart Validation
- Real-time check SINGLE/MULTI choice
- Color-coded warnings
- Visual indicators

### 🔒 Media Security
- Protected assets
- Signed URLs (5-min expiry)
- Auto-extract metadata

### 📊 Dashboard
- Quick stats
- Revenue tracking
- Color-coded status

---

## 📚 Documentation

- **ADMIN_DASHBOARD_GUIDE.md** - Hướng dẫn chi tiết (Vietnamese)
- **ADMIN_FEATURES.md** - Feature list & technical specs

---

## 🆘 Troubleshooting

### Nested admin không hiển thị?
```bash
# Check URLs
cat config/urls.py | grep nested
# Should see: path('admin/', include('nested_admin.urls'))
```

### CSS/JS không load?
```bash
python manage.py collectstatic --noinput
```

### Validation không chạy?
- F12 → Check Console for JavaScript errors
- Ensure `static/admin/js/custom_admin.js` exists

---

## ✅ Quick Checklist

- [ ] Dependencies installed (`pip install -r requirements/base.txt`)
- [ ] Migrations run (`python manage.py migrate`)
- [ ] Static collected (`python manage.py collectstatic`)
- [ ] Superuser created
- [ ] Server running
- [ ] Admin accessible at `/admin/`
- [ ] Can create Book with nested Units
- [ ] Can add Questions with Choices
- [ ] Validation showing ✓/✗
- [ ] Drag & drop working

---

**Need help?** Read full guide in `ADMIN_DASHBOARD_GUIDE.md`

🎉 **Happy Content Creating!**

