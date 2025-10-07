'use client';

import { useState } from 'react';
import CourseCard from '@/components/ui/CourseCard';
import { mockUser, mockCourses } from '@/lib/data';
import { 
  User, Edit3, BookOpen, Trophy, Clock, Settings, Lock, Bell, CreditCard, Download, Star, Calendar, BarChart3
} from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(mockUser);

  const enrolledCourses = mockCourses.filter(course => 
    userData.enrolledCourses.includes(course.id)
  );

  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
    { id: 'courses', label: 'Khóa học của tôi', icon: BookOpen },
    { id: 'certificates', label: 'Chứng chỉ', icon: Trophy },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: BookOpen, value: enrolledCourses.length, label: 'Khóa học', color: 'bg-blue-100 text-blue-600' },
          { icon: Trophy, value: '3', label: 'Chứng chỉ', color: 'bg-green-100 text-green-600' },
          { icon: Clock, value: '45', label: 'Giờ học', color: 'bg-yellow-100 text-yellow-600' },
          { icon: Star, value: '8.7', label: 'Điểm TB', color: 'bg-purple-100 text-purple-600' },
        ].map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className={`p-3 ${stat.color} rounded-lg`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { action: 'Hoàn thành bài học', course: 'JavaScript cơ bản', time: '2 giờ trước' },
              { action: 'Bắt đầu khóa học', course: 'React.js Thực Chiến', time: '1 ngày trước' },
              { action: 'Nhận chứng chỉ', course: 'HTML & CSS', time: '3 ngày trước' },
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{item.action}</span> - {item.course}
                  </p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Progress */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Tiến độ học tập</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {course.title.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{course.title}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{course.progress}% hoàn thành</span>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-primary-600 h-2.5 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  {course.progress === 100 ? 'Hoàn thành' : 'Đang học'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Khóa học của tôi</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm">
            Tất cả
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm">
            Đang học
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm">
            Hoàn thành
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledCourses.map((course) => (
          <div key={course.id} className="relative">
            <CourseCard course={course} />
            <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
              Đang học
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCertificates = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Chứng chỉ của tôi</h2>
        <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm">
          Tải lên chứng chỉ
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mock certificate items */}
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  CT
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Chứng chỉ khóa học</p>
                  <p className="text-xs text-gray-500">JavaScript cơ bản</p>
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                Ngày cấp: 01/01/2024
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <button className="flex items-center space-x-1 text-primary-600 hover:underline">
                <Download className="w-4 h-4" />
                <span>Tải xuống</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-600 hover:text-primary-600">
                <Lock className="w-4 h-4" />
                <span>Bảo mật</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt tài khoản</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
            <input 
              type="text" 
              value={userData.name} 
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary-500 focus:outline-none"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              value={userData.email} 
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary-500 focus:outline-none"
              disabled
            />
          </div>
        </div>

        <div className="mt-4">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            {isEditing ? 'Lưu thay đổi' : 'Chỉnh sửa'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt bảo mật</h3>
        
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
          <input 
            type="password" 
            className="px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary-500 focus:outline-none"
          />
        </div>

        <div className="mt-4">
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'courses': return renderCourses();
      case 'certificates': return renderCertificates();
      case 'settings': return renderSettings();
      default: return renderOverview();
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {userData.name.charAt(0)}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{userData.name}</h1>
              <p className="text-gray-600 mb-4">{userData.email}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4 text-primary-500" />
                  <span className="text-gray-700">{enrolledCourses.length} khóa học</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-gray-700">3 chứng chỉ</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700">Tham gia từ 2024</span>
                </div>
              </div>
            </div>

            <button className="btn-primary flex items-center space-x-2">
              <Edit3 className="w-4 h-4" />
              <span>Chỉnh sửa hồ sơ</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-xl shadow-sm border p-4">
              <ul className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <li key={tab.id}>
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                          activeTab === tab.id
                            ? 'bg-primary-50 text-primary-700 border border-primary-200'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;