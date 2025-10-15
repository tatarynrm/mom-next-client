// services/auth.ts
import axios from "axios";

export interface LoginResponse {
  accessToken: string;
}

export async function login(email: string, password: string) {
  const response = await axios.post<LoginResponse>(
    "http://localhost:5004/auth/login", // твій NestJS сервер
    { email, password },
    {
      withCredentials: true, // обов'язково, щоб браузер відправив/прийняв cookie
    }
  );

  // Зберігаємо access token у пам'яті або state (не cookie!)
  localStorage.setItem("accessToken", response.data.accessToken);

  return response.data;
}
export async function getMe() {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get("http://localhost:5004/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true, // якщо refresh token використовується
  });
  return response.data; // дані користувача
}
