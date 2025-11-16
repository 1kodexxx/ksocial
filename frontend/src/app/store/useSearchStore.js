import { searchPosts, searchUsers } from "@/service/search.service"; // Подключаем сервисы для поиска
import create from "zustand";

// Хук состояния поиска
const useSearchStore = create((set) => ({
  // Результаты поиска
  users: [],
  posts: [],
  loading: false,
  error: null,

  // Загрузка результатов поиска по пользователям
  searchUsersResults: async (query) => {
    set({ loading: true, error: null });

    try {
      const users = await searchUsers(query);
      set({ users, loading: false });
    } catch (error) {
      console.error("Ошибка поиска пользователей:", error);
      set({
        error: error.message || "Не удалось найти пользователей",
        loading: false,
      });
    }
  },

  // Загрузка результатов поиска по постам
  searchPostsResults: async (query) => {
    set({ loading: true, error: null });

    try {
      const posts = await searchPosts(query);
      set({ posts, loading: false });
    } catch (error) {
      console.error("Ошибка поиска постов:", error);
      set({ error: error.message || "Не удалось найти посты", loading: false });
    }
  },

  // Очистка результатов поиска
  clearResults: () => {
    set({ users: [], posts: [] });
  },
}));

export default useSearchStore;
