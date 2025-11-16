"use client";

import LeftSideBar from "@/components/layout/LeftSideBar"; // Импортируем LeftSideBar
import { searchPosts, searchUsers } from "@/service/search.service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SearchPage = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const query = new URLSearchParams(window.location.search).get("q");

  useEffect(() => {
    if (!query) return;

    setLoading(true);

    const fetchData = async () => {
      try {
        const usersResult = await searchUsers(query);
        const postsResult = await searchPosts(query);

        setUsers(usersResult);
        setPosts(postsResult);
      } catch (error) {
        setError("Ошибка при загрузке результатов.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return (
    <div className="min-h-screen bg-background text-foreground py-6">
      <div className="flex flex-col md:flex-row">
        {/* Добавляем LeftSideBar слева */}
        <LeftSideBar />

        {/* Центрируем содержимое поиска */}
        <div className="w-full max-w-screen-lg p-4 md:ml-64 mb-8 mt-20">
          {/* Добавляем отступ для сайдбара и снизу */}
          {loading && <p>Загрузка...</p>}
          {error && <p>{error}</p>}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Результаты поиска для: {query}
            </h2>

            <h3 className="text-xl font-medium mb-2">Посты:</h3>
            {posts.length === 0 ? (
              <p className="text-gray-500">Нет результатов для постов</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-muted p-4 rounded-md shadow-md hover:shadow-xl transition-shadow duration-300"
                  >
                    <h4 className="text-lg font-semibold">{post.content}</h4>

                    {/* Добавляем изображение, если оно есть */}
                    {post.mediaUrl && (
                      <div className="mt-2">
                        <img
                          src={post.mediaUrl}
                          alt="Post media"
                          className="w-full h-auto rounded-md"
                        />
                      </div>
                    )}

                    <p className="text-sm text-muted-foreground mt-2">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                    <button
                      onClick={() => router.push(`/posts/${post._id}`)}
                      className="mt-3 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Подробнее
                    </button>
                  </div>
                ))}
              </div>
            )}

            <h3 className="text-xl font-medium mt-6 mb-2">Пользователи:</h3>
            {users.length === 0 ? (
              <p className="text-gray-500">Нет результатов для пользователей</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="bg-muted p-4 rounded-md shadow-md hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-white">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={user.username}
                            className="h-full w-full rounded-full"
                          />
                        ) : (
                          user.username?.[0]?.toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{user.username}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/profile/${user._id}`)}
                      className="mt-3 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Перейти в профиль
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
