'use client';

import { Card, CardBody } from '@/components/ui';

export default function QuizQuestion({ 
  question, 
  index, 
  selectedAnswer, 
  onAnswerSelect,
  showResult = false,
  correctAnswer = null 
}) {
  const { id, question_text, question_type, choices } = question;

  const isCorrect = showResult && selectedAnswer === correctAnswer;
  const isWrong = showResult && selectedAnswer && selectedAnswer !== correctAnswer;

  return (
    <Card className={`${
      showResult 
        ? isCorrect 
          ? 'border-2 border-success' 
          : isWrong 
            ? 'border-2 border-error' 
            : ''
        : ''
    }`}>
      <CardBody>
        {/* Question Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
            showResult
              ? isCorrect
                ? 'bg-success text-white'
                : isWrong
                  ? 'bg-error text-white'
                  : 'bg-gray-200 text-gray-700'
              : 'bg-primary text-white'
          }`}>
            {index + 1}
          </div>
          <div className="flex-1">
            <p className="text-gray-900 font-medium">{question_text}</p>
          </div>
        </div>

        {/* Choices */}
        {question_type === 'multiple_choice' && choices ? (
          <div className="space-y-2 ml-11">
            {choices.map((choice) => {
              const isSelected = selectedAnswer === choice.id;
              const isCorrectChoice = showResult && choice.is_correct;
              
              return (
                <label
                  key={choice.id}
                  className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    showResult
                      ? isCorrectChoice
                        ? 'border-success bg-success/10'
                        : isSelected && !isCorrectChoice
                          ? 'border-error bg-error/10'
                          : 'border-gray-200'
                      : isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-primary/50'
                  } ${showResult ? 'cursor-default' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name={`question-${id}`}
                      value={choice.id}
                      checked={isSelected}
                      onChange={() => !showResult && onAnswerSelect(id, choice.id)}
                      disabled={showResult}
                      className="w-4 h-4 text-primary focus:ring-primary-500"
                    />
                    <span className={`flex-1 ${isSelected ? 'font-semibold' : ''}`}>
                      {choice.choice_text}
                    </span>
                    {showResult && isCorrectChoice && (
                      <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {showResult && isSelected && !isCorrectChoice && (
                      <svg className="w-5 h-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        ) : (
          <div className="ml-11">
            <input
              type="text"
              placeholder="Nhập câu trả lời..."
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                showResult
                  ? isCorrect
                    ? 'border-success bg-success/10'
                    : isWrong
                      ? 'border-error bg-error/10'
                      : 'border-gray-200'
                  : 'border-gray-200'
              }`}
              value={selectedAnswer || ''}
              onChange={(e) => !showResult && onAnswerSelect(id, e.target.value)}
              disabled={showResult}
            />
            {showResult && correctAnswer && (
              <p className="mt-2 text-sm text-success">
                Đáp án đúng: <strong>{correctAnswer}</strong>
              </p>
            )}
          </div>
        )}

        {/* Explanation (if available and showing results) */}
        {showResult && question.explanation && (
          <div className="mt-4 ml-11 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong className="block mb-1">💡 Giải thích:</strong>
              {question.explanation}
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

