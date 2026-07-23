import { useMemo } from 'react';
import { useDiscountDetails } from '@/config/discountContent';

function normalizeMessages(messages: string[]) {
  return messages
    .map((m) => (m ?? '').trim())
    .filter(Boolean)
    .slice(0, 10);
}

export default function DiscountScroller() {
  const { messages } = useDiscountDetails();
  const safeMessages = useMemo(() => normalizeMessages(messages), [messages]);

  // Duplicate to make seamless scrolling when the track loops.
  const loopMessages = useMemo(() => {
    const base = safeMessages.length ? safeMessages : ['Check our latest offers!'];
    return [...base, ...base];
  }, [safeMessages]);

  return (
    <section className="w-full bg-warm-sand py-8 md:py-10">
      {/* full-bleed scroller (edge-to-edge to viewport) */}
      <div className="w-screen max-w-none -ml-[calc((100vw-100%)/2)]">
        <div className="relative overflow-hidden rounded-2xl bg-white/60 border border-white/60">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-white/80 via-transparent to-white/80" />
          <div className="relative py-4">
            <div
              className="flex gap-4 whitespace-nowrap items-center animate-discount-scroll"
              style={{ willChange: 'transform' }}
            >
              {loopMessages.map((m, idx) => (
                <div
                  key={`${m}-${idx}`}
                  className="flex items-center gap-3 px-4 md:px-6 py-3 rounded-full bg-warm-sand/70 border border-warm-muted/30"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-burnt-orange" aria-hidden="true" />
                  <span className="font-body text-warm-charcoal text-sm md:text-base">{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 text-center font-body text-xs text-warm-charcoal/70">
        Offers shown may vary—call us for current deals.
      </p>

      <style>{`
        @keyframes discountScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-discount-scroll {
          animation: discountScroll 24s linear infinite;
        }
      `}</style>
    </section>
  );
}
