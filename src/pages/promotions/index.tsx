import { useCallback, useEffect, useState } from "react";
import {
  Button, DatePicker, Form, Input, InputNumber, Modal, Popconfirm,
  Select, Space, Switch, Tag, message,
} from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import CmsLayout from "@/components/cms-layout/CmsLayout";
import CMSTable from "@/components/table/CMSTable";
import { promotionService } from "@/api/services/promotionService";
import type { Coupon, CouponRequest, DiscountType } from "@/types/promotion";

const formatVnd = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

export default function PromotionsPage() {
  const [items, setItems] = useState<Coupon[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form] = Form.useForm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await promotionService.list(page, size, search || undefined);
      setItems(res.items);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, size, search]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({
      discountType: "PERCENTAGE" as DiscountType,
      active: true,
      minOrderAmount: 0,
    });
    setModalOpen(true);
  };

  const openEdit = (record: Coupon) => {
    setEditing(record);
    form.setFieldsValue({
      ...record,
      startDate: record.startDate ? dayjs(record.startDate) : undefined,
      endDate: record.endDate ? dayjs(record.endDate) : undefined,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload: CouponRequest = {
      code: values.code,
      name: values.name,
      description: values.description,
      discountType: values.discountType,
      discountValue: values.discountValue,
      minOrderAmount: values.minOrderAmount ?? 0,
      maxDiscountAmount: values.maxDiscountAmount,
      usageLimit: values.usageLimit,
      usageLimitPerUser: values.usageLimitPerUser,
      startDate: values.startDate ? values.startDate.toISOString() : undefined,
      endDate: values.endDate ? values.endDate.toISOString() : undefined,
      active: values.active,
    };
    if (editing) {
      await promotionService.update(editing.id, payload);
      message.success("Cập nhật mã giảm giá thành công");
    } else {
      await promotionService.create(payload);
      message.success("Tạo mã giảm giá thành công");
    }
    setModalOpen(false);
    load();
  };

  const columns = [
    { title: "Mã", dataIndex: "code", key: "code" },
    { title: "Tên", dataIndex: "name", key: "name" },
    {
      title: "Loại", dataIndex: "discountType", key: "discountType",
      render: (t: DiscountType) => (t === "PERCENTAGE" ? "Phần trăm" : "Cố định"),
    },
    {
      title: "Giá trị", key: "discountValue",
      render: (_: unknown, r: Coupon) =>
        r.discountType === "PERCENTAGE" ? `${r.discountValue}%` : formatVnd(r.discountValue),
    },
    {
      title: "Đơn tối thiểu", dataIndex: "minOrderAmount", key: "minOrderAmount",
      render: (v: number) => formatVnd(v),
    },
    {
      title: "Đã dùng", key: "usage",
      render: (_: unknown, r: Coupon) =>
        `${r.usageCount}${r.usageLimit ? ` / ${r.usageLimit}` : ""}`,
    },
    {
      title: "Trạng thái", dataIndex: "active", key: "active",
      render: (active: boolean) => (
        <Tag color={active ? "green" : "default"}>{active ? "Hoạt động" : "Tắt"}</Tag>
      ),
    },
    {
      title: "Hết hạn", dataIndex: "endDate", key: "endDate",
      render: (d: string) => (d ? dayjs(d).format("DD/MM/YYYY") : "—"),
    },
    {
      title: "Thao tác", key: "actions",
      render: (_: unknown, record: Coupon) => (
        <Space>
          <Button size="small" onClick={() => openEdit(record)}>Sửa</Button>
          <Popconfirm title="Xóa mã giảm giá?" onConfirm={async () => {
            await promotionService.delete(record.id);
            message.success("Đã xóa");
            load();
          }}>
            <Button size="small" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <CmsLayout
      headerTitle="Khuyến mãi"
      subTitle="Quản lý mã giảm giá"
      filters={
        <Input.Search
          placeholder="Tìm mã hoặc tên..."
          allowClear
          onSearch={(v) => { setPage(0); setSearch(v); }}
          style={{ width: 280 }}
        />
      }
      actions={
        <>
          <Button icon={<ReloadOutlined />} onClick={load}>Làm mới</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Thêm mã</Button>
        </>
      }
    >
      <CMSTable
        columns={columns}
        dataSource={items}
        rowKey="id"
        loading={loading}
        pagination={{ current: page, pageSize: size, total, onChange: (p, s) => { setPage(p); setSize(s); } }}
      />

      <Modal
        title={editing ? "Sửa mã giảm giá" : "Thêm mã giảm giá"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        width={640}
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item name="code" label="Mã" rules={[{ required: true }]}>
            <Input placeholder="WELCOME10" style={{ textTransform: "uppercase" }} />
          </Form.Item>
          <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Space style={{ width: "100%" }} size="large">
            <Form.Item name="discountType" label="Loại giảm" rules={[{ required: true }]}>
              <Select style={{ width: 160 }}>
                <Select.Option value="PERCENTAGE">Phần trăm</Select.Option>
                <Select.Option value="FIXED">Cố định (VND)</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="discountValue" label="Giá trị" rules={[{ required: true }]}>
              <InputNumber min={0.01} style={{ width: 160 }} />
            </Form.Item>
          </Space>
          <Space style={{ width: "100%" }} size="large">
            <Form.Item name="minOrderAmount" label="Đơn tối thiểu">
              <InputNumber min={0} style={{ width: 180 }} />
            </Form.Item>
            <Form.Item name="maxDiscountAmount" label="Giảm tối đa">
              <InputNumber min={0} style={{ width: 180 }} />
            </Form.Item>
          </Space>
          <Space style={{ width: "100%" }} size="large">
            <Form.Item name="usageLimit" label="Giới hạn lượt">
              <InputNumber min={1} style={{ width: 160 }} />
            </Form.Item>
            <Form.Item name="usageLimitPerUser" label="Giới hạn / user">
              <InputNumber min={1} style={{ width: 160 }} />
            </Form.Item>
          </Space>
          <Space style={{ width: "100%" }} size="large">
            <Form.Item name="startDate" label="Bắt đầu">
              <DatePicker />
            </Form.Item>
            <Form.Item name="endDate" label="Kết thúc">
              <DatePicker />
            </Form.Item>
          </Space>
          <Form.Item name="active" label="Kích hoạt" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </CmsLayout>
  );
}
