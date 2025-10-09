'use client';

import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui";
import { useTranslation } from "@/hooks/useTranslation";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 transition-colors">
        <div className="max-w-2xl w-full text-center">
          {/* 404 Animation */}
          <div className="mb-8 relative">
            <h1 className="text-9xl md:text-[200px] font-bold text-primary/10 dark:text-primary-400/10 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl animate-bounce">🔍</div>
            </div>
          </div>

          {/* Content */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('notFound.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
              {t('notFound.description')}
            </p>
            <p className="text-gray-500 dark:text-gray-500">
              {t('notFound.suggestion')}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {t('notFound.backToHome')}
              </Button>
            </Link>
            <Link href="/courses">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {t('notFound.viewCourses')}
              </Button>
            </Link>
          </div>

          {/* Suggestions */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('notFound.mayBeLookingFor')}</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link href="/courses">
                <span className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white dark:hover:bg-primary-600 transition-colors cursor-pointer">
                  📚 {t('notFound.quickLinks.courses')}
                </span>
              </Link>
              <Link href="/profile">
                <span className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white dark:hover:bg-primary-600 transition-colors cursor-pointer">
                  👤 {t('notFound.quickLinks.profile')}
                </span>
              </Link>
              <Link href="/sign-in">
                <span className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white dark:hover:bg-primary-600 transition-colors cursor-pointer">
                  🔐 {t('notFound.quickLinks.login')}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
