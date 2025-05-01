import React from 'react';
import {
  Layout,
  Menu,
  Button,
  Typography,
  Row,
  Col,
  Card,
  Statistic,
} from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import useAuth from '@app/hooks/useAuth';
import { APP_TITLE } from '@Consts/strings';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <Layout style={{ minHeight: '100vh' }}>
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

      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['dashboard']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
              Dashboard
            </Menu.Item>
          </Menu>
        </Sider>

        <Content style={{ padding: '24px', margin: 0, minHeight: 280 }}>
          <Title level={2}>Dashboard</Title>
          <Row gutter={16}>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Welcome"
                  value={user?.email || 'User'}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col span={16}>
              <Card title="Account Information">
                <p>
                  <strong>Email:</strong> {user?.email}
                </p>
                <p>
                  <strong>User ID:</strong> {user?.id}
                </p>
                <p>
                  <strong>Created at:</strong>{' '}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : 'N/A'}
                </p>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardPage;
