import { apiFetch } from "@/lib/api";
import { NotificationsResponse } from "@/types/notification";

export type NotificationQuery = {
  entityType?: string;
  isRead?: string;
};

export const getNotifications = async (
  params: NotificationQuery = {},
): Promise<NotificationsResponse> => {
  const query = new URLSearchParams();
  if (params.entityType) query.set("entityType", params.entityType);
  if (params.isRead) query.set("isRead", params.isRead);

  const qs = query.toString();
  const res = await apiFetch(`/notifications${qs ? `?${qs}` : ""}`, {
    method: "GET",
  });

  return res?.data ?? res;
};

export const markAllReads = async () => {
  const res = await apiFetch(`/notifications/mark-all-read`, { method: "PATCH" });
  return res?.data ?? res;
};

export const markSingleRead = async (id: string) => {
  const res = await apiFetch(`/notifications/${id}/read`, { method: "PATCH" });
  return res?.data ?? res;
};

