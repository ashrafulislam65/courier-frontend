'use client';

import ErrorFallback from '@/components/shared/ErrorFallback';

export default function ProviderError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorFallback {...props} />;
}