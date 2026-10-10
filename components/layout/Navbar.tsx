'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, LogOut, Menu, Package } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMounted } from '@/hooks/useMounted';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';

const links = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/track', label: 'Track Shipment' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const roleDashboard: Record<string, string> = {
  ADMIN: '/admin',
  CUSTOMER: '/dashboard',
  COURIER: '/provider',
};

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const mounted = useMounted();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const loggedIn = mounted && isAuthenticated;
  const dashboardHref = roleDashboard[user?.role ?? ''] ?? '/';

  return (
    <header className="sticky top-0 z-50 border-b bg-white/85 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Package className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">Courier</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Main">
          {links.map((link) => {
            const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-blue-600'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {loggedIn ? (
            <>
              <Link href={dashboardHref}>
                <Button variant="outline" size="sm">
                  <LayoutDashboard className="h-4 w-4 mr-1" /> Dashboard
                </Button>
              </Link>
              <Button size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-72 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Package className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold">Courier</span>
          </div>
          <nav className="flex flex-col gap-1 p-4" aria-label="Mobile">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'rounded-md px-3 py-2.5 text-sm font-medium',
                  pathname === link.href
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-100'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-2 border-t p-4">
            {loggedIn ? (
              <>
                <Link href={dashboardHref} onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full">
                    <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
                  </Button>
                </Link>
                <Button
                  className="w-full"
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setOpen(false)}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}