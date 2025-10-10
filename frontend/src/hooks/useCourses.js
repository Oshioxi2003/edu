import { useQuery } from '@tanstack/react-query';
import { catalogAPI, progressAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export function useCourses(filters = {}) {
  return useQuery({
    queryKey: ['courses', filters],
    queryFn: async () => {
      const response = await catalogAPI.getBooks(filters);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCourse(slug) {
  return useQuery({
    queryKey: ['course', slug],
    queryFn: async () => {
      const response = await catalogAPI.getBook(slug);
      return response.data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCourseUnits(slug) {
  return useQuery({
    queryKey: ['course-units', slug],
    queryFn: async () => {
      const response = await catalogAPI.getBookUnits(slug);
      return response.data;
    },
    enabled: !!slug,
  });
}

export function useUnit(unitId) {
  return useQuery({
    queryKey: ['unit', unitId],
    queryFn: async () => {
      const response = await catalogAPI.getUnit(unitId);
      return response.data;
    },
    enabled: !!unitId,
  });
}

export function useUserProgress() {
  const { isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: ['user-progress'],
    queryFn: async () => {
      const response = await progressAPI.getProgress();
      return response.data.results || response.data;
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useProgressAnalytics() {
  const { isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: ['progress-analytics'],
    queryFn: async () => {
      const response = await progressAPI.getAnalytics();
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });
}

