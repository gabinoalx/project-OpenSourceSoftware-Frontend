export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  nombres: string;
  apellidos: string;
  role: string;
}