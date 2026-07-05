import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Package, PhoneCall, Truck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '1',
    title: 'Choose Your Bottle',
    description:
      "Not sure which one? Use our bottle guide above or give us a call — we’ll help you pick the perfect size.",
    icon: Package,
  },
  {
    number: '2',
    title: 'Call or Schedule Delivery',
    description:
      'Call (781) 762-2331 or fill out the contact form. We’ll confirm your request and delivery timing right away.',
    icon: PhoneCall,
  },
  {
    number: '3',
    title: 'We Deliver to Your Door',
    description:
      'Our friendly driver delivers your gas bottle across Norwood and surrounding areas. We can connect it properly and take away your empties.',
    icon: Truck,
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const circlesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        sectionRef.current!.querySelector('[data-title]'),
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
        }
      );

      // Line draw animation
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1, duration: 1, ease: 'power2.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
          }
        );
      }

      // Circles pop in
      circlesRef.current.forEach((circle, i) => {
        if (!circle) return;
        gsap.fromTo(
          circle,
          { scale: 0 },
          {
            scale: 1, duration: 0.5, ease: 'back.out(1.7)', delay: 0.3 + i * 0.3,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
          }
        );
      });

      // Step content fade in
      const stepContents = sectionRef.current!.querySelectorAll('[data-step-content]');
      stepContents.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.5 + i * 0.2,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-warm-cream py-20 md:py-40">
      <div className="max-w-[960px] mx-auto px-5 md:px-12">
        <h2
          data-title
          className="font-display text-[32px] md:text-[56px] text-warm-charcoal text-center mb-16 md:mb-20 opacity-0"
        >
          Gas in Three Easy Steps
        </h2>

        <div className="relative">
          {/* Connecting line - desktop only */}
          <div
            ref={lineRef}
            className="hidden md:block absolute top-8 left-[16.67%] right-[16.67%] h-[1px] bg-border-medium origin-left"
          />

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="flex md:flex-col items-start md:items-center gap-4 md:gap-0">
                  {/* Number circle */}
                  <div
                    ref={(el) => { circlesRef.current[i] = el; }}
                    className="shrink-0 w-16 h-16 rounded-full border-2 border-burnt-orange bg-warm-cream flex items-center justify-center z-10"
                  >
                    <Icon size={24} className="text-burnt-orange" />
                  </div>

                  {/* Content */}
                  <div
                    data-step-content
                    className="md:text-center md:mt-6 opacity-0"
                  >
                    <div className="font-mono text-xs text-burnt-orange uppercase tracking-[0.04em] mb-1">
                      Step {step.number}
                    </div>
                    <h3 className="font-display text-xl md:text-2xl text-warm-charcoal">
                      {step.title}
                    </h3>
                    <p className="font-body text-sm md:text-base text-warm-gray mt-3 leading-relaxed max-w-[280px] md:mx-auto">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
