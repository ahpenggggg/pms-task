export interface User {
  userId: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export interface LoginResponse {
  userId: number;
  username: string;
  token: string;
  message: string;
}

export interface RegisterResponse {
  message: string;
  token: string;
  account: {
    userId: number;
    username: string;
    email: string;
  };
}

export interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  userId: number;
  date?: string;
}

export interface CreatePostData {
  title: string;
  body: string;
  tags: string[];
}

export interface PostsResponse {
  data: Post[];
  page: number;
  limit: number;
  totalPages: number;
  totalPosts: number;
}

export interface DecodedToken {
  username: string;
  email: string;
  userId: number;
  role: 'admin' | 'user';
  iat: number;
  exp: number;
}

export interface AccountsResponse {
  data?: User[];
  accounts?: User[];
  total?: number;
  totalAccounts?: number;
}