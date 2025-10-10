'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { paymentAPI } from '@/lib/api';
import { Button, Skeleton } from '@/components/ui';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';

export default function PaymentResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // VNPay/MoMo may send different param names
  const orderId = searchParams.get('order_id') || searchParams.get('orderId');
  const vnpayResponseCode = searchParams.get('vnp_ResponseCode');
  const momoResultCode = searchParams.get('resultCode');
  
  // Get order details
  const { data: ordersResponse, isLoading } = useQuery({
    queryKey: ['orders', orderId],
    queryFn: async () => {
      const response = await paymentAPI.getOrders({});
      return response.data;
    },
    enabled: !!orderId,
    refetchInterval: (data) => {
      // Keep refetching if order is still pending
      const orders = data?.results || [];
      const order = orders[0];
      return order?.status === 'pending' ? 3000 : false;
    },
  });

  // Find the order from the list (latest order or matching ID)
  const order = ordersResponse?.results?.[0];

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md w-full px-4">
            <div className="bg-white rounded-xl shadow-card p-8 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Đang kiểm tra thanh toán...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const isSuccess = order?.status === 'paid';
  const isPending = order?.status === 'pending';
  const isFailed = order?.status === 'failed' || order?.status === 'cancelled';

  return (
    <MainLayout>
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md w-full px-4">
        <div className="bg-white rounded-xl shadow-card p-8">
          {/* Success */}
          {isSuccess && (
            <div className="text-center">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Thanh toán thành công!</h1>
              <p className="text-gray-600 mb-8">
                Cảm ơn bạn đã mua khóa học. Bạn có thể bắt đầu học ngay bây giờ.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-semibold text-gray-900">{order.order_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Khóa học:</span>
                  <span className="font-semibold text-gray-900">{order.book?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-semibold text-primary">{parseFloat(order.amount || 0).toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phương thức:</span>
                  <span className="font-semibold text-gray-900">
                    {order.provider === 'vnpay' ? 'VNPay' : 'MoMo'}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Link href={`/course/${order.book?.slug || order.book?.id}`} className="block">
                  <Button variant="primary" className="w-full">
                    Bắt đầu học ngay 🚀
                  </Button>
                </Link>
                <Link href="/courses" className="block">
                  <Button variant="outline" className="w-full">
                    Xem khóa học khác
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Pending */}
          {isPending && (
            <div className="text-center">
              <div className="w-20 h-20 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Đang xử lý...</h1>
              <p className="text-gray-600 mb-8">
                Đơn hàng của bạn đang được xử lý. Vui lòng đợi trong giây lát.
              </p>
              <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
                Làm mới trang
              </Button>
            </div>
          )}

          {/* Failed */}
          {isFailed && (
            <div className="text-center">
              <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Thanh toán thất bại</h1>
              <p className="text-gray-600 mb-8">
                Rất tiếc, thanh toán của bạn không thành công. Vui lòng thử lại.
              </p>

              {order?.error_message && (
                <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-6">
                  <p className="text-sm text-error">{order.error_message}</p>
                </div>
              )}

              <div className="space-y-3">
                <Link href={`/payment?course=${order?.book?.slug || order?.book?.id}`} className="block">
                  <Button variant="primary" className="w-full">
                    Thử lại
                  </Button>
                </Link>
                <Link href="/courses" className="block">
                  <Button variant="outline" className="w-full">
                    Về trang khóa học
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* No order found */}
          {!order && (
            <div className="text-center">
              <div className="text-6xl mb-4">❓</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy đơn hàng</h1>
              <p className="text-gray-600 mb-6">
                Không thể tìm thấy thông tin đơn hàng. Vui lòng kiểm tra lại.
              </p>
              <Link href="/courses">
                <Button variant="primary">Về trang khóa học</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
    </MainLayout>
  );
}

