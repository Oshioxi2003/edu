import { useQuery } from '@tanstack/react-query';
import { catalogAPI, progressAPI } from '@/lib/api';

export function useCourses(filters = {}) {
  return useQuery({
    queryKey: ['courses', filters],
    queryFn: async () => {
      const response = await catalogAPI.getBooks(filters);
      return response.data;
    },
  });
}

export function useCourse(id) {
  return useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      const response = await catalogAPI.getBook(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCourseUnits(bookId) {
  return useQuery({
    queryKey: ['course-units', bookId],
    queryFn: async () => {
      const response = await catalogAPI.getUnits(bookId);
      return response.data;
    },
    enabled: !!bookId,
  });
}

export function useUserProgress() {
  return useQuery({
    queryKey: ['user-progress'],
    queryFn: async () => {
      const response = await progressAPI.getUserProgress();
      return response.data;
    },
  });
}

