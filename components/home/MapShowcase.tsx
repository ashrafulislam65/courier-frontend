'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import RouteMap from '@/components/maps/RouteMap';
import Reveal from '@/components/shared/Reveal';
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

export default function MapShowcase() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % DEMO_STATUSES.length), 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-neutral-950 py-24 text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
        <Reveal className="lg:col-span-2">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-400">
            Live on the map
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Watch your parcel travel across Bangladesh
          </h2>
          <p className="mt-4 text-neutral-400">
            Every shipment gets its own route between hubs. The marker moves as the courier updates
            the status, so you always know how far your parcel has come.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-neutral-300">
            {[
              'Hub-to-hub route drawn on a real map',
              'Marker moves with every status update',
              'Auto-refreshes, no page reload needed',
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-400" /> {t}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="lg:col-span-3" delay={150}>
          <p className="mb-2 flex items-center gap-2 text-xs text-neutral-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Live route demo
          </p>
          <RouteMap
            variant="dark"
            status={DEMO_STATUSES[index]}
            origin={{ name: 'Dhaka Central Hub', address: 'Motijheel, Dhaka' }}
            destination={{ name: 'Chattogram Hub', address: 'Agrabad, Chattogram' }}
          />
        </Reveal>
      </div>
    </section>
  );
}