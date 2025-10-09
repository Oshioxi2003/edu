'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { isAuthenticated, user } = useAuth();
  const { t } = useTranslation();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('common.home') },
    { href: '/courses', label: t('common.courses') },
    { href: '/about', label: t('common.about') },
    { href: '/contact', label: t('common.contact') },
  ];

  const isActive = (href) => pathname === href;

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary dark:bg-primary-400 rounded-lg flex items-center justify-center">
              <span className="text-xl text-white font-bold">🎧</span>
            </div>
            <span className="text-xl font-bold text-primary dark:text-primary-400 hidden sm:inline">
              {t('header.brand')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-primary dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User Menu & Controls */}
          <div className="flex items-center gap-2">
            {/* Theme Switcher */}
            <ThemeSwitcher />
            
            {/* Language Switcher */}
            <LanguageSwitcher />
            {/* User Actions */}
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200 dark:border-gray-700">
              {isAuthenticated ? (
                <>
                  <Link href="/profile" className="hidden md:block">
                    <Button variant="ghost" size="sm">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                          <span className="text-sm">{user?.avatar || '👤'}</span>
                        </div>
                        <span className="hidden lg:inline text-gray-700 dark:text-gray-300">{user?.full_name}</span>
                      </div>
                    </Button>
                  </Link>
                  <Link href="/profile" className="md:hidden">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <span className="text-sm">{user?.avatar || '👤'}</span>
                    </div>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/sign-in" className="hidden md:block">
                    <Button variant="ghost" size="sm">
                      {t('common.login')}
                    </Button>
                  </Link>
                  <Link href="/register" className="hidden md:block">
                    <Button variant="primary" size="sm">
                      {t('common.register')}
                    </Button>
                  </Link>
                  <Link href="/sign-in" className="md:hidden">
                    <Button variant="primary" size="sm">
                      {t('common.login')}
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-primary dark:bg-primary-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2 bg-accent dark:bg-accent-600 text-primary dark:text-primary-900 rounded-lg font-semibold text-center"
                >
                  {t('common.register')}
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

