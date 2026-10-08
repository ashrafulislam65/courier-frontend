import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PackagePlus } from 'lucide-react';
import CustomerShipmentsView from '@/components/dashboard/CustomerShipmentsView';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = { title: 'My Shipments' };

export default function CustomerDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Shipments</h1>
          <p className="text-sm text-gray-500">Track and manage all your parcels.</p>
        </div>
        <Link href="/dashboard/shipments/new">
          <Button>
            <PackagePlus className="h-4 w-4 mr-2" /> New Shipment
          </Button>
        </Link>
      </div>

      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <CustomerShipmentsView />
      </Suspense>
    </div>
  );
}