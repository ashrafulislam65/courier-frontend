import {
  LayoutDashboard,
  PackagePlus,
  CreditCard,
  UserCircle,
  ClipboardList,
  Wallet,
  Truck,
  BarChart3,
  ScrollText,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Role } from '@/types';


export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

export const navConfig: Record<Role, { title: string; items: NavItem[] }> = {
  CUSTOMER: {
    title: 'Customer Panel',
    items: [
      { href: '/dashboard', label: 'My Shipments', icon: LayoutDashboard, exact: true },
      { href: '/dashboard/shipments/new', label: 'New Shipment', icon: PackagePlus },
      { href: '/dashboard/payments', label: 'Payments', icon: CreditCard },
      { href: '/dashboard/profile', label: 'Profile', icon: UserCircle },
    ],
  },
  COURIER: {
    title: 'Courier Panel',
    items: [
      { href: '/provider', label: 'My Deliveries', icon: Truck, exact: true },
      { href: '/provider/earnings', label: 'Earnings', icon: Wallet },
      { href: '/provider/profile', label: 'Profile & Availability', icon: UserCircle },
    ],
  },
    ADMIN: {
    title: 'Admin Panel',
    items: [
      { href: '/admin', label: 'Overview', icon: BarChart3, exact: true },
      { href: '/admin/manage', label: 'Shipments', icon: ClipboardList },
      { href: '/admin/users', label: 'Users', icon: Users },
      { href: '/admin/reports', label: 'Audit Logs', icon: ScrollText },
    ],
  },
};