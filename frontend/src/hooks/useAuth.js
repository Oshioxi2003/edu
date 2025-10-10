import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { authAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, setAuth, setUser, logout: clearAuth, isAuthenticated, getRefreshToken } = useAuthStore();

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
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (response) => {
      const { refresh, access } = response.data;
      // Note: Backend returns user data separately in /auth/me/ endpoint
      // For now, we'll store tokens and fetch user data
      setAuth(null, access, refresh);
      
      // Fetch user data after login
      authAPI.getCurrentUser().then((userResponse) => {
        setUser(userResponse.data);
        queryClient.setQueryData(['user'], userResponse.data);
      });
      
      toast.success('Đăng nhập thành công!');
      router.push('/courses');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 'Đăng nhập thất bại';
      toast.error(errorMessage);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: (response) => {
      const { user: userData, access, refresh } = response.data;
      setAuth(userData, access, refresh);
      queryClient.setQueryData(['user'], userData);
      toast.success('Đăng ký thành công!');
      router.push('/courses');
    },
    onError: (error) => {
      const errors = error.response?.data;
      if (errors) {
        // Display validation errors
        if (typeof errors === 'object') {
          Object.keys(errors).forEach(key => {
            const messages = Array.isArray(errors[key]) ? errors[key] : [errors[key]];
            messages.forEach(msg => {
              toast.error(`${key}: ${msg}`);
            });
          });
        } else {
          toast.error(errors.detail || 'Đăng ký thất bại');
        }
      } else {
        toast.error('Đăng ký thất bại');
      }
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => {
      const refreshToken = getRefreshToken();
      return authAPI.logout(refreshToken);
    },
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success('Đã đăng xuất');
      router.push('/sign-in');
    },
    onError: () => {
      // Even if logout fails on server, clear local state
      clearAuth();
      queryClient.clear();
      router.push('/sign-in');
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: authAPI.patchProfile,
    onSuccess: (response) => {
      const updatedUser = { ...user, profile: response.data };
      setUser(updatedUser);
      queryClient.setQueryData(['user'], updatedUser);
      toast.success('Cập nhật thông tin thành công!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 'Cập nhật thất bại';
      toast.error(errorMessage);
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: authAPI.changePassword,
    onSuccess: () => {
      toast.success('Đổi mật khẩu thành công!');
    },
    onError: (error) => {
      const errors = error.response?.data;
      if (errors) {
        Object.keys(errors).forEach(key => {
          const messages = Array.isArray(errors[key]) ? errors[key] : [errors[key]];
          messages.forEach(msg => {
            toast.error(msg);
          });
        });
      } else {
        toast.error('Đổi mật khẩu thất bại');
      }
    },
  });

  return {
    user: currentUser || user,
    isAuthenticated,
    isLoading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    changePassword: changePasswordMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
  };
}

