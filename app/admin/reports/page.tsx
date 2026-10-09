import { Suspense } from 'react';
import type { Metadata } from 'next';
import AuditLogsView from '@/components/admin/AuditLogsView';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = { title: 'Audit Logs' };

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <p className="text-sm text-gray-500">
          A record of sensitive admin actions such as courier assignments and role changes.
        </p>
      </div>
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <AuditLogsView />
      </Suspense>
    </div>
  );
}