'use client';

import { Card, CardBody, Button, Badge, ProgressBar } from '@/components/ui';
import Link from 'next/link';

export default function UnitCard({ unit, courseId, isLocked, progress }) {
  const {
    id,
    title,
    order,
    duration_formatted,
    duration_sec,
    has_quiz,
  } = unit;

  const unitProgress = progress?.progress_pct || 0;
  const bestScore = progress?.best_score || 0;
  const isCompleted = unitProgress === 100;
  
  // Calculate estimated questions (assume 1 question per minute of audio)
  const estimatedQuestions = has_quiz ? Math.max(5, Math.floor((duration_sec || 300) / 60)) : 0;

  return (
    <Card className={`${isLocked ? 'opacity-60' : ''}`}>
      <CardBody>
        <div className="flex items-start gap-4">
          {/* Order Number */}
          <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg ${
            isCompleted 
              ? 'bg-success text-white' 
              : isLocked
                ? 'bg-gray-200 text-gray-500'
                : 'bg-primary text-white'
          }`}>
            {isCompleted ? '✓' : order}
          </div>

          <div className="flex-1 min-w-0">
            {/* Title & Status */}
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              {isLocked && (
                <Badge variant="warning">🔒 Khóa</Badge>
              )}
              {isCompleted && (
                <Badge variant="success">Hoàn thành</Badge>
              )}
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                <span>{duration_formatted || '03:00'}</span>
              </div>
              {has_quiz && (
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Có bài quiz</span>
                </div>
              )}
              {bestScore > 0 && (
                <div className="flex items-center gap-1 text-accent-700 font-semibold">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>Điểm: {bestScore}%</span>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {unitProgress > 0 && !isLocked && (
              <div className="mb-4">
                <ProgressBar progress={unitProgress} size="sm" showLabel={false} />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {isLocked ? (
                <Button variant="outline" disabled className="flex-1 sm:flex-none">
                  🔒 Mua để mở khóa
                </Button>
              ) : (
                <>
                  <Link href={`/course/${courseId}/unit/${id}`} className="flex-1 sm:flex-none">
                    <Button variant={isCompleted ? 'outline' : 'primary'} className="w-full">
                      {isCompleted ? 'Học lại' : unitProgress > 0 ? 'Tiếp tục' : 'Bắt đầu học'}
                    </Button>
                  </Link>
                  {unitProgress > 0 && (
                    <Link href={`/course/${courseId}/unit/${id}/results`}>
                      <Button variant="ghost">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0h2a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

