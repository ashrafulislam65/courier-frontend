'use client';

import Link from 'next/link';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Eye } from 'lucide-react';
import { getShipments } from '@/lib/api/shipments';
import { usePagination } from '@/hooks/usePagination';
import { Shipment } from '@/types';
import { SHIPMENT_STATUS_OPTIONS } from '@/lib/constants';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import DataTable, { Column } from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import PaymentBadge from '@/components/shared/PaymentBadge';
import PaginationControls from '@/components/shared/PaginationControls';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PAGE_SIZE = 10;

const columns: Column<Shipment>[] = [
  {
    header: 'Tracking Code',
    accessor: (s) => <span className="font-mono text-xs">{s.trackingCode}</span>,
  },
  { header: 'Recipient', accessor: (s) => s.recipientName },
  { header: 'Price', accessor: (s) => formatCurrency(s.price) },
  { header: 'Status', accessor: (s) => <StatusBadge status={s.status} /> },
  { header: 'Payment', accessor: (s) => <PaymentBadge status={s.payment?.status} /> },
  { header: 'Created', accessor: (s) => formatDateTime(s.createdAt) },
  {
    header: 'Action',
    accessor: (s) => (
      <Link href={`/dashboard/shipments/${s.id}`}>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4 mr-1" /> View
        </Button>
      </Link>
    ),
  },
];

export default function CustomerShipmentsView() {
  const { page, status, setPage, setStatus } = usePagination();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['shipments', { page, status }],
    queryFn: () => getShipments({ page, limit: PAGE_SIZE, status: status || undefined }),
    placeholderData: keepPreviousData,
  });

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
      <div className="flex items-center gap-3">
        <Select
          value={status || 'ALL'}
          onValueChange={(value) => setStatus(value === 'ALL' ? '' : value)}
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
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        keyExtractor={(s) => s.id}
        emptyMessage="No shipments found. Create your first shipment to get started."
      />

      <PaginationControls
        page={page}
        totalPages={data?.meta.totalPages ?? 1}
        onPageChange={setPage}
      />
    </div>
  );
}