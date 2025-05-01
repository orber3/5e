import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService, { User } from '../services/auth.service';
import userService from '../services/user.service';
import AppRoutes from '../routes';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check auth status (makes an API call that checks the cookie)
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = await userService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Handle successful authentication
  const handleAuthSuccess = useCallback(
    (userData: User) => {
      setUser(userData);
      navigate(AppRoutes.DASHBOARD);
    },
    [navigate]
  );

  // Logout user
  const logout = useCallback(async () => {
    try {
      await authService.logout(); // This API call will clear the auth cookie
      setUser(null);
      navigate(AppRoutes.LOGIN);
    } catch (error) {
      console.error('Logout failed', error);
    }
  }, [navigate]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    handleAuthSuccess,
    logout,
    checkAuth,
  };
};

export default useAuth;
