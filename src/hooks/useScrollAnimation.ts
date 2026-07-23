import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Drives the `data-animate` contract used across sections:
 *   data-x / data-y      start offset in px (animates to 0)
 *   data-scale           start scale (animates to 1)
 *   data-delay           start delay in seconds
 *   data-duration        tween duration in seconds (default 0.7)
 *   data-stagger         groups sibling elements under the same parent into
 *                        one staggered reveal (value = seconds between items)
 */
export function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    if (prefersReducedMotion()) {
      gsap.set(ref.current.querySelectorAll('[data-animate]'), { opacity: 1, x: 0, y: 0, scale: 1, clearProps: 'transform' });
      return;
    }

    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray<HTMLElement>('[data-animate]', ref.current!);
      const grouped = new Map<Element, HTMLElement[]>();
      const solo: HTMLElement[] = [];

      elements.forEach((el) => {
        const stagger = el.dataset.stagger;
        const parent = el.parentElement;
        if (stagger && parent) {
          const bucket = grouped.get(parent) ?? [];
          bucket.push(el);
          grouped.set(parent, bucket);
        } else {
          solo.push(el);
        }
      });

      const reveal = (el: HTMLElement) => {
        const x = parseFloat(el.dataset.x || '0');
        const y = parseFloat(el.dataset.y || '0');
        const scale = el.dataset.scale ? parseFloat(el.dataset.scale) : undefined;
        const delay = parseFloat(el.dataset.delay || '0');
        const duration = parseFloat(el.dataset.duration || '0.7');
        return {
          from: { opacity: 0, x, y, ...(scale !== undefined ? { scale } : {}) },
          to: { opacity: 1, x: 0, y: 0, ...(scale !== undefined ? { scale: 1 } : {}), delay, duration, ease: 'power3.out' },
        };
      };

      solo.forEach((el) => {
        const { from, to } = reveal(el);
        gsap.fromTo(el, from, {
          ...to,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      });

      grouped.forEach((els, parent) => {
        const staggerValue = parseFloat(els[0].dataset.stagger || '0.1');
        const { from, to } = reveal(els[0]);
        gsap.fromTo(els, from, {
          ...to,
          stagger: staggerValue,
          scrollTrigger: { trigger: parent, start: 'top 85%', once: true },
        });
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return ref;
}

/** Animates a number climbing from 0 to `endValue` once its span scrolls into view. */
export function useCountUp(endValue: number, suffix: string = '') {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    if (prefersReducedMotion()) {
      ref.current.textContent = `${endValue}${suffix}`;
      return;
    }

    const el = ref.current;
    const proxy = { val: 0 };
    const ctx = gsap.context(() => {
      gsap.to(proxy, {
        val: endValue,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = `${Math.round(proxy.val)}${suffix}`;
        },
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [endValue, suffix]);

  return ref;
}
