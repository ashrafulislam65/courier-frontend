import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/providers/query-provider';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Courier & Logistics Platform',
    template: '%s | Courier Platform',
  },
  description:
    'A fast, reliable courier and logistics management platform connecting customers, couriers, and hubs nationwide.',
  openGraph: {
    title: 'Courier & Logistics Platform',
    description: 'Fast, reliable parcel delivery and tracking.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          {children}
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}