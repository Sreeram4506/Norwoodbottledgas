import { useScrollAnimation, useCountUp } from '@/hooks/useScrollAnimation';

const metrics = [
  { value: 20, suffix: '+', label: 'Years Serving Norwood' },
  { value: 40, suffix: '+', label: 'Towns Served' },
  { value: 50, suffix: 'K+', label: 'Bottles Delivered' },
  { value: 99, suffix: '%', label: 'Happy Customers' },
];

function MetricItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const numberRef = useCountUp(value, suffix);

  return (
    <div className="text-center" data-animate data-y="40" data-duration="0.8">
      <span
        ref={numberRef}
        className="font-display text-[48px] md:text-[56px] text-burnt-orange leading-none tracking-[-0.03em]"
      >
        0{suffix}
      </span>
      <p className="font-body text-xs uppercase tracking-[0.04em] text-warm-muted mt-2">
        {label}
      </p>
    </div>
  );
}

export default function TrustBar() {
  const sectionRef = useScrollAnimation();

  return (
    <section ref={sectionRef} className="w-full bg-warm-sand py-20 md:py-20">
      <div className="max-w-[1280px] mx-auto px-5 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-8">
          {metrics.map((m) => (
            <MetricItem key={m.label} value={m.value} suffix={m.suffix} label={m.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
