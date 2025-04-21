import { Client } from "./client";
import { Product } from "./product";

export interface Warehouse {
    id: number;
    name: string;
    address: string;
    phone: string;
    user_id: number; 
}

export interface CreateUpdateWarehouseRequest {
    name: string;
    address: string;
    phone: string;
    user_id: number; 
}

export interface ResponseWarehouse {
    id: number;
    name: string;
    address: string;
    phone: string;
    user_id: number; 
}

export interface ProductsByWarehouseIdResponse {
    id: number;
    name: string;
    address: string;
    phone: string;
    user_id: number;
    products: Product[];
  }

  export interface ClientsByWarehouseIdResponse {
    id: number;
    name: string;
    address: string;
    phone: string;
    user_id: number;
    clients: Client[];
  }
  

