import React from 'react';
import { Layout, Typography, Button } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { APP_TITLE } from '@app/consts/strings';
import { User } from '@app/services/auth.service';

const { Header } = Layout;

interface AppHeaderProps {
  user: User | null;
  logout: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ user, logout }) => {
  return (
    <Header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <Typography.Title level={3} style={{ margin: 0 }}>
        {APP_TITLE}
      </Typography.Title>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Typography.Text style={{ marginRight: 16 }}>
          <UserOutlined /> {user?.email}
        </Typography.Text>
        <Button icon={<LogoutOutlined />} onClick={logout}>
          Logout
        </Button>
      </div>
    </Header>
  );
};

export default AppHeader;
