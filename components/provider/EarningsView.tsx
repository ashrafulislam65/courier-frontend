'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { PackageCheck, TrendingUp, Wallet } from 'lucide-react';
import { getMyEarnings } from '@/lib/api/courier';
import { getShipments } from '@/lib/api/shipments';
import { COURIER_COMMISSION_RATE } from '@/lib/constants';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Shipment } from '@/types';
import DataTable, { Column } from '@/components/shared/DataTable';
import StatCard from '@/components/shared/StatCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const earningOf = (s: Shipment) => Math.round(Number(s.price) * COURIER_COMMISSION_RATE);

const columns: Column<Shipment>[] = [
  {
    header: 'Tracking Code',
    accessor: (s) => <span className="font-mono text-xs">{s.trackingCode}</span>,
  },
  { header: 'Delivered At', accessor: (s) => formatDateTime(s.updatedAt) },
  { header: 'Shipment Price', accessor: (s) => formatCurrency(s.price) },
  {
    header: 'Your Earning',
    accessor: (s) => <span className="font-semibold">{formatCurrency(earningOf(s))}</span>,
  },
];

export default function EarningsView() {
  const earningsQuery = useQuery({
    queryKey: ['courier', 'earnings'],
    queryFn: getMyEarnings,
  });
  const deliveredQuery = useQuery({
    queryKey: ['courier', 'delivered'],
    queryFn: () => getShipments({ status: 'DELIVERED', limit: 50 }),
  });

  const delivered = deliveredQuery.data?.items;

  const chartData = useMemo(() => {
    const byDay = new Map<string, number>();
    (delivered ?? []).forEach((s) => {
      const day = new Date(s.updatedAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
      });
      byDay.set(day, (byDay.get(day) ?? 0) + earningOf(s));
    });
    return Array.from(byDay, ([day, earnings]) => ({ day, earnings })).reverse();
  }, [delivered]);

  if (earningsQuery.isError || deliveredQuery.isError) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-red-500 mb-3">Failed to load earnings.</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            earningsQuery.refetch();
            deliveredQuery.refetch();
          }}
        >
          Retry
        </Button>
      </div>
    );
  }

  const total = Number(earningsQuery.data?.totalEarnings ?? 0);
  const count = earningsQuery.data?.deliveredCount ?? 0;
  const average = count > 0 ? Math.round(total / count) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total earnings"
          value={formatCurrency(total)}
          icon={Wallet}
          iconColor="text-green-600"
        />
        <StatCard title="Deliveries completed" value={count} icon={PackageCheck} />
        <StatCard
          title="Average per delivery"
          value={formatCurrency(average)}
          icon={TrendingUp}
          iconColor="text-purple-600"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Earnings by day</CardTitle>
        </CardHeader>
        <CardContent>
          {deliveredQuery.isLoading ? (
            <Skeleton className="h-72 w-full" />
          ) : chartData.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-16">
              Complete a delivery to see your earnings chart.
            </p>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="earnings" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Recent deliveries</h2>
        <DataTable
          columns={columns}
          data={delivered ?? []}
          isLoading={deliveredQuery.isLoading}
          keyExtractor={(s) => s.id}
          emptyMessage="No completed deliveries yet."
        />
      </div>
    </div>
  );
}