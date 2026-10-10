'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Loader2, PackageSearch, Search } from 'lucide-react';
import { toast } from 'sonner';
import { getPublicTracking } from '@/lib/api/tracking';
import { getErrorMessage } from '@/lib/utils';
import RouteMap from '@/components/maps/RouteMap';
import StatusBadge from '@/components/shared/StatusBadge';
import TrackingTimeline from '@/components/shared/TrackingTimeline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export default function TrackView() {
  const initialCode = useSearchParams().get('code') ?? '';
  const [code, setCode] = useState(initialCode);
  const autoSearched = useRef(false);

  const { mutate, data, isPending } = useMutation({
    mutationFn: getPublicTracking,
    onError: (error) =>
      toast.error(getErrorMessage(error, 'No shipment found with that tracking code')),
  });

  // হোম পেজ থেকে ?code=... নিয়ে এলে নিজে নিজেই খোঁজে
  useEffect(() => {
    if (initialCode && !autoSearched.current) {
      autoSearched.current = true;
      mutate(initialCode.trim());
    }
  }, [initialCode, mutate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) mutate(code.trim());
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <PackageSearch className="mx-auto mb-4 h-12 w-12 text-blue-600" />
        <h1 className="mb-2 text-3xl font-bold">Track Your Shipment</h1>
        <p className="text-gray-500">Enter your tracking code to see where your parcel is.</p>
      </div>

      <form onSubmit={handleSearch} className="mb-10 flex gap-3">
        <Input
          placeholder="e.g. CR-015490-EW8VZW"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          aria-label="Tracking code"
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          <span className="ml-2 hidden sm:inline">Track</span>
        </Button>
      </form>

      {data && (
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Tracking Code</p>
                <p className="font-mono font-semibold">{data.trackingCode}</p>
              </div>
              <StatusBadge status={data.status} />
            </div>

                        <RouteMap
              status={data.status}
              origin={data.originHub ?? { name: 'Origin hub' }}
              destination={data.destinationHub ?? { name: 'Destination hub' }}
            />

            <div>
              <h2 className="mb-4 font-semibold">Tracking history</h2>
              <TrackingTimeline history={data.statusHistory} showActor={false} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}