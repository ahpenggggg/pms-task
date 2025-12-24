import axios from 'axios';
import { API_BASE_URL } from './constant';

export const testLogin = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/account/login`, {
      email: 'admin@yahoo.com',
      password: 'admin123'
    });
    console.log('Login Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Login Error:', error.response?.data || error.message);
    throw error;
  }
};

export const testGetMyPosts = async (token: string, page: number, limit: number) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/posts/mypost`,
      { page, limit },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log('My Posts Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('My Posts Error:', error.response?.data || error.message);
    throw error;
  }
};

export const testGetAllPosts = async (token: string, page: number, limit: number) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/posts`,
      {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log('All Posts Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('All Posts Error:', error.response?.data || error.message);
    throw error;
  }
};