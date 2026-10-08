import { ShipmentStatus } from '@/types';

export const DEMO_CREDENTIALS = {
  ADMIN: { email: 'admin@courier.com', password: 'Admin@12345' },
  CUSTOMER: { email: 'karim@example.com', password: 'Karim@12345' },
  COURIER: { email: 'courier@courier.com', password: 'Courier@12345' },
};

export const SHIPMENT_STATUS_OPTIONS: ShipmentStatus[] = [
  'CREATED',
  'PICKUP_SCHEDULED',
  'COURIER_ASSIGNED',
  'PICKED_UP',
  'IN_TRANSIT',
  'AT_DESTINATION_HUB',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'FAILED',
  'RETURN_TO_SENDER',
  'CANCELLED',
];
// Backend-এর state machine অনুযায়ী courier পরবর্তী কোন কোন status-এ যেতে পারে
export const COURIER_NEXT_STATUS: Partial<Record<ShipmentStatus, ShipmentStatus[]>> = {
  COURIER_ASSIGNED: ['PICKED_UP'],
  PICKED_UP: ['IN_TRANSIT', 'FAILED'],
  IN_TRANSIT: ['AT_DESTINATION_HUB', 'FAILED'],
  AT_DESTINATION_HUB: ['OUT_FOR_DELIVERY', 'FAILED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'FAILED'],
  FAILED: ['RETURN_TO_SENDER', 'OUT_FOR_DELIVERY'],
};

// Backend-এর commission rate-এর সাথে মেলাতে হবে
export const COURIER_COMMISSION_RATE = 0.7;