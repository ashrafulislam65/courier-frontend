import { Suspense } from 'react';
import type { Metadata } from 'next';
import PaymentHistoryView from '@/components/dashboard/PaymentHistoryView';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = { title: 'Payments' };

export default function CustomerPaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payments & Billing</h1>
        <p className="text-sm text-gray-500">Payment status for all your shipments.</p>
      </div>
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <PaymentHistoryView />
      </Suspense>
    </div>
  );
}