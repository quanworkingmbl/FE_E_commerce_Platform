import {
  AppstoreOutlined,
  BarChartOutlined,
  CreditCardOutlined,
  GiftOutlined,
  HomeOutlined,
  RollbackOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  TagsOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

export type NavItem = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  disabled?: boolean;
  children?: NavItem[];
};

export const NAV_WIDTH = 260;
export const NAV_COLLAPSED_WIDTH = 80;

export const navItems: NavItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <HomeOutlined />,
    path: "/admin/dashboard",
  },
  {
    key: "catalog",
    label: "Catalog",
    icon: <AppstoreOutlined />,
    children: [
      { key: "products", label: "Products", icon: <ShoppingOutlined />, path: "/admin/products" },
      { key: "categories", label: "Categories", icon: <TagsOutlined />, path: "/admin/categories" },
      { key: "brands", label: "Brands", icon: <GiftOutlined />, path: "/admin/brands" },
    ],
  },
  {
    key: "inventory",
    label: "Inventory",
    icon: <BarChartOutlined />,
    path: "/admin/inventory",
  },
  {
    key: "orders",
    label: "Orders",
    icon: <ShoppingCartOutlined />,
    path: "/admin/orders",
  },
  {
    key: "payments",
    label: "Payments",
    icon: <CreditCardOutlined />,
    path: "/admin/payments",
  },
  {
    key: "promotions",
    label: "Promotions",
    icon: <GiftOutlined />,
    path: "/admin/promotions",
  },
  {
    key: "returns",
    label: "Returns",
    icon: <RollbackOutlined />,
    path: "/admin/returns",
    disabled: true,
  },
  {
    key: "users",
    label: "Users",
    icon: <TeamOutlined />,
    path: "/admin/users",
    disabled: true,
  },
  {
    key: "settings",
    label: "Settings",
    icon: <SettingOutlined />,
    path: "/admin/settings",
    disabled: true,
  },
  {
    key: "profile",
    label: "Profile",
    icon: <UserOutlined />,
    path: "/profile",
  },
];

export const toMenuItems = (items: NavItem[]): MenuProps["items"] =>
  items.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
    disabled: item.disabled,
    children: item.children ? toMenuItems(item.children) : undefined,
  }));
