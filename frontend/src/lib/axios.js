import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Access token is in httpOnly cookie, no need to manually set
    // But we can add CSRF token if needed
    const csrfToken = Cookies.get('csrftoken');
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
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

    // Handle 401 (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        await axios.post(`${API_URL}/users/token/refresh/`, {}, {
          withCredentials: true,
        });
        
        // Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        if (typeof window !== 'undefined') {
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          window.location.href = '/sign-in';
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const message = error.response?.data?.detail 
      || error.response?.data?.message 
      || error.message 
      || 'Đã có lỗi xảy ra';
    
    if (typeof window !== 'undefined') {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

