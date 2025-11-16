import io from "socket.io-client";

// Инициализация WebSocket
export const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
  withCredentials: true,
});
