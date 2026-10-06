import apiClient from './client';
import { ApiSuccessResponse, AuthResponse, User } from '@/types';
import { LoginFormValues, RegisterFormValues } from '@/lib/validations/auth.schema';

export const loginUser = async (data: LoginFormValues): Promise<AuthResponse> => {
  const res = await apiClient.post<ApiSuccessResponse<AuthResponse>>('/auth/login', data);
  return res.data.data;
};

export const registerUser = async (data: RegisterFormValues): Promise<AuthResponse> => {
  const res = await apiClient.post<ApiSuccessResponse<AuthResponse>>('/auth/register', data);
  return res.data.data;
};

export const getMe = async (): Promise<User> => {
  const res = await apiClient.get<ApiSuccessResponse<User>>('/users/me');
  return res.data.data;
};

export const updateMe = async (data: { name?: string; phone?: string }): Promise<User> => {
  const res = await apiClient.patch<ApiSuccessResponse<User>>('/users/me', data);
  return res.data.data;
};

export const logoutUser = async (refreshToken: string): Promise<void> => {
  await apiClient.post('/auth/logout', { refreshToken });
};