'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Calculator, PackageSearch, Search } from 'lucide-react';
import { PRICING } from '@/lib/constants';
import { formatCurrency, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Tab = 'track' | 'quote';

export default function TrackQuoteWidget() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('track');
  const [code, setCode] = useState('');
  const [weight, setWeight] = useState(2);

  const price = Math.round(PRICING.baseFee + weight * PRICING.perKgRate);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    router.push(`/track?code=${encodeURIComponent(code.trim())}`);
  };

  const tabs: { id: Tab; label: string; icon: typeof Search }[] = [
    { id: 'track', label: 'Track Shipment', icon: PackageSearch },
    { id: 'quote', label: 'Get a Quote', icon: Calculator },
  ];

  return (
    <div className="rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
      <div className="flex border-b" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 px-4 py-4 text-sm font-semibold transition-colors',
              tab === t.id
                ? 'border-b-2 border-blue-600 text-blue-700'
                : 'text-slate-500 hover:text-slate-800'
            )}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-5 sm:p-7">
        {tab === 'track' ? (
          <form onSubmit={handleTrack} className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter tracking code, e.g. CR-015490-EW8VZW"
              className="h-11"
              aria-label="Tracking code"
            />
            <Button type="submit" className="h-11 px-6">
              <Search className="mr-2 h-4 w-4" /> Track
            </Button>
          </form>
        ) : (
          <div className="grid items-center gap-6 sm:grid-cols-2">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <label htmlFor="weight" className="font-medium text-slate-700">
                  Parcel weight
                </label>
                <span className="font-semibold text-blue-700">{weight} kg</span>
              </div>
              <input
                id="weight"
                type="range"
                min={0.5}
                max={30}
                step={0.5}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="mt-1 flex justify-between text-xs text-slate-400">
                <span>0.5 kg</span>
                <span>30 kg</span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <p className="text-xs uppercase tracking-wide text-slate-500">Estimated price</p>
              <p className="text-3xl font-bold text-slate-900">{formatCurrency(price)}</p>
              <p className="mt-1 text-xs text-slate-500">
                {formatCurrency(PRICING.baseFee)} base + {formatCurrency(PRICING.perKgRate)} per kg
              </p>
              <Link
                href="/dashboard/shipments/new"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline"
              >
                Create this shipment <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}