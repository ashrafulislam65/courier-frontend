'use client';

import { useEffect, useState } from 'react';
import RouteTracker from '@/components/shared/RouteTracker';
import type { ShipmentStatus } from '@/types';

const DEMO_STATUSES: ShipmentStatus[] = [
  'CREATED',
  'COURIER_ASSIGNED',
  'PICKED_UP',
  'IN_TRANSIT',
  'AT_DESTINATION_HUB',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
];

export default function HeroRouteDemo() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % DEMO_STATUSES.length), 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-2xl bg-slate-900/70 p-5 shadow-2xl ring-1 ring-white/10 backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-white">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          Live route demo
        </div>
        <span className="text-xs text-slate-400">Dhaka → Chattogram</span>
      </div>
      <RouteTracker
        status={DEMO_STATUSES[index]}
        variant="dark"
        originLabel="Dhaka"
        destinationLabel="Chattogram hub"
      />
    </div>
  );
}