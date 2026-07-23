export type OrderStatus =
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPING"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus = "UNPAID" | "PAID" | "REFUNDED";

export type OrderItem = {
  id: number;
  variantId?: number;
  productName: string;
  sku: string;
  variantLabel?: string;
  imageUrl?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type OrderStatusHistory = {
  status: OrderStatus;
  note?: string;
  actorEmail?: string;
  createdAt: string;
};

export type OrderSummary = {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  itemCount: number;
  recipientName: string;
  createdAt: string;
};

export type OrderDetail = OrderSummary & {
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  couponCode?: string;
  shippingMethodName?: string;
  recipientPhone: string;
  shippingAddress: string;
  note?: string;
  customerEmail?: string;
  items: OrderItem[];
  statusHistory: OrderStatusHistory[];
  updatedAt: string;
};

export type UpdateOrderStatusPayload = {
  status: OrderStatus;
  note?: string;
};
