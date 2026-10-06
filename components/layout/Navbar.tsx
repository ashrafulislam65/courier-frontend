'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

const roleDashboard: Record<string, string> = {
  ADMIN: '/admin',
  CUSTOMER: '/dashboard',
  COURIER: '/provider',
};

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Package className="h-6 w-6 text-blue-600" />
          <span>Courier</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <Link href="/services" className="hover:text-blue-600">Services</Link>
          <Link href="/track" className="hover:text-blue-600">Track Shipment</Link>
          <Link href="/about" className="hover:text-blue-600">About</Link>
          <Link href="/contact" className="hover:text-blue-600">Contact</Link>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link href={roleDashboard[user?.role || ''] || '/'}>
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
              <Button size="sm" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}