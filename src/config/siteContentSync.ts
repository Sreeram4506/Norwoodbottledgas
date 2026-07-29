import { api } from '@/lib/api';
import { setContactDetails, type SiteContactDetails } from './siteContent';
import { setDiscountDetails, type DiscountDetails } from './discountContent';

let synced = false;

/** Pulls the server-persisted contact/discount copy once and pushes it into
 * the existing localStorage-backed hooks, so every component that already
 * reads `useContactDetails` / `useDiscountDetails` picks it up for free. */
export function syncSiteContentFromServer() {
  if (synced) return;
  synced = true;

  api
    .get<{ contact: SiteContactDetails; discount: DiscountDetails }>('/site-content')
    .then((res) => {
      setContactDetails(res.contact);
      setDiscountDetails(res.discount);
    })
    .catch(() => {
      synced = false;
    });
}
