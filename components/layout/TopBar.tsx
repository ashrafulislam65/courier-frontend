import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="hidden bg-brand-50 text-xs text-neutral-700 md:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <ul className="flex items-center gap-6">
          <li className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-brand-600" /> +880 1700-000000
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-brand-600" /> Motijheel, Dhaka, Bangladesh
          </li>
          <li className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-brand-600" /> support@courier.com
          </li>
        </ul>
        <Link href="/track" className="font-semibold text-brand-700 hover:underline">
          Track a parcel →
        </Link>
      </div>
    </div>
  );
}