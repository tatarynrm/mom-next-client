// shared/api/schemas/transportation.schema.ts
import { z } from "zod";

export const transportationSchema = z.object({
  cargo_date: z.string().nonempty("Дата обов'язкова"),
  location_from: z.string().nonempty("Місце завантаження обов'язкове"),
  location_to: z.string().nonempty("Місце вивантаження обов'язкове"),
  driver: z.string().nonempty("Водій обов'язковий"),
  truck: z.string().nonempty("Авто обов'язкове"),
  truck_owner: z.string().nonempty("Власник авто обов'язковий"),
  price: z.number({ message: "Ціна має бути числом" }),
  cost: z.number({ message: "Маржа має бути числом" }),
  status: z.number({message:'Оберіть статус'}).int().min(1).max(4),
  transportation_comment: z.string().optional(),
});
