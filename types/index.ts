export type Role = 'CUSTOMER' | 'COURIER' | 'ADMIN';

export type ShipmentStatus =
  | 'CREATED'
  | 'PICKUP_SCHEDULED'
  | 'COURIER_ASSIGNED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'AT_DESTINATION_HUB'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED'
  | 'RETURN_TO_SENDER'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  isBlocked?: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface Hub {
  id: string;
  name: string;
  address: string;
  zoneId: string;
  createdAt?: string;
}

export interface Zone {
  id: string;
  name: string;
  region: string;
  hubs?: Hub[];
}

export interface Shipment {
  id: string;
  trackingCode: string;
  customerId: string;
  courierId: string | null;
  originHubId: string;
  destinationHubId: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  weightKg: string;
  price: string;
  status: ShipmentStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  customer?: { id: string; name: string; email: string };
  courier?: { id: string; name: string; phone?: string } | null;
  payment?: Payment | null;
}

export interface ShipmentStatusHistoryItem {
  id: string;
  shipmentId: string;
  status: ShipmentStatus;
  changedById: string;
  note?: string;
  createdAt: string;
  changedBy: { name: string; role: Role };
}

export interface Payment {
  id: string;
  shipmentId: string;
  amount: string;
  provider: string;
  status: PaymentStatus;
  sessionId?: string | null;
  transactionId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CourierProfile {
  id: string;
  userId: string;
  vehicleType: string;
  zoneId: string;
  isAvailable: boolean;
  totalEarnings: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors: { field?: string; message: string }[];
}

export interface DashboardStats {
  totalShipments: number;
  deliveredShipments: number;
  activeShipments: number;
  totalUsers: number;
  totalCouriers: number;
  totalRevenue: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  actor: { name: string; role: Role };
}