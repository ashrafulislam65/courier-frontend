import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Building2, RefreshCcw, BarChart3 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Explore our parcel delivery, hub management, and tracking services.',
};

const services = [
  {
    icon: Package,
    title: 'Parcel Delivery',
    desc: 'Create a shipment in seconds and track it from pickup through every hub transfer to final delivery.',
  },
  {
    icon: Building2,
    title: 'Hub & Zone Network',
    desc: 'Shipments route through a managed network of origin and destination hubs for efficient transit.',
  },
  {
    icon: RefreshCcw,
    title: 'Status Lifecycle Management',
    desc: 'Every shipment follows a strict, auditable status pipeline — no step can be skipped or faked.',
  },
  {
    icon: BarChart3,
    title: 'Courier & Admin Tools',
    desc: 'Couriers manage their assigned deliveries and earnings; admins get full operational visibility.',
  },
];

export default function ServicesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Our Services</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Everything you need to send, deliver, and manage parcels — in one platform.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {services.map((s) => (
          <Card key={s.title} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6 flex gap-4">
              <s.icon className="h-10 w-10 text-blue-600 shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}