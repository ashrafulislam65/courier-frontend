'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigation, PackageCheck, Truck } from 'lucide-react';
import { getHubs } from '@/lib/api/shipments';
import { getMyAssignedShipments } from '@/lib/api/courier';
import { COURIER_NEXT_STATUS } from '@/lib/constants';
import { Shipment } from '@/types';
import DataTable, { Column } from '@/components/shared/DataTable';
import StatCard from '@/components/shared/StatCard';
import StatusBadge from '@/components/shared/StatusBadge';
import UpdateStatusDialog from '@/components/provider/UpdateStatusDialog';
import { Button } from '@/components/ui/button';

export default function MyDeliveriesView() {
  const [selected, setSelected] = useState<Shipment | null>(null);

  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['courier', 'assigned'],
    queryFn: getMyAssignedShipments,
  });
  const { data: hubs = [] } = useQuery({ queryKey: ['hubs'], queryFn: getHubs });

  const hubName = (id: string) => hubs.find((h) => h.id === id)?.name ?? '—';
  const awaitingPickup = data.filter((s) => s.status === 'COURIER_ASSIGNED').length;
  const outForDelivery = data.filter((s) => s.status === 'OUT_FOR_DELIVERY').length;

  const columns: Column<Shipment>[] = [
    {
      header: 'Tracking Code',
      accessor: (s) => <span className="font-mono text-xs">{s.trackingCode}</span>,
    },
    {
      header: 'Route',
      accessor: (s) => `${hubName(s.originHubId)} → ${hubName(s.destinationHubId)}`,
    },
    {
      header: 'Recipient',
      accessor: (s) => (
        <div>
          <p className="font-medium">{s.recipientName}</p>
          <p className="text-xs text-gray-400">{s.recipientPhone}</p>
        </div>
      ),
    },
    {
      header: 'Address',
      accessor: (s) => <span className="text-sm text-gray-600">{s.recipientAddress}</span>,
      className: 'min-w-48',
    },
    { header: 'Status', accessor: (s) => <StatusBadge status={s.status} /> },
    {
      header: 'Action',
      accessor: (s) => (
        <Button
          size="sm"
          disabled={(COURIER_NEXT_STATUS[s.status] ?? []).length === 0}
          onClick={() => setSelected(s)}
        >
          Update
        </Button>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-red-500 mb-3">Failed to load your deliveries.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Active deliveries" value={data.length} icon={Truck} />
        <StatCard
          title="Awaiting pickup"
          value={awaitingPickup}
          icon={PackageCheck}
          iconColor="text-indigo-600"
        />
        <StatCard
          title="Out for delivery"
          value={outForDelivery}
          icon={Navigation}
          iconColor="text-orange-600"
        />
      </div>

      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        keyExtractor={(s) => s.id}
        emptyMessage="No active deliveries. New assignments from the admin will appear here."
      />

      <UpdateStatusDialog shipment={selected} onClose={() => setSelected(null)} />
    </div>
  );
}