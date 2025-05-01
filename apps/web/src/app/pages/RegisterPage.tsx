import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import RegisterForm from '../components/auth/RegisterForm';
import useRegister from '../hooks/useRegister';
import AppRoutes from '../routes';
import { REGISTER_PAGE } from '@app/consts/strings';

export const RegisterPage: React.FC = () => {
  const { form, loading, error, onSubmit } = useRegister();

  return (
    <AuthLayout
      title={REGISTER_PAGE.TITLE}
      footer={
        <>
          {REGISTER_PAGE.HAVE_ACCOUNT_TEXT}{' '}
          <Link to={AppRoutes.LOGIN}>{REGISTER_PAGE.LOGIN_LINK_TEXT}</Link>
        </>
      }
    >
      <RegisterForm
        form={form}
        onSubmit={onSubmit}
        loading={loading}
        error={error}
      />
    </AuthLayout>
  );
};

export default RegisterPage;
