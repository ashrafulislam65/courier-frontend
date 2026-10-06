import apiClient from './client';
import { ApiSuccessResponse, CourierProfile, Shipment } from '@/types';

export const setAvailability = async (isAvailable: boolean): Promise<CourierProfile> => {
  const res = await apiClient.patch<ApiSuccessResponse<CourierProfile>>(
    '/courier/availability',
    { isAvailable }
  );
  return res.data.data;
};

export const getMyAssignedShipments = async (): Promise<Shipment[]> => {
  const res = await apiClient.get<ApiSuccessResponse<Shipment[]>>('/courier/my-assigned');
  return res.data.data;
};

export const getMyEarnings = async (): Promise<{
  totalEarnings: string;
  deliveredCount: number;
}> => {
  const res = await apiClient.get<ApiSuccessResponse<{ totalEarnings: string; deliveredCount: number }>>(
    '/courier/earnings'
  );
  return res.data.data;
};