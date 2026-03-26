export enum NotificationType {
  NEW_ORDER = "NEW_ORDER",
  ORDER_STATUS_UPDATED = "ORDER_STATUS_UPDATED",
  PAYMENT_SUCCESS = "PAYMENT_SUCCESS",
  ORDER_CANCELLED = "ORDER_CANCELLED",
  REFUND_PROCESSED = "REFUND_PROCESSED",
  REFEND_INITIATED = "REFEND_INITIATED",
  REFEND_SUCCESS = "REFEND_SUCCESS",
}

export enum RecipientType {
  ADMIN = "ADMIN",
  USER = "USER",
}

export type NotificationEntityType = "Order" | "Payment" | null;

export type NotificationItem = {
  _id: string;
  type: NotificationType;
  recipientType: RecipientType;
  recipientId?: string | null;
  title: string;
  message: string;
  entityId?: string | null;
  entityType?: NotificationEntityType;
  isRead: boolean;
  readAt?: string | null;
  actionUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NotificationsResponse = {
  success: boolean;
  unreadCount: number;
  notifications: NotificationItem[];
};

export type NotificationSocketPayload = {
  type: NotificationType;
  unreadCount: number;
  notification: NotificationItem;
};

