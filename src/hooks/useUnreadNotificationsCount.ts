"use client";

import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/services/notification.service";

export const useUnreadNotificationsCount = (enabled = true) => {
  const { data } = useQuery({
    queryKey: ["notifications", "unreadCount"],
    queryFn: async () => {
      const res = await getNotifications({ isRead: "false" });
      return res?.unreadCount ?? 0;
    },
    enabled,
    refetchInterval: enabled ? 60_000 : false,
  });

  return data ?? 0;
};

