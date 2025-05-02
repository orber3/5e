import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { lazy, Suspense } from 'react';
import AppRoutes from './routes';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ConfigProvider, Spin } from 'antd';
import { StoreProvider } from './stores/storeContext';

// Lazy load page components
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const StockDetailsPage = lazy(() => import('./pages/StockDetailsPage'));

// Loading component for Suspense fallback
const PageLoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <Spin size="large" tip="Loading page..." />
  </div>
);

export function App() {
  return (
    <StoreProvider>
      <ConfigProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Suspense fallback={<PageLoadingSpinner />}>
          <Routes>
            {/* Redirect from root to portfolio */}
            <Route
              path="/"
              element={<Navigate to={AppRoutes.PORTFOLIO} replace />}
            />

            <Route path={AppRoutes.LOGIN} element={<LoginPage />} />
            <Route path={AppRoutes.REGISTER} element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path={AppRoutes.PORTFOLIO} element={<PortfolioPage />} />
              <Route
                path={AppRoutes.STOCK_DETAILS}
                element={<StockDetailsPage />}
              />
            </Route>

            {/* Fallback route */}
            <Route
              path="*"
              element={<Navigate to={AppRoutes.LOGIN} replace />}
            />
          </Routes>
        </Suspense>
      </ConfigProvider>
    </StoreProvider>
  );
}

export default App;
