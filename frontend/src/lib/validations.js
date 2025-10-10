import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc'),
  password: yup
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .required('Mật khẩu là bắt buộc'),
});

export const registerSchema = yup.object().shape({
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc'),
  display_name: yup
    .string()
    .min(2, 'Họ tên phải có ít nhất 2 ký tự')
    .required('Họ tên là bắt buộc'),
  password: yup
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .required('Mật khẩu là bắt buộc'),
  password_confirm: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Mật khẩu xác nhận không khớp')
    .required('Xác nhận mật khẩu là bắt buộc'),
});

export const changePasswordSchema = yup.object().shape({
  old_password: yup
    .string()
    .required('Mật khẩu cũ là bắt buộc'),
  new_password: yup
    .string()
    .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
    .required('Mật khẩu mới là bắt buộc'),
  new_password_confirm: yup
    .string()
    .oneOf([yup.ref('new_password'), null], 'Mật khẩu xác nhận không khớp')
    .required('Xác nhận mật khẩu mới là bắt buộc'),
});

