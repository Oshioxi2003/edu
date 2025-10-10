import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to get auth store (to avoid circular dependency)
const getAuthStore = () => {
  if (typeof window !== 'undefined') {
    const { useAuthStore } = require('@/store/authStore');
    return useAuthStore.getState();
  }
  return null;
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const authStore = getAuthStore();
    const token = authStore?.getAccessToken?.();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 (Unauthorized) - Try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const authStore = getAuthStore();
        const refreshToken = authStore?.getRefreshToken?.();
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Try to refresh token
        const response = await axios.post(`${API_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });
        
        const newAccessToken = response.data.access;
        
        // Update token in store
        authStore?.setAccessToken?.(newAccessToken);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout and redirect to login
        if (typeof window !== 'undefined') {
          const authStore = getAuthStore();
          authStore?.logout?.();
          window.location.href = '/sign-in';
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors - Don't show toast for all errors
    // Let the calling code handle error display
    return Promise.reject(error);
  }
);

export default axiosInstance;

