import { useEffect, useState } from "react";
import { Button, Card, Form, Input, InputNumber, message } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import CmsLayout from "@/components/cms-layout/CmsLayout";
import { settingsService, type AppSettings } from "@/api/services/settingsService";

export default function SettingsPage() {
  const [form] = Form.useForm<AppSettings>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    settingsService.get().then((data) => {
      form.setFieldsValue(data);
      setLoading(false);
    });
  }, [form]);

  const onSave = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      await settingsService.update(values);
      message.success("Lưu cài đặt thành công");
    } finally {
      setSaving(false);
    }
  };

  return (
    <CmsLayout headerTitle="Cài đặt" subTitle="Cấu hình hệ thống B2C">
      <Card loading={loading}>
        <Form form={form} layout="vertical" style={{ maxWidth: 520 }}>
          <Form.Item name="siteName" label="Tên website" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="supportEmail" label="Email hỗ trợ" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="paymentExpiryMinutes" label="Thời hạn thanh toán (phút)" rules={[{ required: true }]}>
            <InputNumber min={5} max={120} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="lowStockDefaultThreshold" label="Ngưỡng tồn kho thấp mặc định" rules={[{ required: true }]}>
            <InputNumber min={1} max={1000} style={{ width: "100%" }} />
          </Form.Item>
          <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={onSave}>Lưu thay đổi</Button>
        </Form>
      </Card>
    </CmsLayout>
  );
}
