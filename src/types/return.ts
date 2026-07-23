export type ReturnStatus =
  | "REQUESTED"
  | "APPROVED"
  | "REJECTED"
  | "RECEIVED"
  | "REFUNDED"
  | "CANCELLED";

export interface ReturnSummary {
  id: number;
  orderId: number;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  status: ReturnStatus;
  reason: string;
  adminNote?: string | null;
  refundAmount?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReturnItem {
  orderItemId: number;
  productName: string;
  sku: string;
  quantity: number;
  itemReason?: string | null;
}

export interface ReturnDetail extends ReturnSummary {
  items: ReturnItem[];
}
