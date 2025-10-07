'use client';

import Link from 'next/link';
import { Course } from '@/types/course';
import { Star, Users, Clock, BookOpen } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const discountPercent = course.originalPrice 
    ? Math.round((1 - course.price / course.originalPrice) * 100)
    : 0;

  return (
    <Link href={`/course/${course.id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer h-full flex flex-col">
        {/* Course Thumbnail */}
        <div className="relative h-48 bg-gradient-to-br from-primary-400 to-primary-600">
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-white opacity-50" />
          </div>
          
          {/* Discount Badge */}
          {discountPercent > 0 && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
              -{discountPercent}%
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute bottom-3 left-3 bg-white bg-opacity-90 px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
            {course.category}
          </div>
        </div>

        {/* Course Info */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
            {course.title}
          </h3>
          
          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
            {course.description}
          </p>
          
          {/* Meta Info */}
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-semibold text-gray-900">{course.rating}</span>
              <span>({course.totalRatings})</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{course.totalStudents.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration}</span>
            </div>
          </div>

          {/* Instructor */}
          <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600">
            <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {course.instructor.charAt(0)}
            </div>
            <span>{course.instructor}</span>
          </div>

          {/* Price & Level */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-primary-600">
                  {formatPrice(course.price)}
                </span>
                {course.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(course.originalPrice)}
                  </span>
                )}
              </div>
            </div>
            
            <div className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">
              {course.level}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;