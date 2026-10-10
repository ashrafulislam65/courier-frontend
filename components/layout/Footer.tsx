import Link from 'next/link';
import { Mail, MapPin, Package, Phone } from 'lucide-react';

const columns = [
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About us' },
      { href: '/services', label: 'Services' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Shipping',
    links: [
      { href: '/track', label: 'Track a shipment' },
      { href: '/dashboard/shipments/new', label: 'Create a shipment' },
      { href: '/#faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Account',
    links: [
      { href: '/login', label: 'Login' },
      { href: '/register', label: 'Sign up' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-slate-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
                <Package className="h-5 w-5" />
              </span>
              <span className="text-lg font-bold">Courier</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-slate-400">
              Parcel delivery tracked end to end, from the first pickup to the recipient&apos;s
              door.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-400" /> support@courier.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-400" /> +880 1700-000000
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-400" /> Motijheel, Dhaka, Bangladesh
              </li>
            </ul>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-semibold text-white">{col.title}</h4>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-slate-400 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Courier & Logistics Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}