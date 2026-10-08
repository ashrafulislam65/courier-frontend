'use client';

import ErrorFallback from '@/components/shared/ErrorFallback';

export default function DashboardError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorFallback {...props} />;
}