export interface Transportation {
  id: number; // bigint
  cargo_date: string; // date
  location_from: string; // character varying
  location_to: string; // character varying
  driver: string; // character varying
  truck: string; // character varying
  truck_owner: string; // character varying
  created_at: string; // timestamp with time zone
  updated_at: string; // timestamp with time zone
  user_id: number; // bigint
  transportation_comment: string; // text
  price: number; // integer
  cost: number; // integer
  status: number; // integer
  status_string?:string;
  cargo_owner: string; // character varying
}