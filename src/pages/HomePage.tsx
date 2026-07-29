import Navigation from '@/components/Navigation';
import FloatingCTA from '@/components/FloatingCTA';
import Hero from '@/sections/Hero';
import DiscountScroller from '@/sections/DiscountScroller';
import TrustBar from '@/sections/TrustBar';
import Services from '@/sections/Services';
import BottleGuide from '@/sections/BottleGuide';
import GrillSalesTeaser from '@/sections/GrillSalesTeaser';
import HowItWorks from '@/sections/HowItWorks';
import CoverageArea from '@/sections/CoverageArea';
import Testimonials from '@/sections/Testimonials';
import FAQ from '@/sections/FAQ';
import ContactCTA from '@/sections/ContactCTA';
import Footer from '@/sections/Footer';

export default function HomePage() {
  return (
    <div className="relative">
      <Navigation />
      <main>
        <Hero />
        <DiscountScroller />
        <TrustBar />
        <Services />
        <BottleGuide />
        <GrillSalesTeaser />
        <HowItWorks />
        <CoverageArea />
        <Testimonials />
        <FAQ />
        <ContactCTA />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
