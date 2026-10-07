import { ShipmentStatus } from '@/types';
import { cn } from '@/lib/utils';

const statusStyles: Record<ShipmentStatus, string> = {
  CREATED: 'bg-gray-100 text-gray-700',
  PICKUP_SCHEDULED: 'bg-blue-100 text-blue-700',
  COURIER_ASSIGNED: 'bg-indigo-100 text-indigo-700',
  PICKED_UP: 'bg-purple-100 text-purple-700',
  IN_TRANSIT: 'bg-amber-100 text-amber-700',
  AT_DESTINATION_HUB: 'bg-cyan-100 text-cyan-700',
  OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-700',
  DELIVERED: 'bg-green-100 text-green-700',
  FAILED: 'bg-red-100 text-red-700',
  RETURN_TO_SENDER: 'bg-rose-100 text-rose-700',
  CANCELLED: 'bg-gray-200 text-gray-500',
};

export default function StatusBadge({ status }: { status: ShipmentStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
        statusStyles[status]
      )}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}