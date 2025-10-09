'use client';

import { Button } from '@/components/ui';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';

export default function HeroSection() {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  return (
    <section className="relative bg-gradient-to-br from-primary to-primary-700 dark:from-primary-800 dark:to-primary-900 text-white overflow-hidden transition-colors">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-accent/20 dark:bg-accent/30 px-4 py-2 rounded-full mb-6">
              <span className="text-accent text-2xl">🎧</span>
              <span className="text-accent font-semibold">{t('home.hero.badge')}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t('home.hero.title')}
              <span className="block text-accent">{t('home.hero.titleHighlight')}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-100 dark:text-primary-200 mb-8 max-w-2xl">
              {t('home.hero.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {isAuthenticated ? (
                <Link href="/courses">
                  <Button variant="accent" size="lg" className="w-full sm:w-auto">
                    {t('home.hero.ctaStart')}
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <Button variant="accent" size="lg" className="w-full sm:w-auto">
                      {t('home.hero.ctaPrimary')}
                    </Button>
                  </Link>
                  <Link href="/courses">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary dark:hover:bg-gray-100">
                      {t('home.hero.ctaSecondary')}
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-primary-400 dark:border-primary-600">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-accent">500+</div>
                <div className="text-primary-200 dark:text-primary-300 text-sm mt-1">{t('home.hero.stats.exercises')}</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-accent">10K+</div>
                <div className="text-primary-200 dark:text-primary-300 text-sm mt-1">{t('home.hero.stats.students')}</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-accent">8.0+</div>
                <div className="text-primary-200 dark:text-primary-300 text-sm mt-1">{t('home.hero.stats.avgBand')}</div>
              </div>
            </div>
          </div>

          {/* Right Content - Illustration */}
          <div className="relative hidden lg:block">
            <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              {/* Mock Player */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center">
                    <span className="text-3xl">🎧</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">Cambridge IELTS 18</div>
                    <div className="text-primary-200 text-sm">Test 1 - Section 1</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-primary-200">
                    <span>2:34</span>
                    <span>5:42</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-6">
                  <button className="text-white hover:text-accent transition-colors">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                    </svg>
                  </button>
                  <button className="w-14 h-14 bg-accent rounded-full flex items-center justify-center hover:bg-accent-600 transition-colors">
                    <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                  <button className="text-white hover:text-accent transition-colors">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 18h2V6h-2zm-3.5-6L4 6v12z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-4 -right-4 bg-success text-white px-4 py-2 rounded-lg shadow-lg animate-bounce">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-semibold">Band 8.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

