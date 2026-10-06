import apiClient from './client';
import { ApiSuccessResponse, AuditLog, DashboardStats, PaginatedResponse, User } from '@/types';

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const res = await apiClient.get<ApiSuccessResponse<DashboardStats>>(
    '/admin/dashboard-stats'
  );
  return res.data.data;
};

export const getUsers = async (
  role?: string,
  page = 1,
  limit = 10
): Promise<PaginatedResponse<User>> => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (role) params.set('role', role);
  const res = await apiClient.get<ApiSuccessResponse<PaginatedResponse<User>>>(
    `/admin/users?${params.toString()}`
  );
  return res.data.data;
};

export const updateUserRole = async (userId: string, role: string): Promise<User> => {
  const res = await apiClient.patch<ApiSuccessResponse<User>>(
    `/admin/users/${userId}/role`,
    { role }
  );
  return res.data.data;
};

export const toggleBlockUser = async (userId: string, isBlocked: boolean): Promise<User> => {
  const res = await apiClient.patch<ApiSuccessResponse<User>>(
    `/admin/users/${userId}/block`,
    { isBlocked }
  );
  return res.data.data;
};

export const getAuditLogs = async (
  page = 1,
  limit = 20
): Promise<PaginatedResponse<AuditLog>> => {
  const res = await apiClient.get<ApiSuccessResponse<PaginatedResponse<AuditLog>>>(
    `/admin/audit-logs?page=${page}&limit=${limit}`
  );
  return res.data.data;
};