import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '@app/components/layout/AuthLayout';
import LoginForm from '@app/components/auth/LoginForm';
import useLogin from '@app/hooks/useLogin';
import AppRoutes from '@app/routes';

export const LoginPage: React.FC = () => {
  const { form, loading, error, onSubmit } = useLogin();

  return (
    <AuthLayout
      title="Log In"
      footer={
        <>
          Don't have an account?{' '}
          <Link to={AppRoutes.REGISTER}>Register now!</Link>
        </>
      }
    >
      <LoginForm
        form={form}
        onSubmit={onSubmit}
        loading={loading}
        error={error}
      />
    </AuthLayout>
  );
};

export default LoginPage;
