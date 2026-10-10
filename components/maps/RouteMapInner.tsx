'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet';
import { cn } from '@/lib/utils';
import {
    arcPoints,
    haversineKm,
    pointAt,
    resolveCity,
    STATUS_PROGRESS,
    type Pt,
} from '@/lib/geo';
import type { ShipmentStatus } from '@/types';

export interface RouteMapProps {
    status: ShipmentStatus;
    origin: { name: string; address?: string };
    destination: { name: string; address?: string };
    variant?: 'light' | 'dark';
    className?: string;
}

const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTRIBUTION =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const TRUCK_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>';

const truckIcon = L.divIcon({
    className: 'courier-pin',
    html: `<div class="relative -translate-x-1/2 -translate-y-1/2"><span class="absolute -inset-2 animate-ping rounded-full bg-brand-500/40"></span><span class="relative grid h-9 w-9 place-items-center rounded-full bg-white text-brand-600 shadow-lg ring-2 ring-brand-600">${TRUCK_SVG}</span></div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
});

const escapeHtml = (text: string) =>
    text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const shorten = (label: string, max = 22) =>
    label.length > max ? `${label.slice(0, max - 1)}…` : label;

const hubIcon = (label: string) =>
    L.divIcon({
        className: 'courier-pin',
        html: `<div class="flex -translate-x-1/2 flex-col items-center"><span class="block h-4 w-4 rounded-full border-4 border-brand-600 bg-white shadow"></span><span class="mt-1 whitespace-nowrap rounded bg-neutral-900/85 px-1.5 py-0.5 text-[10px] font-semibold text-white">${escapeHtml(shorten(label))}</span></div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 8],
    });

function FitBounds({ points }: { points: Pt[] }) {
    const map = useMap();
    useEffect(() => {
        map.invalidateSize();
        map.fitBounds(points, { padding: [56, 56], maxZoom: 12 });
    }, [map, points]);
    return null;
}

export default function RouteMapInner({
    status,
    origin,
    destination,
    variant = 'light',
    className,
}: RouteMapProps) {
    const dark = variant === 'dark';

    const from = useMemo(
        () => resolveCity(`${origin.name} ${origin.address ?? ''}`),
        [origin.name, origin.address]
    );
    const fromTo = useMemo(
        () => resolveCity(`${destination.name} ${destination.address ?? ''}`),
        [destination.name, destination.address]
    );
    // দুটো hub একই জায়গায় পড়লে ম্যাপে আলাদা দেখানোর জন্য একটু সরিয়ে দিই
    const to = useMemo(
        () => (from === fromTo ? { ...fromTo, lat: fromTo.lat + 0.03, lng: fromTo.lng + 0.03 } : fromTo),
        [from, fromTo]
    );

    const route = useMemo(() => arcPoints(from, to), [from, to]);
    const km = Math.round(haversineKm(from, to) * 1.25);

    const target = STATUS_PROGRESS[status];
    const fromRef = useRef(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const start = fromRef.current;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion || start === target) {
            fromRef.current = target;
            setProgress(target);
            return;
        }

        const duration = target < start ? 700 : 1600;
        const startedAt = performance.now();
        let frame = 0;

        const tick = (now: number) => {
            const t = Math.min(1, (now - startedAt) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            const value = start + (target - start) * eased;
            fromRef.current = value;
            setProgress(value);
            if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [target]);

    const accent = status === 'FAILED' ? '#ef4444' : '#e64a19';
    const truckPos = pointAt(route, progress);
    const doneIndex = Math.floor(progress * (route.length - 1));
    const donePath: Pt[] = [...route.slice(0, doneIndex + 1), truckPos];

    const originIcon = useMemo(() => hubIcon(origin.name), [origin.name]);
    const destinationIcon = useMemo(() => hubIcon(destination.name), [destination.name]);

    return (
        <div
            className={cn(
                'isolate overflow-hidden rounded-xl ring-1',
                dark ? 'bg-neutral-900 ring-white/10' : 'bg-neutral-50 ring-neutral-200',
                className
            )}
        >
            <MapContainer
                center={[from.lat, from.lng]}
                zoom={7}
                scrollWheelZoom={false}
                className="h-72 w-full sm:h-96"
                style={{ background: dark ? '#0a0a0a' : '#f5f5f5' }}
            >
                <TileLayer
                    url={TILE_URL}
                    attribution={ATTRIBUTION}
                    className={dark ? 'map-tiles-dark' : undefined}
                />
                <FitBounds points={route} />

                <Polyline
                    positions={route}
                    pathOptions={{
                        color: dark ? '#737373' : '#a3a3a3',
                        weight: 3,
                        dashArray: '3 9',
                        className: 'route-flow',
                    }}
                />
                <Polyline positions={donePath} pathOptions={{ color: accent, weight: 5, opacity: 0.95 }} />

                <Marker position={[from.lat, from.lng]} icon={originIcon} />
                <Marker position={[to.lat, to.lng]} icon={destinationIcon} />
                <Marker position={truckPos} icon={truckIcon} />
            </MapContainer>

            <div
                className={cn(
                    'flex items-center justify-between gap-3 px-4 py-2.5 text-xs',
                    dark ? 'text-neutral-300' : 'text-neutral-600'
                )}
            >
                <span className="font-semibold uppercase tracking-wide" style={{ color: accent }}>
                    {status.replace(/_/g, ' ')}
                </span>
                <span>
                    ≈ {km} km · {Math.round(progress * 100)}% (estimated from status)
                </span>
            </div>
        </div>
    );
}