import { apiGetNotifications } from "@/service/notification.service"; // импортируй функции для работы с API
import { socket } from "@/service/socketClient";
import { create } from "zustand";

const useNotificationStore = create((set, get) => ({
  notifications: [],
  loading: false,
  error: null,
  unreadCount: 0,

  initSocketListener: () => {
    if (socket._hasNotificationListener) return;
    socket._hasNotificationListener = true;

    socket.on("notification:new", (notification) => {
      set((state) => {
        const exists = state.notifications.some(
          (n) => n._id === notification._id
        );
        const notifications = exists
          ? state.notifications
          : [notification, ...state.notifications];

        const unreadCount = notifications.filter((n) => !n.isRead).length;
        return { notifications, unreadCount };
      });
    });
  },

  fetchNotifications: async () => {
    try {
      set({ loading: true, error: null });
      const data = await apiGetNotifications();
      const notifications = Array.isArray(data)
        ? data
        : data?.notifications || [];
      const unreadCount = notifications.filter((n) => !n.isRead).length;
      set({ notifications, unreadCount, loading: false });

      get().initSocketListener(); // Инициализация слушателя WebSocket
    } catch (e) {
      console.error("Ошибка загрузки уведомлений:", e);
      set({ error: "Не удалось загрузить уведомления", loading: false });
    }
  },
}));

export default useNotificationStore;
