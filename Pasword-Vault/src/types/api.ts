export interface User {
  id: string;
  username: string;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Account {
  id: string;
  accountId: string;
  username: string;
  password: string;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountRequest {
  username: string;
  password: string;
  comment?: string;
  masterPassword: string;
}

export interface UpdateAccountRequest {
  username?: string;
  password?: string;
  comment?: string;
  masterPassword?: string;
}

export interface AccountListResponse {
  message: string;
  accounts: Account[];
  total: number;
}

export interface AccountResponse {
  message: string;
  account: Account;
}

export interface LoginRequest {
  username: string;
  masterPassword: string;
}

export interface RegisterRequest {
  username: string;
  masterPassword: string;
}

export interface ApiError {
  error: string;
}
