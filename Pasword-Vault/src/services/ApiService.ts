import axios, { AxiosInstance, AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Account,
  CreateAccountRequest,
  UpdateAccountRequest,
  AccountListResponse,
  AccountResponse,
  ApiError
} from '../types/api';

// Use your computer's IP address instead of localhost for React Native development
// Replace this IP with your actual computer's IP address from ipconfig
const API_BASE_URL = 'http://<your-ip-address>/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await SecureStore.getItemAsync('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          await SecureStore.deleteItemAsync('auth_token');
          await SecureStore.deleteItemAsync('user_data');
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth methods
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/register', data);
      
      // Store token and user data
      await SecureStore.setItemAsync('auth_token', response.data.token);
      await SecureStore.setItemAsync('user_data', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', data);
      
      // Store token and user data
      await SecureStore.setItemAsync('auth_token', response.data.token);
      await SecureStore.setItemAsync('user_data', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async verifyToken(): Promise<{ valid: boolean; user?: any }> {
    try {
      const response = await this.api.get('/auth/verify');
      return response.data;
    } catch (error: any) {
      return { valid: false };
    }
  }

  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('user_data');
  }

  // Account methods
  async createAccount(data: CreateAccountRequest): Promise<AccountResponse> {
    try {
      const response: AxiosResponse<AccountResponse> = await this.api.post('/accounts', data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getAccounts(masterPassword: string): Promise<AccountListResponse> {
    try {
      const response: AxiosResponse<AccountListResponse> = await this.api.post('/accounts/list', {
        masterPassword
      });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getAccount(accountId: string, masterPassword: string): Promise<AccountResponse> {
    try {
      const response: AxiosResponse<AccountResponse> = await this.api.post(`/accounts/${accountId}`, {
        masterPassword
      });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async updateAccount(accountId: string, data: UpdateAccountRequest): Promise<AccountResponse> {
    try {
      const response: AxiosResponse<AccountResponse> = await this.api.put(`/accounts/${accountId}`, data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async deleteAccount(accountId: string): Promise<{ message: string; accountId: string }> {
    try {
      const response = await this.api.delete(`/accounts/${accountId}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getAccountStats(): Promise<{ message: string; stats: { totalAccounts: number; userId: string } }> {
    try {
      const response = await this.api.get('/accounts/stats');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Utility methods
  async getStoredToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('auth_token');
  }

  async getStoredUser(): Promise<any | null> {
    const userData = await SecureStore.getItemAsync('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  private handleError(error: any): Error {
    if (error.response?.data?.error) {
      return new Error(error.response.data.error);
    } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
      return new Error('Network error: Cannot connect to server. Make sure the backend is running and check your network connection.');
    } else if (error.code === 'ECONNREFUSED') {
      return new Error('Connection refused: Backend server is not running on the specified port.');
    } else if (error.code === 'TIMEOUT') {
      return new Error('Request timeout: Server is taking too long to respond.');
    } else if (error.message) {
      return new Error(error.message);
    } else {
      return new Error('An unexpected error occurred');
    }
  }
}

export const apiService = new ApiService();
export default apiService;
