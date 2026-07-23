export type DiscountType = "PERCENTAGE" | "FIXED";

export type Coupon = {
  id: number;
  code: string;
  name: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usageCount: number;
  usageLimitPerUser?: number;
  startDate?: string;
  endDate?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CouponRequest = Omit<Coupon, "id" | "usageCount" | "createdAt" | "updatedAt">;
