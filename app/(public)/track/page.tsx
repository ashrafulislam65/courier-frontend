'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Loader2, PackageSearch, Search } from 'lucide-react';
import { toast } from 'sonner';
import { getPublicTracking } from '@/lib/api/tracking';
import { getErrorMessage } from '@/lib/utils';
import StatusBadge from '@/components/shared/StatusBadge';
import TrackingTimeline from '@/components/shared/TrackingTimeline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export default function TrackPage() {
  const [code, setCode] = useState('');

  const mutation = useMutation({
    mutationFn: getPublicTracking,
    onError: (error) =>
      toast.error(getErrorMessage(error, 'No shipment found with that tracking code')),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    mutation.mutate(code.trim());
  };

  const result = mutation.data;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <PackageSearch className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Track Your Shipment</h1>
        <p className="text-gray-500">Enter your tracking code to see live status.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 mb-10">
        <Input
          placeholder="e.g. CR-015490-EW8VZW"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          <span className="ml-2 hidden sm:inline">Track</span>
        </Button>
      </form>

      {result && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-400">Tracking Code</p>
                <p className="font-mono font-semibold">{result.trackingCode}</p>
              </div>
              <StatusBadge status={result.status} />
            </div>
            <TrackingTimeline history={result.statusHistory} showActor={false} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}