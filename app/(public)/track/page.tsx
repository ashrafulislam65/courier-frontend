import { Suspense } from 'react';
import type { Metadata } from 'next';
import TrackView from '@/components/track/TrackView';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Track Shipment',
  description: 'Enter your tracking code to see the live route and history of your parcel.',
};

export default function TrackPage() {
  return (
    <Suspense fallback={<Skeleton className="mx-auto mt-16 h-64 w-full max-w-3xl" />}>
      <TrackView />
    </Suspense>
  );
}