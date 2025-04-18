export interface Product {
  id: number;
  name: string;
  quantity: number;
  serial_number: string;
  price: number;
  description: string | null;
  category: string | null;
  image_url: string | null;
  kit_id: number | null;
  warehouse_id: number | null;
}

export interface CreateUpdateProductRequest {
  serial_number: string;
  name: string;
  quantity: number;
  price: number;
  description: string | null;
  category: string | null;
  image_url: string | null;
  kit_id: number | null;
  warehouse_id: number | null;
}

export interface RespnseProduct {
  id: number;
  name: string;
  quantity: number;
  serial_number: string;
  price: number;
  description: string | null;
  category: string | null;
  image_url: string | null;
  kit_id: number | null;
  warehouse_id: number | null;
}
