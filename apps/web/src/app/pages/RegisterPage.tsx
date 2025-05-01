import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import RegisterForm from '../components/auth/RegisterForm';
import useRegister from '../hooks/useRegister';
import AppRoutes from '../routes';

export const RegisterPage: React.FC = () => {
  const { form, loading, error, onSubmit } = useRegister();

  return (
    <AuthLayout
      title="Register"
      footer={
        <>
          Already have an account? <Link to={AppRoutes.LOGIN}>Log in!</Link>
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
