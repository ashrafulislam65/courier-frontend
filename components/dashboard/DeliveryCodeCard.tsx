'use client';

import { useQuery } from '@tanstack/react-query';
import { KeyRound } from 'lucide-react';
import { getDeliveryCode } from '@/lib/api/shipments';
import type { ShipmentStatus } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DeliveryCodeCard({
  shipmentId,
  status,
}: {
  shipmentId: string;
  status: ShipmentStatus;
}) {
  const active = status === 'OUT_FOR_DELIVERY';
  const { data, isLoading } = useQuery({
    queryKey: ['delivery-code', shipmentId],
    queryFn: () => getDeliveryCode(shipmentId),
    enabled: active,
  });

  if (!active) return null;

  return (
    <Card className="border-brand-200 bg-brand-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <KeyRound className="h-5 w-5 text-brand-600" /> Your delivery code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading || !data ? (
          <Skeleton className="h-14 w-full" />
        ) : (
          <div className="flex justify-center gap-2" aria-label={`Delivery code ${data.code}`}>
            {data.code.split('').map((digit, i) => (
              <span
                key={i}
                className="grid h-14 w-12 place-items-center rounded-lg bg-white text-3xl font-bold text-brand-700 shadow-sm ring-1 ring-brand-200"
              >
                {digit}
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-neutral-600">
          Give this code to the courier <strong>only when you are holding your parcel</strong>. The
          delivery is not complete without it. Never share it earlier or over the phone.
        </p>
      </CardContent>
    </Card>
  );
}