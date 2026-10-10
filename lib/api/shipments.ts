import apiClient from './client';
import {
  ApiSuccessResponse,
  PaginatedResponse,
  Shipment,
  ShipmentStatusHistoryItem,
  Zone,
  Hub,
  
} from '@/types';
import { CreateShipmentFormValues } from '@/lib/validations/shipment.schema';

export interface ShipmentFilters {
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const createShipment = async (data: CreateShipmentFormValues): Promise<Shipment> => {
  const res = await apiClient.post<ApiSuccessResponse<Shipment>>('/shipments', data);
  return res.data.data;
};

export const getShipments = async (
  filters: ShipmentFilters
): Promise<PaginatedResponse<Shipment>> => {
  const params = new URLSearchParams();
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.status) params.set('status', filters.status);
  if (filters.sortBy) params.set('sortBy', filters.sortBy);
  if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

  const res = await apiClient.get<ApiSuccessResponse<PaginatedResponse<Shipment>>>(
    `/shipments?${params.toString()}`
  );
  return res.data.data;
};

export const getShipmentById = async (id: string): Promise<Shipment> => {
  const res = await apiClient.get<ApiSuccessResponse<Shipment>>(`/shipments/${id}`);
  return res.data.data;
};

export const getShipmentTracking = async (
  id: string
): Promise<ShipmentStatusHistoryItem[]> => {
  const res = await apiClient.get<ApiSuccessResponse<ShipmentStatusHistoryItem[]>>(
    `/shipments/${id}/tracking`
  );
  return res.data.data;
};

export const searchShipmentByCode = async (code: string): Promise<Shipment> => {
  const res = await apiClient.get<ApiSuccessResponse<Shipment>>(
    `/shipments/search?q=${encodeURIComponent(code)}`
  );
  return res.data.data;
};

export const cancelShipment = async (id: string): Promise<Shipment> => {
  const res = await apiClient.patch<ApiSuccessResponse<Shipment>>(`/shipments/${id}/cancel`);
  return res.data.data;
};

export const assignCourier = async (
  shipmentId: string,
  courierId: string
): Promise<Shipment> => {
  const res = await apiClient.post<ApiSuccessResponse<Shipment>>(
    `/shipments/${shipmentId}/assign-courier`,
    { courierId }
  );
  return res.data.data;
};

export const updateShipmentStatus = async (
  shipmentId: string,
  status: string,
  note?: string,
  otp?: string
): Promise<Shipment> => {
  const res = await apiClient.patch<ApiSuccessResponse<Shipment>>(
    `/shipments/${shipmentId}/status`,
    { status, note, otp }
  );
  return res.data.data;
};

export const getDeliveryCode = async (shipmentId: string): Promise<{ code: string }> => {
  const res = await apiClient.get<ApiSuccessResponse<{ code: string }>>(
    `/shipments/${shipmentId}/delivery-code`
  );
  return res.data.data;
};

export const getZones = async (): Promise<Zone[]> => {
  const res = await apiClient.get<ApiSuccessResponse<Zone[]>>('/zones');
  return res.data.data;
};

export const getHubs = async (): Promise<Hub[]> => {
  const res = await apiClient.get<ApiSuccessResponse<Hub[]>>('/hubs');
  return res.data.data;
};