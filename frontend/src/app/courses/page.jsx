'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useCourses, useUserProgress } from '@/hooks/useCourses';
import { useTranslation } from '@/hooks/useTranslation';
import CourseCard from '@/components/home/CourseCard';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui';

export default function CoursesPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    level: '',
    search: '',
  });

  const { data: courses, isLoading } = useCourses(filters);
  const { data: userProgress } = useUserProgress();

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <MainLayout>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-primary to-primary-700 dark:from-primary-800 dark:to-primary-900 text-white py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">{t('courses.title')}</h1>
          <p className="text-xl text-primary-100 dark:text-primary-200">
            {t('courses.subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-6 mb-8 transition-colors">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <input
                type="text"
                placeholder={t('courses.search')}
                className="input"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            {/* Level Filter */}
            <div>
              <select
                className="input"
                value={filters.level}
                onChange={(e) => handleFilterChange('level', e.target.value)}
              >
                <option value="">{t('courses.allLevels')}</option>
                <option value="beginner">{t('courses.level.beginner')}</option>
                <option value="intermediate">{t('courses.level.intermediate')}</option>
                <option value="advanced">{t('courses.level.advanced')}</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                className="input"
                onChange={(e) => handleFilterChange('ordering', e.target.value)}
              >
                <option value="">{t('courses.sort')}</option>
                <option value="title">A-Z</option>
                <option value="-created_at">Newest</option>
                <option value="price">Price: Low - High</option>
                <option value="-price">Price: High - Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : courses?.results?.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.results.map((course) => {
                const progress = userProgress?.find((p) => p.book_id === course.id);
                return (
                  <CourseCard 
                    key={course.id} 
                    course={course} 
                    userProgress={progress}
                  />
                );
              })}
            </div>

            {/* Pagination */}
            {courses.count > 9 && (
              <div className="flex justify-center gap-2 mt-12">
                <Button variant="outline" disabled>
                  {t('common.previous')}
                </Button>
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 rounded-lg bg-primary dark:bg-primary-600 text-white font-semibold">
                    1
                  </button>
                  <button className="w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold transition-colors">
                    2
                  </button>
                  <button className="w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold transition-colors">
                    3
                  </button>
                </div>
                <Button variant="outline">
                  {t('common.next')}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t('courses.noCoursesFound')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('courses.tryDifferentFilters')}
            </p>
            <Button onClick={() => setFilters({ level: '', search: '' })}>
              {t('courses.clearFilters')}
            </Button>
          </div>
        )}
      </div>
    </div>
    </MainLayout>
  );
}

