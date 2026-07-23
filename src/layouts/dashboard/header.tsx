import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Layout, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { authService } from "@/api/services/authService";
import { useUserActions, useUserInfo, useUserToken } from "@/store/userStore";

const { Header } = Layout;

export default function DashboardHeader() {
  const user = useUserInfo();
  const { refreshToken } = useUserToken();
  const { clearUserInfoAndToken } = useUserActions();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } finally {
      clearUserInfoAndToken();
      navigate("/login", { replace: true });
    }
  };

  const menuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
      onClick: () => navigate("/profile"),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <Header
      style={{
        background: "#fff",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <Typography.Title level={4} style={{ margin: 0 }}>
        Admin Portal
      </Typography.Title>
      <Dropdown menu={{ items: menuItems }}>
        <Space style={{ cursor: "pointer" }}>
          <Avatar icon={<UserOutlined />} src={user?.avatarUrl} />
          <span>{user?.fullName || user?.email}</span>
        </Space>
      </Dropdown>
    </Header>
  );
}
