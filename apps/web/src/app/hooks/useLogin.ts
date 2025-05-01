import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import authService from '../services/auth.service';
import AppRoutes from '../routes';

// Define Zod schema for login form
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Initialize react-hook-form with zod validation
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setError(null);

      // This API call will set the cookie automatically
      await authService.login({
        email: data.email,
        password: data.password,
      });

      // Navigate to dashboard - no need to store anything in localStorage
      navigate(AppRoutes.PORTFOLIO);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    error,
    onSubmit,
  };
};

export default useLogin;
