import { useRef } from 'react';

export default function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

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
          className="font-display text-[40px] md:text-[72px] text-white leading-[0.95] tracking-[-0.03em]"
        >
          WE REFILL PROPANE TANKS OF ALL SIZES!
        </h1>

        <p
          ref={subtitleRef}
          className="font-body text-lg md:text-xl text-white mt-6 max-w-[520px] mx-auto leading-relaxed"
        >
          PROPANE REFILL STATION IN NORWOOD, MA
        </p>

        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <a
            href="tel:17817622331"
            className="w-full sm:w-auto bg-burnt-orange text-white rounded-pill px-8 py-3.5 text-base font-medium hover:bg-burnt-orange-hover hover:shadow-float hover:-translate-y-0.5 transition-all duration-300 text-center"
            style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            CALL US: (781) 762-2331
          </a>

          <a
            href="#contact"
            onClick={(e) => handleScrollTo(e, '#contact')}
            className="w-full sm:w-auto border-[1.5px] border-warm-charcoal text-warm-charcoal rounded-pill px-8 py-3.5 text-base font-medium hover:bg-warm-charcoal hover:text-white transition-all duration-300 text-center"
          >
            Location &amp; Contact
          </a>
        </div>
      </div>

      {/* Scroll Indicator (static) */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center opacity-100"
      >
        <div className="relative w-[1px] h-10 bg-warm-muted/40 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-burnt-orange" />
        </div>
      </div>
    </section>
  );
}
