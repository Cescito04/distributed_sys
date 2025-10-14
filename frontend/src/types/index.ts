export interface Product {
  id: number;
  nom: string;
  description: string;
  prix: string;
  quantite: number;
  date_creation: string;
  date_modification: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  nom: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tokens: {
      access: string;
      refresh: string;
    };
  };
}

export interface ProductCreateRequest {
  nom: string;
  description: string;
  prix: number;
  quantite: number;
}
