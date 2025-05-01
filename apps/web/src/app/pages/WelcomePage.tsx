import React from 'react';
import { Layout, Typography, Button, Space, Row, Col, Card } from 'antd';
import { UserOutlined, LoginOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import AppRoutes from '../routes';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

export const WelcomePage: React.FC = () => {
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
          My App
        </Typography.Title>
        <Space>
          <Link to={AppRoutes.LOGIN}>
            <Button type="primary" icon={<LoginOutlined />}>
              Login
            </Button>
          </Link>
          <Link to={AppRoutes.REGISTER}>
            <Button icon={<UserOutlined />}>Register</Button>
          </Link>
        </Space>
      </Header>

      <Content style={{ padding: '50px 50px' }}>
        <Row
          gutter={[24, 24]}
          justify="center"
          align="middle"
          style={{ minHeight: '70vh' }}
        >
          <Col xs={24} md={12}>
            <Title>Welcome to Our Application</Title>
            <Paragraph style={{ fontSize: 18 }}>
              This is a demo application with authentication features built with
              React, Ant Design, and NestJS backend with MongoDB.
            </Paragraph>
            <Space
              direction="horizontal"
              size="middle"
              style={{ marginTop: 24 }}
            >
              <Link to={AppRoutes.LOGIN}>
                <Button type="primary" size="large">
                  Login
                </Button>
              </Link>
              <Link to={AppRoutes.REGISTER}>
                <Button size="large">Register</Button>
              </Link>
            </Space>
          </Col>

          <Col xs={24} md={12}>
            <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <Title level={2}>Features</Title>
              <ul style={{ fontSize: 16, lineHeight: '1.8' }}>
                <li>User authentication with JWT</li>
                <li>Secure cookie-based authentication</li>
                <li>User registration and login</li>
                <li>Protected routes</li>
                <li>MongoDB database</li>
                <li>React with Ant Design UI components</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </Content>

  
    </Layout>
  );
};

export default WelcomePage;
