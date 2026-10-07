import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Users, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about our mission to make parcel delivery faster, safer, and more transparent.',
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">About Courier</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          We&apos;re building the logistics backbone for modern parcel delivery — connecting
          customers, couriers, and hub operators on a single, transparent platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardContent className="pt-6 text-center">
            <Target className="h-10 w-10 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Our Mission</h3>
            <p className="text-gray-500 text-sm">
              Make every shipment trackable, every delivery accountable, and every courier
              fairly compensated.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="h-10 w-10 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Our People</h3>
            <p className="text-gray-500 text-sm">
              A growing network of verified couriers and hub operators working together
              across zones.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Globe className="h-10 w-10 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Our Reach</h3>
            <p className="text-gray-500 text-sm">
              Expanding hub-to-hub coverage to make nationwide delivery fast and predictable.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="prose max-w-none text-gray-600">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Our Story</h2>
        <p className="mb-4">
          Courier was built to solve a simple but persistent problem: parcel delivery
          coordination is messy. Customers lose track of their shipments, couriers juggle
          assignments manually, and hubs operate in silos with no shared visibility.
        </p>
        <p>
          Our platform brings all three sides together — a strict status pipeline from
          pickup to delivery, real-time tracking history, zone-based courier assignment,
          and secure online payment — so nothing falls through the cracks.
        </p>
      </div>
    </div>
  );
}