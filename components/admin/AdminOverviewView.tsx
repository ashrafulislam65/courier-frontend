'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Activity, Banknote, CheckCircle2, Package, Truck, Users } from 'lucide-react';
import { getDashboardStats } from '@/lib/api/admin';
import { getShipments } from '@/lib/api/shipments';
import { formatCurrency } from '@/lib/utils';
import StatCard from '@/components/shared/StatCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const COLORS = [
  '#2563eb',
  '#7c3aed',
  '#f59e0b',
  '#10b981',
  '#ef4444',
  '#06b6d4',
  '#f97316',
  '#64748b',
  '#ec4899',
  '#84cc16',
  '#a855f7',
];

export default function AdminOverviewView() {
  const statsQuery = useQuery({ queryKey: ['admin', 'stats'], queryFn: getDashboardStats });
  const shipmentsQuery = useQuery({
    queryKey: ['shipments', 'admin', 'overview'],
    queryFn: () => getShipments({ limit: 100 }),
  });

  const items = shipmentsQuery.data?.items;

  const statusData = useMemo(() => {
    const counts = new Map<string, number>();
    (items ?? []).forEach((s) => counts.set(s.status, (counts.get(s.status) ?? 0) + 1));
    return Array.from(counts, ([status, value]) => ({
      name: status.replace(/_/g, ' '),
      value,
    }));
  }, [items]);

  const revenueData = useMemo(() => {
    const byDay = new Map<string, number>();
    (items ?? [])
      .filter((s) => s.payment?.status === 'SUCCESS')
      .forEach((s) => {
        const day = new Date(s.createdAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
        });
        byDay.set(day, (byDay.get(day) ?? 0) + Number(s.price));
      });
    return Array.from(byDay, ([day, revenue]) => ({ day, revenue })).reverse();
  }, [items]);

  if (statsQuery.isError) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-red-500 mb-3">Failed to load dashboard statistics.</p>
        <Button variant="outline" size="sm" onClick={() => statsQuery.refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const stats = statsQuery.data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {!stats ? (
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
        ) : (
          <>
            <StatCard title="Total shipments" value={stats.totalShipments} icon={Package} />
            <StatCard
              title="Active shipments"
              value={stats.activeShipments}
              icon={Activity}
              iconColor="text-amber-600"
            />
            <StatCard
              title="Delivered"
              value={stats.deliveredShipments}
              icon={CheckCircle2}
              iconColor="text-green-600"
            />
            <StatCard
              title="Total revenue"
              value={formatCurrency(stats.totalRevenue)}
              icon={Banknote}
              iconColor="text-emerald-600"
            />
            <StatCard
              title="Customers"
              value={stats.totalUsers}
              icon={Users}
              iconColor="text-purple-600"
            />
            <StatCard
              title="Couriers"
              value={stats.totalCouriers}
              icon={Truck}
              iconColor="text-indigo-600"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Shipments by status</CardTitle>
          </CardHeader>
          <CardContent>
            {shipmentsQuery.isLoading ? (
              <Skeleton className="h-72 w-full" />
            ) : statusData.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-16">No shipments yet.</p>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={95}
                      paddingAngle={2}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue by day (paid shipments)</CardTitle>
          </CardHeader>
          <CardContent>
            {shipmentsQuery.isLoading ? (
              <Skeleton className="h-72 w-full" />
            ) : revenueData.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-16">
                Revenue appears here once customers pay for shipments.
              </p>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}