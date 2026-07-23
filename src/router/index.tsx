import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard";
import ProtectedRoute from "@/router/components/protected-route";
import DashboardPage from "@/pages/dashboard";
import LoginPage from "@/pages/login";
import ProfilePage from "@/pages/profile";

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
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to={HOMEPAGE} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
