'use client';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getUsers, toggleBlockUser, updateUserRole } from '@/lib/api/admin';
import { useUrlParams } from '@/hooks/useUrlParams';
import { useAuthStore } from '@/store/auth-store';
import { cn, formatDateTime, getErrorMessage } from '@/lib/utils';
import { User } from '@/types';
import DataTable, { Column } from '@/components/shared/DataTable';
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
const ROLES = ['CUSTOMER', 'COURIER', 'ADMIN'];

export default function AdminUsersView() {
  const queryClient = useQueryClient();
  const { get, update } = useUrlParams();
  const page = Number(get('page')) || 1;
  const role = get('role');
  const me = useAuthStore((state) => state.user);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'users', { page, role }],
    queryFn: () => getUsers(role || undefined, page, PAGE_SIZE),
    placeholderData: keepPreviousData,
  });

  const onSuccess = (message: string) => {
    toast.success(message);
    queryClient.invalidateQueries({ queryKey: ['admin'] });
  };

  const roleMutation = useMutation({
    mutationFn: (vars: { id: string; role: string }) => updateUserRole(vars.id, vars.role),
    onSuccess: () => onSuccess('User role updated'),
    onError: (error) => toast.error(getErrorMessage(error, 'Could not update role')),
  });

  const blockMutation = useMutation({
    mutationFn: (vars: { id: string; isBlocked: boolean }) =>
      toggleBlockUser(vars.id, vars.isBlocked),
    onSuccess: (_data, vars) => onSuccess(vars.isBlocked ? 'User blocked' : 'User unblocked'),
    onError: (error) => toast.error(getErrorMessage(error, 'Could not update user')),
  });

  const busy = roleMutation.isPending || blockMutation.isPending;

  const columns: Column<User>[] = [
    {
      header: 'User',
      accessor: (u) => (
        <div>
          <p className="font-medium">{u.name}</p>
          <p className="text-xs text-gray-400">{u.email}</p>
        </div>
      ),
    },
    {
      header: 'Role',
      accessor: (u) =>
        u.id === me?.id ? (
          <span className="text-sm font-medium capitalize">{u.role.toLowerCase()} (you)</span>
        ) : (
          <Select
            value={u.role}
            onValueChange={(value) => {
              if (value && value !== u.role) roleMutation.mutate({ id: u.id, role: value });
            }}
          >
            <SelectTrigger className="w-36" disabled={busy}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ),
    },
    {
      header: 'Status',
      accessor: (u) => (
        <span
          className={cn(
            'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
            u.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          )}
        >
          {u.isBlocked ? 'BLOCKED' : 'ACTIVE'}
        </span>
      ),
    },
    {
      header: 'Joined',
      accessor: (u) => (u.createdAt ? formatDateTime(u.createdAt) : '—'),
    },
    {
      header: 'Action',
      accessor: (u) =>
        u.id === me?.id ? null : (
          <Button
            size="sm"
            variant={u.isBlocked ? 'outline' : 'destructive'}
            disabled={busy}
            onClick={() => blockMutation.mutate({ id: u.id, isBlocked: !u.isBlocked })}
          >
            {u.isBlocked ? 'Unblock' : 'Block'}
          </Button>
        ),
    },
  ];

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-red-500 mb-3">Failed to load users.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Select
        value={role || 'ALL'}
        onValueChange={(value) => update({ role: !value || value === 'ALL' ? '' : value })}
      >
        <SelectTrigger className="w-full sm:w-56">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All roles</SelectItem>
          {ROLES.map((r) => (
            <SelectItem key={r} value={r}>
              {r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        keyExtractor={(u) => u.id}
        emptyMessage="No users found."
      />

      <PaginationControls
        page={page}
        totalPages={data?.meta.totalPages ?? 1}
        onPageChange={(p) => update({ page: String(p) })}
      />
    </div>
  );
}