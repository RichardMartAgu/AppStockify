export interface CreateUserRequest {
    username: string;
    password: string;
    email: string;
    role: string;
    image_url: string | null;
    admin_id: number | null;
}

export interface RespnseUser {
    id: number;
    username: string;
    email: string;
    role: string;
    image_url: string;
    admin_id: number; 
}

