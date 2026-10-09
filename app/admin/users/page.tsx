import { Suspense } from 'react';
import type { Metadata } from 'next';
import AdminUsersView from '@/components/admin/AdminUsersView';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = { title: 'Manage Users' };

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-sm text-gray-500">Change roles and block or unblock accounts.</p>
      </div>
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <AdminUsersView />
      </Suspense>
    </div>
  );
}