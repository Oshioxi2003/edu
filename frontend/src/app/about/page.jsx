'use client';

import MainLayout from '@/components/layout/MainLayout';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardBody, Button } from '@/components/ui';

export default function AboutPage() {
  const { t } = useTranslation();

  const teamMembers = [
    {
      id: 1,
      name: 'Nguyễn Minh Anh',
      role: 'CEO & Founder',
      avatar: '👩‍💼',
      bio: 'Chuyên gia IELTS với 10+ năm kinh nghiệm, từng giảng dạy tại các trường đại học hàng đầu.',
      expertise: ['IELTS Expert', 'Education Technology', 'Team Leadership']
    },
    {
      id: 2,
      name: 'Trần Văn Minh',
      role: 'CTO',
      avatar: '👨‍💻',
      bio: 'Kỹ sư phần mềm với chuyên môn về AI và Machine Learning, phát triển hệ thống chấm điểm tự động.',
      expertise: ['AI/ML', 'Full-stack Development', 'System Architecture']
    },
    {
      id: 3,
      name: 'Lê Thị Hương',
      role: 'Head of Education',
      avatar: '👩‍🏫',
      bio: 'Thạc sĩ Ngôn ngữ học, chuyên gia thiết kế chương trình học IELTS hiệu quả.',
      expertise: ['Curriculum Design', 'Language Assessment', 'Teacher Training']
    },
    {
      id: 4,
      name: 'Phạm Đức Thành',
      role: 'Lead Developer',
      avatar: '👨‍🔧',
      bio: 'Chuyên gia phát triển frontend với kinh nghiệm xây dựng các ứng dụng học tập tương tác.',
      expertise: ['React/Next.js', 'UI/UX Design', 'Performance Optimization']
    }
  ];

  const stats = [
    { number: '10,000+', label: t('about.stats.students') },
    { number: '500+', label: t('about.stats.exercises') },
    { number: '95%', label: t('about.stats.successRate') },
    { number: '4.9/5', label: t('about.stats.rating') }
  ];

  const values = [
    {
      icon: '🎯',
      title: t('about.values.quality.title'),
      description: t('about.values.quality.description')
    },
    {
      icon: '🚀',
      title: t('about.values.innovation.title'),
      description: t('about.values.innovation.description')
    },
    {
      icon: '🤝',
      title: t('about.values.support.title'),
      description: t('about.values.support.description')
    },
    {
      icon: '📈',
      title: t('about.values.results.title'),
      description: t('about.values.results.description')
    }
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-primary-700 dark:from-primary-800 dark:to-primary-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {t('about.hero.title')}
              </h1>
              <p className="text-xl text-primary-100 dark:text-primary-200 max-w-3xl mx-auto">
                {t('about.hero.subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary dark:text-primary-400 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  {t('about.mission.title')}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  {t('about.mission.description')}
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('about.mission.point1')}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('about.mission.point2')}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('about.mission.point3')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900 dark:to-accent-900 rounded-2xl p-8">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎯</div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {t('about.mission.target')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('about.mission.targetDescription')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t('about.values.title')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {t('about.values.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center">
                  <CardBody>
                    <div className="text-4xl mb-4">{value.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {value.description}
                    </p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t('about.team.title')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {t('about.team.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member) => (
                <Card key={member.id} className="text-center">
                  <CardBody>
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900 dark:to-accent-900 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                      {member.avatar}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {member.name}
                    </h3>
                    <p className="text-primary dark:text-primary-400 font-semibold mb-3">
                      {member.role}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {member.bio}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {member.expertise.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary dark:text-primary-400 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary to-primary-700 dark:from-primary-800 dark:to-primary-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t('about.cta.title')}
            </h2>
            <p className="text-lg md:text-xl text-primary-100 dark:text-primary-200 mb-8">
              {t('about.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="accent" size="lg" className="shadow-xl">
                {t('about.cta.startLearning')}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white text-white hover:bg-white hover:text-primary dark:hover:bg-gray-100"
              >
                {t('about.cta.contactUs')}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

