// src/shared/api/instance.api.ts
import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.mira-notes.site",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // куки відправляються автоматично
});

// Функція для оновлення access token через refresh cookie
async function refreshAccessToken() {
  try {
    const res = await api.post("/auth/refresh");
    return res.data.accessToken; // новий access token
  } catch (err) {
    console.error("Не вдалося оновити токен", err);
    return null;
  }
}

// Axios interceptor для 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        // підставляємо новий access token у заголовки
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest); // повторюємо запит
      }
    }

    const message =
      error.response?.data?.message || error.message || "Помилка запиту";

    console.log(error);
    if (error.response.data.statusCode === 403) {
      return null;
    }

    console.log(message, "message");

    toast.error(message);
    return Promise.reject(error);
  }
);

export default api;
