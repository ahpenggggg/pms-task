import axiosInstance from './axios';
import { Post, CreatePostData, PostsResponse } from '../types';

export const getAllPosts = async (page: number, limit: number): Promise<PostsResponse> => {
  const response = await axiosInstance.get<PostsResponse>('/api/posts', {
    params: { page, limit }
  });
  return response.data;
};

export const getMyPosts = async (page: number, limit: number): Promise<PostsResponse> => {
  const response = await axiosInstance.post<PostsResponse>('/api/posts/mypost', {
    page,
    limit
  });
  return response.data;
};

export const createPost = async (data: CreatePostData): Promise<Post> => {
  const response = await axiosInstance.post<Post>('/api/posts/create', data);
  return response.data;
};

export const editPost = async (postId: number, data: CreatePostData): Promise<Post> => {
  const response = await axiosInstance.put<Post>(`/api/posts/edit/${postId}`, data);
  return response.data;
};

export const deletePost = async (postId: number): Promise<void> => {
  await axiosInstance.delete(`/api/posts/delete/${postId}`);
};

export const viewPost = async (postId: number): Promise<Post> => {
  const response = await axiosInstance.get<Post>(`/api/posts/view/${postId}`);
  return response.data;
};