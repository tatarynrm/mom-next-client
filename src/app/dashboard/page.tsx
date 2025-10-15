"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/AuthProvider";
import api from "@/shared/api/instance";
import { Button } from "@/components/ui/button";

interface MonthlyEarning {
  year: number;
  month: number;
  total: number;
}
const monthNames = [
  "Січень",
  "Лютий",
  "Березень",
  "Квітень",
  "Травень",
  "Червень",
  "Липень",
  "Серпень",
  "Вересень",
  "Жовтень",
  "Листопад",
  "Грудень",
];
export default function Dashboard() {
  const { user, logout, loading } = useAuthContext();
  const router = useRouter();

  const [earnings, setEarnings] = useState<MonthlyEarning[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchEarnings = async () => {
    try {
      const res = await api.get(
        `/transportations/monthly-earnings?page=${page}&limit=${limit}`
      );
      setEarnings(res.data.rows);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) fetchEarnings();
  }, [user, page]);

  const totalPages = Math.ceil(total / limit);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Завантаження...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">DASHBOARD</h1>
        <Button variant="outline" onClick={logout}>
          Вийти
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <p className="text-lg">
          Привіт, <span className="font-semibold">{user?.email}</span>
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Тут відображаються заробітки по місяцях.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white dark:bg-gray-800">
        <table className="min-w-full border-collapse text-sm sm:text-base">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-3 text-left">Місяць</th>
              <th className="p-3 text-left">Рік</th>
              <th className="p-3 text-left">Сума</th>
            </tr>
          </thead>
          <tbody>
            {earnings.map((e, i) => (
              <tr
                key={`${e.year}-${e.month}`}
                className="border-t hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <td className="p-3">{monthNames[e.month - 1]}</td>
                <td className="p-3">{e.year}</td>
                <td className="p-3">{Number(e.total).toLocaleString()} грн</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="w-full sm:w-auto"
        >
          Попередня
        </Button>

        <span className="text-sm sm:text-base">
          Сторінка {page} з {totalPages}
        </span>

        <Button
          variant="outline"
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          className="w-full sm:w-auto"
        >
          Наступна
        </Button>
      </div>
    </div>
  );
}
