export type PaymentTransactionStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface PaymentSummary {
  id: number;
  orderId: number;
  orderNumber: string;
  amount: number;
  provider: string;
  status: PaymentTransactionStatus;
  txnRef: string;
  gatewayTransactionNo?: string | null;
  gatewayResponseCode?: string | null;
  gatewayBankCode?: string | null;
  paidAt?: string | null;
  createdAt: string;
}
