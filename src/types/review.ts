export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ReviewSummary {
  id: number;
  productId: number;
  productName: string;
  orderId: number;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  rating: number;
  content?: string | null;
  status: ReviewStatus;
  adminNote?: string | null;
  createdAt: string;
  moderatedAt?: string | null;
}
