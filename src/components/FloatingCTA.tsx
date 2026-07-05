import { Phone } from 'lucide-react';
import { useContactDetails } from '@/config/siteContent';

export default function FloatingCTA() {
  const contact = useContactDetails();

  return (
    <a
      href={contact.phoneHref}
      className="fixed bottom-0 left-0 right-0 z-50 bg-burnt-orange text-white py-4 px-5 flex items-center justify-center gap-2 font-body text-base font-medium md:hidden"
    >
      <Phone size={16} />
      Call Now — {contact.phoneDisplay}
    </a>
  );
}
