import { Layout } from "antd";
import { Navigate } from "react-router-dom";
import { useUserToken } from "@/store/userStore";
import LoginForm from "./LoginForm";

const HOMEPAGE = import.meta.env.VITE_APP_HOMEPAGE || "/admin/dashboard";

export default function LoginPage() {
  const { accessToken } = useUserToken();

  if (accessToken) {
    return <Navigate to={HOMEPAGE} replace />;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "row",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "none",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 32,
            fontWeight: 700,
          }}
          className="login-hero"
        >
          E-Commerce Admin
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 32px",
            maxWidth: 480,
            margin: "0 auto",
            width: "100%",
          }}
        >
          <div style={{ width: "100%" }}>
            <LoginForm />
          </div>
        </div>
      </div>
      <style>{`
        @media (min-width: 768px) {
          .login-hero { display: flex !important; }
        }
      `}</style>
    </Layout>
  );
}
