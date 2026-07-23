import { useCallback, useEffect, useState } from "react";
import {
  Button, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Tag, message,
} from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import CmsLayout from "@/components/cms-layout/CmsLayout";
import CMSTable from "@/components/table/CMSTable";
import { MultiImageUploadField } from "@/components/upload/ImageUploadField";
import { categoryService, flattenCategories } from "@/api/services/categoryService";
import { brandService } from "@/api/services/brandService";
import { productService } from "@/api/services/productService";
import type { Brand, Category, ProductDetail, ProductPayload, ProductStatus, ProductSummary } from "@/types/catalog";

const STATUS_OPTIONS: { label: string; value: ProductStatus }[] = [
  { label: "Nháp", value: "DRAFT" },
  { label: "Đang bán", value: "ACTIVE" },
  { label: "Lưu trữ", value: "ARCHIVED" },
];

const formatVnd = (v?: number) => (v != null ? `${v.toLocaleString("vi-VN")} ₫` : "—");

export default function ProductsPage() {
  const [items, setItems] = useState<ProductSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProductStatus | undefined>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProductDetail | null>(null);
  const [form] = Form.useForm<ProductPayload & { imageUrls: string[] }>();

  const loadMeta = useCallback(async () => {
    const [cats, brandPage] = await Promise.all([
      categoryService.listTree(),
      brandService.list(0, 100),
    ]);
    setCategories(flattenCategories(cats));
    setBrands(brandPage.items);
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productService.list({ page, size, search: search || undefined, status });
      setItems(res.items);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, size, search, status]);

  useEffect(() => { loadMeta(); }, [loadMeta]);
  useEffect(() => { loadProducts(); }, [loadProducts]);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({
      status: "DRAFT",
      variants: [{ sku: "", price: 0, stockQuantity: 0, active: true }],
      imageUrls: [],
    });
    setModalOpen(true);
  };

  const openEdit = async (id: number) => {
    const detail = await productService.getById(id);
    setEditing(detail);
    form.setFieldsValue({
      name: detail.name,
      description: detail.description,
      categoryId: detail.categoryId,
      brandId: detail.brandId,
      status: detail.status,
      variants: detail.variants,
      imageUrls: detail.images?.map((i) => i.url) ?? [],
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload: ProductPayload = {
      name: values.name,
      description: values.description,
      categoryId: values.categoryId,
      brandId: values.brandId,
      status: values.status,
      variants: values.variants,
      images: (values.imageUrls ?? []).map((url, index) => ({
        url,
        sortOrder: index,
        primary: index === 0,
      })),
    };
    if (editing) {
      await productService.update(editing.id, payload);
      message.success("Cập nhật sản phẩm thành công");
    } else {
      await productService.create(payload);
      message.success("Tạo sản phẩm thành công");
    }
    setModalOpen(false);
    loadProducts();
  };

  const columns = [
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Danh mục", dataIndex: "categoryName", key: "categoryName" },
    { title: "Thương hiệu", dataIndex: "brandName", key: "brandName" },
    { title: "Giá", key: "price", render: (_: unknown, r: ProductSummary) => formatVnd(r.minPrice) },
    {
      title: "Trạng thái", dataIndex: "status", key: "status",
      render: (s: ProductStatus) => {
        const color = s === "ACTIVE" ? "green" : s === "DRAFT" ? "gold" : "default";
        return <Tag color={color}>{s}</Tag>;
      },
    },
    {
      title: "Thao tác", key: "actions",
      render: (_: unknown, r: ProductSummary) => (
        <Space>
          <Button size="small" onClick={() => openEdit(r.id)}>Sửa</Button>
          <Popconfirm title="Lưu trữ sản phẩm?" onConfirm={async () => { await productService.archive(r.id); loadProducts(); }}>
            <Button size="small">Archive</Button>
          </Popconfirm>
          <Popconfirm title="Xóa vĩnh viễn?" onConfirm={async () => { await productService.delete(r.id); loadProducts(); }}>
            <Button size="small" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <CmsLayout
      headerTitle="Sản phẩm"
      subTitle="Quản lý catalog B2C"
      actions={
        <>
          <Button icon={<ReloadOutlined />} onClick={loadProducts}>Làm mới</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Thêm sản phẩm</Button>
        </>
      }
      filters={
        <Space wrap>
          <Input.Search placeholder="Tìm kiếm..." allowClear onSearch={setSearch} style={{ width: 240 }} />
          <Select allowClear placeholder="Trạng thái" style={{ width: 160 }} options={STATUS_OPTIONS} onChange={setStatus} />
        </Space>
      }
    >
      <CMSTable
        columns={columns}
        dataSource={items}
        loading={loading}
        pagination={{ current: page, pageSize: size, total, onChange: (p, s) => { setPage(p); setSize(s); } }}
      />

      <Modal title={editing ? "Sửa sản phẩm" : "Thêm sản phẩm"} open={modalOpen} onCancel={() => setModalOpen(false)} onOk={handleSubmit} width={720} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Space style={{ width: "100%" }} size="large">
            <Form.Item name="categoryId" label="Danh mục" style={{ flex: 1 }}>
              <Select allowClear options={categories.map((c) => ({ label: c.name, value: c.id }))} />
            </Form.Item>
            <Form.Item name="brandId" label="Thương hiệu" style={{ flex: 1 }}>
              <Select allowClear options={brands.map((b) => ({ label: b.name, value: b.id }))} />
            </Form.Item>
            <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
              <Select options={STATUS_OPTIONS} />
            </Form.Item>
          </Space>
          <Form.List name="variants">
            {(fields, { add, remove }) => (
              <>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Biến thể (SKU)</div>
                {fields.map((field) => (
                  <Space key={field.key} align="baseline" style={{ display: "flex", marginBottom: 8 }}>
                    <Form.Item {...field} name={[field.name, "sku"]} rules={[{ required: true }]}><Input placeholder="SKU" /></Form.Item>
                    <Form.Item {...field} name={[field.name, "color"]}><Input placeholder="Màu" /></Form.Item>
                    <Form.Item {...field} name={[field.name, "size"]}><Input placeholder="Size" /></Form.Item>
                    <Form.Item {...field} name={[field.name, "price"]} rules={[{ required: true }]}><InputNumber min={0} placeholder="Giá" /></Form.Item>
                    <Form.Item {...field} name={[field.name, "stockQuantity"]}><InputNumber min={0} placeholder="Tồn" /></Form.Item>
                    <Button onClick={() => remove(field.name)} danger>X</Button>
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add({ active: true, stockQuantity: 0, price: 0 })} block>+ Variant</Button>
              </>
            )}
          </Form.List>
          <Form.Item name="imageUrls" label="Hình ảnh" style={{ marginTop: 16 }}>
            <MultiImageUploadField />
          </Form.Item>
        </Form>
      </Modal>
    </CmsLayout>
  );
}
