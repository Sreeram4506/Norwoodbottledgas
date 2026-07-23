import { useEffect, useState } from 'react';

export type DiscountDetails = {
  title: string;
  messages: string[];
};

const STORAGE_KEY = 'norwood_bottled_gas_discount_v1';
const DISCOUNT_UPDATED_EVENT = 'norwood_discount_details_updated_v1';

const defaultDiscountDetails: DiscountDetails = {
  title: 'Limited-Time Offers',
  messages: [
    '10% OFF refill bundles (ask us about deals!)',
    'Seasonal promo: bring your tank anytime',
    'Family & bulk discounts available',
  ],
};

export function getDiscountDetails(): DiscountDetails {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultDiscountDetails;
    const parsed = JSON.parse(raw) as Partial<DiscountDetails>;

    const messages = Array.isArray(parsed.messages) ? parsed.messages : defaultDiscountDetails.messages;

    return {
      ...defaultDiscountDetails,
      ...parsed,
      messages,
    };
  } catch {
    return defaultDiscountDetails;
  }
}

export function setDiscountDetails(next: DiscountDetails) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(DISCOUNT_UPDATED_EVENT));
}

export function getDefaultDiscountDetails(): DiscountDetails {
  return defaultDiscountDetails;
}

export function useDiscountDetails(): DiscountDetails {
  const [details, setDetails] = useState<DiscountDetails>(() => getDiscountDetails());

  useEffect(() => {
    const refresh = () => setDetails(getDiscountDetails());

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) refresh();
    };

    window.addEventListener(DISCOUNT_UPDATED_EVENT, refresh);
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener(DISCOUNT_UPDATED_EVENT, refresh);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return details;
}
