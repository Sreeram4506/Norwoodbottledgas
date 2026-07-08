import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { useContactDetails } from '@/config/siteContent';

const navLinks = [
  { label: 'Propane', href: '#bottles' },
  { label: 'Delivery & Exchange Program', href: '#areas' },
  { label: 'Grill Sales, Parts & Repair', href: '#services' },
  { label: 'Location & Contact', href: '#contact' },
];

export default function Navigation() {
  const contact = useContactDetails();
  const [visible, setVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-400 ${
          visible ? 'translate-y-0' : '-translate-y-full'
        } bg-warm-cream/90 backdrop-blur border-b border-border-light`}
      >
        <div className="max-w-[1280px] mx-auto px-5 md:px-12 h-full flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label="Norwood Bottled Gas Home"
            className="flex shrink-0 items-center"
          >
            <img
              src="/lohopropane.png"
              alt="Norwood Bottled Gas"
              className="block h-11 w-[160px] object-cover object-center md:h-12 md:w-[180px]"
              loading="lazy"
            />
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-[13px] text-warm-gray hover:text-warm-charcoal transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <a
            href={contact.phoneHref}
            className="hidden md:flex items-center gap-2 bg-brand-blue text-white rounded-pill px-6 py-2.5 text-sm font-medium hover:bg-brand-blue-hover hover:shadow-float hover:-translate-y-0.5 transition-all duration-300"
            style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            <Phone size={14} />
            Call Us
          </a>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 text-warm-charcoal"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] bg-warm-cream flex flex-col">
          <div className="flex items-center justify-between px-5 h-16 border-b border-border-light">
            <a href="#" aria-label="Norwood Bottled Gas Home" className="flex shrink-0 items-center">
              <img
                src="/lohopropane.png"
                alt="Norwood Bottled Gas"
                className="block h-9 w-[132px] object-cover object-center"
                loading="lazy"
              />
            </a>
            <button
              className="p-2 text-warm-charcoal"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="font-display text-3xl text-warm-charcoal hover:text-brand-blue transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
            <a
              href={contact.phoneHref}
              className="mt-4 flex items-center gap-2 bg-brand-blue text-white rounded-pill px-8 py-3.5 text-base font-medium"
            >
              <Phone size={16} />
              Call {contact.phoneDisplay}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
