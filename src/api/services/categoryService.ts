import apiClient from "@/api/apiClient";
import type { Category } from "@/types/catalog";

export const categoryService = {
  listTree() {
    return apiClient.get<Category[]>({ url: "/admin/catalog/categories" });
  },
  create(data: { name: string; parentId?: number; sortOrder?: number; active?: boolean }) {
    return apiClient.post<Category>({ url: "/admin/catalog/categories", data });
  },
  update(id: number, data: { name: string; parentId?: number; sortOrder?: number; active?: boolean }) {
    return apiClient.put<Category>({ url: `/admin/catalog/categories/${id}`, data });
  },
  delete(id: number) {
    return apiClient.delete<void>({ url: `/admin/catalog/categories/${id}` });
  },
};

export function flattenCategories(categories: Category[]): Category[] {
  const result: Category[] = [];
  const walk = (items: Category[], depth = 0) => {
    items.forEach((item) => {
      result.push({ ...item, name: `${"— ".repeat(depth)}${item.name}` });
      if (item.children?.length) walk(item.children, depth + 1);
    });
  };
  walk(categories);
  return result;
}
