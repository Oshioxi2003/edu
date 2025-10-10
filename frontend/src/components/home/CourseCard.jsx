'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, Button, Badge, ProgressBar } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';
import Image from 'next/image';

export default function CourseCard({ course, userProgress }) {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  
  const {
    id,
    slug,
    title,
    description,
    cover,
    level,
    unit_count,
    price,
    is_owned,
  } = course;

  const progress = userProgress?.completion_percentage || 0;
  const isPurchased = is_owned;
  const isFree = price === "0.00" || price === 0;

  // Fix hydration by only showing user-specific content after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Card className="overflow-hidden h-full flex flex-col" suppressHydrationWarning>
      {/* Cover Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900 dark:to-accent-900" suppressHydrationWarning>
        {cover ? (
          <Image
            src={cover}
            alt={title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">📚</span>
          </div>
        )}
        
        {/* Level Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant={level === 'beginner' ? 'success' : level === 'intermediate' ? 'warning' : 'error'}>
            {t(`courses.level.${level}`)}
          </Badge>
        </div>

        {/* Price Tag - Always show (static data) */}
        {!is_owned && (
          <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 rounded-lg px-3 py-1 shadow-md" suppressHydrationWarning>
            <span className="font-bold text-primary dark:text-primary-400">
              {isFree ? t('courses.status.free') : `${parseFloat(price || 0).toLocaleString('vi-VN')}đ`}
            </span>
          </div>
        )}
      </div>

      <CardBody className="flex-1 flex flex-col">
        {/* Title & Description */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
          {description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>{unit_count || 0} {t('courses.units')}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>1.2K {t('courses.students')}</span>
          </div>
        </div>

        {/* Progress (if purchased) - Only show after hydration */}
        {isClient && isPurchased && progress > 0 && (
          <div className="mb-4">
            <ProgressBar progress={progress} size="sm" />
          </div>
        )}

        {/* CTA Button */}
        <Link href={`/course/${slug || id}`} className="block" suppressHydrationWarning>
          <Button 
            variant="primary"
            className="w-full"
            suppressHydrationWarning
          >
            {!isClient 
              ? t('courses.viewDetails')
              : isPurchased 
                ? t('courses.continue') 
                : isFree 
                  ? t('courses.startNow') 
                  : t('courses.viewDetails')
            }
          </Button>
        </Link>
      </CardBody>
    </Card>
  );
}

