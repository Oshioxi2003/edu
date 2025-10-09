import MainLayout from '@/components/layout/MainLayout';
import HeroSection from '@/components/home/HeroSection';
import FeatureSection from '@/components/home/FeatureSection';
import TestimonialSection from '@/components/home/TestimonialSection';
import CTASection from '@/components/home/CTASection';

export const metadata = {
  title: 'IELTS Listening Platform - Luyện IELTS Listening Chuẩn Quốc Tế',
  description: 'Nền tảng học IELTS Listening trực tuyến hàng đầu với 500+ bài tập, chấm điểm tự động và theo dõi tiến độ chi tiết.',
};

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <FeatureSection />
      <TestimonialSection />
      <CTASection />
    </MainLayout>
  );
}
