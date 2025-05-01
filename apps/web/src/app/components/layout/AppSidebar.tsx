import React from 'react';
import { Layout, Menu } from 'antd';
import { DashboardOutlined, StockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AppRoutes from '@app/routes';

const { Sider } = Layout;

interface AppSidebarProps {
  currentPath: string;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ currentPath }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      key: AppRoutes.PORTFOLIO,
      icon: <StockOutlined />,
      label: 'Portfolio',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  // Find the currently selected keys based on currentPath
  const selectedKey =
    menuItems.find((item) => currentPath.startsWith(item.key))?.key ||
    AppRoutes.PORTFOLIO;

  return (
    <Sider
      width={200}
      style={{
        background: '#fff',
        borderRight: '1px solid #f0f0f0',
        overflow: 'auto',
        height: '100%',
        position: 'sticky',
        left: 0,
        top: 0,
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={handleMenuClick}
        style={{ height: '100%', borderRight: 0 }}
        items={menuItems}
      />
    </Sider>
  );
};

export default AppSidebar;
