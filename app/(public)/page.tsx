import HeroSlider from '@/components/home/HeroSlider';
import MapShowcase from '@/components/home/MapShowcase';
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

export default function HomePage() {
  return (
    <div>
      <HeroSlider />

      <div id="quote" className="relative z-10 mx-auto -mt-24 max-w-4xl scroll-mt-24 px-4 sm:px-6">
        <TrackQuoteWidget />
      </div>

      <TrustStrip />
      <div id="services" className="scroll-mt-20">
        <ServicesSection />
      </div>
      <LifecycleSection />
      <RolesSection />
      <MapShowcase />
      <WhySection />
      <FaqSection />
      <CtaSection />
    </div>
  );
}