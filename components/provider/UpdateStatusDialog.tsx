'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { updateShipmentStatus } from '@/lib/api/shipments';
import {
  updateStatusSchema,
  type UpdateStatusFormValues,
} from '@/lib/validations/shipment.schema';
import { COURIER_NEXT_STATUS } from '@/lib/constants';
import { getErrorMessage } from '@/lib/utils';
import { Shipment } from '@/types';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function StatusForm({ shipment, onDone }: { shipment: Shipment; onDone: () => void }) {
  const queryClient = useQueryClient();
  const options = (COURIER_NEXT_STATUS[shipment.status] ??
    []) as UpdateStatusFormValues['status'][];

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateStatusFormValues>({
    resolver: zodResolver(updateStatusSchema),
    defaultValues: { status: options[0], note: '' },
  });

  const mutation = useMutation({
    mutationFn: (values: UpdateStatusFormValues) =>
      updateShipmentStatus(shipment.id, values.status, values.note || undefined),
    onSuccess: () => {
      toast.success('Shipment status updated');
      queryClient.invalidateQueries({ queryKey: ['courier'] });
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      queryClient.invalidateQueries({ queryKey: ['shipment', shipment.id] });
      queryClient.invalidateQueries({ queryKey: ['tracking', shipment.id] });
      onDone();
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Could not update status')),
  });

  return (
    <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Current status</span>
        <StatusBadge status={shipment.status} />
      </div>

      <div>
        <Label>Move to</Label>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select value={field.value} onValueChange={(value) => value && field.onChange(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select next status" />
              </SelectTrigger>
              <SelectContent>
                {options.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.status && <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>}
      </div>

      <div>
        <Label htmlFor="note">Note (optional)</Label>
        <Textarea id="note" placeholder="e.g. Recipient not at home" {...register('note')} />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onDone} disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending || options.length === 0}>
          {mutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Update Status
        </Button>
      </div>
    </form>
  );
}

export default function UpdateStatusDialog({
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
              <DialogTitle>Update Shipment Status</DialogTitle>
              <DialogDescription className="font-mono">{shipment.trackingCode}</DialogDescription>
            </DialogHeader>
            <StatusForm key={shipment.id} shipment={shipment} onDone={onClose} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}