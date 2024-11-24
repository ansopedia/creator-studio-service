import { Server, Socket } from "socket.io";

export type UserConnectionEvent = {
  userId: string;
  timestamp: number;
};

export type UserUpdateEvent = {
  userId: string;
  updates: {
    field: string;
    value: unknown;
  }[];
};

export type NotificationEvent = {
  id: string;
  type: "info" | "warning" | "error" | "success";
  message: string;
  timestamp: number;
};

export interface ServerToClientEvents {
  "course:created": (data: { courseId: string }) => void;
  "course:deleted": (data: { courseId: string }) => void;
  "course:restored": (data: { courseId: string }) => void;
  "course:updated": (data: { courseId: string }) => void;
}

export interface ClientToServerEvents {
  "course:create": (data: { name: string; description: string }) => void;
  "course:delete": (data: { courseId: string }) => void;
  "course:restore": (data: { courseId: string }) => void;
  "course:update": (data: { courseId: string; name: string; description: string }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
}

export interface SocketUser {
  userId: string;
  socketId: string;
}

export type CustomSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export type CustomServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
