import { useRef } from 'react';

/**
 * Background/scroll animations disabled.
 * Components can still use the returned ref, but no GSAP/ScrollTrigger work is performed.
 */
export function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  return ref;
}

/**
 * Count-up animations disabled (kept as a no-op to preserve API expected by components).
 */
export function useCountUp(_endValue: number, _suffix: string = '') {
  const ref = useRef<HTMLSpanElement>(null);
  return ref;
}
