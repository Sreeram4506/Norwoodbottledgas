import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useContactDetails } from '@/config/siteContent';

gsap.registerPlugin(ScrollTrigger);

export default function ContactCTA() {
  const contact = useContactDetails();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const els = sectionRef.current!.querySelectorAll('[data-animate-contact]');
      els.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: i === 1 ? 30 : 40 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 + i * 0.15,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" ref={sectionRef} className="w-full bg-warm-dark py-20 md:py-40">
      <div className="max-w-[960px] mx-auto px-5 md:px-12 text-center">
        <h2
          data-animate-contact
          className="font-display text-[36px] md:text-[56px] text-white opacity-0"
        >
          Ready to Order?
        </h2>

        <a
          href={contact.phoneHref}
          data-animate-contact
          className="block font-display text-[48px] md:text-[72px] text-burnt-orange mt-6 hover:text-white transition-colors duration-300 opacity-0"
        >
          {contact.phoneDisplay}
        </a>

        <p
          data-animate-contact
          className="font-body text-lg md:text-xl text-white/70 mt-4 opacity-0"
        >
          Call now to place your order or request a delivery
        </p>

        <p
          data-animate-contact
          className="font-mono text-xs uppercase tracking-[0.04em] text-white/50 mt-4 opacity-0"
        >
          Winter Hours: {contact.winterHours}
        </p>

        <p
          data-animate-contact
          className="font-body text-sm text-white/50 mt-4 opacity-0"
        >
          {contact.addressLine} · {contact.email}
        </p>

        <p
          data-animate-contact
          className="font-body text-sm text-white/50 italic mt-12 mb-8 opacity-0"
        >
          — or send us a message —
        </p>

        {submitted ? (
          <div
            data-animate-contact
            className="max-w-[480px] mx-auto bg-white/10 rounded-xl p-8 opacity-0"
          >
            <p className="font-display text-2xl text-white">Thank you!</p>
            <p className="font-body text-base text-white/70 mt-2">
              We'll get back to you within one business day.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="max-w-[480px] mx-auto text-left opacity-0"
            data-animate-contact
          >
            <input
              type="text"
              placeholder="Your name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-5 py-3.5 text-white placeholder:text-white/40 font-body text-base focus:border-burnt-orange focus:outline-none transition-colors duration-200"
            />
            <input
              type="tel"
              placeholder="Phone number"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-5 py-3.5 text-white placeholder:text-white/40 font-body text-base focus:border-burnt-orange focus:outline-none transition-colors duration-200 mt-4"
            />
            <textarea
              placeholder="How can we help?"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-5 py-3.5 text-white placeholder:text-white/40 font-body text-base focus:border-burnt-orange focus:outline-none transition-colors duration-200 mt-4 resize-y min-h-[120px]"
            />
            <button
              type="submit"
              className="w-full bg-burnt-orange text-white rounded-pill py-3.5 text-base font-medium hover:bg-burnt-orange-hover transition-colors duration-300 mt-6"
            >
              Send Message
            </button>
            <p className="font-body text-xs text-white/40 mt-4 text-center">
              We'll get back to you within one business day.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
