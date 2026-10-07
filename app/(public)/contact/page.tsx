import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Courier team for support or partnership inquiries.',
};

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Have a question or need support? Reach out — we&apos;re here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        <Card>
          <CardContent className="pt-6 text-center">
            <Mail className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Email</h3>
            <p className="text-sm text-gray-500">support@courier.com</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Phone className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Phone</h3>
            <p className="text-sm text-gray-500">+880 1700-000000</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Head Office</h3>
            <p className="text-sm text-gray-500">Motijheel, Dhaka, Bangladesh</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}