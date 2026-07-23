import { useCallback, useEffect, useState } from "react";
import { Button, Input, Modal, Rate, Select, Space, Tag, message } from "antd";
import { CheckOutlined, CloseOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import CmsLayout from "@/components/cms-layout/CmsLayout";
import CMSTable from "@/components/table/CMSTable";
import { reviewService } from "@/api/services/reviewService";
import type { ReviewStatus, ReviewSummary } from "@/types/review";

const STATUS_LABEL: Record<ReviewStatus, string> = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
};

const STATUS_COLOR: Record<ReviewStatus, string> = {
  PENDING: "gold",
  APPROVED: "green",
  REJECTED: "red",
};

export default function ReviewsPage() {
  const [items, setItems] = useState<ReviewSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | undefined>("PENDING");
  const [selected, setSelected] = useState<ReviewSummary | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reviewService.list(page, size, { search: search || undefined, status: statusFilter });
      setItems(res.items);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, size, search, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const moderate = async (status: ReviewStatus) => {
    if (!selected) return;
    await reviewService.moderate(selected.id, { status });
    message.success(status === "APPROVED" ? "Đã duyệt đánh giá" : "Đã từ chối đánh giá");
    setSelected(null);
    load();
  };

  const columns = [
    { title: "Sản phẩm", dataIndex: "productName", key: "productName" },
    { title: "Mã đơn", dataIndex: "orderNumber", key: "orderNumber" },
    { title: "Khách", dataIndex: "customerName", key: "customerName" },
    {
      title: "Sao", dataIndex: "rating", key: "rating",
      render: (v: number) => <Rate disabled value={v} style={{ fontSize: 14 }} />,
    },
    {
      title: "Nội dung", dataIndex: "content", key: "content", ellipsis: true,
      render: (v?: string) => v || "—",
    },
    {
      title: "Trạng thái", dataIndex: "status", key: "status",
      render: (s: ReviewStatus) => <Tag color={STATUS_COLOR[s]}>{STATUS_LABEL[s]}</Tag>,
    },
    {
      title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt",
      render: (d: string) => dayjs(d).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Thao tác", key: "actions",
      render: (_: unknown, record: ReviewSummary) => (
        <Button size="small" onClick={() => setSelected(record)}>Xem</Button>
      ),
    },
  ];

  return (
    <CmsLayout
      headerTitle="Đánh giá"
      subTitle="Duyệt đánh giá sản phẩm từ khách hàng"
      filters={
        <Space wrap>
          <Input.Search
            placeholder="Tìm sản phẩm, email..."
            allowClear
            onSearch={(v) => { setPage(0); setSearch(v); }}
            style={{ width: 260 }}
          />
          <Select
            allowClear
            placeholder="Trạng thái"
            style={{ width: 160 }}
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
        title={selected ? `Đánh giá #${selected.id}` : "Chi tiết đánh giá"}
        open={!!selected}
        onCancel={() => setSelected(null)}
        footer={
          selected?.status === "PENDING" ? (
            <Space>
              <Button icon={<CloseOutlined />} danger onClick={() => moderate("REJECTED")}>Từ chối</Button>
              <Button type="primary" icon={<CheckOutlined />} onClick={() => moderate("APPROVED")}>Duyệt</Button>
            </Space>
          ) : null
        }
      >
        {selected && (
          <>
            <p><strong>Sản phẩm:</strong> {selected.productName}</p>
            <p><strong>Đơn hàng:</strong> {selected.orderNumber}</p>
            <p><strong>Khách:</strong> {selected.customerName} ({selected.customerEmail})</p>
            <Rate disabled value={selected.rating} />
            <p style={{ marginTop: 12 }}>{selected.content || "Không có nội dung"}</p>
          </>
        )}
      </Modal>
    </CmsLayout>
  );
}
