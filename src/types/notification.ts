export type NotificationCategory = "ORDER" | "PROMOTION" | "SYSTEM" | "PAYMENT";

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  category: NotificationCategory;
  referenceType?: string | null;
  referenceId?: number | null;
  actionUrl?: string | null;
  read: boolean;
  createdAt: string;
}

export interface UnreadCount {
  unreadCount: number;
}
