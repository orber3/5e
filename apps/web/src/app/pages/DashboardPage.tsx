import React from 'react';
import { Typography, Row, Col, Card, Statistic } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import useAuth from '@app/hooks/useAuth';
import { DASHBOARD_PAGE } from '@app/consts/strings';

const { Title } = Typography;

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <>
      <Title level={2}>{DASHBOARD_PAGE.TITLE}</Title>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title={DASHBOARD_PAGE.WELCOME_TITLE}
              value={user?.email || DASHBOARD_PAGE.DEFAULT_USER}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={16}>
          <Card title={DASHBOARD_PAGE.ACCOUNT_INFO.TITLE}>
            <p>
              <strong>{DASHBOARD_PAGE.ACCOUNT_INFO.EMAIL_LABEL}</strong>{' '}
              {user?.email}
            </p>
            <p>
              <strong>{DASHBOARD_PAGE.ACCOUNT_INFO.USER_ID_LABEL}</strong>{' '}
              {user?.id}
            </p>
            <p>
              <strong>{DASHBOARD_PAGE.ACCOUNT_INFO.CREATED_AT_LABEL}</strong>{' '}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : DASHBOARD_PAGE.ACCOUNT_INFO.NOT_AVAILABLE}
            </p>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DashboardPage;
