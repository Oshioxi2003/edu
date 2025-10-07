'use client';

import CourseCard from '@/components/ui/CourseCard';
import { mockCourses, getFeaturedCourses } from '@/lib/data';
import { Search, BookOpen, Users, Trophy, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';

const Home = () => {
  const featuredCourses = getFeaturedCourses();
  const popularCourses = mockCourses.slice(0, 6);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Học tập không giới hạn
              <span className="block text-yellow-300">cùng LearnCourse</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Khám phá hàng ngàn khóa học chất lượng cao từ các chuyên gia hàng đầu
            </p>

            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Bạn muốn học gì hôm nay?"
                  className="w-full pl-12 pr-6 py-4 text-lg rounded-xl border-0 shadow-lg focus:outline-none focus:ring-4 focus:ring-white/20 text-gray-800"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors">
                  Tìm kiếm
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses" className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-lg">
                Khám phá khóa học
              </Link>
              <Link href="/register" className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-colors text-lg">
                Đăng ký miễn phí
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: BookOpen, value: '1,000+', label: 'Khóa học', color: 'bg-primary-500' },
              { icon: Users, value: '50,000+', label: 'Học viên', color: 'bg-green-500' },
              { icon: Trophy, value: '100+', label: 'Giảng viên', color: 'bg-yellow-500' },
              { icon: Star, value: '4.8', label: 'Đánh giá trung bình', color: 'bg-red-500' },
            ].map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className={`${stat.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Featured Courses */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Khóa học nổi bật</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những khóa học được đánh giá cao nhất bởi cộng đồng học viên
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          <div className="text-center">
            <Link href="/courses" className="inline-flex items-center space-x-2 bg-primary-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors">
              <span>Xem tất cả khóa học</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Danh mục khóa học</h2>
            <p className="text-xl text-gray-600">Chọn lĩnh vực bạn muốn phát triển</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Lập trình', icon: '💻', count: 245, color: 'bg-blue-500' },
              { name: 'Ngoại ngữ', icon: '🌍', count: 180, color: 'bg-green-500' },
              { name: 'Kinh doanh', icon: '📊', count: 120, color: 'bg-purple-500' },
              { name: 'Thiết kế', icon: '🎨', count: 95, color: 'bg-pink-500' },
              { name: 'Marketing', icon: '📈', count: 87, color: 'bg-orange-500' },
              { name: 'Nhiếp ảnh', icon: '📸', count: 65, color: 'bg-indigo-500' },
            ].map((category) => (
              <Link 
                key={category.name}
                href={`/courses?category=${category.name.toLowerCase()}`}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center group cursor-pointer"
              >
                <div className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl group-hover:scale-110 transition-transform`}>
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.count} khóa học</p>
              </Link>
            ))}
          </div>
        </div>
      </section> */}

      {/* Popular Courses */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Khóa học phổ biến</h2>
            <p className="text-xl text-gray-600">Được nhiều học viên lựa chọn nhất</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Sẵn sàng bắt đầu hành trình học tập?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Tham gia cộng đồng học viên và giảng viên tài năng. Học tập linh hoạt, tiến bộ nhanh chóng.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-lg">
              Đăng ký ngay
            </Link>
            <Link href="/courses" className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-colors text-lg">
              Duyệt khóa học
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
