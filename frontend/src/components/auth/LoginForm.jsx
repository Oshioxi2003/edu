'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '@/lib/validations';
import { useAuth } from '@/hooks/useAuth';
import { Button, Input } from '@/components/ui';
import Link from 'next/link';

export default function LoginForm() {
  const { login, isLoggingIn } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = (data) => {
    login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Input
          label="Email"
          type="email"
          placeholder="your@email.com"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <div>
        <Input
          label="Mật khẩu"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-600">Ghi nhớ đăng nhập</span>
        </label>
        <Link href="/forgot-password" className="text-sm text-primary hover:text-primary-600">
          Quên mật khẩu?
        </Link>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        isLoading={isLoggingIn}
      >
        Đăng nhập
      </Button>

      <p className="text-center text-sm text-gray-600">
        Chưa có tài khoản?{' '}
        <Link href="/register" className="font-semibold text-primary hover:text-primary-600">
          Đăng ký ngay
        </Link>
      </p>
    </form>
  );
}

