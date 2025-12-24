import axiosInstance from './axios';
import { LoginCredentials, LoginResponse, RegisterData, RegisterResponse } from '../types';

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>('/api/account/login', credentials);
  return response.data;
};

export const register = async (data: RegisterData): Promise<RegisterResponse> => {
  const response = await axiosInstance.post<RegisterResponse>('/api/account/register', data);
  return response.data;
};

export const getAllAccounts = async () => {
  const response = await axiosInstance.get('/api/accounts');
  return response.data;
};