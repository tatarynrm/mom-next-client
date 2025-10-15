// hooks/useAuth.ts
import { useState, useEffect, useCallback } from "react";
import api from "../api/instance";
import { usePathname, useRouter } from "next/navigation";

interface User {
  id: number;
  email: string;
}

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Логін
  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    setAccessToken(res.data.accessToken);
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${res.data.accessToken}`;

    const me = await api.get("/auth/me");
    setUser(me.data);
  }, []);

  // Вихід
  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout"); // викликаємо бекенд для видалення refresh token
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      setAccessToken(null);
      api.defaults.headers.common["Authorization"] = "";
      router.push("/login"); // редірект на логін
    }
  }, []);

  // Спроба отримати user при старті (через refresh token)
  const refresh = useCallback(async () => {
    try {
      const res = await api.post("/auth/refresh");
      const accessToken = res.data.accessToken;

      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      const me = await api.get("/auth/me");
      setUser(me.data);
      setAccessToken(accessToken);
    } catch (e) {
      // ✅ Перевірка, на яких сторінках реагувати на помилку
      if (pathname === "/login" || pathname.startsWith("/dashboard")) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [pathname, logout]);
  // Виконуємо refresh при старті аплікації
  useEffect(() => {
    refresh();
  }, [refresh]);

  return { user, accessToken, login, logout, loading };
}
