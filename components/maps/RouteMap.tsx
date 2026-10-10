'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import type { RouteMapProps } from './RouteMapInner';

const RouteMapInner = dynamic(() => import('./RouteMapInner'), {
  ssr: false,
  loading: () => <Skeleton className="h-80 w-full rounded-xl sm:h-[26rem]" />,
});

export default function RouteMap(props: RouteMapProps) {
  return <RouteMapInner {...props} />;
}