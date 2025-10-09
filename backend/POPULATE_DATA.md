# Populate Demo Data

## Hướng dẫn tạo dữ liệu mẫu

Script này sẽ tạo:
- **10 Users** (student1@example.com đến student10@example.com)
- **10 Books** (các khóa học tiếng Anh khác nhau)
- **100 Units** (mỗi book có 10 units)
- **100 Assets** (audio files cho mỗi unit)
- **1000 Questions** (mỗi unit có 10 câu hỏi)
- **4000 Choices** (mỗi question có 4 lựa chọn)
- **Enrollments** (mỗi user đăng ký 3-7 khóa học ngẫu nhiên)
- **Attempts** (các lần làm quiz với kết quả)

## Cách chạy

### Cách 1: Sử dụng Python trực tiếp

```powershell
# Trong thư mục backend
cd backend
.\.venv\Scripts\python.exe populate_data.py
```

### Cách 2: Sử dụng Django Management Command

```powershell
# Trong thư mục backend
cd backend
.\.venv\Scripts\python.exe manage.py populate_demo_data --books 10 --units-per-book 10 --questions-per-unit 10 --users 10
```

## Thông tin đăng nhập

Sau khi chạy script, bạn có thể đăng nhập với các tài khoản sau:

**Students:**
- Email: `student1@example.com` đến `student10@example.com`
- Password: `password123`

**Admin:**
- Sử dụng tài khoản admin đã tạo trước đó

## Xóa dữ liệu demo

Nếu muốn xóa dữ liệu demo và tạo lại, uncomment dòng `clear_data()` trong file `populate_data.py`:

```python
def main():
    # ...
    clear_data()  # Bỏ comment dòng này
    # ...
```

## Tùy chỉnh

Bạn có thể chỉnh sửa các thông số trong file `populate_data.py`:

```python
# Thay đổi số lượng
users = create_users(10)        # Số users
books = create_books(10, 10, 10)  # (số books, units/book, questions/unit)
```

## Lưu ý

- Script tạo dữ liệu mẫu, không tạo file audio thực tế
- Assets chỉ có metadata, không có file thực
- Tất cả password đều là `password123`
- 2 units đầu tiên của mỗi book là miễn phí
- 2/3 books được publish, 1/3 là draft

