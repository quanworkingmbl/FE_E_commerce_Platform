import { useCallback, useEffect, useState } from "react";
import { Button, DatePicker, Input, Select, Space, Tag, message } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import CmsLayout from "@/components/cms-layout/CmsLayout";
import CMSTable from "@/components/table/CMSTable";
import { paymentService } from "@/api/services/paymentService";
import { formatVnd } from "@/constants/orderStatus";
import type { PaymentSummary, PaymentTransactionStatus } from "@/types/payment";

const { RangePicker } = DatePicker;

const PAYMENT_STATUS_LABEL: Record<PaymentTransactionStatus, string> = {
  PENDING: "Đang chờ",
  COMPLETED: "Thành công",
  FAILED: "Thất bại",
};

const PAYMENT_STATUS_COLOR: Record<PaymentTransactionStatus, string> = {
  PENDING: "gold",
  COMPLETED: "green",
  FAILED: "red",
};

export default function PaymentsPage() {
  const [items, setItems] = useState<PaymentSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentTransactionStatus | undefined>();
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await paymentService.list(page, size, {
        search: search || undefined,
        status: statusFilter,
        dateFrom: dateRange?.[0]?.format("YYYY-MM-DD"),
        dateTo: dateRange?.[1]?.format("YYYY-MM-DD"),
      });
      setItems(res.items);
      setTotal(res.total);
    } catch {
      message.error("Không tải được danh sách giao dịch");
    } finally {
      setLoading(false);
    }
  }, [page, size, search, statusFilter, dateRange]);

  useEffect(() => { load(); }, [load]);

  const columns = [
    { title: "Mã GD", dataIndex: "txnRef", key: "txnRef" },
    { title: "Mã đơn", dataIndex: "orderNumber", key: "orderNumber" },
    {
      title: "Số tiền", dataIndex: "amount", key: "amount",
      render: (v: number) => formatVnd(v),
    },
    { title: "Cổng", dataIndex: "provider", key: "provider" },
    {
      title: "Trạng thái", dataIndex: "status", key: "status",
      render: (s: PaymentTransactionStatus) => (
        <Tag color={PAYMENT_STATUS_COLOR[s]}>{PAYMENT_STATUS_LABEL[s]}</Tag>
      ),
    },
    { title: "Mã VNPay", dataIndex: "gatewayTransactionNo", key: "gatewayTransactionNo", render: (v?: string) => v ?? "—" },
    { title: "Mã bank", dataIndex: "gatewayBankCode", key: "gatewayBankCode", render: (v?: string) => v ?? "—" },
    {
      title: "Thời gian", dataIndex: "createdAt", key: "createdAt",
      render: (d: string) => dayjs(d).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Thanh toán lúc", dataIndex: "paidAt", key: "paidAt",
      render: (d?: string | null) => (d ? dayjs(d).format("DD/MM/YYYY HH:mm") : "—"),
    },
  ];

  return (
    <CmsLayout
      headerTitle="Thanh toán"
      subTitle="Danh sách giao dịch thanh toán"
      filters={
        <Space wrap>
          <Input.Search
            placeholder="Tìm mã GD, mã đơn..."
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
            options={Object.entries(PAYMENT_STATUS_LABEL).map(([value, label]) => ({ value, label }))}
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
    </CmsLayout>
  );
}
