"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSocket } from "@/lib/socket";
import {
  NotificationType,
  NotificationsResponse,
  RecipientType,
} from "@/types/notification";

const toastMessages: Partial<Record<NotificationType, string>> = {
  [NotificationType.NEW_ORDER]: "New order received",
  [NotificationType.ORDER_STATUS_UPDATED]: "Order status updated",
  [NotificationType.PAYMENT_SUCCESS]: "Payment successful",
  [NotificationType.ORDER_CANCELLED]: "Order cancelled",
  [NotificationType.REFUND_PROCESSED]: "Refund processed",
  [NotificationType.REFEND_INITIATED]: "Refund initiated",
  [NotificationType.REFEND_SUCCESS]: "Refund successful",
};

export const useNotificationSocket = (
  userId: string | null | undefined,
  enabled = true,
): void => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || !userId) return;

    const socket = getSocket();

    const handleConnect = () => {
      socket.emit("join", { role: RecipientType.USER, userId });
    };

    const handleConnectError = (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : "Socket connection failed";
      toast.error(msg);
    };

    const handleDisconnect = () => {
      // Keep it quiet; automatic reconnection will try again.
    };

    const handleNewNotification = (payload: {
      type: NotificationType;
      unreadCount: number;
    }) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });

      queryClient.setQueriesData<NotificationsResponse>(
        { queryKey: ["notifications"], exact: false },
        (old) => (old ? { ...old, unreadCount: payload.unreadCount } : old),
      );
      queryClient.setQueryData<number>(["notifications", "unreadCount"], payload.unreadCount);

      const msg = toastMessages[payload.type] ?? "New notification";
      toast.info(msg);
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("disconnect", handleDisconnect);
    socket.on("notification:new", handleNewNotification);

    if (!socket.connected) {
      socket.connect();
    } else {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      socket.off("disconnect", handleDisconnect);
      socket.off("notification:new", handleNewNotification);
    };
  }, [enabled, queryClient, userId]);
};

