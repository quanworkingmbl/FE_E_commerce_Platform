import { forwardRef, type CSSProperties, type ReactNode } from "react";

type CmsLayoutProps = {
  logo?: string | ReactNode;
  headerTitle: string;
  subTitle?: string;
  actions?: ReactNode;
  tools?: ReactNode;
  filters?: ReactNode;
  topStyle?: CSSProperties;
  contentStyle?: CSSProperties;
  children?: ReactNode;
};

const CmsLayout = forwardRef<HTMLDivElement, CmsLayoutProps>(
  ({ logo, headerTitle, subTitle, actions, tools, filters, topStyle, contentStyle, children }, ref) => (
    <div ref={ref} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: "none", background: "#fff", borderBottom: "1px solid #f0f0f0", ...topStyle }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", padding: "16px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            {logo}
            <div>
              <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{headerTitle}</h1>
              {subTitle && <p style={{ margin: 0, color: "#888", fontSize: 13 }}>{subTitle}</p>}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {actions}
            {tools}
          </div>
        </div>
        {filters && <div style={{ padding: "12px 24px", background: "#fafafa", borderTop: "1px solid #f0f0f0" }}>{filters}</div>}
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: "16px 0", ...contentStyle }}>{children}</div>
    </div>
  ),
);
CmsLayout.displayName = "CmsLayout";
export default CmsLayout;
