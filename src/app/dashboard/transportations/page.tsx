"use client";

import AddTransportationModal from "@/features/dashboard/transportations/components/AddTransportationModal";
import { DeleteTransportation } from "@/features/dashboard/transportations/components/DeleteTransportation";
import { EditTransportation } from "@/features/dashboard/transportations/components/EditTransportation";
import api from "@/shared/api/instance";
import { Transportation } from "@/shared/api/types/transportation";
import moment from "moment";
import "moment/locale/uk";
import { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getStatusColorClass } from "@/lib/utils/status";

moment.locale("uk");



export default function TransportationsPage() {
  const [data, setData] = useState<Transportation[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  const limit = 10;

  const fetchData = async (page = 1, searchQuery = search) => {
    try {
      const res = await api.get(
        `/transportations?page=${page}&limit=${limit}&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      setData(res.data.rows);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    }
  };

  // Debounce для пошуку (300ms)
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setPage(1);
      fetchData(1, value);
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <Input
          clearable
          placeholder="Пошук..."
          value={search}
          onChange={handleSearchChange}
     
        />
        <AddTransportationModal onSuccess={() => fetchData(page)} />
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-full border-collapse text-sm sm:text-base">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-3 text-left whitespace-nowrap">Створено</th>
              <th className="p-3 text-left whitespace-nowrap">Маршрут</th>
              <th className="p-3 text-left whitespace-nowrap">Водій</th>
              <th className="p-3 text-left whitespace-nowrap">Авто</th>
              <th className="p-3 text-left whitespace-nowrap">Ціна</th>
              <th className="p-3 text-left whitespace-nowrap">Маржа</th>
              <th className="p-3 text-left whitespace-nowrap">Статус</th>
              <th className="p-3 text-left whitespace-nowrap">Редагувати</th>
            </tr>
          </thead>
          <tbody>
            {data.map((t) => (
              <tr
                key={t.id}
                className="border-t hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <td className="p-3">{moment(t.cargo_date).format("LL")}</td>
                <td className="p-3 uppercase whitespace-nowrap">
                  {t.location_from} → {t.location_to}
                </td>
                <td className="p-3 uppercase">{t.driver}</td>
                <td className="p-3 uppercase">{t.truck}</td>
                <td className="p-3">{t.price}</td>
                <td className="p-3">{t.cost}</td>
                <td
                  className={`p-3 font-bold dark:text-black ${getStatusColorClass(
                    t.status
                  )}`}
                >
                  {t.status_string}
                </td>
                <td className="p-3 flex flex-col justify-between gap-2 md:flex-row">
                  <EditTransportation
                    data={t}
                    onSuccess={() => fetchData(page)}
                  />
                  <DeleteTransportation
                    id={t.id}
                    onSuccess={() => fetchData(page)}
                  />
                </td>
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
