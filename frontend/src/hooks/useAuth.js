import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { authAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, setUser, logout: clearAuth, isAuthenticated } = useAuthStore();

  // Get current user
  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await authAPI.getCurrentUser();
      setUser(response.data);
      return response.data;
    },
    enabled: isAuthenticated,
    retry: false,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (response) => {
      setUser(response.data.user);
      queryClient.setQueryData(['user'], response.data.user);
      toast.success('Đăng nhập thành công!');
      router.push('/courses');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Đăng nhập thất bại');
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: (response) => {
      setUser(response.data.user);
      queryClient.setQueryData(['user'], response.data.user);
      toast.success('Đăng ký thành công!');
      router.push('/courses');
    },
    onError: (error) => {
      const errors = error.response?.data;
      if (errors) {
        Object.keys(errors).forEach(key => {
          toast.error(`${key}: ${errors[key]}`);
        });
      } else {
        toast.error('Đăng ký thất bại');
      }
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success('Đã đăng xuất');
      router.push('/sign-in');
    },
  });

  return {
    user: currentUser || user,
    isAuthenticated,
    isLoading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
}

