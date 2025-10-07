'use client';

import Link from 'next/link';
import { Home, Search, ArrowLeft, BookOpen, HelpCircle } from 'lucide-react';

const NotFoundPage = () => {
  const popularCourses = [
    { id: '1', title: 'JavaScript từ cơ bản đến nâng cao', students: '5.2K', price: '599K' },
    { id: '2', title: 'React.js Thực Chiến', students: '3.1K', price: '799K' },
    { id: '3', title: 'Tiếng Anh Giao Tiếp Cơ Bản', students: '8.5K', price: '450K' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            <div className="text-9xl font-bold text-gray-200 select-none text-center">404</div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
                  <HelpCircle className="w-12 h-12 text-white" />
                </div>
                
                <div className="absolute -top-4 -left-8 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -top-2 -right-6 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '0.5s' }}>
                  <Search className="w-3 h-3 text-white" />
                </div>
                <div className="absolute -bottom-2 -left-4 w-10 h-10 bg-red-400 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '1s' }}>
                  <span className="text-white text-xs font-bold">?</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            Oops! Trang không tồn tại
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed text-center">
            Trang bạn đang tìm kiếm có thể đã được di chuyển, đổi tên hoặc không tồn tại.
          </p>
        </div>

        {/* Suggestions */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Bạn có thể thử:
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary-600 text-sm font-semibold">1</span>
              </div>
              <span className="text-gray-700">Kiểm tra lại URL xem có lỗi chính tả không</span>
            </li>
            <li className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary-600 text-sm font-semibold">2</span>
              </div>
              <span className="text-gray-700">Quay lại trang trước đó bằng nút &quot;Back&quot; của trình duyệt</span>
            </li>
            <li className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary-600 text-sm font-semibold">3</span>
              </div>
              <span className="text-gray-700">Tìm kiếm khóa học bạn đang quan tâm</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link 
            href="/"
            className="w-full bg-primary-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-600 transition-colors inline-flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Về trang chủ</span>
          </Link>
          
          <div className="flex space-x-4">
            <Link 
              href="/courses"
              className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center space-x-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Khóa học</span>
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-center space-x-2 text-blue-700 mb-2">
            <HelpCircle className="w-5 h-5" />
            <span className="font-semibold">Cần trợ giúp?</span>
          </div>
          <p className="text-sm text-blue-600 mb-3 text-center">
            Nếu bạn tin rằng đây là lỗi hệ thống, vui lòng liên hệ với chúng tôi.
          </p>
          <div className="space-y-1 text-sm text-blue-600 text-center">
            <p>📧 Email: support@learncourse.vn</p>
            <p>📞 Hotline: +84 123 456 789</p>
          </div>
        </div>

        {/* Popular Courses */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Khóa học phổ biến
          </h3>
          <div className="space-y-3">
            {popularCourses.map((course) => (
              <Link 
                key={course.id}
                href={`/course/${course.id}`}
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                      {course.title}
                    </h4>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-600">{course.students} học viên</span>
                      <span className="text-sm font-semibold text-primary-600">{course.price} VNĐ</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;