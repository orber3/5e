import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from './routes';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PortfolioPage from './pages/PortfolioPage';
import StockDetailsPage from './pages/StockDetailsPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ConfigProvider } from 'antd';
import { StoreProvider } from './stores/storeContext';

export function App() {
  return (
    <StoreProvider>
      <ConfigProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
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
          <Route path="*" element={<Navigate to={AppRoutes.LOGIN} replace />} />
        </Routes>
      </ConfigProvider>
    </StoreProvider>
  );
}

export default App;
