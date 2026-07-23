import { useCallback, useEffect, useRef, useState } from "react";
import { Badge, Button, Empty, Modal, Popover, Spin, Tag, Tooltip } from "antd";
import { BellOutlined, CheckOutlined, ReloadOutlined } from "@ant-design/icons";
import { notificationService } from "@/api/services/notificationService";
import type { NotificationCategory, NotificationItem } from "@/types/notification";

const CATEGORY_META: Record<NotificationCategory, { label: string; color: string }> = {
  ORDER: { label: "Đơn hàng", color: "blue" },
  SYSTEM: { label: "Hệ thống", color: "orange" },
  PROMOTION: { label: "Khuyến mãi", color: "green" },
  PAYMENT: { label: "Thanh toán", color: "purple" },
};

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s trước`;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
}

export default function NotificationBell() {
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<NotificationItem | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchUnread = useCallback(async () => {
    try {
      const res = await notificationService.unreadCount();
      setUnread(res.unreadCount);
    } catch {
      // silent
    }
  }, []);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await notificationService.list(0, 50);
      setItems(res.items);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnread();
    timerRef.current = setInterval(fetchUnread, 30000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [fetchUnread]);

  useEffect(() => {
    if (open) fetchList();
  }, [open, fetchList]);

  const markRead = async (id: number) => {
    await notificationService.markRead(id);
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setUnread((prev) => Math.max(0, prev - 1));
  };

  const markAllRead = async () => {
    await notificationService.markAllRead();
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnread(0);
  };

  const content = (
    <div style={{ width: 360, maxHeight: 420, overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <strong>Thông báo {unread > 0 ? `(${unread})` : ""}</strong>
        <div>
          <Tooltip title="Làm mới">
            <Button type="text" size="small" icon={<ReloadOutlined />} onClick={fetchList} loading={loading} />
          </Tooltip>
          {unread > 0 && (
            <Tooltip title="Đọc tất cả">
              <Button type="text" size="small" icon={<CheckOutlined />} onClick={markAllRead} />
            </Tooltip>
          )}
        </div>
      </div>
      {loading && <div style={{ textAlign: "center", padding: 16 }}><Spin size="small" /></div>}
      {!loading && items.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có thông báo" />}
      {!loading && items.map((n) => {
        const meta = CATEGORY_META[n.category] ?? { label: n.category, color: "default" };
        return (
          <div
            key={n.id}
            onClick={() => { if (!n.read) markRead(n.id); setSelected(n); }}
            style={{
              padding: "8px 10px",
              marginBottom: 4,
              borderRadius: 6,
              cursor: "pointer",
              background: n.read ? "#fafafa" : "#e6f4ff",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
              <strong style={{ fontSize: 12 }}>{n.title}</strong>
              <Tag color={meta.color} style={{ margin: 0, fontSize: 10 }}>{meta.label}</Tag>
            </div>
            <div style={{ fontSize: 12, color: "#666", marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {n.message}
            </div>
            <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>{timeAgo(n.createdAt)}</div>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      <Popover content={content} trigger="click" open={open} onOpenChange={setOpen} placement="bottomRight">
        <Badge count={unread} size="small" overflowCount={99}>
          <Button type="text" shape="circle" icon={<BellOutlined style={{ fontSize: 18 }} />} />
        </Badge>
      </Popover>
      <Modal
        open={!!selected}
        title={selected?.title}
        onCancel={() => setSelected(null)}
        footer={<Button onClick={() => setSelected(null)}>Đóng</Button>}
      >
        {selected && (
          <>
            <Tag color={CATEGORY_META[selected.category]?.color}>{CATEGORY_META[selected.category]?.label}</Tag>
            <p style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>{selected.message}</p>
            <p style={{ color: "#999", fontSize: 12 }}>{new Date(selected.createdAt).toLocaleString("vi-VN")}</p>
          </>
        )}
      </Modal>
    </>
  );
}
