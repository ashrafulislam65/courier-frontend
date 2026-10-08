import type { Metadata } from 'next';
import MyDeliveriesView from '@/components/provider/MyDeliveriesView';

export const metadata: Metadata = { title: 'My Deliveries' };

export default function ProviderDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Deliveries</h1>
        <p className="text-sm text-gray-500">
          Shipments assigned to you. Update the status as you move each parcel.
        </p>
      </div>
      <MyDeliveriesView />
    </div>
  );
}