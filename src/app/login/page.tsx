"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Проверяем, авторизован ли пользователь
  useEffect(() => {
    try {
      const isAdmin = localStorage.getItem("isAdmin");
      if (isAdmin === "true") {
        router.push("/admin");
      }
    } catch (error) {
      console.error("Ошибка при проверке авторизации:", error);
    }
  }, [router]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      setTimeout(() => {
        // Получаем сохраненный пароль из localStorage, если он есть
        const savedPassword = localStorage.getItem("adminPassword") || "passd030201";
        
        if (username === "adminko" && password === savedPassword) {
          localStorage.setItem("isAdmin", "true");
          router.push("/admin");
        } else {
          setError("Неверное имя пользователя или пароль");
          setIsLoading(false);
        }
      }, 1000);
    } catch (error) {
      console.error("Ошибка при входе:", error);
      setError("Произошла ошибка при входе. Пожалуйста, попробуйте еще раз.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Вход в панель администратора
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Для доступа к админ-панели необходимо войти в систему
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Имя пользователя
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder="Имя пользователя"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder="Пароль"
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-center text-red-500">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-pink-500 group-hover:text-pink-400" />
              </span>
              {isLoading ? "Вход..." : "Войти"}
            </button>
          </div>
        </form>

        <div className="text-sm text-center mt-4">
          <Link href="/" className="font-medium text-pink-600 hover:text-pink-500">
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
} 