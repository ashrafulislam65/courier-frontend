'use client';

import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { UserPlus } from 'lucide-react';
import { getShipments } from '@/lib/api/shipments';
import { useUrlParams } from '@/hooks/useUrlParams';
import { SHIPMENT_STATUS_OPTIONS } from '@/lib/constants';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Shipment } from '@/types';
import DataTable, { Column } from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import PaymentBadge from '@/components/shared/PaymentBadge';
import PaginationControls from '@/components/shared/PaginationControls';
import AssignCourierDialog from '@/components/admin/AssignCourierDialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PAGE_SIZE = 10;
const ASSIGNABLE = ['CREATED', 'PICKUP_SCHEDULED'];

export default function AdminShipmentsView() {
  const { get, update } = useUrlParams();
  const page = Number(get('page')) || 1;
  const status = get('status');
  const [selected, setSelected] = useState<Shipment | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['shipments', 'admin', { page, status }],
    queryFn: () => getShipments({ page, limit: PAGE_SIZE, status: status || undefined }),
    placeholderData: keepPreviousData,
  });

  const columns: Column<Shipment>[] = [
    {
      header: 'Tracking Code',
      accessor: (s) => <span className="font-mono text-xs">{s.trackingCode}</span>,
    },
    { header: 'Customer', accessor: (s) => s.customer?.name ?? '—' },
    {
      header: 'Courier',
      accessor: (s) =>
        s.courier?.name ?? <span className="text-gray-400 text-sm">Unassigned</span>,
    },
    { header: 'Price', accessor: (s) => formatCurrency(s.price) },
    { header: 'Status', accessor: (s) => <StatusBadge status={s.status} /> },
    { header: 'Payment', accessor: (s) => <PaymentBadge status={s.payment?.status} /> },
    { header: 'Created', accessor: (s) => formatDateTime(s.createdAt) },
    {
      header: 'Action',
      accessor: (s) =>
        !s.courierId && ASSIGNABLE.includes(s.status) ? (
          <Button size="sm" onClick={() => setSelected(s)}>
            <UserPlus className="h-4 w-4 mr-1" /> Assign
          </Button>
        ) : null,
    },
  ];

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-red-500 mb-3">Failed to load shipments.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Select
        value={status || 'ALL'}
        onValueChange={(value) => update({ status: !value || value === 'ALL' ? '' : value })}
      >
        <SelectTrigger className="w-full sm:w-56">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All statuses</SelectItem>
          {SHIPMENT_STATUS_OPTIONS.map((s) => (
            <SelectItem key={s} value={s}>
              {s.replace(/_/g, ' ')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        keyExtractor={(s) => s.id}
        emptyMessage="No shipments match this filter."
      />

      <PaginationControls
        page={page}
        totalPages={data?.meta.totalPages ?? 1}
        onPageChange={(p) => update({ page: String(p) })}
      />

      <AssignCourierDialog shipment={selected} onClose={() => setSelected(null)} />
    </div>
  );
}