export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  enrolledCourses: string[];
}

export interface ListeningQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'fill-blank' | 'true-false';
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
}

export interface ListeningExercise {
  id: string;
  audioUrl: string;
  transcript?: string;
  questions: ListeningQuestion[];
}

export interface Exercise {
  id: string;
  title: string;
  type: 'video' | 'text' | 'listening' | 'quiz';
  content: string;
  duration?: number;
  isCompleted?: boolean;
  listeningExercises?: ListeningExercise[];
}

export interface Part {
  id: string;
  title: string;
  description: string;
  order: number;
  exercises: Exercise[];
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  order: number;
  parts: Part[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  originalPrice?: number;
  rating: number;
  totalRatings: number;
  totalStudents: number;
  duration: string;
  level: 'Cơ bản' | 'Trung cấp' | 'Nâng cao';
  category: string;
  instructor: string;
  tags: string[];
  isFeatured?: boolean;
  units: Unit[];
}
