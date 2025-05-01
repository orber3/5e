import React from 'react';
import { Typography, Row, Col, Card, Statistic } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import useAuth from '@app/hooks/useAuth';

const { Title } = Typography;

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <>
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
    </>
  );
};

export default DashboardPage;
