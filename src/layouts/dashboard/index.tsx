import { Layout, Menu } from "antd";
import { useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { NAV_COLLAPSED_WIDTH, NAV_WIDTH, navItems, toMenuItems } from "./config";
import DashboardHeader from "./header";

const { Sider, Content } = Layout;

function findSelectedKeys(pathname: string): string[] {
  for (const item of navItems) {
    if (item.path === pathname) return [item.key];
    if (item.children) {
      for (const child of item.children) {
        if (child.path === pathname) return [child.key];
      }
    }
  }
  return ["dashboard"];
}

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const selectedKeys = useMemo(() => findSelectedKeys(location.pathname), [location.pathname]);

  const handleMenuClick = ({ key }: { key: string }) => {
    const findPath = (items: typeof navItems): string | undefined => {
      for (const item of items) {
        if (item.key === key) return item.disabled ? undefined : item.path;
        if (item.children) {
          const childPath = findPath(item.children);
          if (childPath) return childPath;
        }
      }
      return undefined;
    };
    const path = findPath(navItems);
    if (path) navigate(path);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={NAV_WIDTH}
        collapsedWidth={NAV_COLLAPSED_WIDTH}
        theme="dark"
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 700,
            fontSize: collapsed ? 14 : 18,
          }}
        >
          {collapsed ? "EC" : "E-Commerce"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          items={toMenuItems(navItems)}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <DashboardHeader />
        <Content style={{ margin: 16, padding: 24, background: "#fff", borderRadius: 8 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
