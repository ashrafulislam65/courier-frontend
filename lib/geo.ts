import type { ShipmentStatus } from '@/types';

export type Pt = [number, number];

export interface LatLng {
  lat: number;
  lng: number;
}

export interface City extends LatLng {
  key: string;
  name: string;
  keywords: string[];
}

// আগে ছোট এলাকা, পরে বড় শহর: hub-এর নাম/ঠিকানা থেকে জায়গা চেনার জন্য
export const CITIES: City[] = [
  { key: 'gulshan', name: 'Gulshan', lat: 23.7925, lng: 90.4078, keywords: ['gulshan', 'banani'] },
  { key: 'motijheel', name: 'Motijheel', lat: 23.733, lng: 90.4172, keywords: ['motijheel'] },
  { key: 'uttara', name: 'Uttara', lat: 23.8759, lng: 90.3795, keywords: ['uttara'] },
  { key: 'dhaka', name: 'Dhaka', lat: 23.8103, lng: 90.4125, keywords: ['dhaka'] },
  { key: 'chattogram', name: 'Chattogram', lat: 22.3569, lng: 91.7832, keywords: ['chattogram', 'chittagong', 'agrabad'] },
  { key: 'sylhet', name: 'Sylhet', lat: 24.8949, lng: 91.8687, keywords: ['sylhet'] },
  { key: 'khulna', name: 'Khulna', lat: 22.8456, lng: 89.5403, keywords: ['khulna'] },
  { key: 'rajshahi', name: 'Rajshahi', lat: 24.3745, lng: 88.6042, keywords: ['rajshahi'] },
  { key: 'barishal', name: 'Barishal', lat: 22.701, lng: 90.3535, keywords: ['barishal', 'barisal'] },
  { key: 'rangpur', name: 'Rangpur', lat: 25.7439, lng: 89.2752, keywords: ['rangpur'] },
  { key: 'mymensingh', name: 'Mymensingh', lat: 24.7471, lng: 90.4203, keywords: ['mymensingh'] },
  { key: 'cumilla', name: 'Cumilla', lat: 23.4607, lng: 91.1809, keywords: ['cumilla', 'comilla'] },
  { key: 'coxsbazar', name: "Cox's Bazar", lat: 21.4272, lng: 92.0058, keywords: ['cox'] },
];

export function resolveCity(text: string): City {
  const lower = text.toLowerCase();
  return CITIES.find((c) => c.keywords.some((k) => lower.includes(k))) ?? CITIES[3];
}

export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// দুই শহরের মাঝে হালকা বাঁকানো পথ (quadratic bezier)
export function arcPoints(a: LatLng, b: LatLng, steps = 90): Pt[] {
  const bend = 0.18;
  const cLat = (a.lat + b.lat) / 2 - (b.lng - a.lng) * bend;
  const cLng = (a.lng + b.lng) / 2 + (b.lat - a.lat) * bend;
  const points: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    points.push([
      u * u * a.lat + 2 * u * t * cLat + t * t * b.lat,
      u * u * a.lng + 2 * u * t * cLng + t * t * b.lng,
    ]);
  }
  return points;
}

export function pointAt(route: Pt[], progress: number): Pt {
  const p = Math.min(1, Math.max(0, progress)) * (route.length - 1);
  const i = Math.floor(p);
  const f = p - i;
  const a = route[i];
  const b = route[Math.min(i + 1, route.length - 1)];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
}

// Status অনুযায়ী route-এর কত অংশ পার হয়েছে (অনুমান, GPS নয়)
export const STATUS_PROGRESS: Record<ShipmentStatus, number> = {
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