import React from 'react';
import { Layout, Typography, Button, Space, Row, Col, Card } from 'antd';
import { UserOutlined, LoginOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import AppRoutes from '../routes';
import { WELCOME_PAGE } from '@app/consts/strings';

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
          {WELCOME_PAGE.APP_NAME}
        </Typography.Title>
        <Space>
          <Link to={AppRoutes.LOGIN}>
            <Button type="primary" icon={<LoginOutlined />}>
              {WELCOME_PAGE.LOGIN_BUTTON}
            </Button>
          </Link>
          <Link to={AppRoutes.REGISTER}>
            <Button icon={<UserOutlined />}>
              {WELCOME_PAGE.REGISTER_BUTTON}
            </Button>
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
            <Title>{WELCOME_PAGE.WELCOME_HEADING}</Title>
            <Paragraph style={{ fontSize: 18 }}>
              {WELCOME_PAGE.WELCOME_DESCRIPTION}
            </Paragraph>
            <Space
              direction="horizontal"
              size="middle"
              style={{ marginTop: 24 }}
            >
              <Link to={AppRoutes.LOGIN}>
                <Button type="primary" size="large">
                  {WELCOME_PAGE.LOGIN_BUTTON}
                </Button>
              </Link>
              <Link to={AppRoutes.REGISTER}>
                <Button size="large">{WELCOME_PAGE.REGISTER_BUTTON}</Button>
              </Link>
            </Space>
          </Col>

          <Col xs={24} md={12}>
            <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <Title level={2}>{WELCOME_PAGE.FEATURES.HEADING}</Title>
              <ul style={{ fontSize: 16, lineHeight: '1.8' }}>
                {WELCOME_PAGE.FEATURES.LIST.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default WelcomePage;
