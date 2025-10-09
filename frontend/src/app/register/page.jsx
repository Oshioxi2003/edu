import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';

export const metadata = {
  title: 'Đăng ký - IELTS Listening Platform',
  description: 'Tạo tài khoản mới để bắt đầu học IELTS Listening',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-2xl text-white font-bold">🎧</span>
              </div>
              <span className="text-2xl font-bold text-primary">IELTS Listening</span>
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Tạo tài khoản mới</h2>
          <p className="mt-2 text-gray-600">Bắt đầu hành trình chinh phục IELTS Listening</p>
        </div>

        {/* Register Form Card */}
        <div className="bg-white rounded-xl shadow-card p-8">
          <RegisterForm />
        </div>

        {/* Benefits */}
        <div className="mt-8 bg-white rounded-xl shadow-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quyền lợi khi đăng ký
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 text-success flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">Truy cập hàng trăm bài Listening chuẩn IELTS</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 text-success flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">Theo dõi tiến độ học tập chi tiết</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 text-success flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">Chấm điểm tự động và phân tích kết quả</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 text-success flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">Học mọi lúc, mọi nơi trên mọi thiết bị</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
