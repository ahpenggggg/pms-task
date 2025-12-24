import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../types';

export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
};

export const decodeToken = (): DecodedToken | null => {
  const token = getToken();
  if (!token) return null;
  
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;
  
  const decoded = decodeToken();
  if (!decoded) return false;
  
  return decoded.exp * 1000 > Date.now();
};

export const getUserRole = (): 'admin' | 'user' | null => {
  const decoded = decodeToken();
  return decoded?.role || null;
};