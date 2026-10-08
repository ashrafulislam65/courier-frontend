'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft, CreditCard, Loader2, XCircle } from 'lucide-react';
import {
  cancelShipment,
  getHubs,
  getShipmentById,
  getShipmentTracking,
} from '@/lib/api/shipments';
import { initiatePayment } from '@/lib/api/payments';
import { formatCurrency, formatDateTime, getErrorMessage } from '@/lib/utils';
import StatusBadge from '@/components/shared/StatusBadge';
import PaymentBadge from '@/components/shared/PaymentBadge';
import TrackingTimeline from '@/components/shared/TrackingTimeline';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-2 text-sm border-b last:border-0">
      <span className="text-gray-500">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

export default function ShipmentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [cancelOpen, setCancelOpen] = useState(false);

  const shipmentQuery = useQuery({
    queryKey: ['shipment', id],
    queryFn: () => getShipmentById(id),
  });
  const trackingQuery = useQuery({
    queryKey: ['tracking', id],
    queryFn: () => getShipmentTracking(id),
  });
  const { data: hubs = [] } = useQuery({ queryKey: ['hubs'], queryFn: getHubs });

  const payMutation = useMutation({
    mutationFn: () => initiatePayment(id),
    onSuccess: ({ checkoutUrl }) => {
      window.location.href = checkoutUrl;
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Could not start payment')),
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelShipment(id),
    onSuccess: () => {
      toast.success('Shipment cancelled');
      setCancelOpen(false);
      queryClient.invalidateQueries({ queryKey: ['shipment', id] });
      queryClient.invalidateQueries({ queryKey: ['tracking', id] });
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Could not cancel shipment')),
  });

  if (shipmentQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (shipmentQuery.isError || !shipmentQuery.data) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 mb-3">Shipment not found or failed to load.</p>
        <Link href="/dashboard">
          <Button variant="outline">Back to shipments</Button>
        </Link>
      </div>
    );
  }

  const shipment = shipmentQuery.data;
  const hubName = (hubId: string) => hubs.find((h) => h.id === hubId)?.name ?? '—';
  const isPaid = shipment.payment?.status === 'SUCCESS';
  const canPay = !isPaid && shipment.status !== 'CANCELLED';
  const canCancel = ['CREATED', 'PICKUP_SCHEDULED'].includes(shipment.status) && !isPaid;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-blue-600 inline-flex items-center gap-1 mb-3"
        >
          <ArrowLeft className="h-4 w-4" /> Back to shipments
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-gray-400">Tracking Code</p>
            <h1 className="text-2xl font-bold font-mono">{shipment.trackingCode}</h1>
          </div>
          <StatusBadge status={shipment.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Shipment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <DetailRow
                label="Route"
                value={`${hubName(shipment.originHubId)} → ${hubName(shipment.destinationHubId)}`}
              />
              <DetailRow label="Recipient" value={shipment.recipientName} />
              <DetailRow label="Phone" value={shipment.recipientPhone} />
              <DetailRow label="Address" value={shipment.recipientAddress} />
              <DetailRow label="Weight" value={`${shipment.weightKg} kg`} />
              <DetailRow
                label="Courier"
                value={shipment.courier?.name ?? 'Not assigned yet'}
              />
              <DetailRow label="Created" value={formatDateTime(shipment.createdAt)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tracking Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {trackingQuery.isLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : (
                <TrackingTimeline history={trackingQuery.data ?? []} />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{formatCurrency(shipment.price)}</span>
                <PaymentBadge status={shipment.payment?.status} />
              </div>

              {canPay && (
                <>
                  <Button
                    className="w-full"
                    onClick={() => payMutation.mutate()}
                    disabled={payMutation.isPending}
                  >
                    {payMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CreditCard className="h-4 w-4 mr-2" />
                    )}
                    Pay Now
                  </Button>
                  <p className="text-xs text-gray-400">
                    Stripe test mode: use card 4242 4242 4242 4242, any future date, any CVC.
                  </p>
                </>
              )}

              {isPaid && shipment.payment?.transactionId && (
                <p className="text-xs text-gray-400 break-all">
                  Transaction: {shipment.payment.transactionId}
                </p>
              )}
            </CardContent>
          </Card>

          {canCancel && (
            <Button
              variant="outline"
              className="w-full text-red-600 hover:text-red-700"
              onClick={() => setCancelOpen(true)}
            >
              <XCircle className="h-4 w-4 mr-2" /> Cancel Shipment
            </Button>
          )}
        </div>
      </div>

      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel this shipment?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The shipment will be marked as cancelled.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelOpen(false)}>
              Keep Shipment
            </Button>
            <Button
              variant="destructive"
              onClick={() => cancelMutation.mutate()}
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Yes, Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}