import { useContactDetails } from '@/config/siteContent';

const quickLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Bottle Guide', href: '#bottles' },
  { label: 'Coverage', href: '#areas' },
  { label: 'Contact', href: '#contact' },
];

const serviceLinks = [
  'Home & Heating',
  'BBQ & Patio',
  'Commercial',
  'Accessories',
];

export default function Footer() {
  const contact = useContactDetails();
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-warm-dark pt-16 md:pt-20 pb-8 md:pb-10">
      <div className="max-w-[1280px] mx-auto px-5 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <img
              src="/lohopropane.png"
              alt="Norwood Bottled Gas"
              className="h-9 w-auto object-contain"
              loading="lazy"
            />
            <p className="font-body text-sm text-white/40 mt-3">
              Your top source for propane and grill services and repair
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.04em] text-white/40 block mb-4">
              Quick Links
            </span>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="font-body text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.04em] text-white/40 block mb-4">
              Services
            </span>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link}>
                  <span className="font-body text-sm text-white/60">{link}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.04em] text-white/40 block mb-4">
              Get in Touch
            </span>
            <a
              href={contact.phoneHref}
              className="font-display text-xl md:text-2xl text-white hover:text-burnt-orange transition-colors duration-200 block"
            >
              {contact.phoneDisplay}
            </a>
            <p className="font-body text-sm text-white/60 mt-2">
              {contact.addressLine}
            </p>
            <p className="font-body text-sm text-white/60">
              {contact.email}
            </p>
            <p className="font-body text-sm text-white/60 mt-2">
              Winter Hours
            </p>
            <p className="font-body text-sm text-white/60">
              {contact.winterHours}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-white/40">
            &copy; 2025 Norwood Bottled Gas. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="font-body text-xs text-white/40 hover:text-white/70 transition-colors duration-200 cursor-pointer">
              Privacy
            </span>
            <span className="font-body text-xs text-white/40 hover:text-white/70 transition-colors duration-200 cursor-pointer">
              Terms
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
