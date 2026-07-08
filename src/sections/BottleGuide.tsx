import { useEffect } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const bottles = [
  // Note: the UI displays Height/Diameter from this dataset. Since the original dataset was kg-based,
  // these dimensions/best-for suggestions reuse the closest existing entries to keep the layout consistent.
  { size: '4.5 lb', name: 'Propane', bestFor: 'Camping, small heaters, single-burner cookers', height: '34cm', diameter: '20cm' },
  { size: '5 lb', name: 'Propane', bestFor: 'Caravans, motorhomes, small BBQs', height: '49cm', diameter: '25cm' },

  { size: '10 lb', name: 'Propane', bestFor: 'Home heating, large BBQs, patio heaters', height: '58cm', diameter: '31cm' },
  { size: '11 lb', name: 'Butane', bestFor: 'Indoor heaters, cooking, conservatory heating', height: '59cm', diameter: '31cm' },

  { size: '20 lb', name: 'Propane', bestFor: 'Commercial heating, large cookers, static caravans', height: '81cm', diameter: '31cm' },
  { size: '30 lb', name: 'Propane', bestFor: 'Large homes, commercial kitchens, industrial use', height: '129cm', diameter: '38cm' },

  { size: '33 lb', name: 'Propane', bestFor: 'Large homes, commercial kitchens, industrial use', height: '129cm', diameter: '38cm' },
  { size: '40 lb', name: 'Propane', bestFor: 'Large homes, commercial kitchens, industrial use', height: '129cm', diameter: '38cm' },
  { size: '50 lb', name: 'Propane', bestFor: 'Large homes, commercial kitchens, industrial use', height: '129cm', diameter: '38cm' },
  { size: '60 lb', name: 'Propane', bestFor: 'Large homes, commercial kitchens, industrial use', height: '129cm', diameter: '38cm' },
  { size: '100 lb', name: 'Propane', bestFor: 'Large homes, commercial kitchens, industrial use', height: '129cm', diameter: '38cm' },
];

export default function BottleGuide() {
  const sectionRef = useScrollAnimation();

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const imgWrap = sectionRef.current!.querySelector('[data-bottle-hero-image]');
      if (!imgWrap) return;

      const mm = gsap.matchMedia();

      mm.add('(min-width: 768px)', () => {
        gsap.fromTo(
          imgWrap,
          { opacity: 0, y: 40, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              end: 'top 40%',
              scrub: true,
            },
          }
        );
      });

      return () => mm.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, [sectionRef]);

  return (
    <section id="bottles" ref={sectionRef} className="w-full bg-warm-sand py-20 md:py-40">
      <div className="max-w-[1280px] mx-auto px-5 md:px-12">
        <h2
          className="font-display text-[32px] md:text-[56px] text-warm-charcoal text-center mb-6 md:mb-4"
          data-animate
          data-y="40"
          data-duration="0.8"
        >
          Propane Tank - Propane &amp; Natural Gas in Norwood, MA
        </h2>

        <div
          className="flex justify-center mb-10 md:mb-6"
          data-bottle-hero-image
        >
          <img
            src="/368-400w.webp"
            alt="Propane tank and gas service in Norwood, MA"
            className="w-full max-w-[520px] h-auto rounded-xl shadow-sm"
            loading="lazy"
          />
        </div>

        <p
          className="font-body text-center text-warm-gray/90 max-w-[820px] mx-auto mb-10 md:mb-20"
          data-animate
          data-y="30"
          data-duration="0.7"
        >
          Choosing the right bottle is easy—tell us what you’re powering, and we’ll recommend the correct size. We refill propane and natural gas
          tanks across Norwood in every capacity.
        </p>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Bottle Rows + Guidance */}
          <div className="w-full">
            <div
              className="bg-white/70 backdrop-blur rounded-xl border border-border-light px-6 py-5 mb-8"
              data-animate
              data-y="25"
              data-duration="0.7"
            >
              <p className="font-display text-lg md:text-xl text-warm-charcoal mb-3">American Standards: What you can expect</p>
              <ul className="font-body text-sm md:text-base text-warm-gray/90 space-y-2">
                <li>• Refill and exchange options based on availability</li>
                <li>• Clear guidance on sizing for heaters, BBQs, and home systems</li>
                <li>• Fast local delivery around Norwood, MA</li>
              </ul>
              <p className="font-mono text-xs text-warm-muted mt-3">
                Tip: If you’re unsure, call with your appliance type—our team will help you pick the right bottle.
              </p>
            </div>

            {bottles.map((b) => (
              <div
                key={b.size + b.name}
                className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 py-6 border-b border-border-light px-4 -mx-4 rounded-lg hover:bg-white transition-colors duration-200"
                data-animate
                data-x="40"
                data-stagger="0.12"
                data-duration="0.7"
              >
                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                  <span className="font-mono text-xs uppercase bg-burnt-orange text-white rounded-pill px-3.5 py-1.5 tracking-wide">
                    {b.size}
                  </span>
                  <span className="font-display text-xl md:text-2xl text-warm-charcoal">
                    {b.name}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm md:text-base text-warm-gray">
                    Best for: <span className="text-warm-charcoal font-medium">{b.bestFor}</span>
                  </p>

                  <p className="font-body text-sm md:text-base text-warm-gray mt-2">
                    We refill propane &amp; natural gas tanks in Norwood, MA — in every size.
                  </p>

                  <p className="font-mono text-xs text-warm-muted mt-2">
                    Height: {b.height} · Diameter: {b.diameter}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
