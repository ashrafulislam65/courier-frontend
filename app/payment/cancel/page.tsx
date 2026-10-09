import Link from 'next/link';
import type { Metadata } from 'next';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = { title: 'Payment Cancelled' };

export default async function PaymentCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ shipmentId?: string }>;
}) {
  const { shipmentId } = await searchParams;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-8 pb-8 space-y-4">
          <div className="flex justify-center">
            <XCircle className="h-14 w-14 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold">Payment cancelled</h1>
          <p className="text-sm text-gray-500">
            No money was charged. Your shipment is saved and you can pay whenever you are ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            {shipmentId && (
              <Link href={`/dashboard/shipments/${shipmentId}`}>
                <Button>Try Again</Button>
              </Link>
            )}
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}