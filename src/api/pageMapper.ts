import type { PageResponse } from "@/types/api";

export function mapPage<T>(data: PageResponse<T>) {
  return {
    items: data.content,
    total: data.totalElements,
    page: data.page,
    size: data.size,
    totalPages: data.totalPages,
  };
}
