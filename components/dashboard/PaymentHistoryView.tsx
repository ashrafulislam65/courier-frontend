'use client';

import Link from 'next/link';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getShipments } from '@/lib/api/shipments';
import { usePagination } from '@/hooks/usePagination';
import { Shipment } from '@/types';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import DataTable, { Column } from '@/components/shared/DataTable';
import PaymentBadge from '@/components/shared/PaymentBadge';
import PaginationControls from '@/components/shared/PaginationControls';
import { Button } from '@/components/ui/button';

const PAGE_SIZE = 10;

const columns: Column<Shipment>[] = [
  {
    header: 'Tracking Code',
    accessor: (s) => <span className="font-mono text-xs">{s.trackingCode}</span>,
  },
  { header: 'Amount', accessor: (s) => formatCurrency(s.price) },
  { header: 'Payment', accessor: (s) => <PaymentBadge status={s.payment?.status} /> },
  {
    header: 'Transaction ID',
    accessor: (s) =>
      s.payment?.transactionId ? (
        <span className="font-mono text-xs">{s.payment.transactionId.slice(0, 18)}…</span>
      ) : (
        <span className="text-gray-400">—</span>
      ),
  },
  { header: 'Date', accessor: (s) => formatDateTime(s.createdAt) },
  {
    header: 'Action',
    accessor: (s) =>
      s.payment?.status === 'SUCCESS' || s.status === 'CANCELLED' ? null : (
        <Link href={`/dashboard/shipments/${s.id}`}>
          <Button size="sm">Pay Now</Button>
        </Link>
      ),
  },
];

export default function PaymentHistoryView() {
  const { page, setPage } = usePagination();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['shipments', 'payments', { page }],
    queryFn: () => getShipments({ page, limit: PAGE_SIZE }),
    placeholderData: keepPreviousData,
  });

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-red-500 mb-3">Failed to load payments.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        keyExtractor={(s) => s.id}
        emptyMessage="No payments yet. Create a shipment to get started."
      />
      <PaginationControls
        page={page}
        totalPages={data?.meta.totalPages ?? 1}
        onPageChange={setPage}
      />
    </div>
  );
}