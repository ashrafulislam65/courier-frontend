import apiClient from './client';
import { ApiSuccessResponse, ShipmentStatus } from '@/types';

export interface PublicTracking {
    trackingCode: string;
    status: ShipmentStatus;
    createdAt: string;
    updatedAt: string;
    originHub: { name: string; address: string };
    destinationHub: { name: string; address: string };
    statusHistory: {
        id: string;
        status: ShipmentStatus;
        note?: string | null;
        createdAt: string;
    }[];
}

export const getPublicTracking = async (code: string): Promise<PublicTracking> => {
    const res = await apiClient.get<ApiSuccessResponse<PublicTracking>>(
        `/track/${encodeURIComponent(code)}`
    );
    return res.data.data;
};