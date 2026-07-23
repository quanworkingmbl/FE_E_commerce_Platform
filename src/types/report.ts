export interface DashboardSummary {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalCustomers: number;
  lowStockCount: number;
}

export interface RevenueByMonthItem {
  month: string;
  revenue: number;
  orderCount: number;
}

export interface TopProductItem {
  productName: string;
  sku: string;
  quantitySold: number;
  revenue: number;
}

export interface LowStockItem {
  variantId: number;
  sku: string;
  productName: string;
  stockQuantity: number;
  lowStockThreshold: number;
}
