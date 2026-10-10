import { z } from 'zod';

export const createShipmentSchema = z.object({
  originHubId: z.string().min(1, 'Please select an origin hub'),
  destinationHubId: z.string().min(1, 'Please select a destination hub'),
  recipientName: z.string().min(2, 'Recipient name must be at least 2 characters'),
  recipientPhone: z.string().min(6, 'Please enter a valid phone number'),
  recipientAddress: z.string().min(5, 'Address must be at least 5 characters'),
  weightKg: z.number().positive('Weight must be greater than 0'),
});

export type CreateShipmentFormValues = z.infer<typeof createShipmentSchema>;

export const updateStatusSchema = z.object({
  status: z.enum([
    'PICKUP_SCHEDULED',
    'PICKED_UP',
    'IN_TRANSIT',
    'AT_DESTINATION_HUB',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'FAILED',
    'RETURN_TO_SENDER',
  ]),
  note: z.string().optional(),
  otp: z.string().optional(),
});

export type UpdateStatusFormValues = z.infer<typeof updateStatusSchema>;