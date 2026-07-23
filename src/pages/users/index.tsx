import { useCallback, useEffect, useState } from "react";
import { Button, Input, Modal, Select, Space, Switch, Tag, message } from "antd";
import { EditOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import CmsLayout from "@/components/cms-layout/CmsLayout";
import CMSTable from "@/components/table/CMSTable";
import { adminUserService, type AdminUser } from "@/api/services/adminUserService";

const ROLE_OPTIONS = ["CUSTOMER", "ADMIN", "STAFF"].map((r) => ({ value: r, label: r }));

export default function UsersPage() {
  const [items, setItems] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<{ fullName: string; phone: string; enabled: boolean; roles: string[] }>({
    fullName: "", phone: "", enabled: true, roles: [],
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminUserService.list(page, size, search || undefined);
      setItems(res.items);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, size, search]);

  useEffect(() => { load(); }, [load]);

  const openEdit = (user: AdminUser) => {
    setSelected(user);
    setForm({
      fullName: user.fullName,
      phone: user.phone ?? "",
      enabled: user.enabled,
      roles: [...user.roles],
    });
    setEditOpen(true);
  };

  const save = async () => {
    if (!selected) return;
    await adminUserService.update(selected.id, form);
    message.success("Cập nhật người dùng thành công");
    setEditOpen(false);
    load();
  };

  const columns = [
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Họ tên", dataIndex: "fullName", key: "fullName" },
    {
      title: "Vai trò", dataIndex: "roles", key: "roles",
      render: (roles: string[]) => roles.map((r) => <Tag key={r}>{r}</Tag>),
    },
    {
      title: "Trạng thái", dataIndex: "enabled", key: "enabled",
      render: (v: boolean) => <Tag color={v ? "green" : "red"}>{v ? "Hoạt động" : "Khóa"}</Tag>,
    },
    {
      title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt",
      render: (d: string) => dayjs(d).format("DD/MM/YYYY"),
    },
    {
      title: "Thao tác", key: "actions",
      render: (_: unknown, record: AdminUser) => (
        <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>Sửa</Button>
      ),
    },
  ];

  return (
    <CmsLayout
      headerTitle="Người dùng"
      subTitle="Quản lý tài khoản khách hàng và nhân viên"
      filters={
        <Input.Search
          placeholder="Tìm email, tên..."
          allowClear
          onSearch={(v) => { setPage(0); setSearch(v); }}
          style={{ width: 280 }}
        />
      }
      actions={<Button icon={<ReloadOutlined />} onClick={load}>Làm mới</Button>}
    >
      <CMSTable
        columns={columns}
        dataSource={items}
        rowKey="id"
        loading={loading}
        pagination={{ current: page, pageSize: size, total, onChange: (p, s) => { setPage(p); setSize(s); } }}
      />

      <Modal title={`Sửa — ${selected?.email}`} open={editOpen} onCancel={() => setEditOpen(false)} onOk={save}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Họ tên" />
          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="SĐT" />
          <div>Kích hoạt: <Switch checked={form.enabled} onChange={(v) => setForm({ ...form, enabled: v })} /></div>
          <Select mode="multiple" style={{ width: "100%" }} options={ROLE_OPTIONS} value={form.roles} onChange={(v) => setForm({ ...form, roles: v })} />
        </Space>
      </Modal>
    </CmsLayout>
  );
}
