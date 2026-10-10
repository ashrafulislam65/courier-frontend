'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const SLIDES = [
  {
    image: '/images/hero-1.jpg',
    eyebrow: 'Courier & Parcel Delivery',
    top: 'Fastest & Secured',
    title: 'Courier Delivery',
    text: 'Book online, pay securely, and follow your parcel hub to hub until it reaches the door.',
  },
  {
    image: '/images/hero-2.jpg',
    eyebrow: 'Hub-to-Hub Network',
    top: 'Smart Routing',
    title: 'Across Bangladesh',
    text: 'Every shipment follows a strict pipeline, with a live route map from pickup to delivery.',
  },
  {
    image: '/images/hero-3.jpg',
    eyebrow: 'Proof of Delivery',
    top: 'Delivered Only',
    title: 'With Your Code',
    text: 'A parcel is marked delivered only when the courier enters the code you share at the door.',
  },
];

export default function HeroSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (dir: 1 | -1) => setActive((i) => (i + dir + SLIDES.length) % SLIDES.length),
    []
  );

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => go(1), 6500);
    return () => clearInterval(timer);
  }, [paused, go]);

  const slide = SLIDES[active];

  return (
    <section
      className="relative h-[600px] overflow-hidden bg-neutral-950 text-white sm:h-[660px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {SLIDES.map((s, i) => (
        <div
          key={s.image}
          className={cn(
            'absolute inset-0 transition-opacity duration-1000',
            i === active ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Image
            src={s.image}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            quality={75}
            className={cn('object-cover', i === active && 'animate-kenburns')}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-neutral-950/55" />
      <div className="absolute inset-y-0 left-0 hidden w-[72%] bg-neutral-950/85 [clip-path:polygon(0_0,100%_0,72%_100%,0_100%)] md:block" />

      <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 pb-24 sm:px-6 lg:px-8">
        <div key={active} className="max-w-2xl">
          <p className="animate-fade-up text-sm font-semibold uppercase tracking-widest text-brand-400">
            {slide.eyebrow}
          </p>
          <h1 className="mt-4">
            <span
              className="animate-fade-up block text-3xl font-semibold sm:text-4xl"
              style={{ animationDelay: '120ms' }}
            >
              {slide.top}
            </span>
            <span
              className="animate-fade-up block text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl"
              style={{ animationDelay: '240ms' }}
            >
              {slide.title}
            </span>
          </h1>
          <p
            className="animate-fade-up mt-5 max-w-lg text-neutral-300"
            style={{ animationDelay: '360ms' }}
          >
            {slide.text}
          </p>

          <div
            className="animate-fade-up mt-8 flex flex-wrap items-center gap-5"
            style={{ animationDelay: '480ms' }}
          >
            <Link href="#services">
              <Button size="lg" className="px-8 font-semibold uppercase tracking-wide">
                Discover more
              </Button>
            </Link>
            <span className="flex items-center gap-3 text-sm font-semibold">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-white/10 ring-1 ring-white/20">
                <Phone className="h-4 w-4" />
              </span>
              +880 1700-000000
            </span>
          </div>
        </div>
      </div>

      <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 flex-col gap-3 sm:flex lg:right-10">
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => go(1)}
          className="grid h-12 w-12 place-items-center rounded-full bg-white text-neutral-900 transition hover:bg-brand-600 hover:text-white"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => go(-1)}
          className="grid h-12 w-12 place-items-center rounded-full bg-white text-neutral-900 transition hover:bg-brand-600 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="absolute bottom-28 left-4 flex gap-2 sm:left-6 lg:left-8">
        {SLIDES.map((s, i) => (
          <button
            key={s.image}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setActive(i)}
            className={cn(
              'h-1.5 rounded-full transition-all',
              i === active ? 'w-10 bg-brand-500' : 'w-4 bg-white/40 hover:bg-white/70'
            )}
          />
        ))}
      </div>
    </section>
  );
}