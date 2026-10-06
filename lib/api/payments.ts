import apiClient from './client';
import { ApiSuccessResponse, Payment } from '@/types';

export const initiatePayment = async (
  shipmentId: string
): Promise<{ checkoutUrl: string; payment: Payment }> => {
  const res = await apiClient.post<
    ApiSuccessResponse<{ checkoutUrl: string; payment: Payment }>
  >('/payments/initiate', { shipmentId });
  return res.data.data;
};

export const getPaymentStatus = async (shipmentId: string): Promise<Payment> => {
  const res = await apiClient.get<ApiSuccessResponse<Payment>>(`/payments/${shipmentId}`);
  return res.data.data;
};