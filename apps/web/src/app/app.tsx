import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppRoutes from './routes';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ConfigProvider } from 'antd';

export function App() {
  return (
    <ConfigProvider>
      <Routes>
        <Route path={AppRoutes.WELCOME} element={<WelcomePage />} />
        <Route path={AppRoutes.LOGIN} element={<LoginPage />} />
        <Route path={AppRoutes.REGISTER} element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path={AppRoutes.DASHBOARD} element={<DashboardPage />} />
          {/* Add more protected routes here */}
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to={AppRoutes.LOGIN} replace />} />
      </Routes>
    </ConfigProvider>
  );
}

export default App;
