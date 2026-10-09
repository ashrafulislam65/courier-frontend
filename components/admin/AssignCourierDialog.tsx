'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { getUsers } from '@/lib/api/admin';
import { assignCourier } from '@/lib/api/shipments';
import { cn, getErrorMessage } from '@/lib/utils';
import { Shipment } from '@/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

function AssignForm({ shipment, onDone }: { shipment: Shipment; onDone: () => void }) {
  const queryClient = useQueryClient();
  const [courierId, setCourierId] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'couriers'],
    queryFn: () => getUsers('COURIER', 1, 50),
  });
  const couriers = (data?.items ?? []).filter((u) => !u.isBlocked);

  const mutation = useMutation({
    mutationFn: () => assignCourier(shipment.id, courierId),
    onSuccess: () => {
      toast.success('Courier assigned');
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      queryClient.invalidateQueries({ queryKey: ['admin'] });
      queryClient.invalidateQueries({ queryKey: ['courier'] });
      onDone();
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Could not assign courier')),
  });

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      ) : couriers.length === 0 ? (
        <p className="text-sm text-gray-500 py-6 text-center">
          No couriers found. Register a courier account first.
        </p>
      ) : (
        <ul className="max-h-64 space-y-2 overflow-y-auto">
          {couriers.map((courier) => (
            <li key={courier.id}>
              <button
                type="button"
                onClick={() => setCourierId(courier.id)}
                className={cn(
                  'w-full rounded-md border p-3 text-left text-sm transition-colors',
                  courierId === courier.id ? 'border-blue-600 bg-blue-50' : 'hover:bg-gray-50'
                )}
              >
                <p className="font-medium">{courier.name}</p>
                <p className="text-xs text-gray-500">{courier.email}</p>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onDone} disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button onClick={() => mutation.mutate()} disabled={!courierId || mutation.isPending}>
          {mutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Assign Courier
        </Button>
      </div>
    </div>
  );
}

export default function AssignCourierDialog({
  shipment,
  onClose,
}: {
  shipment: Shipment | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!shipment} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        {shipment && (
          <>
            <DialogHeader>
              <DialogTitle>Assign a Courier</DialogTitle>
              <DialogDescription className="font-mono">{shipment.trackingCode}</DialogDescription>
            </DialogHeader>
            <AssignForm key={shipment.id} shipment={shipment} onDone={onClose} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}