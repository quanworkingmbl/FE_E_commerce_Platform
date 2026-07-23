import { useCallback, useEffect, useState } from "react";
import { Card, Col, Row, Spin, Statistic, Table, Typography } from "antd";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { reportService } from "@/api/services/reportService";
import { formatVnd } from "@/constants/orderStatus";
import { useUserInfo } from "@/store/userStore";
import type { DashboardSummary, RevenueByMonthItem, TopProductItem } from "@/types/report";

const { Title, Paragraph } = Typography;

export default function DashboardPage() {
  const user = useUserInfo();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [revenue, setRevenue] = useState<RevenueByMonthItem[]>([]);
  const [topProducts, setTopProducts] = useState<TopProductItem[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const year = new Date().getFullYear();
      const [s, r, t] = await Promise.all([
        reportService.summary(),
        reportService.revenueByMonth(year),
        reportService.topProducts(undefined, undefined, 5),
      ]);
      setSummary(s);
      setRevenue(r);
      setTopProducts(t);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const chartOptions: ApexOptions = {
    chart: { toolbar: { show: false }, fontFamily: "inherit" },
    xaxis: { categories: revenue.map((i) => i.month) },
    yaxis: { labels: { formatter: (v) => `${Math.round(v / 1000)}k` } },
    colors: ["#FF6B35"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3 },
    fill: { type: "gradient", gradient: { opacityFrom: 0.4, opacityTo: 0.05 } },
  };

  const chartSeries = [{ name: "Doanh thu", data: revenue.map((i) => i.revenue) }];

  if (loading && !summary) {
    return <div style={{ textAlign: "center", padding: 80 }}><Spin size="large" /></div>;
  }

  return (
    <div>
      <Title level={3}>Dashboard</Title>
      <Paragraph>Chào mừng, <strong>{user?.fullName}</strong>. Tổng quan kinh doanh thời gian thực.</Paragraph>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Doanh thu" value={summary?.totalRevenue ?? 0} formatter={(v) => formatVnd(Number(v))} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Đơn hàng" value={summary?.totalOrders ?? 0} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Chờ thanh toán" value={summary?.pendingOrders ?? 0} valueStyle={{ color: "#faad14" }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Tồn kho thấp" value={summary?.lowStockCount ?? 0} valueStyle={{ color: "#ff4d4f" }} /></Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={14}>
          <Card title="Doanh thu theo tháng">
            <ReactApexChart type="area" height={320} options={chartOptions} series={chartSeries} />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="Top sản phẩm bán chạy">
            <Table
              size="small"
              rowKey="sku"
              pagination={false}
              dataSource={topProducts}
              columns={[
                { title: "Sản phẩm", dataIndex: "productName", ellipsis: true },
                { title: "SL", dataIndex: "quantitySold", width: 60 },
                { title: "Doanh thu", dataIndex: "revenue", render: (v: number) => formatVnd(v) },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
