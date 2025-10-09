'use client';

import { use, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { catalogAPI, quizAPI, progressAPI } from '@/lib/api';
import AudioPlayer from '@/components/unit/AudioPlayer';
import QuizQuestion from '@/components/unit/QuizQuestion';
import { Button, Badge, Skeleton } from '@/components/ui';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function UnitPage({ params }) {
  const { courseId, unitId } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const [answers, setAnswers] = useState({});
  const [showTranscript, setShowTranscript] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [audioPosition, setAudioPosition] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Fetch unit data
  const { data: unit, isLoading: unitLoading } = useQuery({
    queryKey: ['unit', courseId, unitId],
    queryFn: async () => {
      const response = await catalogAPI.getUnit(courseId, unitId);
      return response.data;
    },
  });

  // Fetch questions
  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ['questions', unitId],
    queryFn: async () => {
      const response = await quizAPI.getQuestions(unitId);
      return response.data;
    },
  });

  // Submit answers mutation
  const submitMutation = useMutation({
    mutationFn: async (submissionData) => {
      const response = await quizAPI.submitAnswers(unitId, submissionData);
      return response.data;
    },
    onSuccess: (data) => {
      setShowResults(true);
      setHasSubmitted(true);
      queryClient.invalidateQueries(['unit', courseId, unitId]);
      queryClient.invalidateQueries(['course', courseId]);
      toast.success(`Điểm của bạn: ${data.score_pct}%`);
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi nộp bài');
    },
  });

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(answers).length;
    const totalQuestions = questions?.length || 0;

    if (answeredCount < totalQuestions) {
      if (!confirm(`Bạn mới trả lời ${answeredCount}/${totalQuestions} câu. Bạn có chắc muốn nộp bài?`)) {
        return;
      }
    }

    const submissionData = {
      answers: Object.entries(answers).map(([question_id, answer]) => ({
        question_id: parseInt(question_id),
        selected_choice_id: typeof answer === 'number' ? answer : null,
        text_answer: typeof answer === 'string' ? answer : null,
      })),
    };

    submitMutation.mutate(submissionData);
  };

  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
    setHasSubmitted(false);
    setAudioPosition(0);
  };

  // Save audio position to localStorage
  useEffect(() => {
    const interval = setInterval(() => {
      if (audioPosition > 0) {
        localStorage.setItem(`audio-position-${unitId}`, audioPosition.toString());
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [audioPosition, unitId]);

  // Load saved audio position
  useEffect(() => {
    const saved = localStorage.getItem(`audio-position-${unitId}`);
    if (saved) {
      setAudioPosition(parseFloat(saved));
    }
  }, [unitId]);

  if (unitLoading || questionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Skeleton className="h-64 mb-8" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/course/${courseId}`}>
                <Button variant="ghost" size="sm">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{unit?.title}</h1>
                <p className="text-sm text-gray-500">Unit {unit?.order}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={answeredCount === totalQuestions ? 'success' : 'warning'}>
                {answeredCount}/{totalQuestions} câu
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Audio Player Section */}
        <div className="bg-white rounded-xl shadow-card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="text-2xl">🎧</span>
              Audio Listening
            </h2>
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="text-sm text-primary hover:text-primary-600 font-semibold"
            >
              {showTranscript ? 'Ẩn' : 'Hiện'} Transcript
            </button>
          </div>

          <AudioPlayer
            audioUrl={unit?.audio_file || '/sample-audio.mp3'}
            onTimeUpdate={setAudioPosition}
            savedPosition={audioPosition}
          />

          {/* Transcript */}
          {showTranscript && unit?.transcript && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Transcript:</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{unit.transcript}</p>
            </div>
          )}
        </div>

        {/* Quiz Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Câu hỏi ({totalQuestions})
            </h2>
            {showResults && (
              <Button onClick={handleReset} variant="outline">
                Làm lại
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {questions?.map((question, index) => (
              <QuizQuestion
                key={question.id}
                question={question}
                index={index}
                selectedAnswer={answers[question.id]}
                onAnswerSelect={handleAnswerSelect}
                showResult={showResults}
                correctAnswer={question.correct_answer}
              />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        {!showResults && (
          <div className="sticky bottom-4 bg-white rounded-xl shadow-xl p-6 border-2 border-primary">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">
                  Đã trả lời: <strong>{answeredCount}/{totalQuestions}</strong> câu
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>
              <Button
                onClick={handleSubmit}
                variant="primary"
                size="lg"
                isLoading={submitMutation.isPending}
                disabled={answeredCount === 0}
              >
                Nộp bài
              </Button>
            </div>
          </div>
        )}

        {/* Results Summary */}
        {showResults && submitMutation.data && (
          <div className="bg-gradient-to-br from-primary to-primary-700 text-white rounded-xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">
              {submitMutation.data.score_pct >= 80 ? '🎉' : submitMutation.data.score_pct >= 60 ? '👍' : '💪'}
            </div>
            <h3 className="text-3xl font-bold mb-2">
              Điểm của bạn: {submitMutation.data.score_pct}%
            </h3>
            <p className="text-primary-100 text-lg mb-6">
              Đúng {submitMutation.data.correct_count}/{totalQuestions} câu
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={handleReset} variant="accent">
                Làm lại
              </Button>
              <Link href={`/course/${courseId}`}>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  Về danh sách Units
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

