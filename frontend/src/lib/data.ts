import { Course, User } from '@/types/course';

export const mockUser: User = {
  id: '1',
  name: 'Nguyễn Văn A',
  email: 'user@example.com',
  enrolledCourses: ['1', '2', '3'],
};

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'JavaScript từ cơ bản đến nâng cao',
    description: 'Học JavaScript từ những kiến thức cơ bản nhất đến nâng cao với các ví dụ thực tế và bài tập phong phú.',
    thumbnail: '/images/courses/javascript.jpg',
    price: 599000,
    originalPrice: 999000,
    rating: 4.8,
    totalRatings: 1234,
    totalStudents: 5230,
    duration: '40 giờ',
    level: 'Cơ bản',
    category: 'Lập trình',
    instructor: 'Trần Văn B',
    tags: ['JavaScript', 'Web Development', 'Programming'],
    isFeatured: true,
    units: [
      {
        id: 'unit-1',
        title: 'Giới thiệu về JavaScript',
        description: 'Tìm hiểu về JavaScript và cách thiết lập môi trường làm việc',
        order: 1,
        parts: [
          {
            id: 'part-1',
            title: 'JavaScript là gì?',
            description: 'Giới thiệu tổng quan về JavaScript',
            order: 1,
            exercises: [
              {
                id: 'ex-1',
                title: 'Giới thiệu JavaScript',
                type: 'video',
                content: 'Video giới thiệu về JavaScript',
                duration: 15,
              },
              {
                id: 'ex-2',
                title: 'Cài đặt môi trường',
                type: 'text',
                content: 'Hướng dẫn cài đặt Node.js và VS Code',
                duration: 10,
              },
            ],
          },
        ],
      },
      {
        id: 'unit-2',
        title: 'Cú pháp cơ bản',
        description: 'Học các cú pháp cơ bản của JavaScript',
        order: 2,
        parts: [
          {
            id: 'part-2',
            title: 'Biến và kiểu dữ liệu',
            description: 'Tìm hiểu về biến và các kiểu dữ liệu',
            order: 1,
            exercises: [
              {
                id: 'ex-3',
                title: 'Khai báo biến',
                type: 'video',
                content: 'Học cách khai báo biến với var, let, const',
                duration: 20,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'React.js Thực Chiến',
    description: 'Xây dựng ứng dụng web hiện đại với React.js và các công nghệ liên quan.',
    thumbnail: '/images/courses/react.jpg',
    price: 799000,
    originalPrice: 1299000,
    rating: 4.9,
    totalRatings: 892,
    totalStudents: 3120,
    duration: '35 giờ',
    level: 'Trung cấp',
    category: 'Lập trình',
    instructor: 'Lê Thị C',
    tags: ['React', 'JavaScript', 'Frontend'],
    isFeatured: true,
    units: [
      {
        id: 'unit-1',
        title: 'React Basics',
        description: 'Học các khái niệm cơ bản của React',
        order: 1,
        parts: [
          {
            id: 'part-1',
            title: 'Components',
            description: 'Tìm hiểu về React Components',
            order: 1,
            exercises: [
              {
                id: 'ex-1',
                title: 'Giới thiệu Components',
                type: 'video',
                content: 'Video về React Components',
                duration: 25,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '3',
    title: 'Tiếng Anh Giao Tiếp Cơ Bản',
    description: 'Nâng cao kỹ năng giao tiếp tiếng Anh trong cuộc sống hàng ngày và công việc.',
    thumbnail: '/images/courses/english.jpg',
    price: 450000,
    originalPrice: 750000,
    rating: 4.7,
    totalRatings: 2156,
    totalStudents: 8540,
    duration: '30 giờ',
    level: 'Cơ bản',
    category: 'Ngoại ngữ',
    instructor: 'John Smith',
    tags: ['English', 'Communication', 'Language'],
    isFeatured: true,
    units: [
      {
        id: 'unit-1',
        title: 'Greetings and Introductions',
        description: 'Học cách chào hỏi và giới thiệu',
        order: 1,
        parts: [
          {
            id: 'part-1',
            title: 'Basic Greetings',
            description: 'Các cách chào hỏi cơ bản',
            order: 1,
            exercises: [
              {
                id: 'ex-1',
                title: 'Hello and Goodbye',
                type: 'listening',
                content: 'Bài nghe về chào hỏi',
                duration: 15,
                listeningExercises: [
                  {
                    id: 'listening-1',
                    audioUrl: '/audio/greetings.mp3',
                    transcript: 'Hello, how are you? I am fine, thank you.',
                    questions: [
                      {
                        id: 'q-1',
                        question: 'What is the response to "How are you?"',
                        type: 'multiple-choice',
                        options: ['I am fine', 'I am sad', 'I am angry', 'I am tired'],
                        correctAnswer: 'I am fine',
                        explanation: 'The correct response is "I am fine, thank you."',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '4',
    title: 'Python cho Data Science',
    description: 'Học Python và ứng dụng vào phân tích dữ liệu và machine learning.',
    thumbnail: '/images/courses/python.jpg',
    price: 899000,
    originalPrice: 1499000,
    rating: 4.8,
    totalRatings: 756,
    totalStudents: 2890,
    duration: '45 giờ',
    level: 'Trung cấp',
    category: 'Lập trình',
    instructor: 'Phạm Văn D',
    tags: ['Python', 'Data Science', 'Machine Learning'],
    units: [],
  },
  {
    id: '5',
    title: 'UI/UX Design Fundamentals',
    description: 'Nắm vững các nguyên tắc thiết kế giao diện và trải nghiệm người dùng.',
    thumbnail: '/images/courses/uiux.jpg',
    price: 699000,
    originalPrice: 1199000,
    rating: 4.9,
    totalRatings: 634,
    totalStudents: 2340,
    duration: '28 giờ',
    level: 'Cơ bản',
    category: 'Thiết kế',
    instructor: 'Ngô Thị E',
    tags: ['UI', 'UX', 'Design', 'Figma'],
    isFeatured: true,
    units: [],
  },
  {
    id: '6',
    title: 'Digital Marketing Toàn Diện',
    description: 'Chiến lược marketing online hiệu quả cho doanh nghiệp và cá nhân.',
    thumbnail: '/images/courses/marketing.jpg',
    price: 549000,
    originalPrice: 899000,
    rating: 4.6,
    totalRatings: 1023,
    totalStudents: 4560,
    duration: '32 giờ',
    level: 'Cơ bản',
    category: 'Marketing',
    instructor: 'Hoàng Văn F',
    tags: ['Marketing', 'SEO', 'Social Media', 'Google Ads'],
    units: [],
  },
];

// Helper functions
export const getFeaturedCourses = (): Course[] => {
  return mockCourses.filter(course => course.isFeatured);
};

export const getCourseById = (id: string): Course | undefined => {
  return mockCourses.find(course => course.id === id);
};

export const getCoursesByCategory = (category: string): Course[] => {
  return mockCourses.filter(course => course.category === category);
};

export const searchCourses = (query: string): Course[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockCourses.filter(
    course =>
      course.title.toLowerCase().includes(lowercaseQuery) ||
      course.description.toLowerCase().includes(lowercaseQuery) ||
      course.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};
