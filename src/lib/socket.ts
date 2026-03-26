import { io, Socket } from "socket.io-client";
import { NotificationSocketPayload, RecipientType } from "@/types/notification";

interface ServerToClientEvents {
  "notification:new": (payload: NotificationSocketPayload) => void;
}

interface ClientToServerEvents {
  join: (payload: { role: RecipientType; userId: string }) => void;
}

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export const getSocket = (): Socket<
  ServerToClientEvents,
  ClientToServerEvents
> => {
  if (!socket) {
    const socketUrl =
      process.env.REACT_APP_SERVER_URL ?? "http://localhost:5000";

    socket = io(socketUrl, {
      withCredentials: true,
      autoConnect: false,
      transports: ["websocket", "polling"],
    });
  }

  return socket;
};
