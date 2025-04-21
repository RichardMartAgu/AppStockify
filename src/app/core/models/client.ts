export interface Client {
    id: number;
    identifier: string;
    name: string;
    contact: string;
    email: string  | null; 
    address: string;
    phone: string;
    user_id: number; 
}
export interface CreateUpdateClientRequest {
    identifier: string;
    name: string;
    contact: string;
    email: string  | null; 
    address: string;
    phone: string;
    user_id: number; 
}

export interface ResponseClient {
    id: number;
    identifier: string;
    name: string;
    contact: string;
    email: string  | null; 
    address: string;
    phone: string;
    user_id: number; 
}

