import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard";
import ProtectedRoute from "@/router/components/protected-route";
import DashboardPage from "@/pages/dashboard";
import LoginPage from "@/pages/login";
import ProfilePage from "@/pages/profile";
import ProductsPage from "@/pages/products";
import CategoriesPage from "@/pages/categories";
import BrandsPage from "@/pages/brands";
import PromotionsPage from "@/pages/promotions";
import InventoryPage from "@/pages/inventory";
import OrdersPage from "@/pages/orders";

const HOMEPAGE = import.meta.env.VITE_APP_HOMEPAGE || "/admin/dashboard";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to={HOMEPAGE} replace />} />
          <Route path="admin/dashboard" element={<DashboardPage />} />
          <Route path="admin/products" element={<ProductsPage />} />
          <Route path="admin/categories" element={<CategoriesPage />} />
          <Route path="admin/brands" element={<BrandsPage />} />
          <Route path="admin/promotions" element={<PromotionsPage />} />
          <Route path="admin/inventory" element={<InventoryPage />} />
          <Route path="admin/orders" element={<OrdersPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to={HOMEPAGE} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
