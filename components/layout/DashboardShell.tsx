'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Menu, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';
import { useMounted } from '@/hooks/useMounted';
import { cn } from '@/lib/utils';
import type { Role } from '@/types';
import { navConfig, type NavItem } from './nav-config';

function Brand({ subtitle }: { subtitle: string }) {
  return (
    <Link href="/" className="flex items-center gap-2 px-6 h-16 border-b">
      <Package className="h-6 w-6 text-blue-600" />
      <div className="leading-tight">
        <p className="font-bold">Courier</p>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
    </Link>
  );
}

function NavLinks({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-4">
      {items.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              active ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function DashboardShell({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const config = navConfig[role];
  const { user, logout } = useAuth();
  const mounted = useMounted();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="hidden md:flex w-64 flex-col border-r bg-white">
        <Brand subtitle={config.title} />
        <NavLinks items={config.items} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b bg-white flex items-center justify-between px-4 sm:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <Brand subtitle={config.title} />
              <NavLinks items={config.items} onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <p className="hidden md:block text-sm text-gray-500">{config.title}</p>

          <div className="flex items-center gap-3">
            {mounted && user && (
              <div className="text-right leading-tight">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-400">{user.role.toLowerCase()}</p>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}