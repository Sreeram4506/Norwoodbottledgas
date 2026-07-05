import { useEffect, useMemo, useRef, useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const testimonials = [
  {
    quote: 'Norwood Bottled Gas is always on time and incredibly friendly. They make sure everything is connected properly before they go. Great service.',
    name: 'Margaret H.',
    location: 'Norwood, MA',
    image: '/images/image-testimonial-1.jpg',
  },
  {
    quote: "We can’t afford to run out of gas. Norwood Bottled Gas keeps us stocked and makes delivery and exchange simple. Reliable and professional.",
    name: 'David T.',
    location: 'Norwood, MA',
    image: '/images/image-testimonial-2.jpg',
  },
  {
    quote: 'Fast delivery, clear communication, and they always treat our home with respect. Highly recommend.',
    name: 'Sarah K.',
    location: 'Norwood, MA',
    image: '/images/image-testimonial-1.jpg',
  },
  {
    quote: 'They helped us choose the right bottle size and made the exchange effortless. Excellent customer service.',
    name: 'Michael R.',
    location: 'Norwood, MA',
    image: '/images/image-testimonial-2.jpg',
  },
  {
    quote: 'Dependable, affordable, and never a hassle. Our family counts on them every season.',
    name: 'Jessica P.',
    location: 'Norwood, MA',
    image: '/images/image-testimonial-1.jpg',
  },
  {
    quote: 'Professional and courteous every time. The winter hours info was spot-on and we felt prepared.',
    name: 'William S.',
    location: 'Norwood, MA',
    image: '/images/image-testimonial-2.jpg',
  },
];

export default function Testimonials() {
  const sectionRef = useScrollAnimation();

  // Duplicate items so we can loop seamlessly.
  const items = useMemo(() => [...testimonials, ...testimonials], []);

  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  // Translate track using RAF (scrollLeft with direction:rtl can be inconsistent).
  const [x, setX] = useState(0);

  useEffect(() => {
    const trackEl = trackRef.current;
    if (!trackEl) return;

    let last = performance.now();
    const speed = 0.035; // px/ms (~35px/sec)

    const step = (now: number) => {
      const dt = now - last;
      last = now;

      setX((prev) => {
        const next = prev - dt * speed;

        // Reset after shifting past half of the duplicated track.
        const half = trackEl.scrollWidth / 2;
        if (Math.abs(next) >= half) return 0;

        return next;
      });

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-warm-cream py-20 md:py-40">
      <div className="max-w-[960px] mx-auto px-5 md:px-12">
        <h2
          className="font-display text-[32px] md:text-[56px] text-warm-charcoal text-center mb-12 md:mb-16"
          data-animate
          data-y="40"
          data-duration="0.8"
        >
          What Our Customers Say
        </h2>

        <div className="relative" data-animate data-y="50" data-duration="0.8">
          <div className="overflow-hidden">
            <div
              ref={trackRef}
              className="flex gap-6 md:gap-12"
              style={{ transform: `translateX(${x}px)` }}
            >
              {items.map((t, idx) => (
                <div
                  key={`${t.name}-${idx}`}
                  className="min-w-[86%] sm:min-w-[420px] bg-white rounded-xl shadow-card p-8 md:p-12 relative"
                  data-animate
                  data-stagger="0.25"
                  data-duration="0.8"
                >
                  <span
                    className="absolute top-4 left-6 font-display text-[120px] leading-none text-burnt-orange/[0.15] select-none pointer-events-none"
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>

                  <p className="font-display text-lg md:text-xl text-warm-charcoal leading-relaxed italic relative z-10">
                    {t.quote}
                  </p>

                  <div className="flex items-center gap-4 mt-8">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-14 h-14 rounded-full object-cover"
                      loading="lazy"
                    />
                    <div>
                      <p className="font-body text-base font-medium text-warm-charcoal">{t.name}</p>
                      <p className="font-body text-sm text-warm-muted">{t.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 h-0.5 bg-warm-muted/20 rounded-full" aria-hidden="true" />
      </div>
    </section>
  );
}
