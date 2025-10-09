'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { useUserProgress } from '@/hooks/useCourses';
import { useQuery } from '@tanstack/react-query';
import { paymentAPI } from '@/lib/api';
import { Card, CardBody, Button, Badge, ProgressBar, Skeleton } from '@/components/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('courses');

  const { data: progress, isLoading: progressLoading } = useUserProgress();
  const { data: paymentHistory, isLoading: paymentsLoading } = useQuery({
    queryKey: ['payment-history'],
    queryFn: async () => {
      const response = await paymentAPI.getPaymentHistory();
      return response.data;
    },
  });

  if (!isAuthenticated) {
    router.push('/sign-in');
    return null;
  }

  const tabs = [
    { id: 'courses', label: 'Khóa học của tôi', icon: '📚' },
    { id: 'results', label: 'Kết quả học tập', icon: '📊' },
    { id: 'payments', label: 'Lịch sử thanh toán', icon: '💳' },
    { id: 'settings', label: 'Cài đặt', icon: '⚙️' },
  ];

  return (
    <MainLayout>
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-primary to-primary-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center text-4xl border-4 border-white/30">
              {user?.avatar || '👤'}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{user?.full_name || 'User'}</h1>
              <p className="text-primary-100">{user?.email}</p>
              <div className="flex items-center gap-4 mt-3">
                <Badge variant="success">Thành viên</Badge>
                <span className="text-sm text-primary-100">
                  Tham gia từ {new Date(user?.created_at || Date.now()).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {/* My Courses Tab */}
          {activeTab === 'courses' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Khóa học của tôi</h2>
              {progressLoading ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-48" />
                  ))}
                </div>
              ) : progress?.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {progress.map((item) => (
                    <Card key={item.book_id} hover>
                      <CardBody>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                              {item.book_title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {item.completed_units}/{item.total_units} Units hoàn thành
                            </p>
                          </div>
                          <Badge variant={
                            item.progress_pct === 100 ? 'success' :
                            item.progress_pct > 0 ? 'warning' :
                            'primary'
                          }>
                            {item.progress_pct === 100 ? 'Hoàn thành' : 
                             item.progress_pct > 0 ? 'Đang học' : 
                             'Chưa bắt đầu'}
                          </Badge>
                        </div>
                        
                        <ProgressBar progress={item.progress_pct} className="mb-4" />
                        
                        <Link href={`/course/${item.book_id}`}>
                          <Button variant="primary" className="w-full">
                            {item.progress_pct > 0 ? 'Tiếp tục học' : 'Bắt đầu học'}
                          </Button>
                        </Link>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardBody className="text-center py-12">
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Chưa có khóa học nào
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Khám phá và đăng ký khóa học để bắt đầu học tập
                    </p>
                    <Link href="/courses">
                      <Button variant="primary">Khám phá khóa học</Button>
                    </Link>
                  </CardBody>
                </Card>
              )}
            </div>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Kết quả học tập</h2>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardBody className="text-center">
                    <div className="text-4xl mb-2">🎯</div>
                    <div className="text-3xl font-bold text-primary mb-1">
                      {progress?.filter(p => p.progress_pct === 100).length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Khóa học hoàn thành</div>
                  </CardBody>
                </Card>
                
                <Card>
                  <CardBody className="text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <div className="text-3xl font-bold text-primary mb-1">
                      {progress?.reduce((sum, p) => sum + p.completed_units, 0) || 0}
                    </div>
                    <div className="text-sm text-gray-600">Units đã hoàn thành</div>
                  </CardBody>
                </Card>
                
                <Card>
                  <CardBody className="text-center">
                    <div className="text-4xl mb-2">⭐</div>
                    <div className="text-3xl font-bold text-primary mb-1">
                      {progress?.length 
                        ? (progress.reduce((sum, p) => sum + (p.average_score || 0), 0) / progress.length).toFixed(1)
                        : 0}%
                    </div>
                    <div className="text-sm text-gray-600">Điểm trung bình</div>
                  </CardBody>
                </Card>
              </div>

              {progress?.length > 0 ? (
                <Card>
                  <CardBody>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Chi tiết theo khóa học</h3>
                    <div className="space-y-4">
                      {progress.map((item) => (
                        <div key={item.book_id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-gray-900">{item.book_title}</h4>
                            <Link href={`/course/${item.book_id}`}>
                              <Button variant="ghost" size="sm">
                                Xem chi tiết →
                              </Button>
                            </Link>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="text-gray-600 mb-1">Tiến độ</div>
                              <div className="font-semibold text-primary">{item.progress_pct}%</div>
                            </div>
                            <div>
                              <div className="text-gray-600 mb-1">Units hoàn thành</div>
                              <div className="font-semibold">{item.completed_units}/{item.total_units}</div>
                            </div>
                            <div>
                              <div className="text-gray-600 mb-1">Điểm TB</div>
                              <div className="font-semibold text-accent-700">{item.average_score || 0}%</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              ) : (
                <Card>
                  <CardBody className="text-center py-12">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Chưa có kết quả
                    </h3>
                    <p className="text-gray-600">
                      Bắt đầu học để xem kết quả của bạn
                    </p>
                  </CardBody>
                </Card>
              )}
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Lịch sử thanh toán</h2>
              {paymentsLoading ? (
                <Skeleton className="h-96" />
              ) : paymentHistory?.length > 0 ? (
                <Card>
                  <CardBody>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Mã đơn
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Khóa học
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Ngày
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Số tiền
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Trạng thái
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {paymentHistory.map((payment) => (
                            <tr key={payment.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                {payment.order_id}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700">
                                {payment.book_title}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {new Date(payment.created_at).toLocaleDateString('vi-VN')}
                              </td>
                              <td className="px-6 py-4 text-sm font-semibold text-primary">
                                {payment.amount?.toLocaleString('vi-VN')}đ
                              </td>
                              <td className="px-6 py-4">
                                <Badge variant={
                                  payment.status === 'completed' ? 'success' :
                                  payment.status === 'pending' ? 'warning' :
                                  'error'
                                }>
                                  {payment.status === 'completed' ? 'Thành công' :
                                   payment.status === 'pending' ? 'Đang xử lý' :
                                   'Thất bại'}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>
              ) : (
                <Card>
                  <CardBody className="text-center py-12">
                    <div className="text-6xl mb-4">💳</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Chưa có giao dịch
                    </h3>
                    <p className="text-gray-600">
                      Lịch sử thanh toán của bạn sẽ hiển thị ở đây
                    </p>
                  </CardBody>
                </Card>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Cài đặt tài khoản</h2>
              <div className="space-y-6">
                <Card>
                  <CardBody>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin cá nhân</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Họ và tên
                        </label>
                        <input
                          type="text"
                          className="input"
                          defaultValue={user?.full_name}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          className="input"
                          defaultValue={user?.email}
                          disabled
                        />
                      </div>
                      <Button variant="outline" disabled>
                        Cập nhật thông tin (Sắp có)
                      </Button>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Đổi mật khẩu</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mật khẩu hiện tại
                        </label>
                        <input type="password" className="input" placeholder="••••••••" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mật khẩu mới
                        </label>
                        <input type="password" className="input" placeholder="••••••••" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Xác nhận mật khẩu mới
                        </label>
                        <input type="password" className="input" placeholder="••••••••" />
                      </div>
                      <Button variant="outline" disabled>
                        Đổi mật khẩu (Sắp có)
                      </Button>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 text-error">Vùng nguy hiểm</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
                        <p className="text-sm text-gray-700 mb-4">
                          Đăng xuất khỏi tất cả các thiết bị và xóa dữ liệu đăng nhập.
                        </p>
                        <Button variant="outline" onClick={logout}>
                          Đăng xuất
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </MainLayout>
  );
}

