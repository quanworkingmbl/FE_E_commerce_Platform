import { Card, Descriptions, Form, Input, Button, message, Spin, Tag } from "antd";
import { useCallback, useEffect, useState } from "react";
import { userService } from "@/api/services/userService";
import { useUserActions } from "@/store/userStore";
import type { UserProfile } from "@/types/api";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const { setUserInfo } = useUserActions();

  const fetchProfile = useCallback(async () => {
    const data = await userService.getMe();
    setProfile(data);
    setUserInfo(data);
    form.setFieldsValue({
      fullName: data.fullName,
      phone: data.phone,
    });
  }, [form, setUserInfo]);

  useEffect(() => {
    fetchProfile()
      .catch(() => message.error("Không tải được profile"))
      .finally(() => setLoading(false));
  }, [fetchProfile]);

  const handleSave = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      const updated = await userService.updateMe(values);
      setProfile(updated);
      setUserInfo(updated);
      setEditing(false);
      message.success("Cập nhật profile thành công");
    } catch {
      message.error("Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Spin style={{ display: "block", margin: "80px auto" }} />;
  }

  return (
    <Card title="Hồ sơ cá nhân">
      {!editing ? (
        <>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Email">{profile?.email}</Descriptions.Item>
            <Descriptions.Item label="Họ tên">{profile?.fullName}</Descriptions.Item>
            <Descriptions.Item label="SĐT">{profile?.phone || "-"}</Descriptions.Item>
            <Descriptions.Item label="Vai trò">
              {profile?.roles.map((role) => (
                <Tag key={role}>{role.replace("ROLE_", "")}</Tag>
              ))}
            </Descriptions.Item>
          </Descriptions>
          <Button type="primary" style={{ marginTop: 16 }} onClick={() => setEditing(true)}>
            Chỉnh sửa
          </Button>
        </>
      ) : (
        <Form form={form} layout="vertical" style={{ maxWidth: 480 }}>
          <Form.Item name="fullName" label="Họ tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="SĐT">
            <Input />
          </Form.Item>
          <Button type="primary" loading={saving} onClick={handleSave}>
            Lưu
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={() => setEditing(false)}>
            Hủy
          </Button>
        </Form>
      )}
    </Card>
  );
}
