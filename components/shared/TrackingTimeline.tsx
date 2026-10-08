import { ShipmentStatusHistoryItem } from '@/types';
import { cn, formatDateTime } from '@/lib/utils';
import EmptyState from './EmptyState';

interface TrackingTimelineProps {
  history: ShipmentStatusHistoryItem[];
  showActor?: boolean;
}

export default function TrackingTimeline({ history, showActor = true }: TrackingTimelineProps) {
  if (!history.length) return <EmptyState title="No tracking updates yet" />;

  return (
    <ol className="space-y-4">
      {history.map((item, idx) => {
        const isLatest = idx === history.length - 1;
        return (
          <li key={item.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-3 h-3 rounded-full mt-1.5',
                  isLatest ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-gray-300'
                )}
              />
              {!isLatest && <div className="w-px flex-1 bg-gray-200 my-1" />}
            </div>
            <div className="pb-4">
              <p className="font-medium text-sm">{item.status.replace(/_/g, ' ')}</p>
              {item.note && <p className="text-xs text-gray-500">{item.note}</p>}
              <p className="text-xs text-gray-400 mt-0.5">
                {formatDateTime(item.createdAt)}
                {showActor && ` · ${item.changedBy.name} (${item.changedBy.role.toLowerCase()})`}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}