"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  getNotifications,
  markAllReads,
  markSingleRead,
} from "@/services/notification.service";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import { NotificationItem, NotificationsResponse } from "@/types/notification";
import { useAuth } from "@/context/AuthContext";

type NotificationEntityType = "Order" | "Payment" | "";
type ReadFilter = "" | "false" | "true";

const filterTabs: { label: string; value: NotificationEntityType }[] = [
  { label: "All", value: "" },
  { label: "Orders", value: "Order" },
  { label: "Payments", value: "Payment" },
];

const readTabs: { label: string; value: ReadFilter }[] = [
  { label: "All", value: "" },
  { label: "Unread", value: "false" },
];

const typeBadgeStyles: Record<NotificationEntityType, string> = {
  Order: "bg-blue-100 text-blue-700",
  Payment: "bg-emerald-100 text-emerald-700",
  "": "",
};

export default function NotificationsContent() {
  const [activeTab, setActiveTab] = useState<NotificationEntityType>("");
  const [readFilter, setReadFilter] = useState<ReadFilter>("");
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useNotificationSocket(user?.id, true);

  const { data, isLoading } = useQuery<NotificationsResponse>({
    queryKey: ["notifications", activeTab, readFilter],
    queryFn: () =>
      getNotifications({
        entityType: activeTab || undefined,
        isRead: readFilter || undefined,
      }),
    staleTime: 0,
    enabled: true,
  });

  const notifications = useMemo(() => data?.notifications ?? [], [data]);
  const unreadCount = data?.unreadCount ?? 0;

  const { mutate: markAllMutation, isPending: isMarkingAll } = useMutation({
    mutationFn: markAllReads,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const { mutate: markSingleMutation, isPending: isMarkingSingle } =
    useMutation({
      mutationFn: (id: string) => markSingleRead(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      },
    });

  const handleNotificationClick = (item: NotificationItem) => {
    if (!item.isRead) {
      markSingleMutation(item._id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">
            Notifications
          </h2>
          <p className="text-sm text-stone-500">
            {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}
          </p>
        </div>

        <button
          onClick={() => markAllMutation()}
          disabled={isMarkingAll || unreadCount === 0}
          className="rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Mark all as read
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.value || "all"}
            onClick={() => setActiveTab(tab.value)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === tab.value
                ? "bg-yellow-500 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {readTabs.map((tab) => (
          <button
            key={tab.value || "all-read"}
            onClick={() => setReadFilter(tab.value)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              readFilter === tab.value
                ? "bg-rose-500 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="divide-y divide-stone-100 rounded-xl border border-stone-100 bg-white">
        {isLoading ? (
          <div className="p-6 text-sm text-stone-500">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-sm text-stone-500">
            No notifications found.
          </div>
        ) : (
          notifications.map((item) => (
            <button
              key={item._id}
              onClick={() => handleNotificationClick(item)}
              disabled={isMarkingSingle}
              className={`w-full text-left p-4 hover:bg-stone-50 transition-colors ${
                !item.isRead ? "bg-yellow-50/50" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p
                    className={`text-sm ${!item.isRead ? "font-semibold text-stone-900" : "font-medium text-stone-800"}`}
                  >
                    {item.title}
                  </p>
                  <p className="text-sm text-stone-600">{item.message}</p>
                </div>
                {!item.isRead && (
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-yellow-500" />
                )}
              </div>

              <div className="mt-2 flex items-center gap-2 text-xs text-stone-500">
                {item.entityType && (
                  <span
                    className={`rounded px-2 py-0.5 font-medium ${typeBadgeStyles[item.entityType]}`}
                  >
                    {item.entityType}
                  </span>
                )}
                <span>
                  {formatDistanceToNow(new Date(item.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
