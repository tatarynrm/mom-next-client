"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import api from "@/shared/api/instance";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/AuthProvider";

const loginSchema = z.object({
  email: z.string().email({ message: "Невірний email" }),
  password: z
    .string()
    .min(6, { message: "Пароль має бути мінімум 6 символів" }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
     const { user, login, loading:loadingAuth } = useAuthContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    try {
      console.log(data, "data");

    //   const res = await api.post("/auth/login", data);
      login(data.email,data.password)
      toast.success("Ви успішно увійшли!");
      router.replace("/dashboard");
    } catch (err) {
      // toast помилка вже обробляється в інстансі
    } finally {
      setLoading(false);
    }
  };
  // Якщо користувач уже залогінений, не даємо заходити на login
  useEffect(() => {
    if (!loading && user) {
      // Залишаємося на поточній сторінці, або можна редірект на /dashboard
      router.replace("/dashboard");
    }
  }, [user, loading, router]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Логін
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="example@mail.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="relative">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Ваш пароль"
                {...register("password")}
                showPasswordToggle
              />

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Завантаження..." : "Увійти"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
