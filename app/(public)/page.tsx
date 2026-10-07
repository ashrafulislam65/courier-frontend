import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Package, MapPin, ShieldCheck, Clock, Truck, CreditCard } from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Fast, Reliable Parcel Delivery — Tracked End to End
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
            From pickup to doorstep, every shipment is tracked in real time across our
            network of hubs and couriers — with secure online payment built in.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" variant="secondary">Get Started</Button>
            </Link>
            <Link href="/track">
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-blue-700">
                Track a Shipment
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: MapPin,
              title: 'Real-Time Tracking',
              desc: 'Follow your parcel through every hub transfer, right up to delivery.',
            },
            {
              icon: ShieldCheck,
              title: 'Verified Couriers',
              desc: 'Every delivery is handled by a vetted, zone-assigned courier.',
            },
            {
              icon: Clock,
              title: 'Fast Turnaround',
              desc: 'Optimized hub routing keeps delivery times short and predictable.',
            },
            {
              icon: CreditCard,
              title: 'Secure Payments',
              desc: 'Pay safely online with industry-standard payment processing.',
            },
            {
              icon: Truck,
              title: 'Nationwide Network',
              desc: 'A growing network of hubs and zones covering major cities.',
            },
            {
              icon: Package,
              title: 'Simple Booking',
              desc: 'Create a shipment in under a minute, no paperwork required.',
            },
          ].map((f) => (
            <Card key={f.title} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <f.icon className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
            {[
              { step: '1', label: 'Create Shipment' },
              { step: '2', label: 'Courier Assigned' },
              { step: '3', label: 'In Transit' },
              { step: '4', label: 'Delivered' },
            ].map((s) => (
              <div key={s.step}>
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mx-auto mb-3">
                  {s.step}
                </div>
                <p className="font-medium text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to ship your first parcel?</h2>
        <p className="text-gray-500 mb-8">Create an account and send your first shipment today.</p>
        <Link href="/register">
          <Button size="lg">Create Free Account</Button>
        </Link>
      </section>
    </div>
  );
}