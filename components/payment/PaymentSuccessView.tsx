'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Clock, Loader2, XCircle } from 'lucide-react';
import { getPaymentStatus } from '@/lib/api/payments';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const MAX_POLLS = 8;

export default function PaymentSuccessView() {
  const shipmentId = useSearchParams().get('shipmentId');
  const queryClient = useQueryClient();

  const { data, isError } = useQuery({
    queryKey: ['payment', shipmentId],
    queryFn: () => getPaymentStatus(shipmentId as string),
    enabled: !!shipmentId,
    // Webhook আসতে দেরি হতে পারে, তাই SUCCESS না আসা পর্যন্ত কয়েকবার আবার চেক করি
    refetchInterval: (query) =>
      query.state.data?.status === 'SUCCESS' || query.state.dataUpdateCount >= MAX_POLLS
        ? false
        : 2500,
  });

  const status = data?.status;

  useEffect(() => {
    if (status === 'SUCCESS') {
      queryClient.invalidateQueries({ queryKey: ['shipment', shipmentId] });
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
    }
  }, [status, shipmentId, queryClient]);

  let icon = <Loader2 className="h-14 w-14 text-blue-600 animate-spin" />;
  let title = 'Confirming your payment…';
  let description = 'This usually takes just a few seconds. Please do not close this page.';

  if (!shipmentId) {
    icon = <XCircle className="h-14 w-14 text-red-500" />;
    title = 'Missing payment reference';
    description = 'We could not find which shipment this payment belongs to.';
  } else if (isError) {
    icon = <XCircle className="h-14 w-14 text-red-500" />;
    title = 'Could not verify payment';
    description = 'Please check your payment history for the latest status.';
  } else if (status === 'SUCCESS') {
    icon = <CheckCircle2 className="h-14 w-14 text-green-600" />;
    title = 'Payment successful';
    description = `We received ${formatCurrency(data?.amount ?? 0)}. Your shipment is confirmed.`;
  } else if (status === 'FAILED') {
    icon = <XCircle className="h-14 w-14 text-red-500" />;
    title = 'Payment failed';
    description = 'Your payment could not be completed. You can try again from the shipment page.';
  } else if (status === 'PENDING' && (data ? true : false) && !isPolling(queryClient, shipmentId)) {
    icon = <Clock className="h-14 w-14 text-amber-500" />;
    title = 'Payment is still processing';
    description = 'Your bank is taking a little longer. Check your payment history in a moment.';
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-8 pb-8 space-y-4">
          <div className="flex justify-center">{icon}</div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-gray-500">{description}</p>

          {data?.transactionId && status === 'SUCCESS' && (
            <p className="text-xs text-gray-400 break-all">Transaction: {data.transactionId}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            {shipmentId && (
              <Link href={`/dashboard/shipments/${shipmentId}`}>
                <Button>View Shipment</Button>
              </Link>
            )}
            <Link href="/dashboard/payments">
              <Button variant="outline">Payment History</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function isPolling(
  queryClient: ReturnType<typeof useQueryClient>,
  shipmentId: string | null
): boolean {
  const state = queryClient.getQueryState(['payment', shipmentId]);
  return (state?.dataUpdateCount ?? 0) < MAX_POLLS;
}