import React, { ReactNode } from 'react';
import { Layout } from 'antd';
import { useLocation } from 'react-router-dom';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import useAuth from '@app/hooks/useAuth';

const { Content } = Layout;

interface ProtectedLayoutProps {
  children: ReactNode;
}

export const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({
  children,
}) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader user={user} logout={logout} />

      <Layout>
        <AppSidebar currentPath={currentPath} />

        <Content style={{ padding: '24px', margin: 0, minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ProtectedLayout;
