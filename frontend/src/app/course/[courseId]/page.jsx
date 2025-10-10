'use client';

import { use } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useCourse, useCourseUnits } from '@/hooks/useCourses';
import { useAuth } from '@/hooks/useAuth';
import UnitCard from '@/components/course/UnitCard';
import { Button, Badge, ProgressBar, Skeleton } from '@/components/ui';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

export default function CourseDetailPage({ params }) {
  const { courseId } = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const { data: course, isLoading: courseLoading } = useCourse(courseId);
  const { data: units, isLoading: unitsLoading } = useCourseUnits(courseId);

  const handlePurchase = () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để mua khóa học');
      router.push('/sign-in');
      return;
    }
    router.push(`/payment?course=${courseId}`);
  };

  if (courseLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-64 mb-8" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Backend uses `is_owned` field
  const isPurchased = course?.is_owned;
  const overallProgress = course?.progress_pct || 0;
  const isFree = course?.price === "0.00" || course?.price === 0;

  return (
    <MainLayout>
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-gradient-to-br from-primary to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Course Info */}
            <div className="lg:col-span-2">
              <Link href="/courses" className="inline-flex items-center gap-2 text-primary-100 hover:text-white mb-4 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại danh sách
              </Link>

              <div className="flex items-center gap-3 mb-4">
                <Badge variant={course?.level === 'beginner' ? 'success' : course?.level === 'intermediate' ? 'warning' : 'error'}>
                  {course?.level === 'beginner' ? 'Cơ bản' : course?.level === 'intermediate' ? 'Trung cấp' : 'Nâng cao'}
                </Badge>
                {isPurchased && (
                  <Badge variant="success">Đã sở hữu</Badge>
                )}
              </div>

              <h1 className="text-4xl font-bold mb-4">{course?.title}</h1>
              <p className="text-xl text-primary-100 mb-6">{course?.description}</p>

              <div className="flex flex-wrap gap-6 text-primary-100">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>{course?.unit_count || 0} Units</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>1.2K+ học viên</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>4.9 (520 đánh giá)</span>
                </div>
              </div>
            </div>

            {/* Right: Purchase Card */}
            {!isPurchased && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl p-6 shadow-xl">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {isFree ? 'Miễn phí' : `${parseFloat(course?.price || 0).toLocaleString('vi-VN')}đ`}
                    </div>
                    {!isFree && (
                      <div className="text-sm text-gray-500 line-through">
                        {(parseFloat(course?.price || 0) * 1.5).toLocaleString('vi-VN')}đ
                      </div>
                    )}
                  </div>

                  <Button 
                    variant="accent" 
                    className="w-full mb-4"
                    onClick={handlePurchase}
                  >
                    {isFree ? 'Bắt đầu học ngay' : 'Mua khóa học'}
                  </Button>

                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Truy cập trọn đời</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Chấm điểm tự động</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Học trên mọi thiết bị</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Theo dõi tiến độ chi tiết</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Overall Progress */}
          {isPurchased && overallProgress > 0 && (
            <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Tiến độ khóa học</h3>
                <span className="text-accent text-lg font-bold">{overallProgress}%</span>
              </div>
              <div className="progress-bar h-3">
                <div 
                  className="progress-fill" 
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Units List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Danh sách Units ({course?.units?.length || units?.length || 0})
        </h2>

        {unitsLoading || courseLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : (course?.units || units)?.length > 0 ? (
          <div className="space-y-4">
            {(course?.units || units).map((unit) => (
              <UnitCard
                key={unit.id}
                unit={unit}
                courseId={courseId}
                isLocked={!isPurchased && !unit.is_free}
                progress={unit.progress}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Chưa có Unit nào
            </h3>
            <p className="text-gray-600">
              Khóa học đang được cập nhật nội dung
            </p>
          </div>
        )}
      </div>
    </div>
    </MainLayout>
  );
}

