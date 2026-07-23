import apiClient from "@/api/apiClient";
import { mapPage } from "@/api/pageMapper";
import type { PageResponse } from "@/types/api";
import type { NotificationCategory, NotificationItem, UnreadCount } from "@/types/notification";

export const notificationService = {
  async list(page = 0, size = 50, params?: { category?: NotificationCategory; isRead?: boolean }) {
    const data = await apiClient.get<PageResponse<NotificationItem>>({
      url: "/notifications",
      params: { page, size, ...params },
    });
    return mapPage<NotificationItem>(data);
  },

  unreadCount() {
    return apiClient.get<UnreadCount>({ url: "/notifications/unread-count" });
  },

  markRead(id: number) {
    return apiClient.patch<NotificationItem>({ url: `/notifications/${id}/read` });
  },

  markAllRead() {
    return apiClient.patch<void>({ url: "/notifications/read-all" });
  },
};
