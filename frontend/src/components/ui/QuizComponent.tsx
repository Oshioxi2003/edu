'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Trophy, RotateCcw, ArrowRight, ArrowLeft } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'fill-blank' | 'true-false' | 'multi-select';
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

interface QuizComponentProps {
  title: string;
  questions: QuizQuestion[];
  timeLimit?: number; // in minutes
  passingScore?: number; // percentage
  onComplete?: (score: number, passed: boolean) => void;
  allowRetry?: boolean;
}

const QuizComponent = ({
  title,
  questions,
  timeLimit,
  passingScore = 70,
  onComplete,
  allowRetry = true
}: QuizComponentProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{[key: string]: string | string[]}>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit ? timeLimit * 60 : null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Timer effect
  useEffect(() => {
    if (!timeRemaining || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev && prev <= 1) {
          // Time's up - auto submit
          handleSubmit();
          return 0;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculateScore = () => {
    let totalPoints = 0;
    let earnedPoints = 0;

    questions.forEach(question => {
      totalPoints += question.points;
      const userAnswer = userAnswers[question.id];
      
      if (question.type === 'multi-select') {
        // For multi-select, check if arrays match exactly
        const correct = Array.isArray(question.correctAnswer) ? question.correctAnswer : [];
        const user = Array.isArray(userAnswer) ? userAnswer : [];
        if (JSON.stringify(correct.sort()) === JSON.stringify(user.sort())) {
          earnedPoints += question.points;
        }
      } else {
        // For single answer questions
        if (question.correctAnswer === userAnswer) {
          earnedPoints += question.points;
        }
      }
    });

    return Math.round((earnedPoints / totalPoints) * 100);
  };

  const handleSubmit = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setIsSubmitted(true);
    setShowResults(true);

    const passed = finalScore >= passingScore;
    if (onComplete) {
      onComplete(finalScore, passed);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setIsSubmitted(false);
    setShowResults(false);
    setScore(0);
    setTimeRemaining(timeLimit ? timeLimit * 60 : null);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const getAnsweredQuestionsCount = () => {
    return Object.keys(userAnswers).length;
  };

  const isQuestionAnswered = (questionId: string) => {
    const answer = userAnswers[questionId];
    if (Array.isArray(answer)) {
      return answer.length > 0;
    }
    return answer !== undefined && answer !== '';
  };

  const currentQuestion = questions[currentQuestionIndex];

  const renderQuestion = (question: QuizQuestion) => {
    const userAnswer = userAnswers[question.id];
    const isCorrect = showResults && (
      Array.isArray(question.correctAnswer) 
        ? JSON.stringify(question.correctAnswer.sort()) === JSON.stringify((userAnswer as string[])?.sort())
        : question.correctAnswer === userAnswer
    );

    return (
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 pr-4">
              {question.question}
            </h3>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <span className="text-sm text-gray-500">{question.points} điểm</span>
              {showResults && (
                <div className={`flex items-center space-x-1 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                </div>
              )}
            </div>
          </div>

          {question.type === 'multiple-choice' && (
            <div className="space-y-3">
              {question.options?.map((option, optionIndex) => {
                const isSelected = userAnswer === option;
                const isCorrectOption = showResults && question.correctAnswer === option;
                const isWrongSelection = showResults && isSelected && !isCorrectOption;

                return (
                  <label 
                    key={optionIndex}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      showResults
                        ? isCorrectOption
                          ? 'border-green-500 bg-green-50'
                          : isWrongSelection
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200'
                        : isSelected
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={option}
                      checked={isSelected}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      disabled={isSubmitted}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className={`flex-1 ${
                      showResults && isCorrectOption ? 'font-semibold text-green-800' : ''
                    }`}>
                      {option}
                    </span>
                  </label>
                );
              })}
            </div>
          )}

          {question.type === 'multi-select' && (
            <div className="space-y-3">
              {question.options?.map((option, optionIndex) => {
                const userAnswerArray = Array.isArray(userAnswer) ? userAnswer : [];
                const isSelected = userAnswerArray.includes(option);
                const correctAnswerArray = Array.isArray(question.correctAnswer) ? question.correctAnswer : [];
                const isCorrectOption = showResults && correctAnswerArray.includes(option);
                const isWrongSelection = showResults && isSelected && !isCorrectOption;

                return (
                  <label 
                    key={optionIndex}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      showResults
                        ? isCorrectOption
                          ? 'border-green-500 bg-green-50'
                          : isWrongSelection
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200'
                        : isSelected
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={option}
                      checked={isSelected}
                      onChange={(e) => {
                        const currentAnswers = Array.isArray(userAnswer) ? userAnswer : [];
                        let newAnswers;
                        if (e.target.checked) {
                          newAnswers = [...currentAnswers, option];
                        } else {
                          newAnswers = currentAnswers.filter(item => item !== option);
                        }
                        handleAnswerChange(question.id, newAnswers);
                      }}
                      disabled={isSubmitted}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className={`flex-1 ${
                      showResults && isCorrectOption ? 'font-semibold text-green-800' : ''
                    }`}>
                      {option}
                    </span>
                  </label>
                );
              })}
            </div>
          )}

          {question.type === 'fill-blank' && (
            <div className="space-y-3">
              <input
                type="text"
                value={(userAnswer as string) || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                disabled={isSubmitted}
                placeholder="Nhập câu trả lời của bạn..."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  showResults
                    ? isCorrect
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-gray-300'
                }`}
              />
            </div>
          )}

          {question.type === 'true-false' && (
            <div className="space-y-3">
              {['Đúng', 'Sai'].map((option) => {
                const isSelected = userAnswer === option;
                const isCorrectOption = showResults && question.correctAnswer === option;
                const isWrongSelection = showResults && isSelected && !isCorrectOption;

                return (
                  <label 
                    key={option}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      showResults
                        ? isCorrectOption
                          ? 'border-green-500 bg-green-50'
                          : isWrongSelection
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200'
                        : isSelected
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={option}
                      checked={isSelected}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      disabled={isSubmitted}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className={`flex-1 ${
                      showResults && isCorrectOption ? 'font-semibold text-green-800' : ''
                    }`}>
                      {option}
                    </span>
                  </label>
                );
              })}
            </div>
          )}

          {showResults && question.explanation && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h5 className="font-semibold text-blue-900 mb-1">Giải thích:</h5>
              <p className="text-blue-800 text-sm">{question.explanation}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (showResults) {
    const passed = score >= passingScore;
    
    return (
      <div className="space-y-6">
        {/* Results Header */}
        <div className={`bg-white border rounded-lg p-8 text-center ${
          passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
        }`}>
          <div className="mb-4">
            {passed ? (
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto" />
            ) : (
              <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {passed ? 'Chúc mừng!' : 'Hãy cố gắng thêm!'}
          </h2>
          
          <p className={`text-lg mb-4 ${passed ? 'text-green-700' : 'text-red-700'}`}>
            {passed 
              ? `Bạn đã vượt qua bài kiểm tra với điểm số ${score}%`
              : `Bạn cần ${passingScore}% để đạt. Điểm của bạn: ${score}%`
            }
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-primary-600">{score}%</div>
              <div className="text-sm text-gray-600">Điểm số</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-green-600">
                {questions.filter(q => {
                  const userAnswer = userAnswers[q.id];
                  return Array.isArray(q.correctAnswer) 
                    ? JSON.stringify(q.correctAnswer.sort()) === JSON.stringify((userAnswer as string[])?.sort())
                    : q.correctAnswer === userAnswer;
                }).length}
              </div>
              <div className="text-sm text-gray-600">Câu đúng</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-gray-600">{questions.length}</div>
              <div className="text-sm text-gray-600">Tổng câu</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {allowRetry && (
              <button
                onClick={resetQuiz}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Làm lại</span>
              </button>
            )}
            <button
              onClick={() => setShowResults(false)}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Xem lại đáp án
            </button>
          </div>
        </div>

        {/* Question Review */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Chi tiết kết quả</h3>
          {questions.map((question, index) => (
            <div key={question.id}>
              <div className="mb-2">
                <h4 className="font-medium text-gray-900">Câu {index + 1}</h4>
              </div>
              {renderQuestion(question)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Câu {currentQuestionIndex + 1} / {questions.length}</span>
              <span>•</span>
              <span>Đã trả lời: {getAnsweredQuestionsCount()}</span>
              {passingScore && (
                <>
                  <span>•</span>
                  <span>Điểm đạt: {passingScore}%</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {timeRemaining !== null && (
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                timeRemaining <= 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                <Clock className="w-4 h-4" />
                <span className="font-semibold">{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Question Navigation */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {questions.map((question, index) => (
            <button
              key={question.id}
              onClick={() => goToQuestion(index)}
              className={`w-10 h-10 rounded-lg text-sm font-semibold transition-colors ${
                currentQuestionIndex === index
                  ? 'bg-primary-500 text-white'
                  : isQuestionAnswered(question.id)
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Current Question */}
      {renderQuestion(currentQuestion)}

      {/* Navigation Controls */}
      <div className="flex justify-between items-center">
        <button
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2 ${
            currentQuestionIndex === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Câu trước</span>
        </button>

        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={getAnsweredQuestionsCount() === 0}
            className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
              getAnsweredQuestionsCount() === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            Nộp bài ({getAnsweredQuestionsCount()}/{questions.length})
          </button>
        </div>

        <button
          onClick={nextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2 ${
            currentQuestionIndex === questions.length - 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-primary-500 text-white hover:bg-primary-600'
          }`}
        >
          <span>Câu sau</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default QuizComponent;