import React from 'react';
import { Layout, Menu } from 'antd';
import { DashboardOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import AppRoutes from '@app/routes';

const { Sider } = Layout;

// Define sidebar menu items - can be extended as new routes are added
export const menuItems = [
  {
    key: AppRoutes.DASHBOARD,
    icon: <DashboardOutlined />,
    label: 'Dashboard',
    path: AppRoutes.DASHBOARD,
  },
  // Add more menu items as needed
];

interface AppSidebarProps {
  currentPath: string;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ currentPath }) => {
  // Find the active key based on the current path
  const activeKey =
    menuItems.find((item) => item.path === currentPath)?.key ||
    AppRoutes.DASHBOARD;

  return (
    <Sider width={200} style={{ background: '#fff' }}>
      <Menu
        mode="inline"
        selectedKeys={[activeKey]}
        style={{ height: '100%', borderRight: 0 }}
      >
        {menuItems.map((item) => (
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.path}>
              <span
                style={{
                  fontWeight: item.key === activeKey ? 'bold' : 'normal',
                }}
              >
                {item.label}
              </span>
            </Link>
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  );
};

export default AppSidebar;
