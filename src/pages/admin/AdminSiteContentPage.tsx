import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { setContactDetails, getDefaultContactDetails, type SiteContactDetails } from '@/config/siteContent';
import { setDiscountDetails, getDefaultDiscountDetails, type DiscountDetails } from '@/config/discountContent';

export default function AdminSiteContentPage() {
  const [details, setDetails] = useState<SiteContactDetails>(getDefaultContactDetails());
  const [discount, setDiscount] = useState<DiscountDetails>(getDefaultDiscountDetails());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<{ contact: SiteContactDetails; discount: DiscountDetails }>('/site-content')
      .then((res) => {
        setDetails(res.contact);
        setDiscount(res.discount);
      })
      .finally(() => setLoading(false));
  }, []);

  const isPhoneHrefValid = useMemo(() => details.phoneHref.trim().toLowerCase().startsWith('tel:'), [details.phoneHref]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPhoneHrefValid) return;
    setError(null);
    setSaving(true);

    const cleanedDiscount = {
      ...discount,
      title: discount.title.trim(),
      messages: discount.messages.map((m) => (m ?? '').trim()).filter(Boolean),
    };

    try {
      const res = await api.put<{ contact: SiteContactDetails; discount: DiscountDetails }>('/admin/site-content', {
        contact: details,
        discount: cleanedDiscount,
      });
      // Push the saved copy into the localStorage-backed hooks so the live
      // site updates immediately without a reload.
      setContactDetails(res.contact);
      setDiscountDetails(res.discount);
      setDiscount(res.discount);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch {
      setError('Could not save. Check the fields and try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="font-body text-white/60">Loading…</p>;

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Site Content</h1>

      <form onSubmit={handleSave} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
        <div className="space-y-10">
          <div>
            <h2 className="font-display text-xl mb-4">Contact Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm text-white/70 mb-2">Phone (tel link)</label>
                <input
                  value={details.phoneHref}
                  onChange={(e) => setDetails({ ...details, phoneHref: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 font-body text-base focus:border-burnt-orange focus:outline-none transition-colors duration-200"
                  placeholder="tel:17817622331"
                />
                {!isPhoneHrefValid && (
                  <p className="mt-2 text-sm text-red-300">
                    phoneHref must start with <span className="font-mono">tel:</span>
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-white/70 mb-2">Phone (display)</label>
                <input
                  value={details.phoneDisplay}
                  onChange={(e) => setDetails({ ...details, phoneDisplay: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-body text-base focus:border-burnt-orange focus:outline-none transition-colors duration-200"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-white/70 mb-2">Address</label>
                <input
                  value={details.addressLine}
                  onChange={(e) => setDetails({ ...details, addressLine: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-body text-base focus:border-burnt-orange focus:outline-none transition-colors duration-200"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-white/70 mb-2">Email</label>
                <input
                  value={details.email}
                  onChange={(e) => setDetails({ ...details, email: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-body text-base focus:border-burnt-orange focus:outline-none transition-colors duration-200"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-white/70 mb-2">Winter Hours</label>
                <textarea
                  value={details.winterHours}
                  onChange={(e) => setDetails({ ...details, winterHours: e.target.value })}
                  rows={4}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-body text-base focus:border-burnt-orange focus:outline-none transition-colors duration-200 resize-y min-h-[120px]"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8">
            <h2 className="font-display text-xl mb-4">Discount Offers (Hero Scroller)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm text-white/70 mb-2">Scroller Title</label>
                <input
                  value={discount.title}
                  onChange={(e) => setDiscount({ ...discount, title: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-body text-base focus:border-burnt-orange focus:outline-none transition-colors duration-200"
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
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-body text-base focus:border-burnt-orange focus:outline-none transition-colors duration-200"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {error && <p className="font-body text-sm text-red-400 mt-6">{error}</p>}

        <div className="flex items-center gap-4 mt-8">
          <button
            type="submit"
            disabled={!isPhoneHrefValid || saving}
            className="bg-burnt-orange text-white rounded-pill px-6 py-3.5 text-base font-medium hover:bg-burnt-orange-hover transition-colors duration-300 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          {saved && <span className="text-sm text-white/70">Saved.</span>}
        </div>
      </form>
    </div>
  );
}
