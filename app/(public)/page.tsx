import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import HeroRouteDemo from '@/components/home/HeroRouteDemo';
import TrackQuoteWidget from '@/components/home/TrackQuoteWidget';
import {
  CtaSection,
  FaqSection,
  LifecycleSection,
  RolesSection,
  ServicesSection,
  TrustStrip,
  WhySection,
} from '@/components/home/HomeSections';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div
          aria-hidden
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              'radial-gradient(circle at 18% 22%, rgba(37,99,235,0.5), transparent 45%), radial-gradient(circle at 85% 30%, rgba(245,158,11,0.2), transparent 40%)',
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-40 pt-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pt-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium ring-1 ring-white/15">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Live tracking · Secure payments
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Move every parcel with{' '}
              <span className="text-amber-400">confidence</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-300">
              Book a pickup, pay online, and watch your shipment travel hub to hub until it
              reaches the door. Every step is tracked and recorded.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="bg-amber-400 text-slate-950 hover:bg-amber-300">
                  Get started free
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  Try a demo login
                </Button>
              </Link>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
              {['No hidden fees', 'Stripe-secured checkout', 'Public parcel tracking'].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {t}
                </li>
              ))}
            </ul>
          </div>

          <HeroRouteDemo />
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-24 max-w-4xl px-4 sm:px-6">
        <TrackQuoteWidget />
      </div>

      <TrustStrip />
      <ServicesSection />
      <LifecycleSection />
      <RolesSection />
      <WhySection />
      <FaqSection />
      <CtaSection />
    </div>
  );
}