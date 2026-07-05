import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import FloatingCTA from '@/components/FloatingCTA';
import Hero from '@/sections/Hero';
import TrustBar from '@/sections/TrustBar';
import Services from '@/sections/Services';
import BottleGuide from '@/sections/BottleGuide';
import HowItWorks from '@/sections/HowItWorks';
import CoverageArea from '@/sections/CoverageArea';
import Testimonials from '@/sections/Testimonials';
import ContactCTA from '@/sections/ContactCTA';
import Footer from '@/sections/Footer';
import AdminContact from '@/pages/AdminContact';

function getPathname() {
  try {
    return window.location.pathname || '/';
  } catch {
    return '/';
  }
}

export default function App() {
  const [pathname, setPathname] = useState(getPathname());

  useEffect(() => {
    const onPopState = () => setPathname(getPathname());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  if (pathname === '/admin') {
    return <AdminContact />;
  }

  return (
    <div className="relative">
      <Navigation />
      <main>
        <Hero />
        <TrustBar />
        <Services />
        <BottleGuide />
        <HowItWorks />
        <CoverageArea />
        <Testimonials />
        <ContactCTA />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
