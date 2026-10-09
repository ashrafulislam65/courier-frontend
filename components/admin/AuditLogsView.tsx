'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getAuditLogs } from '@/lib/api/admin';
import { usePagination } from '@/hooks/usePagination';
import { formatDateTime } from '@/lib/utils';
import { AuditLog } from '@/types';
import DataTable, { Column } from '@/components/shared/DataTable';
import PaginationControls from '@/components/shared/PaginationControls';
import { Button } from '@/components/ui/button';

const PAGE_SIZE = 20;

const columns: Column<AuditLog>[] = [
  { header: 'When', accessor: (log) => formatDateTime(log.createdAt) },
  {
    header: 'Actor',
    accessor: (log) => (
      <span>
        {log.actor.name}{' '}
        <span className="text-xs text-gray-400">({log.actor.role.toLowerCase()})</span>
      </span>
    ),
  },
  {
    header: 'Action',
    accessor: (log) => (
      <span className="inline-flex px-2 py-1 rounded bg-gray-100 text-xs font-mono">
        {log.action}
      </span>
    ),
  },
  {
    header: 'Target',
    accessor: (log) => (
      <span className="text-sm">
        {log.targetType} <span className="font-mono text-xs text-gray-400">{log.targetId.slice(0, 8)}…</span>
      </span>
    ),
  },
  {
    header: 'Details',
    accessor: (log) => (
      <span className="font-mono text-xs text-gray-500 break-all">
        {log.metadata ? JSON.stringify(log.metadata) : '—'}
      </span>
    ),
    className: 'min-w-48',
  },
];

export default function AuditLogsView() {
  const { page, setPage } = usePagination();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'audit-logs', { page }],
    queryFn: () => getAuditLogs(page, PAGE_SIZE),
    placeholderData: keepPreviousData,
  });

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-red-500 mb-3">Failed to load audit logs.</p>
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
        keyExtractor={(log) => log.id}
        emptyMessage="No audit events recorded yet."
      />
      <PaginationControls
        page={page}
        totalPages={data?.meta.totalPages ?? 1}
        onPageChange={setPage}
      />
    </div>
  );
}