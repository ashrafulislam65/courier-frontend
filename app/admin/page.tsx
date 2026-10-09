import type { Metadata } from 'next';
import AdminOverviewView from '@/components/admin/AdminOverviewView';

export const metadata: Metadata = { title: 'Admin Overview' };

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Operations Overview</h1>
        <p className="text-sm text-gray-500">Live view of shipments, revenue, and your network.</p>
      </div>
      <AdminOverviewView />
    </div>
  );
}