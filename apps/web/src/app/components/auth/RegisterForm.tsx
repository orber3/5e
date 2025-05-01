import React from 'react';
import { Form, Input, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Controller } from 'react-hook-form';
import SubmitButton from '../ui/SubmitButton';
import { RegisterFormData } from '../../hooks/useRegister';
import type { UseFormReturn } from 'react-hook-form';

interface RegisterFormProps {
  form: UseFormReturn<RegisterFormData>;
  onSubmit: (data: RegisterFormData) => void;
  loading: boolean;
  error: string | null;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  form,
  onSubmit,
  loading,
  error,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit(onSubmit)}
      className="register-form"
    >
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Form.Item
        label="Email"
        validateStatus={errors.email ? 'error' : ''}
        help={errors.email?.message}
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              prefix={<UserOutlined />}
              placeholder="Email"
              size="large"
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Password"
        validateStatus={errors.password ? 'error' : ''}
        help={errors.password?.message}
      >
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input.Password
              {...field}
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Confirm Password"
        validateStatus={errors.confirmPassword ? 'error' : ''}
        help={errors.confirmPassword?.message}
      >
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <Input.Password
              {...field}
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
              size="large"
            />
          )}
        />
      </Form.Item>

      <Form.Item>
        <SubmitButton loading={loading} text="Register" size="large" />
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
