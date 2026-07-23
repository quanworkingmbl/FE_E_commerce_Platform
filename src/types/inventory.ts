export type InventoryItem = {
  variantId: number;
  sku: string;
  productName: string;
  size?: string;
  color?: string;
  stockQuantity: number;
  lowStockThreshold: number;
  lowStock: boolean;
};

export type InventoryLog = {
  id: number;
  logType: string;
  quantity: number;
  stockBefore: number;
  stockAfter: number;
  note?: string;
  createdByEmail?: string;
  createdAt: string;
};
