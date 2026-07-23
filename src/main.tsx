import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "@/router";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider locale={viVN}>
      <AppRouter />
    </ConfigProvider>
  </StrictMode>,
);
