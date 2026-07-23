import type { PageResponse } from "@/types/api";

export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId?: number | null;
  sortOrder: number;
  active: boolean;
  children?: Category[];
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logoUrl?: string;
  active: boolean;
}

export type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export interface ProductVariant {
  id?: number;
  sku: string;
  size?: string;
  color?: string;
  price: number;
  comparePrice?: number;
  weight?: number;
  stockQuantity?: number;
  active?: boolean;
}

export interface ProductImage {
  id?: number;
  url: string;
  altText?: string;
  sortOrder?: number;
  primary?: boolean;
}

export interface ProductSummary {
  id: number;
  name: string;
  slug: string;
  description?: string;
  status: ProductStatus;
  categoryId?: number;
  categoryName?: string;
  brandId?: number;
  brandName?: string;
  primaryImageUrl?: string;
  minPrice?: number;
  maxPrice?: number;
  createdAt?: string;
}

export interface ProductDetail extends ProductSummary {
  category?: Category;
  brand?: Brand;
  variants: ProductVariant[];
  images: ProductImage[];
  updatedAt?: string;
}

export interface ProductPayload {
  name: string;
  description?: string;
  categoryId?: number;
  brandId?: number;
  status?: ProductStatus;
  variants: ProductVariant[];
  images?: ProductImage[];
}

export interface MediaUploadResult {
  url: string;
  filename: string;
  size: number;
}

export type ProductPage = PageResponse<ProductSummary>;
export type BrandPage = PageResponse<Brand>;
