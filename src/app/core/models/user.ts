import { Client } from './client';
import { Warehouse } from './warehouse';

export interface User {
  id: number;
  username: string;
  password: string | null; 
  email: string;
  role: string;
  image_url: string;
  admin_id: number | null;
}

export interface CreateUserRequest {
  username: string;
  password: string | null; 
  email: string;
  role: string;
  image_url: string | null;
  admin_id: number | null;
}

export interface ResponseUser {
  id: number;
  username: string;
  email: string;
  role: string;
  image_url: string;
  admin_id: number;
}

export interface UserWithWarehouses {
  id: number;
  username: string;
  email: string;
  role: string;
  warehouses: Warehouse[];
}

export interface ClientsByUserIdResponse {
  id: number;
  username: string;
  email: string;
  role: string;
  clients: Client[];
}
