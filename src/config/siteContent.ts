import { useEffect, useState } from 'react';

export type SiteContactDetails = {
  phoneHref: string; // tel:...
  phoneDisplay: string; // (781) ...
  addressLine: string;
  email: string;
  winterHours: string;
};

const STORAGE_KEY = 'norwood_bottled_gas_contact_v1';
const CONTACT_DETAILS_UPDATED_EVENT = 'norwood_contact_details_updated_v1';

const defaultContactDetails: SiteContactDetails = {
  phoneHref: 'tel:17817622331',
  phoneDisplay: '(781) 762-2331',
  addressLine: '305 Providence Highway, Route 1, Norwood, MA 02062',
  email: 'bengnbg@gmail.com',
  winterHours: 'Mon–Fri 8:00 AM–6:00 PM · Sat 8:00 AM–5:00 PM · Sun 10:00 AM–4:00 PM',
};

export function getContactDetails(): SiteContactDetails {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultContactDetails;
    const parsed = JSON.parse(raw) as Partial<SiteContactDetails>;
    return {
      ...defaultContactDetails,
      ...parsed,
    };
  } catch {
    return defaultContactDetails;
  }
}

export function setContactDetails(next: SiteContactDetails) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CONTACT_DETAILS_UPDATED_EVENT));
}

export function getDefaultContactDetails(): SiteContactDetails {
  return defaultContactDetails;
}

export function useContactDetails(): SiteContactDetails {
  const [details, setDetails] = useState<SiteContactDetails>(() => getContactDetails());

  useEffect(() => {
    const refresh = () => setDetails(getContactDetails());

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) refresh();
    };

    window.addEventListener(CONTACT_DETAILS_UPDATED_EVENT, refresh);
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener(CONTACT_DETAILS_UPDATED_EVENT, refresh);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return details;
}
