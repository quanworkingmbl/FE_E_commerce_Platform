import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Typography } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/api/services/authService";
import { useUserActions } from "@/store/userStore";

const { Title, Text } = Typography;
const HOMEPAGE = import.meta.env.VITE_APP_HOMEPAGE || "/admin/dashboard";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const { setAuth } = useUserActions();
  const navigate = useNavigate();
  const [form] = Form.useForm<LoginFormValues>();

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const data = await authService.login(values);
      setAuth({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresIn: data.expiresIn,
        user: data.user,
      });
      message.success("Đăng nhập thành công");
      navigate(HOMEPAGE, { replace: true });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={2}>Đăng nhập Admin</Title>
      <Text type="secondary">E-Commerce Platform — Spring Boot API</Text>
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 32 }}
        onFinish={onFinish}
        initialValues={{ email: "admin@ecommerce.com" }}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="admin@ecommerce.com" size="large" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Admin@123" size="large" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block size="large" loading={loading}>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
