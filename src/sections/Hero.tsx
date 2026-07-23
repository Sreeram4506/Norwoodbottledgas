import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useContactDetails } from '@/config/siteContent';

export default function Hero() {
  const contact = useContactDetails();
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(
        [headlineRef.current, subtitleRef.current, scrollIndicatorRef.current, ...(ctaRef.current ? Array.from(ctaRef.current.children) : [])],
        { opacity: 1 }
      );
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(headlineRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9 })
        .fromTo(subtitleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.55')
        .fromTo(
          ctaRef.current ? Array.from(ctaRef.current.children) : [],
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 },
          '-=0.4'
        )
        .fromTo(scrollIndicatorRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.2');
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative w-full min-h-[100dvh] overflow-hidden flex items-center justify-center">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-[0]"
        src="/hero-video.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {/* Radial Gradient Overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(250, 246, 241, 0.10) 0%, rgba(250, 246, 241, 0.35) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-[2] text-center max-w-[720px] mx-auto px-5">
        <h1
          ref={headlineRef}
          className="font-display text-[40px] md:text-[72px] text-white leading-[0.95] tracking-[-0.03em] opacity-0"
        >
          WE REFILL PROPANE TANKS OF ALL SIZES!
        </h1>

        <p
          ref={subtitleRef}
          className="font-body text-lg md:text-xl text-white mt-6 max-w-[520px] mx-auto leading-relaxed opacity-0"
        >
          PROPANE REFILL STATION IN NORWOOD, MA
        </p>

        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <a
            href={contact.phoneHref}
            className="w-full sm:w-auto bg-burnt-orange text-white rounded-pill px-8 py-3.5 text-base font-medium hover:bg-burnt-orange-hover hover:shadow-float hover:-translate-y-0.5 transition-all duration-300 text-center opacity-0"
            style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            CALL US: {contact.phoneDisplay}
          </a>

          <a
            href="#contact"
            onClick={(e) => handleScrollTo(e, '#contact')}
            className="w-full sm:w-auto border-[1.5px] border-warm-charcoal text-warm-charcoal rounded-pill px-8 py-3.5 text-base font-medium hover:bg-warm-charcoal hover:text-white transition-all duration-300 text-center opacity-0"
          >
            Location &amp; Contact
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center opacity-0"
      >
        <div className="relative w-[1px] h-10 bg-warm-muted/40 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-burnt-orange animate-scroll-dot motion-reduce:animate-none" />
        </div>
      </div>
    </section>
  );
}
