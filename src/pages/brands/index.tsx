import { useCallback, useEffect, useState } from "react";
import { Button, Form, Input, Modal, Popconfirm, Space, Switch, Tag, message } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import CmsLayout from "@/components/cms-layout/CmsLayout";
import CMSTable from "@/components/table/CMSTable";
import { ImageUploadField, resolveMediaUrl } from "@/components/upload/ImageUploadField";
import { brandService } from "@/api/services/brandService";
import type { Brand } from "@/types/catalog";

export default function BrandsPage() {
  const [items, setItems] = useState<Brand[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [form] = Form.useForm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await brandService.list(page, size);
      setItems(res.items);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, size]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ active: true });
    setModalOpen(true);
  };

  const openEdit = (record: Brand) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (editing) {
      await brandService.update(editing.id, values);
      message.success("Cập nhật thương hiệu thành công");
    } else {
      await brandService.create(values);
      message.success("Tạo thương hiệu thành công");
    }
    setModalOpen(false);
    load();
  };

  const columns = [
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Slug", dataIndex: "slug", key: "slug" },
    {
      title: "Logo", dataIndex: "logoUrl", key: "logoUrl",
      render: (url: string) => url ? <img src={resolveMediaUrl(url)} alt="" style={{ height: 32 }} /> : "—",
    },
    {
      title: "Trạng thái", dataIndex: "active", key: "active",
      render: (active: boolean) => <Tag color={active ? "green" : "default"}>{active ? "Hiện" : "Ẩn"}</Tag>,
    },
    {
      title: "Thao tác", key: "actions",
      render: (_: unknown, record: Brand) => (
        <Space>
          <Button size="small" onClick={() => openEdit(record)}>Sửa</Button>
          <Popconfirm title="Xóa thương hiệu?" onConfirm={async () => { await brandService.delete(record.id); load(); }}>
            <Button size="small" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <CmsLayout
      headerTitle="Thương hiệu"
      actions={
        <>
          <Button icon={<ReloadOutlined />} onClick={load}>Làm mới</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Thêm thương hiệu</Button>
        </>
      }
    >
      <CMSTable
        columns={columns}
        dataSource={items}
        loading={loading}
        pagination={{ current: page, pageSize: size, total, onChange: (p, s) => { setPage(p); setSize(s); } }}
      />

      <Modal title={editing ? "Sửa thương hiệu" : "Thêm thương hiệu"} open={modalOpen} onCancel={() => setModalOpen(false)} onOk={handleSubmit} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="logoUrl" label="Logo">
            <ImageUploadField />
          </Form.Item>
          <Form.Item name="active" label="Hiển thị" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </CmsLayout>
  );
}
