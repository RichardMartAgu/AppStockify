export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;

  id: number;
  username: string;
  image_url: string;
  email: string;
}