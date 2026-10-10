'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ShipmentStatus } from '@/types';

const PATH_D = 'M 70 250 C 190 250, 210 90, 340 120 S 560 270, 730 90';

// Status অনুযায়ী route-এর কত অংশ পার হয়েছে
const PROGRESS: Record<ShipmentStatus, number> = {
  CREATED: 0,
  PICKUP_SCHEDULED: 0.06,
  COURIER_ASSIGNED: 0.12,
  PICKED_UP: 0.25,
  IN_TRANSIT: 0.5,
  AT_DESTINATION_HUB: 0.75,
  OUT_FOR_DELIVERY: 0.9,
  DELIVERED: 1,
  FAILED: 0.9,
  RETURN_TO_SENDER: 0.1,
  CANCELLED: 0,
};

const MILESTONES = [0, 0.25, 0.5, 0.75, 1];
const MILESTONE_LABELS = ['Origin hub', 'Picked up', 'In transit', 'Destination hub', 'Delivered'];

interface Point {
  x: number;
  y: number;
}
interface Geometry {
  length: number;
  points: Point[];
}
interface TruckState extends Point {
  progress: number;
}

interface RouteTrackerProps {
  status: ShipmentStatus;
  originLabel?: string;
  destinationLabel?: string;
  variant?: 'light' | 'dark';
  className?: string;
}

const shorten = (label: string, max = 18) =>
  label.length > max ? `${label.slice(0, max - 1)}…` : label;

export default function RouteTracker({
  status,
  originLabel = 'Origin hub',
  destinationLabel = 'Destination hub',
  variant = 'light',
  className,
}: RouteTrackerProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const pathRef = useRef<SVGPathElement>(null);
  const fromRef = useRef(0);
  const [geo, setGeo] = useState<Geometry | null>(null);
  const [truck, setTruck] = useState<TruckState | null>(null);

  const target = PROGRESS[status];
  const dark = variant === 'dark';
  const delivered = status === 'DELIVERED';
  const stopped = status === 'CANCELLED' || status === 'RETURN_TO_SENDER';
  const accent =
    status === 'FAILED' ? '#ef4444' : stopped ? '#f59e0b' : dark ? '#38bdf8' : '#2563eb';

  // Route-এর মাপ ও milestone-এর অবস্থান একবার বের করা
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    setGeo({
      length,
      points: MILESTONES.map((at) => {
        const p = path.getPointAtLength(length * at);
        return { x: p.x, y: p.y };
      }),
    });
  }, []);

  // Status বদলালে truck নরমভাবে নতুন জায়গায় যায়
  useEffect(() => {
    const path = pathRef.current;
    if (!geo || !path) return;

    const place = (progress: number) => {
      const p = path.getPointAtLength(geo.length * progress);
      setTruck({ x: p.x, y: p.y, progress });
    };

    const from = fromRef.current;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || from === target) {
      fromRef.current = target;
      place(target);
      return;
    }

    const duration = target < from ? 700 : 1500;
    const startedAt = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = from + (target - from) * eased;
      fromRef.current = value;
      place(value);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [geo, target]);

  const progress = truck?.progress ?? 0;
  const bg = dark ? '#0f172a' : '#ffffff';
  const labelFill = dark ? '#cbd5e1' : '#475569';

  return (
    <div
      className={cn(
        'rounded-xl p-3',
        dark ? 'bg-white/5 ring-1 ring-white/10' : 'bg-slate-50 ring-1 ring-slate-200',
        className
      )}
    >
      <svg
        viewBox="0 0 800 340"
        role="img"
        aria-label={`Shipment route, current status ${status.replace(/_/g, ' ').toLowerCase()}`}
        className="h-auto w-full"
      >
        <defs>
          <linearGradient id={`${uid}-route`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor={accent} />
          </linearGradient>
          <pattern id={`${uid}-dots`} width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.3" fill={dark ? '#94a3b8' : '#cbd5e1'} opacity="0.35" />
          </pattern>
        </defs>

        <rect width="800" height="340" fill={`url(#${uid}-dots)`} />

        {/* বাকি পথ (ডট ডট) */}
        <path
          ref={pathRef}
          d={PATH_D}
          fill="none"
          stroke={dark ? '#334155' : '#cbd5e1'}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="2 12"
        />

        {/* পার হওয়া পথ */}
        {geo && (
          <path
            d={PATH_D}
            fill="none"
            stroke={`url(#${uid}-route)`}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${geo.length * progress} ${geo.length}`}
          />
        )}

        {geo?.points.map((pt, i) => {
          const label = i === 0 ? originLabel : i === 3 ? destinationLabel : MILESTONE_LABELS[i];
          const reached = progress >= MILESTONES[i] - 0.001;
          return (
            <g key={MILESTONE_LABELS[i]}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={10}
                fill={reached ? accent : bg}
                stroke={reached ? accent : dark ? '#475569' : '#94a3b8'}
                strokeWidth={3}
              />
              {reached && (
                <path
                  d={`M ${pt.x - 4} ${pt.y} l 3 3 l 5 -6`}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              <text
                x={pt.x}
                y={pt.y + 32}
                textAnchor="middle"
                fontSize="13"
                fontWeight="600"
                fill={labelFill}
                stroke={bg}
                strokeWidth="4"
                paintOrder="stroke"
              >
                {shorten(label)}
              </text>
            </g>
          );
        })}

        {truck && (
          <g transform={`translate(${truck.x} ${truck.y})`}>
            {!delivered && !stopped && (
              <circle r="18" fill={accent} opacity="0.3">
                <animate attributeName="r" values="16;30;16" dur="2s" repeatCount="indefinite" />
                <animate
                  attributeName="opacity"
                  values="0.35;0;0.35"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
            <circle r="19" fill={bg} stroke={accent} strokeWidth="3" />
            <Truck x={-11} y={-11} size={22} color={accent} strokeWidth={2.2} />
          </g>
        )}
      </svg>

      <div
        className={cn(
          'mt-2 flex items-center justify-between px-1 text-xs',
          dark ? 'text-slate-300' : 'text-slate-500'
        )}
      >
        <span className="font-semibold uppercase tracking-wide" style={{ color: accent }}>
          {status.replace(/_/g, ' ')}
        </span>
        <span>{Math.round(progress * 100)}% of the route completed</span>
      </div>
    </div>
  );
}