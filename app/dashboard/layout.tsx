import DashboardShell from '@/components/layout/DashboardShell';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role="CUSTOMER">{children}</DashboardShell>;
}