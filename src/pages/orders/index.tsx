import { useCallback, useEffect, useState } from "react";
import {
  Button, DatePicker, Descriptions, Form, Input, Modal, Select, Space, Table, Tag, Timeline, message,
} from "antd";
import { EyeOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import CmsLayout from "@/components/cms-layout/CmsLayout";
import CMSTable from "@/components/table/CMSTable";
import { orderService } from "@/api/services/orderService";
import {
  ORDER_STATUS_COLOR, ORDER_STATUS_LABEL, PAYMENT_STATUS_COLOR, PAYMENT_STATUS_LABEL, formatVnd,
} from "@/constants/orderStatus";
import type { OrderDetail, OrderStatus, OrderSummary } from "@/types/order";

const { RangePicker } = DatePicker;

export default function OrdersPage() {
  const [items, setItems] = useState<OrderSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>();
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusForm] = Form.useForm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await orderService.list(page, size, {
        search: search || undefined,
        status: statusFilter,
        dateFrom: dateRange?.[0]?.format("YYYY-MM-DD"),
        dateTo: dateRange?.[1]?.format("YYYY-MM-DD"),
      });
      setItems(res.items);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, size, search, statusFilter, dateRange]);

  useEffect(() => { load(); }, [load]);

  const openDetail = async (record: OrderSummary) => {
    setDetailOpen(true);
    setDetailLoading(true);
    try {
      const data = await orderService.getById(record.id);
      setDetail(data);
    } finally {
      setDetailLoading(false);
    }
  };

  const openStatusModal = () => {
    if (!detail) return;
    statusForm.setFieldsValue({ status: detail.status });
    setStatusModalOpen(true);
  };

  const submitStatus = async () => {
    if (!detail) return;
    const values = await statusForm.validateFields();
    await orderService.updateStatus(detail.id, values);
    message.success("Cập nhật trạng thái thành công");
    setStatusModalOpen(false);
    const updated = await orderService.getById(detail.id);
    setDetail(updated);
    load();
  };

  const columns = [
    { title: "Mã đơn", dataIndex: "orderNumber", key: "orderNumber" },
    { title: "Khách hàng", dataIndex: "recipientName", key: "recipientName" },
    {
      title: "Trạng thái", dataIndex: "status", key: "status",
      render: (s: OrderStatus) => <Tag color={ORDER_STATUS_COLOR[s]}>{ORDER_STATUS_LABEL[s]}</Tag>,
    },
    {
      title: "Thanh toán", dataIndex: "paymentStatus", key: "paymentStatus",
      render: (s: keyof typeof PAYMENT_STATUS_LABEL) => (
        <Tag color={PAYMENT_STATUS_COLOR[s]}>{PAYMENT_STATUS_LABEL[s]}</Tag>
      ),
    },
    {
      title: "Tổng tiền", dataIndex: "totalAmount", key: "totalAmount",
      render: (v: number) => formatVnd(v),
    },
    {
      title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt",
      render: (d: string) => dayjs(d).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Thao tác", key: "actions",
      render: (_: unknown, record: OrderSummary) => (
        <Button size="small" icon={<EyeOutlined />} onClick={() => openDetail(record)}>Chi tiết</Button>
      ),
    },
  ];

  return (
    <CmsLayout
      headerTitle="Đơn hàng"
      subTitle="Quản lý đơn hàng và cập nhật trạng thái"
      filters={
        <Space wrap>
          <Input.Search
            placeholder="Tìm mã đơn, tên, SĐT..."
            allowClear
            onSearch={(v) => { setPage(0); setSearch(v); }}
            style={{ width: 260 }}
          />
          <Select
            allowClear
            placeholder="Trạng thái"
            style={{ width: 180 }}
            value={statusFilter}
            onChange={(v) => { setPage(0); setStatusFilter(v); }}
            options={Object.entries(ORDER_STATUS_LABEL).map(([value, label]) => ({ value, label }))}
          />
          <RangePicker
            value={dateRange}
            onChange={(v) => { setPage(0); setDateRange(v as [dayjs.Dayjs, dayjs.Dayjs] | null); }}
          />
        </Space>
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

      <Modal
        title={detail ? `Đơn ${detail.orderNumber}` : "Chi tiết đơn"}
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        width={900}
        footer={
          detail && detail.status !== "CANCELLED" && detail.status !== "COMPLETED" ? (
            <Button type="primary" onClick={openStatusModal}>Cập nhật trạng thái</Button>
          ) : null
        }
        destroyOnHidden
      >
        {detailLoading || !detail ? (
          <div style={{ textAlign: "center", padding: 40 }}>Đang tải...</div>
        ) : (
          <>
            <Descriptions bordered size="small" column={2} style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Khách">{detail.recipientName}</Descriptions.Item>
              <Descriptions.Item label="SĐT">{detail.recipientPhone}</Descriptions.Item>
              <Descriptions.Item label="Email">{detail.customerEmail ?? "—"}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={ORDER_STATUS_COLOR[detail.status]}>{ORDER_STATUS_LABEL[detail.status]}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Thanh toán">
                <Tag color={PAYMENT_STATUS_COLOR[detail.paymentStatus]}>{PAYMENT_STATUS_LABEL[detail.paymentStatus]}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={2}>{detail.shippingAddress}</Descriptions.Item>
              <Descriptions.Item label="Tạm tính">{formatVnd(detail.subtotal)}</Descriptions.Item>
              <Descriptions.Item label="Phí ship">{formatVnd(detail.shippingFee)}</Descriptions.Item>
              <Descriptions.Item label="Giảm giá">{formatVnd(detail.discountAmount)}</Descriptions.Item>
              <Descriptions.Item label="Tổng">{formatVnd(detail.totalAmount)}</Descriptions.Item>
            </Descriptions>

            <Table
              size="small"
              rowKey="id"
              pagination={false}
              dataSource={detail.items}
              columns={[
                { title: "Sản phẩm", dataIndex: "productName" },
                { title: "SKU", dataIndex: "sku" },
                { title: "SL", dataIndex: "quantity", width: 60 },
                { title: "Đơn giá", dataIndex: "unitPrice", render: (v: number) => formatVnd(v) },
                { title: "Thành tiền", dataIndex: "lineTotal", render: (v: number) => formatVnd(v) },
              ]}
              style={{ marginBottom: 16 }}
            />

            <h4>Lịch sử trạng thái</h4>
            <Timeline
              items={detail.statusHistory.map((h) => ({
                color: ORDER_STATUS_COLOR[h.status],
                children: (
                  <div>
                    <strong>{ORDER_STATUS_LABEL[h.status]}</strong>
                    <div style={{ color: "#888", fontSize: 12 }}>
                      {dayjs(h.createdAt).format("DD/MM/YYYY HH:mm")}
                      {h.actorEmail ? ` · ${h.actorEmail}` : ""}
                    </div>
                    {h.note && <div>{h.note}</div>}
                  </div>
                ),
              }))}
            />
          </>
        )}
      </Modal>

      <Modal title="Cập nhật trạng thái" open={statusModalOpen} onCancel={() => setStatusModalOpen(false)} onOk={submitStatus}>
        <Form form={statusForm} layout="vertical">
          <Form.Item name="status" label="Trạng thái mới" rules={[{ required: true }]}>
            <Select options={Object.entries(ORDER_STATUS_LABEL).map(([value, label]) => ({ value, label }))} />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </CmsLayout>
  );
}
