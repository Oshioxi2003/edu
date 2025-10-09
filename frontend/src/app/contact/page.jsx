'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardBody, Button, Input } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

const contactSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  subject: yup.string().required('Subject is required'),
  message: yup.string().required('Message is required'),
});

export default function ContactPage() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(t('contact.form.successMessage'));
      reset();
    } catch (error) {
      toast.error(t('contact.form.errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: '📧',
      title: t('contact.info.email.title'),
      value: 'support@ieltslistening.com',
      description: t('contact.info.email.description')
    },
    {
      icon: '📞',
      title: t('contact.info.phone.title'),
      value: '+84 123 456 789',
      description: t('contact.info.phone.description')
    },
    {
      icon: '📍',
      title: t('contact.info.address.title'),
      value: '123 Nguyễn Huệ, Q1, TP.HCM',
      description: t('contact.info.address.description')
    },
    {
      icon: '⏰',
      title: t('contact.info.hours.title'),
      value: '8:00 - 22:00 (GMT+7)',
      description: t('contact.info.hours.description')
    }
  ];

  const faqs = [
    {
      question: t('contact.faq.q1.question'),
      answer: t('contact.faq.q1.answer')
    },
    {
      question: t('contact.faq.q2.question'),
      answer: t('contact.faq.q2.answer')
    },
    {
      question: t('contact.faq.q3.question'),
      answer: t('contact.faq.q3.answer')
    },
    {
      question: t('contact.faq.q4.question'),
      answer: t('contact.faq.q4.answer')
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
                {t('contact.hero.title')}
              </h1>
              <p className="text-xl text-primary-100 dark:text-primary-200 max-w-3xl mx-auto">
                {t('contact.hero.subtitle')}
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardBody>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {t('contact.form.title')}
                  </h2>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('contact.form.name')} *
                        </label>
                        <Input
                          {...register('name')}
                          placeholder={t('contact.form.namePlaceholder')}
                          className={errors.name ? 'input-error' : ''}
                        />
                        {errors.name && (
                          <p className="text-error text-sm mt-1">{errors.name.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('contact.form.email')} *
                        </label>
                        <Input
                          type="email"
                          {...register('email')}
                          placeholder={t('contact.form.emailPlaceholder')}
                          className={errors.email ? 'input-error' : ''}
                        />
                        {errors.email && (
                          <p className="text-error text-sm mt-1">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('contact.form.subject')} *
                      </label>
                      <Input
                        {...register('subject')}
                        placeholder={t('contact.form.subjectPlaceholder')}
                        className={errors.subject ? 'input-error' : ''}
                      />
                      {errors.subject && (
                        <p className="text-error text-sm mt-1">{errors.subject.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('contact.form.message')} *
                      </label>
                      <textarea
                        {...register('message')}
                        rows={6}
                        placeholder={t('contact.form.messagePlaceholder')}
                        className={`input ${errors.message ? 'input-error' : ''}`}
                      />
                      {errors.message && (
                        <p className="text-error text-sm mt-1">{errors.message.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? t('contact.form.sending') : t('contact.form.send')}
                    </Button>
                  </form>
                </CardBody>
              </Card>
            </div>

            {/* Contact Info & FAQ */}
            <div className="space-y-8">
              {/* Contact Information */}
              <Card>
                <CardBody>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    {t('contact.info.title')}
                  </h3>
                  
                  <div className="space-y-6">
                    {contactInfo.map((info, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="text-2xl">{info.icon}</div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {info.title}
                          </h4>
                          <p className="text-primary dark:text-primary-400 font-medium mb-1">
                            {info.value}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {info.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* FAQ */}
              <Card>
                <CardBody>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    {t('contact.faq.title')}
                  </h3>
                  
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {faq.question}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {t('contact.map.title')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {t('contact.map.subtitle')}
              </p>
            </div>
            
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🗺️</div>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('contact.map.placeholder')}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
