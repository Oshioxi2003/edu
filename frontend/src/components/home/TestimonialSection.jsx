'use client';

import { Card, CardBody } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';

const testimonials = [
  {
    id: 1,
    name: 'Nguyễn Minh Anh',
    avatar: '👩‍🎓',
    score: 'Band 8.0',
    content: 'Nền tảng tuyệt vời! Các bài tập rất đa dạng và sát với đề thi thật. Tôi đã cải thiện điểm Listening từ 6.5 lên 8.0 chỉ sau 2 tháng.',
    course: 'Cambridge IELTS 18',
  },
  {
    id: 2,
    name: 'Trần Văn Minh',
    avatar: '👨‍💼',
    score: 'Band 7.5',
    content: 'Hệ thống chấm điểm tự động rất nhanh và chính xác. Tính năng theo dõi tiến độ giúp tôi dễ dàng nhận biết điểm yếu để cải thiện.',
    course: 'IELTS Essential',
  },
  {
    id: 3,
    name: 'Lê Thị Hương',
    avatar: '👩‍🏫',
    score: 'Band 8.5',
    content: 'Audio chất lượng cao, giọng đọc chuẩn. Transcript rất hữu ích để kiểm tra lại sau khi làm bài. Highly recommended!',
    course: 'Advanced Listening',
  },
];

export default function TestimonialSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('home.testimonials.title')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('home.testimonials.subtitle')}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="h-full">
              <CardBody className="flex flex-col">
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-accent dark:text-accent-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-700 dark:text-gray-300 mb-6 flex-1 italic">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.course}</div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 bg-success dark:bg-success/90 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {testimonial.score}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

