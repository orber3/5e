import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '@app/components/layout/AuthLayout';
import LoginForm from '@app/components/auth/LoginForm';
import useLogin from '@app/hooks/useLogin';
import AppRoutes from '@app/routes';
import { LOGIN_PAGE } from '@app/consts/strings';

export const LoginPage: React.FC = () => {
  const { form, loading, error, onSubmit } = useLogin();

  return (
    <AuthLayout
      title={LOGIN_PAGE.TITLE}
      footer={
        <>
          {LOGIN_PAGE.NO_ACCOUNT_TEXT}{' '}
          <Link to={AppRoutes.REGISTER}>{LOGIN_PAGE.REGISTER_LINK_TEXT}</Link>
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
