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

export interface RespnseWarehouse {
    id: number;
    name: string;
    address: string;
    phone: string;
    user_id: number; 
}

