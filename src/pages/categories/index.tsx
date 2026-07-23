import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Switch, Tag, message } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import CmsLayout from "@/components/cms-layout/CmsLayout";
import CMSTable from "@/components/table/CMSTable";
import { categoryService } from "@/api/services/categoryService";
import type { Category } from "@/types/catalog";

type TreeRow = Category & { key: number; children?: TreeRow[] };

function toTreeRows(categories: Category[]): TreeRow[] {
  return categories.map((c) => ({
    ...c,
    key: c.id,
    children: c.children?.length ? toTreeRows(c.children) : undefined,
  }));
}

export default function CategoriesPage() {
  const [tree, setTree] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form] = Form.useForm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setTree(await categoryService.listTree());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const parentOptions = useMemo(() => {
    const flat: { label: string; value: number }[] = [];
    const walk = (items: Category[], depth = 0) => {
      items.forEach((c) => {
        flat.push({ label: `${"— ".repeat(depth)}${c.name}`, value: c.id });
        if (c.children?.length) walk(c.children, depth + 1);
      });
    };
    walk(tree);
    return flat;
  }, [tree]);

  const openCreate = (parentId?: number) => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ active: true, sortOrder: 0, parentId });
    setModalOpen(true);
  };

  const openEdit = (record: Category) => {
    setEditing(record);
    form.setFieldsValue({
      name: record.name,
      parentId: record.parentId ?? undefined,
      sortOrder: record.sortOrder,
      active: record.active,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (editing) {
      await categoryService.update(editing.id, values);
      message.success("Cập nhật danh mục thành công");
    } else {
      await categoryService.create(values);
      message.success("Tạo danh mục thành công");
    }
    setModalOpen(false);
    load();
  };

  const columns = [
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Slug", dataIndex: "slug", key: "slug" },
    { title: "Thứ tự", dataIndex: "sortOrder", key: "sortOrder", width: 90 },
    {
      title: "Trạng thái", dataIndex: "active", key: "active", width: 120,
      render: (active: boolean) => <Tag color={active ? "green" : "default"}>{active ? "Hiện" : "Ẩn"}</Tag>,
    },
    {
      title: "Thao tác", key: "actions", width: 220,
      render: (_: unknown, record: Category) => (
        <Space>
          <Button size="small" onClick={() => openCreate(record.id)}>Thêm con</Button>
          <Button size="small" onClick={() => openEdit(record)}>Sửa</Button>
          <Popconfirm title="Xóa danh mục?" onConfirm={async () => { await categoryService.delete(record.id); load(); }}>
            <Button size="small" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <CmsLayout
      headerTitle="Danh mục"
      subTitle="Cây danh mục sản phẩm"
      actions={
        <>
          <Button icon={<ReloadOutlined />} onClick={load}>Làm mới</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openCreate()}>Thêm danh mục</Button>
        </>
      }
    >
      <CMSTable columns={columns} dataSource={toTreeRows(tree) as unknown as Category[]} loading={loading} />

      <Modal title={editing ? "Sửa danh mục" : "Thêm danh mục"} open={modalOpen} onCancel={() => setModalOpen(false)} onOk={handleSubmit} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="parentId" label="Danh mục cha">
            <Select allowClear options={parentOptions} />
          </Form.Item>
          <Form.Item name="sortOrder" label="Thứ tự">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="active" label="Hiển thị" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </CmsLayout>
  );
}
