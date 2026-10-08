import type { Metadata } from 'next';
import EarningsView from '@/components/provider/EarningsView';

export const metadata: Metadata = { title: 'Earnings' };

export default function ProviderEarningsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Earnings & Analytics</h1>
        <p className="text-sm text-gray-500">
          You earn 70% of the price of every shipment you deliver.
        </p>
      </div>
      <EarningsView />
    </div>
  );
}