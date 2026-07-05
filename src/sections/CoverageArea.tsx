import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { MapPin } from 'lucide-react';

const areas = [
  'Westwood',
  'Canton',
  'Dedham',
  'West Roxbury',
  'Hyde Park',
  'Sharon',
  'Walpole',
  'Norfolk',
  'Millis',
  'Newton',
  'Brookline',
  'Stoughton',
  'Wrentham',
  'Needham',
  'Chestnut Hill',
  'Dover',
  'Sherborn',
  'Medfield',
  'Bellingham',
];

export default function CoverageArea() {
  const sectionRef = useScrollAnimation();

  return (
    <section id="areas" ref={sectionRef} className="w-full bg-warm-sand py-20 md:py-40">
      <div className="max-w-[1280px] mx-auto px-5 md:px-12">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          {/* Interactive Map */}
          <div
            className="w-full lg:w-1/2"
            data-animate
            data-y="40"
            data-scale="0.95"
            data-duration="1"
          >
            <iframe
              title="Delivery coverage map - Norwood, MA"
              className="w-full rounded-xl shadow-card"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-71.12%2C42.123%2C-70.86%2C42.23&layer=mapnik&marker=42.176%2C-70.99"
              style={{ border: 0, height: '420px' }}
            />
          </div>

          {/* Content */}
          <div className="w-full lg:w-1/2">
            <h2
              className="font-display text-[32px] md:text-[56px] text-warm-charcoal"
              data-animate
              data-y="40"
              data-duration="0.8"
            >
              Proudly Serving Norwood & Surrounding Areas
            </h2>

            <p
              className="font-body text-lg md:text-xl text-warm-gray mt-5 leading-relaxed"
              data-animate
              data-y="30"
              data-delay="0.15"
              data-duration="0.8"
            >
              We proudly serve Norwood and all surrounding areas including: Westwood, Canton, Dedham, West Roxbury, Hyde Park, Sharon, Walpole, Norfolk, Millis, Newton, Brookline, Stoughton, Wrentham, Needham, Chestnut Hill, Dover, Sherborn, Medfield, and Bellingham.
            </p>

            {/* Area List */}
            <div
              className="grid grid-cols-2 gap-3 mt-8"
              data-animate
              data-x="20"
              data-stagger="0.05"
              data-duration="0.5"
            >
              {areas.map((area) => (
                <div key={area} className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-burnt-orange shrink-0" />
                  <span className="font-body text-sm md:text-base text-warm-charcoal">{area}</span>
                </div>
              ))}
            </div>

            <div data-animate data-y="30" data-delay="0.4" data-duration="0.8">
              <a
                href="tel:01709510297"
                className="inline-flex items-center gap-2 bg-burnt-orange text-white rounded-pill px-8 py-3.5 text-base font-medium hover:bg-burnt-orange-hover hover:shadow-float hover:-translate-y-0.5 transition-all duration-300 mt-10"
                style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
              >
                <MapPin size={16} />
                Call to Check Your Area
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
