import { Suspense } from 'react';
import type { Metadata } from 'next';
import PaymentSuccessView from '@/components/payment/PaymentSuccessView';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = { title: 'Payment Successful' };

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full max-w-md mx-auto mt-24" />}>
      <PaymentSuccessView />
    </Suspense>
  );
}