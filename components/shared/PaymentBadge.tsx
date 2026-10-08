import { PaymentStatus } from '@/types';
import { cn } from '@/lib/utils';

const styles: Record<PaymentStatus | 'UNPAID', string> = {
  UNPAID: 'bg-gray-100 text-gray-600',
  PENDING: 'bg-amber-100 text-amber-700',
  SUCCESS: 'bg-green-100 text-green-700',
  FAILED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-blue-100 text-blue-700',
};

export default function PaymentBadge({ status }: { status?: PaymentStatus | null }) {
  const key = status ?? 'UNPAID';
  const label = key === 'SUCCESS' ? 'PAID' : key;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
        styles[key]
      )}
    >
      {label}
    </span>
  );
}