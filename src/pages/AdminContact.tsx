import { useEffect, useMemo, useState } from 'react';
import {
  getContactDetails,
  setContactDetails,
  getDefaultContactDetails,
  type SiteContactDetails,
} from '@/config/siteContent';
import {
  getDiscountDetails,
  setDiscountDetails,
  getDefaultDiscountDetails,
  type DiscountDetails,
} from '@/config/discountContent';

export default function AdminContact() {
  const [details, setDetails] = useState<SiteContactDetails>(getDefaultContactDetails());
  const [saved, setSaved] = useState(false);

  const [discount, setDiscount] = useState<DiscountDetails>(getDefaultDiscountDetails());

  useEffect(() => {
    setDetails(getContactDetails());
    setDiscount(getDiscountDetails());
  }, []);

  const isPhoneHrefValid = useMemo(() => {
    // very lightweight check: expects "tel:" prefix
    return details.phoneHref.trim().toLowerCase().startsWith('tel:');
  }, [details.phoneHref]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPhoneHrefValid) return;

    setContactDetails(details);
    setDiscountDetails({
      ...discount,
      title: discount.title.trim(),
      messages: discount.messages.map((m) => (m ?? '').trim()).filter(Boolean),
    });

    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    const d = getDefaultContactDetails();
    const dis = getDefaultDiscountDetails();

    setDetails(d);
    setContactDetails(d);

    setDiscount(dis);
    setDiscountDetails(dis);

    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-[100dvh] bg-warm-dark text-white">
      <div className="max-w-[980px] mx-auto px-5 md:px-12 py-12">
        <div className="mb-8">
          <h1 className="font-display text-[34px] md:text-[48px]">Admin: Contact Details</h1>
          <p className="font-body text-white/70 mt-3">
            Updates the phone, address, email and winter hours shown on the website.
          </p>
        </div>

        <form onSubmit={handleSave} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
          <div className="space-y-10">
            <div>
              <div className="mb-6">
                <h2 className="font-display text-[22px] text-white">Contact Details</h2>
                <p className="font-body text-white/70 mt-1 text-sm">
                  Updates the phone, address, email and winter hours shown on the website.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm text-white/70 mb-2">Phone (tel link)</label>
                  <input
                    value={details.phoneHref}
                    onChange={(e) => setDetails({ ...details, phoneHref: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 font-body text-base focus:border-burnt-orange focus:outline-none transition-colors duration-200"
                    placeholder="tel:17817622331"
                  />
                  {!isPhoneHrefValid ? (
                    <p className="mt-2 text-sm text-red-300">
                      phoneHref must start with <span className="font-mono">tel:</span>
                    </p>
                  ) : null}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-white/70 mb-2">Phone (display)</label>
                  <input
                    value={details.phoneDisplay}
                    onChange={(e) => setDetails({ ...details, phoneDisplay: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 font-body text-base focus:border-burnt-orange focus:outline-none transition-colors duration-200"
                    placeholder="(781) 762-2331"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-white/70 mb-2">Address</label>
                  <input
                    value={details.addressLine}
                    onChange={(e) => setDetails({ ...details, addressLine: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 font-body text-base focus:border-burnt-orange focus:outline-none transition-colors duration-200"
                    placeholder="305 Providence Highway, Route 1, Norwood, MA 02062"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-white/70 mb-2">Email</label>
                  <input
                    value={details.email}
                    onChange={(e) => setDetails({ ...details, email: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 font-body text-base focus:border-burnt-orange focus:outline-none transition-colors duration-200"
                    placeholder="bengnbg@gmail.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-white/70 mb-2">Winter Hours</label>
                  <textarea
                    value={details.winterHours}
                    onChange={(e) => setDetails({ ...details, winterHours: e.target.value })}
                    rows={4}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 font-body text-base focus:border-burnt-orange focus:outline-none transition-colors duration-200 resize-y min-h-[120px]"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8">
              <div className="mb-6">
                <h2 className="font-display text-[22px] text-white">Discount Offers (Hero Scroller)</h2>
                <p className="font-body text-white/70 mt-1 text-sm">
                  Updates the discount/messages shown in the scroller directly below the hero.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm text-white/70 mb-2">Scroller Title</label>
                  <input
                    value={discount.title}
                    onChange={(e) => setDiscount({ ...discount, title: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 font-body text-base focus:border-burnt-orange focus:outline-none transition-colors duration-200"
                    placeholder="Limited-Time Offers"
                  />
                </div>

                {Array.from({ length: 3 }).map((_, i) => {
                  const value = discount.messages[i] ?? '';
                  return (
                    <div key={i} className="md:col-span-2">
                      <label className="block text-sm text-white/70 mb-2">{`Message ${i + 1}`}</label>
                      <input
                        value={value}
                        onChange={(e) => {
                          const next = [...discount.messages];
                          next[i] = e.target.value;
                          setDiscount({ ...discount, messages: next });
                        }}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 font-body text-base focus:border-burnt-orange focus:outline-none transition-colors duration-200"
                        placeholder={
                          i === 0
                            ? '10% OFF refill bundles...'
                            : i === 1
                              ? 'Seasonal promo: ...'
                              : 'Family & bulk discounts...'
                        }
                      />
                    </div>
                  );
                })}

                <div className="md:col-span-2 text-white/60 text-sm">
                  Tip: leave messages blank to hide them. Save updates the website on reload.
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-8">
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={!isPhoneHrefValid}
                className="bg-burnt-orange text-white rounded-pill px-6 py-3.5 text-base font-medium hover:bg-burnt-orange-hover transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="border border-white/20 text-white rounded-pill px-6 py-3.5 text-base font-medium hover:bg-white/10 transition-colors duration-300"
              >
                Reset to Defaults
              </button>
            </div>

            {saved ? (
              <div className="text-sm text-white/80">
                Saved! <span className="text-white/60">(Website will update on reload.)</span>
              </div>
            ) : (
              <div className="text-sm text-white/50">
                Tip: refresh the Home page to confirm the updated details.
              </div>
            )}
          </div>
        </form>

        <div className="mt-8 text-white/50 text-sm">
          Admin URL: <span className="font-mono">/admin</span>
        </div>
      </div>
    </div>
  );
}
