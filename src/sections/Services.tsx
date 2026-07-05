import { useEffect, useMemo, useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const services = [
  {
    image: '/images/image-service-home.jpg',
    title: 'Propane Refills',
    description:
      'We refill all types of tanks in every size — whether it’s an RV, food truck, or a tank for your home.',
    bottles: 'Propane Refills · Propane Tanks',
    borderColor: '#D4652A',
    details:
      'Look no further than Norwood Bottled Gas in Norwood, MA for all your propane and grill needs. Our refill station is equipped to fill propane tanks of all sizes. We fill RV\'s, food trucks, canteen trucks, campers, and specialty tanks. If the tank is mobile, we can fill it too! We fill tanks for bbq\'s, grills, forklifts, mosquito magnets, barbecues, torches, pig cookers, smokers. We sell new propane tanks in all various sizes. Including 4.5 lb, 5 lb, 10 lb, 11 lb, 20 lb, 30 lb, 33 lb, 40 lb, 50 lb, 60 lb, 100 lb propane tanks.',
  },
  {
    image: '/images/image-service-bbq.jpg',
    title: 'Propane Delivery & Exchange',
    description:
      'We provide propane delivery & exchange so you always have the gas you need when you need it.',
    bottles: 'Propane Delivery & Exchange',
    borderColor: '#C4A35A',
    details:
      'Keep things cooking at home. With our delivery and exchange program, all you need to do is leave your empty tank in an accessible area and we will swap it out with a full tank. No need to be home, we will even disconnect the empty tank from your grill and reconnect a full tank! For more information visit: Emptygrilltank.com',
  },
  {
    image: '/images/image-service-commercial.jpg',
    title: 'Grill Sales, Service & Repairs',
    description:
      'For grill enthusiasts and businesses alike — we offer grill sales, parts, service, and repairs.',
    bottles: 'Grill Sales & Parts · Grills Service & Repairs',
    borderColor: '#5A7D6C',
    details:
      'Keep your barbecue grills in top condition with our help. Our technicians service and repair all major brands at your location. For your grilling needs, Norwood Bottled Gas carries a large variety of barbecue parts and supplies, too. We are a proud supplier of grills, grill accessories, and replacement parts from the Modern Home Products® line.',
  },
];

export default function Services() {
  const sectionRef = useScrollAnimation();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activePopupTitle, setActivePopupTitle] = useState<string | null>(null);

  const popupDetails = useMemo(() => {
    if (!activePopupTitle) return null;
    return services.find((s) => s.title === activePopupTitle)?.details ?? null;
  }, [activePopupTitle]);

  useEffect(() => {
    if (!isPopupOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsPopupOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isPopupOpen]);

  return (
    <section id="services" ref={sectionRef} className="w-full bg-warm-cream py-20 md:py-40">
      <div className="max-w-[1280px] mx-auto px-5 md:px-12">
        <h2
          className="font-display text-[32px] md:text-[56px] text-warm-charcoal text-center mb-10 md:mb-16"
          data-animate
          data-y="40"
          data-duration="0.8"
        >
          OUR SERVICES INCLUDE:
        </h2>

        {isPopupOpen && activePopupTitle && popupDetails && (
          <div
            className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-5"
            role="dialog"
            aria-modal="true"
            aria-label={`${activePopupTitle} details`}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setIsPopupOpen(false);
            }}
          >
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl text-warm-charcoal">
                    {services.find((s) => s.title === activePopupTitle)?.bottles ?? activePopupTitle}
                  </h3>
                  <p className="font-body text-sm text-warm-gray mt-2">
                    Norwood Bottled Gas in Norwood, MA
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPopupOpen(false)}
                  className="text-warm-charcoal hover:text-burnt-orange transition-colors"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="mt-5">
                <p className="font-body text-base text-warm-gray leading-relaxed">
                  {popupDetails.split('\n').map((line, idx) => (
                    <span key={`${idx}-${line}`}>
                      {line}
                      {idx < popupDetails.split('\n').length - 1 ? <br /> : null}
                    </span>
                  ))}
                </p>
              </div>

              <div className="mt-7 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsPopupOpen(false);
                    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-burnt-orange text-white rounded-pill px-6 py-2.5 font-medium hover:bg-burnt-orange-hover transition-colors"
                >
                  Contact
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {services.map((s) => {
            const isPopupCard = Boolean(s.details);

            return (
              <div
                key={s.title}
                role={isPopupCard ? 'button' : undefined}
                tabIndex={isPopupCard ? 0 : undefined}
                aria-haspopup={isPopupCard ? 'dialog' : undefined}
                onClick={() => {
                  if (!isPopupCard) return;
                  setActivePopupTitle(s.title);
                  setIsPopupOpen(true);
                }}
                onKeyDown={(e) => {
                  if (!isPopupCard) return;
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActivePopupTitle(s.title);
                    setIsPopupOpen(true);
                  }
                }}
                className="bg-white rounded-xl shadow-card overflow-hidden hover:-translate-y-1.5 hover:shadow-float transition-all duration-350 group"
                style={{
                  borderTop: `4px solid ${s.borderColor}`,
                  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: isPopupCard ? 'pointer' : 'default',
                }}
                data-animate
                data-y="60"
                data-stagger="0.2"
                data-duration="0.8"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                <div className="p-6 md:p-8">
                  <h3 className="font-display text-xl md:text-2xl text-warm-charcoal">
                    {s.title}
                  </h3>
                  <p className="font-body text-base text-warm-gray mt-3 leading-relaxed">
                    {s.description}
                  </p>
                  <p className="font-mono text-xs uppercase tracking-[0.04em] text-warm-muted mt-5">
                    {s.bottles}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
