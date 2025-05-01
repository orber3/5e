import React, { ReactNode } from 'react';
import { Layout, Typography, Card } from 'antd';
import { APP_TITLE } from '../../consts/strings';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  footer?: ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  footer,
}) => {
  return (
    <Layout className="auth-layout" style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Typography.Title level={3} style={{ margin: 0 }}>
          Stock Management Website
        </Typography.Title>
      </Header>

      <Content
        style={{
          padding: '50px 50px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Card
          bordered={false}
          style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        >
          <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
            {title}
          </Title>
          {children}

          {footer && (
            <div style={{ marginTop: 16, textAlign: 'center' }}>{footer}</div>
          )}
        </Card>
      </Content>
    </Layout>
  );
};

export default AuthLayout;
