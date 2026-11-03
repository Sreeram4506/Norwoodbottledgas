import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import {
  setContactDetails,
  getDefaultContactDetails,
  type SiteContactDetails,
} from '@/config/siteContent';
import {
  setDiscountDetails,
  getDefaultDiscountDetails,
  type DiscountDetails,
} from '@/config/discountContent';

type Submission = {
  id: string;
  name: string;
  phone: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function AdminDashboardPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(true);

  const [details, setDetails] = useState<SiteContactDetails>(getDefaultContactDetails());
  const [discount, setDiscount] = useState<DiscountDetails>(getDefaultDiscountDetails());
  const [loadingContent, setLoadingContent] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSubmissions = () => {
    setLoadingSubs(true);
    api
      .get<{ submissions: Submission[] }>('/admin/submissions')
      .then((res) => setSubmissions(res.submissions))
      .finally(() => setLoadingSubs(false));
  };

  useEffect(() => {
    loadSubmissions();
    api
      .get<{ contact: SiteContactDetails; discount: DiscountDetails }>('/site-content')
      .then((res) => {
        setDetails(res.contact);
        setDiscount(res.discount);
      })
      .finally(() => setLoadingContent(false));
  }, []);

  const unreadCount = submissions.filter((s) => !s.read).length;

  const markRead = async (id: string) => {
    await api.patch(`/admin/submissions/${id}/read`, {});
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, read: true } : s)));
  };

  const deleteSubmission = async (id: string) => {
    await api.delete(`/admin/submissions/${id}`);
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  };

  const isPhoneHrefValid = useMemo(
    () => details.phoneHref.trim().toLowerCase().startsWith('tel:'),
    [details.phoneHref]
  );

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
      const res = await api.put<{ contact: SiteContactDetails; discount: DiscountDetails }>(
        '/admin/site-content',
        { contact: details, discount: cleanedDiscount }
      );
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

  return (
    <div className="space-y-12">
      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <p className="font-mono text-xs uppercase text-white/50">Total Submissions</p>
          <p className="font-display text-3xl mt-2">{submissions.length}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <p className="font-mono text-xs uppercase text-white/50">Unread</p>
          <p className="font-display text-3xl mt-2 text-burnt-orange">{unreadCount}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <p className="font-mono text-xs uppercase text-white/50">Read</p>
          <p className="font-display text-3xl mt-2">{submissions.length - unreadCount}</p>
        </div>
      </div>

      {/* ── Contact Form Submissions ── */}
      <div>
        <h2 className="font-display text-2xl mb-6">Contact Form Submissions</h2>

        {loadingSubs ? (
          <p className="font-body text-white/60">Loading…</p>
        ) : submissions.length === 0 ? (
          <p className="font-body text-white/60">No submissions yet.</p>
        ) : (
          <div className="space-y-4">
            {submissions.map((s) => (
              <div
                key={s.id}
                className={`bg-white/5 border rounded-xl p-5 ${
                  s.read ? 'border-white/10' : 'border-burnt-orange/40'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="font-body text-sm font-medium text-white">
                      {s.name}
                      {!s.read && (
                        <span className="ml-2 inline-block bg-burnt-orange text-white text-[10px] uppercase tracking-wide rounded px-1.5 py-0.5">
                          New
                        </span>
                      )}
                    </p>
                    <p className="font-mono text-xs text-white/50 mt-0.5">{s.phone}</p>
                  </div>
                  <p className="font-mono text-[11px] text-white/40">
                    {new Date(s.createdAt).toLocaleString()}
                  </p>
                </div>

                {s.message && (
                  <p className="font-body text-sm text-white/70 mt-2 whitespace-pre-wrap">
                    {s.message}
                  </p>
                )}

                <div className="flex gap-3 mt-4">
                  {!s.read && (
                    <button
                      type="button"
                      onClick={() => markRead(s.id)}
                      className="text-burnt-orange hover:underline text-xs font-medium"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteSubmission(s.id)}
                    className="text-white/40 hover:text-red-400 text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Site Settings ── */}
      <div>
        <h2 className="font-display text-2xl mb-6">Site Settings</h2>

        {loadingContent ? (
          <p className="font-body text-white/60">Loading…</p>
        ) : (
          <form
            onSubmit={handleSave}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8"
          >
            <div className="space-y-10">
              <div>
                <h3 className="font-display text-xl mb-4">Contact Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-white/70 mb-2">Email</label>
                    <input
                      value={details.email}
                      onChange={(e) => setDetails({ ...details, email: e.target.value })}
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
                    <label className="block text-sm text-white/70 mb-2">Winter Hours</label>
                    <textarea
                      value={details.winterHours}
                      onChange={(e) => setDetails({ ...details, winterHours: e.target.value })}
                      rows={3}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-body text-base focus:border-burnt-orange focus:outline-none transition-colors duration-200 resize-y"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-8">
                <h3 className="font-display text-xl mb-4">Discount Offers (Hero Scroller)</h3>
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
                {saving ? 'Saving…' : 'Save Settings'}
              </button>
              {saved && <span className="text-sm text-white/70">Saved.</span>}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
