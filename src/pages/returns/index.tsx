import { useCallback, useEffect, useState } from "react";
import {
  Button, Descriptions, Form, Input, Modal, Select, Space, Table, Tag, message,
} from "antd";
import { EyeOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import CmsLayout from "@/components/cms-layout/CmsLayout";
import CMSTable from "@/components/table/CMSTable";
import { returnService } from "@/api/services/returnService";
import { formatVnd } from "@/constants/orderStatus";
import type { ReturnDetail, ReturnStatus, ReturnSummary } from "@/types/return";

const STATUS_LABEL: Record<ReturnStatus, string> = {
  REQUESTED: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
  RECEIVED: "Đã nhận hàng",
  REFUNDED: "Đã hoàn tiền",
  CANCELLED: "Đã hủy",
};

const STATUS_COLOR: Record<ReturnStatus, string> = {
  REQUESTED: "orange",
  APPROVED: "blue",
  REJECTED: "red",
  RECEIVED: "cyan",
  REFUNDED: "green",
  CANCELLED: "default",
};

export default function ReturnsPage() {
  const [items, setItems] = useState<ReturnSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReturnStatus | undefined>();
  const [detail, setDetail] = useState<ReturnDetail | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [actionModal, setActionModal] = useState<"approve" | "reject" | null>(null);
  const [form] = Form.useForm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await returnService.list(page, size, { search: search || undefined, status: statusFilter });
      setItems(res.items);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, size, search, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const openDetail = async (record: ReturnSummary) => {
    const data = await returnService.getById(record.id);
    setDetail(data);
    setDetailOpen(true);
  };

  const runAction = async (action: "approve" | "reject" | "received" | "refund") => {
    if (!detail) return;
    try {
      if (action === "approve") {
        const values = await form.validateFields();
        await returnService.approve(detail.id, values.note);
      } else if (action === "reject") {
        const values = await form.validateFields();
        await returnService.reject(detail.id, values.note);
      } else if (action === "received") {
        await returnService.received(detail.id);
      } else {
        await returnService.refund(detail.id);
      }
      message.success("Cập nhật thành công");
      setActionModal(null);
      setDetailOpen(false);
      load();
    } catch (err: unknown) {
      if (err && typeof err === "object" && "errorFields" in err) return;
      message.error("Không thể cập nhật");
    }
  };

  const columns = [
    { title: "Mã đơn", dataIndex: "orderNumber", key: "orderNumber" },
    { title: "Khách", dataIndex: "customerName", key: "customerName" },
    { title: "Lý do", dataIndex: "reason", key: "reason", ellipsis: true },
    {
      title: "Trạng thái", dataIndex: "status", key: "status",
      render: (s: ReturnStatus) => <Tag color={STATUS_COLOR[s]}>{STATUS_LABEL[s]}</Tag>,
    },
    {
      title: "Hoàn tiền", dataIndex: "refundAmount", key: "refundAmount",
      render: (v?: number | null) => (v != null ? formatVnd(v) : "—"),
    },
    {
      title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt",
      render: (d: string) => dayjs(d).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Thao tác", key: "actions",
      render: (_: unknown, record: ReturnSummary) => (
        <Button size="small" icon={<EyeOutlined />} onClick={() => openDetail(record)}>Chi tiết</Button>
      ),
    },
  ];

  return (
    <CmsLayout
      headerTitle="Trả hàng"
      subTitle="Quản lý yêu cầu trả hàng / hoàn tiền"
      filters={
        <Space wrap>
          <Input.Search
            placeholder="Tìm mã đơn, email..."
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
            options={Object.entries(STATUS_LABEL).map(([value, label]) => ({ value, label }))}
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
        title={detail ? `Trả hàng — ${detail.orderNumber}` : "Chi tiết"}
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        width={800}
        footer={
          detail ? (
            <Space>
              {detail.status === "REQUESTED" && (
                <>
                  <Button danger onClick={() => { form.resetFields(); setActionModal("reject"); }}>Từ chối</Button>
                  <Button type="primary" onClick={() => { form.resetFields(); setActionModal("approve"); }}>Duyệt</Button>
                </>
              )}
              {detail.status === "APPROVED" && (
                <Button type="primary" onClick={() => runAction("received")}>Xác nhận đã nhận hàng</Button>
              )}
              {detail.status === "RECEIVED" && (
                <Button type="primary" onClick={() => runAction("refund")}>Hoàn tiền</Button>
              )}
            </Space>
          ) : null
        }
      >
        {detail && (
          <>
            <Descriptions bordered size="small" column={2} style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Khách">{detail.customerName}</Descriptions.Item>
              <Descriptions.Item label="Email">{detail.customerEmail}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={STATUS_COLOR[detail.status]}>{STATUS_LABEL[detail.status]}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Hoàn tiền">
                {detail.refundAmount != null ? formatVnd(detail.refundAmount) : "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Lý do" span={2}>{detail.reason}</Descriptions.Item>
              {detail.adminNote && (
                <Descriptions.Item label="Ghi chú admin" span={2}>{detail.adminNote}</Descriptions.Item>
              )}
            </Descriptions>
            <Table
              size="small"
              rowKey="orderItemId"
              pagination={false}
              dataSource={detail.items}
              columns={[
                { title: "Sản phẩm", dataIndex: "productName" },
                { title: "SKU", dataIndex: "sku" },
                { title: "SL", dataIndex: "quantity", width: 60 },
                { title: "Lý do", dataIndex: "itemReason", render: (v?: string) => v || "—" },
              ]}
            />
          </>
        )}
      </Modal>

      <Modal
        title={actionModal === "approve" ? "Duyệt yêu cầu" : "Từ chối yêu cầu"}
        open={!!actionModal}
        onCancel={() => setActionModal(null)}
        onOk={() => runAction(actionModal!)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </CmsLayout>
  );
}
