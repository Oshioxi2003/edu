'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  RotateCcw,
  Settings,
  Maximize,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Exercise, ListeningExercise } from '@/types/course';

interface ExercisePlayerProps {
  exercise: Exercise;
  onComplete?: () => void;
}

const ExercisePlayer = ({ exercise, onComplete }: ExercisePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{[key: string]: string | string[]}>({});
  const [showResults, setShowResults] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const listeningExercise = exercise.listeningExercises?.[0]; // Lấy bài nghe đầu tiên

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !listeningExercise) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [listeningExercise]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const time = (parseFloat(e.target.value) / 100) * duration;
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const changeSpeed = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
    
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const skipTime = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.max(0, Math.min(audio.currentTime + seconds, duration));
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, answer: string | string[], type: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const submitAnswers = () => {
    setShowResults(true);
    // Calculate score and show results
    if (onComplete) {
      onComplete();
    }
  };

  const resetExercise = () => {
    setUserAnswers({});
    setShowResults(false);
    setCurrentQuestionIndex(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const renderQuestion = (question: any, index: number) => {
    const userAnswer = userAnswers[question.id];
    const isCorrect = showResults && (
      Array.isArray(question.correctAnswer) 
        ? JSON.stringify(question.correctAnswer.sort()) === JSON.stringify((userAnswer as string[])?.sort())
        : question.correctAnswer === userAnswer
    );

    return (
      <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Câu {index + 1}: {question.question}
          </h3>
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

        {question.type === 'multiple-choice' && (
          <div className="space-y-3">
            {question.options.map((option: string, optionIndex: number) => {
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
                    onChange={(e) => handleAnswerChange(question.id, e.target.value, 'single')}
                    disabled={showResults}
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

        {question.type === 'fill-blank' && (
          <div className="space-y-3">
            <input
              type="text"
              value={(userAnswer as string) || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value, 'single')}
              disabled={showResults}
              placeholder="Nhập câu trả lời của bạn..."
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                showResults
                  ? isCorrect
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-gray-300'
              }`}
            />
            {showResults && (
              <div className="text-sm">
                <p className="text-green-600">
                  <strong>Đáp án đúng:</strong> {question.correctAnswer}
                </p>
                {question.explanation && (
                  <p className="text-gray-600 mt-2">
                    <strong>Giải thích:</strong> {question.explanation}
                  </p>
                )}
              </div>
            )}
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
                    onChange={(e) => handleAnswerChange(question.id, e.target.value, 'single')}
                    disabled={showResults}
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
      </div>
    );
  };

  if (exercise.type === 'video') {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="aspect-video bg-gray-900 rounded-lg mb-4 flex items-center justify-center">
          <div className="text-white text-center">
            <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Video Player</p>
            <p className="text-sm opacity-75">Nội dung video cho: {exercise.title}</p>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{exercise.title}</h3>
        <p className="text-gray-600">{exercise.content}</p>
      </div>
    );
  }

  if (exercise.type === 'text') {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{exercise.title}</h3>
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed">{exercise.content}</p>
        </div>
      </div>
    );
  }

  if (exercise.type === 'listening' && listeningExercise) {
    return (
      <div className="space-y-6">
        {/* Audio Player */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">{exercise.title}</h3>
          
          <audio ref={audioRef} src={listeningExercise.audioUrl} preload="metadata" />
          
          {/* Player Controls */}
          <div className="bg-gray-50 rounded-lg p-4">
            {/* Progress Bar */}
            <div className="mb-4">
              <input
                type="range"
                min="0"
                max="100"
                value={duration ? (currentTime / duration) * 100 : 0}
                onChange={handleSeek}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => skipTime(-10)}
                className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                title="Lùi 10s"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={togglePlay}
                className="p-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-0.5" />
                )}
              </button>

              <button
                onClick={() => skipTime(10)}
                className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                title="Tiến 10s"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Additional Controls */}
            <div className="flex items-center justify-between mt-4">
              {/* Volume Control */}
              <div className="flex items-center space-x-2">
                <button onClick={toggleMute} className="text-gray-600 hover:text-primary-600">
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume * 100}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Speed Control */}
              <button
                onClick={changeSpeed}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                {playbackSpeed}x
              </button>

              {/* Transcript Toggle */}
              {listeningExercise.transcript && (
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  {showTranscript ? 'Ẩn' : 'Hiện'} transcript
                </button>
              )}

              {/* Reset Button */}
              <button
                onClick={resetExercise}
                className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                title="Reset bài tập"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Transcript */}
          {showTranscript && listeningExercise.transcript && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Transcript:</h4>
              <p className="text-gray-700 leading-relaxed">{listeningExercise.transcript}</p>
            </div>
          )}
        </div>

        {/* Questions */}
        {listeningExercise.questions.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">
              Câu hỏi ({listeningExercise.questions.length} câu)
            </h4>
            
            {listeningExercise.questions.map((question, index) => 
              renderQuestion(question, index)
            )}

            {!showResults ? (
              <div className="flex justify-center">
                <button
                  onClick={submitAnswers}
                  className="px-8 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                >
                  Nộp bài
                </button>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <h4 className="text-lg font-semibold text-blue-900 mb-2">
                  Kết quả bài tập
                </h4>
                <p className="text-blue-700 mb-4">
                  Bạn đã trả lời đúng{' '}
                  {listeningExercise.questions.filter((q, index) => {
                    const userAnswer = userAnswers[q.id];
                    return Array.isArray(q.correctAnswer) 
                      ? JSON.stringify(q.correctAnswer.sort()) === JSON.stringify((userAnswer as string[])?.sort())
                      : q.correctAnswer === userAnswer;
                  }).length}{' '}
                  / {listeningExercise.questions.length} câu
                </p>
                <button
                  onClick={resetExercise}
                  className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Làm lại
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{exercise.title}</h3>
      <p className="text-gray-600">Loại bài tập: {exercise.type}</p>
      <p className="text-gray-700 mt-4">{exercise.content}</p>
    </div>
  );
};

export default ExercisePlayer;