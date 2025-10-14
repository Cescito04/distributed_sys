import axios from 'axios';
import { Product, User, AuthTokens, AuthResponse, ApiResponse } from '../types';

/**
 * API client configuration with Axios
 * Handles automatic JWT authentication and token refresh
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to automatically add JWT token
 * Retrieves access token from localStorage and adds it to headers
 */
api.interceptors.request.use(
  (config) => {
    const tokens = localStorage.getItem('tokens');
    if (tokens) {
      const { access } = JSON.parse(tokens);
      if (access) {
        config.headers.Authorization = `Bearer ${access}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor to handle automatic token refresh
 * On 401 error, attempts to renew access token with refresh token
 * Redirects to login page if refresh fails
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const tokens = localStorage.getItem('tokens');
      
      if (tokens) {
        const { refresh } = JSON.parse(tokens);
        if (refresh) {
          try {
            const response = await axios.post<ApiResponse<{ access: string }>>(`${API_BASE_URL}/auth/refresh/`, { refresh });
            const newAccessToken = response.data.data?.access;
            
            if (newAccessToken) {
              const newTokens = { ...JSON.parse(tokens), access: newAccessToken };
              localStorage.setItem('tokens', JSON.stringify(newTokens));
              api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
              return api(originalRequest);
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            localStorage.removeItem('tokens');
            window.location.href = '/login';
          }
        }
      }
      
      localStorage.removeItem('tokens');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Retrieves the list of all available products
 * @returns Promise<ApiResponse<Product[]>> - List of products or error
 */
export const getProducts = async (): Promise<ApiResponse<Product[]>> => {
  try {
    const response = await api.get<ApiResponse<Product[]>>('/products/');
    return response.data;
  } catch (error: any) {
    return { 
      success: false, 
      message: error.response?.data?.message || error.message, 
      errors: error.response?.data?.errors 
    };
  }
};

/**
 * Creates a new product (requires admin privileges)
 * @param productData - Product data to create
 * @returns Promise<ApiResponse<Product>> - Created product or error
 */
export const addProduct = async (productData: Omit<Product, 'id' | 'date_creation' | 'date_modification'>): Promise<ApiResponse<Product>> => {
  try {
    const response = await api.post<ApiResponse<Product>>('/products/create/', productData);
    return response.data;
  } catch (error: any) {
    return { 
      success: false, 
      message: error.response?.data?.message || error.message, 
      errors: error.response?.data?.errors 
    };
  }
};

/**
 * Authenticates a user with email and password
 * Automatically stores JWT tokens in localStorage
 * @param credentials - User email and password
 * @returns Promise<ApiResponse<AuthResponse>> - User data and tokens or error
 */
export const loginUser = async (credentials: any): Promise<ApiResponse<AuthResponse>> => {
  try {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login/', credentials);
    
    if (response.data.success && response.data.data?.tokens) {
      localStorage.setItem('tokens', JSON.stringify(response.data.data.tokens));
    }
    return response.data;
  } catch (error: any) {
    return { 
      success: false, 
      message: error.response?.data?.message || error.message, 
      errors: error.response?.data?.errors 
    };
  }
};

/**
 * Creates a new user account
 * @param userData - User data to create
 * @returns Promise<ApiResponse<User>> - Created user or error
 */
export const registerUser = async (userData: any): Promise<ApiResponse<User>> => {
  try {
    const response = await api.post<ApiResponse<User>>('/users/create/', userData);
    return response.data;
  } catch (error: any) {
    return { 
      success: false, 
      message: error.response?.data?.message || error.message, 
      errors: error.response?.data?.errors 
    };
  }
};

/**
 * Logs out the current user
 * Invalidates refresh token on server side and removes local tokens
 * @returns Promise<ApiResponse<any>> - Logout confirmation or error
 */
export const logoutUser = async (): Promise<ApiResponse<any>> => {
  try {
    const tokens = localStorage.getItem('tokens');
    if (tokens) {
      const { refresh } = JSON.parse(tokens);
      await api.post('/auth/logout/', { refresh });
    }
    localStorage.removeItem('tokens');
    return { success: true, message: 'Déconnexion réussie' };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.response?.data?.message || error.message, 
      errors: error.response?.data?.errors 
    };
  }
};

/**
 * Retrieves the profile of the logged-in user
 * @returns Promise<ApiResponse<User>> - User profile or error
 */
export const getUserProfile = async (): Promise<ApiResponse<User>> => {
  try {
    const response = await api.get<ApiResponse<User>>('/auth/profile/');
    return response.data;
  } catch (error: any) {
    return { 
      success: false, 
      message: error.response?.data?.message || error.message, 
      errors: error.response?.data?.errors 
    };
  }
};
