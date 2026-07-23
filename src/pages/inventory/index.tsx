import { useCallback, useEffect, useState } from "react";
import {
  Button, Drawer, Form, Input, InputNumber, Modal, Space, Switch, Tag, message,
} from "antd";
import { HistoryOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import CmsLayout from "@/components/cms-layout/CmsLayout";
import CMSTable from "@/components/table/CMSTable";
import { inventoryService } from "@/api/services/inventoryService";
import type { InventoryItem, InventoryLog } from "@/types/inventory";

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [selected, setSelected] = useState<InventoryItem | null>(null);
  const [form] = Form.useForm();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await inventoryService.list(page, size, search || undefined, lowStockOnly || undefined);
      setItems(res.items);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, size, search, lowStockOnly]);

  useEffect(() => { load(); }, [load]);

  const openStockIn = (record: InventoryItem) => {
    setSelected(record);
    form.resetFields();
    form.setFieldsValue({ quantity: 1 });
    setStockModalOpen(true);
  };

  const handleStockIn = async () => {
    if (!selected) return;
    const values = await form.validateFields();
    await inventoryService.stockIn(selected.variantId, values.quantity, values.note);
    message.success("Nhập kho thành công");
    setStockModalOpen(false);
    load();
  };

  const openLogs = async (record: InventoryItem) => {
    setSelected(record);
    setDrawerOpen(true);
    setLogsLoading(true);
    try {
      const res = await inventoryService.getLogs(record.variantId);
      setLogs(res.items);
    } finally {
      setLogsLoading(false);
    }
  };

  const columns = [
    { title: "SKU", dataIndex: "sku", key: "sku" },
    { title: "Sản phẩm", dataIndex: "productName", key: "productName" },
    {
      title: "Biến thể", key: "variant",
      render: (_: unknown, r: InventoryItem) =>
        [r.size, r.color].filter(Boolean).join(" / ") || "—",
    },
    {
      title: "Tồn kho", dataIndex: "stockQuantity", key: "stockQuantity",
      render: (qty: number, r: InventoryItem) => (
        <Tag color={r.lowStock ? "red" : "green"}>{qty}</Tag>
      ),
    },
    { title: "Ngưỡng cảnh báo", dataIndex: "lowStockThreshold", key: "lowStockThreshold" },
    {
      title: "Thao tác", key: "actions",
      render: (_: unknown, record: InventoryItem) => (
        <Space>
          <Button size="small" type="primary" icon={<PlusOutlined />} onClick={() => openStockIn(record)}>
            Nhập kho
          </Button>
          <Button size="small" icon={<HistoryOutlined />} onClick={() => openLogs(record)}>
            Lịch sử
          </Button>
        </Space>
      ),
    },
  ];

  const logColumns = [
    { title: "Loại", dataIndex: "logType", key: "logType" },
    { title: "SL", dataIndex: "quantity", key: "quantity" },
    { title: "Trước", dataIndex: "stockBefore", key: "stockBefore" },
    { title: "Sau", dataIndex: "stockAfter", key: "stockAfter" },
    { title: "Ghi chú", dataIndex: "note", key: "note", render: (v: string) => v || "—" },
    {
      title: "Thời gian", dataIndex: "createdAt", key: "createdAt",
      render: (d: string) => dayjs(d).format("DD/MM/YYYY HH:mm"),
    },
  ];

  return (
    <CmsLayout
      headerTitle="Tồn kho"
      subTitle="Quản lý tồn kho và nhập hàng"
      filters={
        <Space>
          <Input.Search
            placeholder="Tìm SKU hoặc sản phẩm..."
            allowClear
            onSearch={(v) => { setPage(0); setSearch(v); }}
            style={{ width: 280 }}
          />
          <Switch
            checked={lowStockOnly}
            onChange={(v) => { setPage(0); setLowStockOnly(v); }}
            checkedChildren="Sắp hết"
            unCheckedChildren="Tất cả"
          />
        </Space>
      }
      actions={
        <Button icon={<ReloadOutlined />} onClick={load}>Làm mới</Button>
      }
    >
      <CMSTable
        columns={columns}
        dataSource={items}
        rowKey="variantId"
        loading={loading}
        pagination={{ current: page, pageSize: size, total, onChange: (p, s) => { setPage(p); setSize(s); } }}
      />

      <Modal
        title={`Nhập kho — ${selected?.sku ?? ""}`}
        open={stockModalOpen}
        onCancel={() => setStockModalOpen(false)}
        onOk={handleStockIn}
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item name="quantity" label="Số lượng nhập" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={2} placeholder="Phiếu nhập, lý do..." />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title={`Lịch sử — ${selected?.productName ?? ""} (${selected?.sku ?? ""})`}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={720}
      >
        <CMSTable
          columns={logColumns}
          dataSource={logs}
          rowKey="id"
          loading={logsLoading}
        />
      </Drawer>
    </CmsLayout>
  );
}
