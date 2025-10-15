"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/shared/api/instance";
import { transportationSchema } from "../schemas/transportation.schema";
import { Edit } from "lucide-react";

type TransportationFormData = z.infer<typeof transportationSchema>;

export function EditTransportation({
  data,
  onSuccess,
}: {
  data: TransportationFormData & { id: number };
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false);

  const defaultValues = {
    ...data,
    cargo_date: data.cargo_date
      ? new Date(data.cargo_date).toISOString().split("T")[0]
      : "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TransportationFormData>({
    resolver: zodResolver(transportationSchema),
    defaultValues,
  });

  const onSubmit = async (formData: TransportationFormData) => {
    try {
      await api.patch(`/transportations/${data.id}`, formData);
      reset(formData);
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      alert("Помилка при оновленні");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon-sm" variant="outline">
          <Edit />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редагувати перевезення</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Дата вантажу */}
            <div>
              <label className="block mb-1 font-medium">Дата вантажу</label>
              <Input type="date" {...register("cargo_date")} />
              {errors.cargo_date && (
                <p className="text-red-500 text-sm">{errors.cargo_date.message}</p>
              )}
            </div>

            {/* Місце відправлення */}
            <div>
              <label className="block mb-1 font-medium">Місце відправлення</label>
              <Input {...register("location_from")} />
              {errors.location_from && (
                <p className="text-red-500 text-sm">{errors.location_from.message}</p>
              )}
            </div>

            {/* Місце прибуття */}
            <div>
              <label className="block mb-1 font-medium">Місце прибуття</label>
              <Input {...register("location_to")} />
              {errors.location_to && (
                <p className="text-red-500 text-sm">{errors.location_to.message}</p>
              )}
            </div>

            {/* Водій */}
            <div>
              <label className="block mb-1 font-medium">Водій</label>
              <Input {...register("driver")} />
              {errors.driver && (
                <p className="text-red-500 text-sm">{errors.driver.message}</p>
              )}
            </div>

            {/* Авто */}
            <div>
              <label className="block mb-1 font-medium">Авто</label>
              <Input {...register("truck")} />
              {errors.truck && (
                <p className="text-red-500 text-sm">{errors.truck.message}</p>
              )}
            </div>

            {/* Власник авто */}
            <div>
              <label className="block mb-1 font-medium">Власник авто</label>
              <Input {...register("truck_owner")} />
              {errors.truck_owner && (
                <p className="text-red-500 text-sm">{errors.truck_owner.message}</p>
              )}
            </div>

            {/* Ціна */}
            <div>
              <label className="block mb-1 font-medium">Ціна</label>
              <Input type="number" {...register("price", { valueAsNumber: true })} />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>

            {/* Маржа */}
            <div>
              <label className="block mb-1 font-medium">Маржа</label>
              <Input type="number" {...register("cost", { valueAsNumber: true })} />
              {errors.cost && (
                <p className="text-red-500 text-sm">{errors.cost.message}</p>
              )}
            </div>

            {/* Статус */}
            <div>
              <label className="block mb-1 font-medium">Статус</label>
              <Select
                onValueChange={(val) =>
                  setValue("status", Number(val), { shouldValidate: true })
                }
                defaultValue={watch("status")?.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Активна</SelectItem>
                  <SelectItem value="2">Очікую</SelectItem>
                  <SelectItem value="3">Не оплачена</SelectItem>
                  <SelectItem value="4">Завершена</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status.message}</p>
              )}
            </div>

            {/* Коментар на всю ширину */}
            <div className="sm:col-span-2">
              <label className="block mb-1 font-medium">Коментар</label>
              <Textarea {...register("transportation_comment")} />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Скасувати
            </Button>
            <Button type="submit">Зберегти</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
