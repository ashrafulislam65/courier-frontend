import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  MapPin,
  Navigation,
  Package,
  PackageCheck,
  PackagePlus,
  RotateCcw,
  ShieldCheck,
  Truck,
  UserCheck,
} from 'lucide-react';
import Reveal from '@/components/shared/Reveal';
import { Button } from '@/components/ui/button';

function SectionHeading({
  eyebrow,
  title,
  description,
  light,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  light?: boolean;
}) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-amber-500">{eyebrow}</p>
      <h2
        className={`mt-2 text-3xl font-bold tracking-tight sm:text-4xl ${
          light ? 'text-white' : 'text-slate-900'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-3 ${light ? 'text-slate-400' : 'text-slate-500'}`}>{description}</p>
      )}
    </div>
  );
}

/* ---------- Trust strip ---------- */
const trust = [
  { icon: MapPin, title: 'Live tracking', text: 'See every hand-off in real time' },
  { icon: CreditCard, title: 'Secure payments', text: 'Stripe-powered card checkout' },
  { icon: ShieldCheck, title: 'Verified couriers', text: 'Assigned and monitored by admins' },
  { icon: BarChart3, title: 'Full audit trail', text: 'Every status change is recorded' },
];

export function TrustStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {trust.map((item, i) => (
          <Reveal key={item.title} delay={i * 80}>
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <item.icon className="h-6 w-6" />
              </span>
              <div>
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-500">{item.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- Services ---------- */
const services = [
  {
    icon: Package,
    title: 'Parcel Delivery',
    desc: 'Book a shipment in under a minute and follow it from pickup to the recipient’s door.',
  },
  {
    icon: Building2,
    title: 'Hub & Zone Network',
    desc: 'Parcels move hub to hub through a managed network, with every transfer logged.',
  },
  {
    icon: MapPin,
    title: 'Live Tracking',
    desc: 'A public tracking page and an animated route show exactly where your parcel is.',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    desc: 'Pay by card through Stripe Checkout. Payment status is confirmed by signed webhooks.',
  },
  {
    icon: RotateCcw,
    title: 'Failed Delivery Handling',
    desc: 'Missed a delivery? Couriers can retry it or send the parcel back to the sender.',
  },
  {
    icon: BarChart3,
    title: 'Courier & Admin Tools',
    desc: 'Couriers track their earnings while admins get analytics, user controls, and audit logs.',
  },
];

export function ServicesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="What we do"
        title="Everything a parcel needs, in one platform"
        description="From booking to payment to the final hand-over, each step is tracked and accountable."
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={(i % 3) * 100}>
            <div className="group h-full rounded-2xl border bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-xl">
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                <s.icon className="h-7 w-7" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- Delivery lifecycle ---------- */
const steps = [
  { icon: PackagePlus, title: 'Created', text: 'Customer books the shipment' },
  { icon: UserCheck, title: 'Assigned', text: 'Admin assigns a courier' },
  { icon: PackageCheck, title: 'Picked up', text: 'Courier collects the parcel' },
  { icon: Truck, title: 'In transit', text: 'On the road between hubs' },
  { icon: Building2, title: 'At hub', text: 'Reaches the destination hub' },
  { icon: Navigation, title: 'Out for delivery', text: 'Heading to the recipient' },
  { icon: CheckCircle2, title: 'Delivered', text: 'Handed over and confirmed' },
];

export function LifecycleSection() {
  return (
    <section className="bg-slate-950 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          light
          eyebrow="How it works"
          title="A strict seven-step delivery pipeline"
          description="No step can be skipped or faked. The system only allows the next valid status."
        />
        <div className="relative">
          <div className="absolute left-[7%] right-[7%] top-7 hidden h-px bg-gradient-to-r from-blue-500/0 via-blue-500/70 to-blue-500/0 lg:block" />
          <ol className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-7">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 70}>
                <li className="relative flex flex-col items-center text-center">
                  <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white ring-8 ring-slate-950">
                    <step.icon className="h-6 w-6" />
                  </span>
                  <p className="mt-4 text-xs font-semibold text-amber-400">STEP {i + 1}</p>
                  <p className="mt-1 font-semibold text-white">{step.title}</p>
                  <p className="mt-1 text-xs text-slate-400">{step.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- Roles ---------- */
const roles = [
  {
    icon: Package,
    title: 'Customers',
    tagline: 'Send parcels with confidence',
    points: [
      'Create shipments with a guided wizard',
      'Pay securely with Stripe',
      'Watch the live route and timeline',
      'Cancel before pickup',
    ],
  },
  {
    icon: Truck,
    title: 'Couriers',
    tagline: 'Deliver and get paid',
    points: [
      'See your assigned deliveries',
      'Update status with valid next steps only',
      'Track earnings with charts',
      'Switch availability instantly',
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Admins',
    tagline: 'Run the whole network',
    points: [
      'Live analytics and revenue charts',
      'Assign couriers to shipments',
      'Manage roles and block users',
      'Audit log of sensitive actions',
    ],
  },
];

export function RolesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Built for everyone"
        title="One platform, three dashboards"
        description="Each role gets its own workspace with exactly the tools it needs."
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {roles.map((role, i) => (
          <Reveal key={role.title} delay={i * 100}>
            <div className="flex h-full flex-col rounded-2xl border bg-white p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <role.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-xl font-bold text-slate-900">{role.title}</h3>
              <p className="text-sm text-slate-500">{role.tagline}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {role.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    {point}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="mt-8">
                <Button variant="outline" className="w-full">
                  Try the {role.title.slice(0, -1).toLowerCase()} demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- Why us ---------- */
const reasons = [
  {
    title: 'Strict status pipeline',
    text: 'A state machine rejects invalid jumps, so a parcel can never skip a stage.',
  },
  {
    title: 'Transaction-safe assignment',
    text: 'Courier assignment is atomic, so one courier is never double-booked.',
  },
  {
    title: 'Verified payments',
    text: 'Payments are confirmed by signed Stripe webhooks, not by the browser.',
  },
  {
    title: 'Everything is auditable',
    text: 'Status changes and admin actions are recorded with who did what, and when.',
  },
];

const tiles = [
  { value: '11', label: 'tracked status stages' },
  { value: '3', label: 'role-based dashboards' },
  { value: '24/7', label: 'online parcel tracking' },
  { value: 'Stripe', label: 'secured card payments' },
];

export function WhySection() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-500">
            Why choose us
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Reliable by design, not by promise
          </h2>
          <ul className="mt-8 space-y-5">
            {reasons.map((r) => (
              <li key={r.title} className="flex gap-4">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold text-slate-900">{r.title}</p>
                  <p className="text-sm text-slate-500">{r.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={150}>
          <div className="grid grid-cols-2 gap-4">
            {tiles.map((t) => (
              <div key={t.label} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <p className="text-3xl font-bold text-blue-600">{t.value}</p>
                <p className="mt-1 text-sm text-slate-500">{t.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
const faqs = [
  {
    q: 'How do I track my parcel?',
    a: 'Enter your tracking code on the Track page. You do not need an account to see the live route and history.',
  },
  {
    q: 'When can I cancel a shipment?',
    a: 'Until a courier picks it up, as long as it has not been paid for.',
  },
  {
    q: 'How is the price calculated?',
    a: 'A base fee of ৳60 plus ৳15 for every kilogram of parcel weight.',
  },
  {
    q: 'How do I pay?',
    a: 'By card through Stripe Checkout. Your payment is confirmed automatically once Stripe notifies us.',
  },
  {
    q: 'What happens if a delivery fails?',
    a: 'The courier marks it as failed with a note, then either retries the delivery or returns it to the sender.',
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <SectionHeading eyebrow="FAQ" title="Questions, answered" />
      <div className="space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="group rounded-xl border bg-white p-5 open:shadow-md">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900">
              {f.q}
              <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ---------- CTA ---------- */
export function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-900 px-8 py-16 text-center text-white">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />
        <h2 className="relative text-3xl font-bold sm:text-4xl">Ready to ship your first parcel?</h2>
        <p className="relative mx-auto mt-3 max-w-xl text-blue-100">
          Create a free account, book a shipment, and watch it move across the map.
        </p>
        <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/register">
            <Button size="lg" className="bg-amber-400 text-slate-950 hover:bg-amber-300">
              Create free account
            </Button>
          </Link>
          <Link href="/track">
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              Track a shipment
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}