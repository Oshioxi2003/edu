'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { paymentAPI } from '@/lib/api';
import { useCourse } from '@/hooks/useCourses';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardBody, Button, Badge } from '@/components/ui';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('course');
  const { isAuthenticated } = useAuth();
  
  const [paymentMethod, setPaymentMethod] = useState('vnpay');
  
  const { data: course } = useCourse(courseId);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thanh toán');
      router.push('/sign-in');
    }
  }, [isAuthenticated, router]);

  const createOrderMutation = useMutation({
    mutationFn: async ({ bookId, provider }) => {
      // Step 1: Create order
      const orderResponse = await paymentAPI.createOrder(bookId, provider);
      const order = orderResponse.data;
      
      // Step 2: Create checkout URL
      let checkoutResponse;
      if (provider === 'vnpay') {
        checkoutResponse = await paymentAPI.createVNPayCheckout(order.id);
        return { paymentUrl: checkoutResponse.data.payment_url };
      } else if (provider === 'momo') {
        checkoutResponse = await paymentAPI.createMoMoCheckout(order.id);
        return { paymentUrl: checkoutResponse.data.pay_url };
      }
      
      return order;
    },
    onSuccess: (data) => {
      if (data.paymentUrl) {
        // Redirect to payment gateway
        window.location.href = data.paymentUrl;
      } else {
        toast.success('Đơn hàng đã được tạo');
      }
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 'Có lỗi xảy ra khi tạo đơn hàng';
      toast.error(errorMessage);
    },
  });

  const handlePayment = () => {
    if (!paymentMethod) {
      toast.error('Vui lòng chọn phương thức thanh toán');
      return;
    }
    if (!course?.id) {
      toast.error('Không tìm thấy thông tin khóa học');
      return;
    }
    createOrderMutation.mutate({ bookId: course.id, provider: paymentMethod });
  };

  if (!course) {
    return <div>Đang tải...</div>;
  }

  return (
    <MainLayout>
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Thanh toán</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Info */}
            <Card>
              <CardBody>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin khóa học</h2>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg flex items-center justify-center text-3xl">
                    📚
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-600">{course.unit_count || 0} Units</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {parseFloat(course.price || 0).toLocaleString('vi-VN')}đ
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardBody>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Phương thức thanh toán</h2>
                <div className="space-y-3">
                  {/* VNPay */}
                  <label
                    className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === 'vnpay'
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="payment_method"
                        value="vnpay"
                        checked={paymentMethod === 'vnpay'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-primary focus:ring-primary-500"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">VNPay</div>
                        <div className="text-sm text-gray-600">Thanh toán qua cổng VNPay</div>
                      </div>
                      <div className="w-16 h-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">
                        VNPAY
                      </div>
                    </div>
                  </label>

                  {/* Momo */}
                  <label
                    className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === 'momo'
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="payment_method"
                        value="momo"
                        checked={paymentMethod === 'momo'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-primary focus:ring-primary-500"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">Momo</div>
                        <div className="text-sm text-gray-600">Thanh toán qua ví Momo</div>
                      </div>
                      <div className="w-16 h-10 bg-pink-600 rounded flex items-center justify-center text-white font-bold text-sm">
                        MoMo
                      </div>
                    </div>
                  </label>

                  {/* Bank Transfer (disabled for now) */}
                  <label className="block p-4 rounded-lg border-2 border-gray-200 opacity-50 cursor-not-allowed">
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        disabled
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">Chuyển khoản ngân hàng</div>
                        <div className="text-sm text-gray-600">Đang cập nhật</div>
                      </div>
                      <Badge variant="warning">Sắp có</Badge>
                    </div>
                  </label>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardBody>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>
                
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Giá khóa học</span>
                    <span>{parseFloat(course.price || 0).toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Giảm giá</span>
                    <span className="text-success">-0đ</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Phí thanh toán</span>
                    <span>0đ</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{parseFloat(course.price || 0).toLocaleString('vi-VN')}đ</span>
                </div>

                <Button
                  onClick={handlePayment}
                  variant="primary"
                  className="w-full"
                  isLoading={createOrderMutation.isPending}
                >
                  Thanh toán ngay
                </Button>

                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Thanh toán an toàn & bảo mật</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Hoàn tiền 100% trong 7 ngày</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Truy cập trọn đời</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </MainLayout>
  );
}

