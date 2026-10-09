import { Suspense } from 'react';
import type { Metadata } from 'next';
import AdminShipmentsView from '@/components/admin/AdminShipmentsView';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = { title: 'Manage Shipments' };

export default function AdminManagePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Shipment Management</h1>
        <p className="text-sm text-gray-500">
          Review every shipment and assign couriers to new pickups.
        </p>
      </div>
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <AdminShipmentsView />
      </Suspense>
    </div>
  );
}