import { Card, Col, Row, Statistic, Typography } from "antd";
import { useUserInfo } from "@/store/userStore";

const { Title, Paragraph } = Typography;

export default function DashboardPage() {
  const user = useUserInfo();

  return (
    <div>
      <Title level={3}>Dashboard</Title>
      <Paragraph>
        Chào mừng, <strong>{user?.fullName}</strong>. Phase 1 — shell CMS đã sẵn sàng.
        Các module Products, Orders... sẽ bật theo phase tiếp theo.
      </Paragraph>
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Products" value="—" suffix="(Phase 2)" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Orders" value="—" suffix="(Phase 4)" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Coupons" value="—" suffix="(Phase 3)" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Returns" value="—" suffix="(Phase 6)" />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
