'use client';

import { Button } from '@/components/ui';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';

export default function CTASection() {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-gradient-to-br from-primary to-primary-700 dark:from-primary-800 dark:to-primary-900 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          {t('home.cta.title')}
        </h2>
        <p className="text-lg md:text-xl text-primary-100 dark:text-primary-200 mb-8">
          {isAuthenticated 
            ? t('home.cta.descriptionAuth')
            : t('home.cta.descriptionGuest')
          }
        </p>

        {isAuthenticated ? (
          <Link href="/courses">
            <Button variant="accent" size="lg" className="shadow-xl">
              {t('home.hero.ctaStart')}
            </Button>
          </Link>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button variant="accent" size="lg" className="shadow-xl w-full sm:w-auto">
                {t('home.hero.ctaPrimary')}
              </Button>
            </Link>
            <Link href="/courses">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white text-white hover:bg-white hover:text-primary dark:hover:bg-gray-100 w-full sm:w-auto"
              >
                {t('common.courses')}
              </Button>
            </Link>
          </div>
        )}

        {/* Trust Badges */}
        <div className="mt-12 pt-12 border-t border-primary-400 dark:border-primary-600">
          <p className="text-primary-200 dark:text-primary-300 mb-6">{t('home.cta.trustBadges.students')}</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
            <div className="text-white font-semibold">🎓 10,000+ {t('home.cta.trustBadges.students')}</div>
            <div className="text-white font-semibold">⭐ 4.9/5 {t('home.cta.trustBadges.rating')}</div>
            <div className="text-white font-semibold">🏆 95% {t('home.cta.trustBadges.success')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

