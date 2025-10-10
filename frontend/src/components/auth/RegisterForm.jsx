'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '@/lib/validations';
import { useAuth } from '@/hooks/useAuth';
import { Button, Input } from '@/components/ui';
import Link from 'next/link';

export default function RegisterForm() {
  const { register: registerUser, isRegistering } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = (data) => {
    registerUser(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Input
          label="Họ và tên"
          type="text"
          placeholder="Nguyễn Văn A"
          error={errors.display_name?.message}
          {...register('display_name')}
        />
      </div>

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
          helperText="Tối thiểu 8 ký tự"
          {...register('password')}
        />
      </div>

      <div>
        <Input
          label="Xác nhận mật khẩu"
          type="password"
          placeholder="••••••••"
          error={errors.password_confirm?.message}
          {...register('password_confirm')}
        />
      </div>

      <div className="flex items-start">
        <input
          id="terms"
          type="checkbox"
          required
          className="w-4 h-4 mt-1 text-primary border-gray-300 rounded focus:ring-primary-500"
        />
        <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
          Tôi đồng ý với{' '}
          <Link href="/terms" className="text-primary hover:text-primary-600">
            Điều khoản dịch vụ
          </Link>{' '}
          và{' '}
          <Link href="/privacy" className="text-primary hover:text-primary-600">
            Chính sách bảo mật
          </Link>
        </label>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        isLoading={isRegistering}
      >
        Đăng ký
      </Button>

      <p className="text-center text-sm text-gray-600">
        Đã có tài khoản?{' '}
        <Link href="/sign-in" className="font-semibold text-primary hover:text-primary-600">
          Đăng nhập
        </Link>
      </p>
    </form>
  );
}

