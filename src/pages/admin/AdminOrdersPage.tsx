import { useEffect, useState } from 'react';
import { api, type Order } from '@/lib/api';

const STATUSES: Order['status'][] = ['pending_payment', 'paid', 'fulfilled', 'cancelled'];

const STATUS_LABEL: Record<Order['status'], string> = {
  pending_payment: 'Pending Payment',
  paid: 'Paid',
  fulfilled: 'Fulfilled',
  cancelled: 'Cancelled',
};

type EditDraft = {
  name: string;
  email: string;
  phone: string;
  items: { productId: string; name: string; price: number; qty: number }[];
  adminNotes: string;
};

function draftFromOrder(o: Order): EditDraft {
  return {
    name: o.contact.name,
    email: o.contact.email,
    phone: o.contact.phone,
    items: o.items.map((i) => ({ ...i })),
    adminNotes: o.adminNotes ?? '',
  };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | Order['status']>('all');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EditDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    const query = statusFilter === 'all' ? '' : `?status=${statusFilter}`;
    api
      .get<{ orders: Order[] }>(`/admin/orders${query}`)
      .then((res) => setOrders(res.orders))
      .finally(() => setLoading(false));
  };

  useEffect(load, [statusFilter]);

  const updateStatus = async (id: string, status: Order['status']) => {
    await api.patch(`/admin/orders/${id}`, { status });
    load();
  };

  const startEdit = (o: Order) => {
    setEditingId(o.id);
    setDraft(draftFromOrder(o));
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(null);
    setError(null);
  };

  const saveEdit = async (id: string) => {
    if (!draft) return;
    setError(null);
    setSaving(true);
    try {
      await api.patch(`/admin/orders/${id}`, {
        contact: { name: draft.name, email: draft.email, phone: draft.phone },
        items: draft.items,
        adminNotes: draft.adminNotes,
      });
      setEditingId(null);
      setDraft(null);
      load();
    } catch {
      setError('Could not save changes. Check the fields and try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateDraftItemQty = (productId: string, qty: number) => {
    setDraft((cur) =>
      cur ? { ...cur, items: cur.items.map((i) => (i.productId === productId ? { ...i, qty: Math.max(1, qty) } : i)) } : cur
    );
  };

  const draftSubtotal = draft ? draft.items.reduce((sum, i) => sum + i.price * i.qty, 0) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Orders</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | Order['status'])}
          className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="font-body text-white/60">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="font-body text-white/60">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const isEditing = editingId === o.id;

            return (
              <div key={o.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-[220px]">
                    <p className="font-mono text-xs text-white/50">#{o.id}</p>

                    {isEditing && draft ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                        <input
                          value={draft.name}
                          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                          placeholder="Name"
                          className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm"
                        />
                        <input
                          value={draft.email}
                          onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                          placeholder="Email"
                          className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm"
                        />
                        <input
                          value={draft.phone}
                          onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                          placeholder="Phone"
                          className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm"
                        />
                      </div>
                    ) : (
                      <p className="font-body text-sm mt-1">
                        {o.contact.name} · {o.contact.email}
                        {o.contact.phone ? ` · ${o.contact.phone}` : ''}
                      </p>
                    )}

                    <p className="font-mono text-[11px] text-white/40 mt-1">
                      {new Date(o.createdAt).toLocaleString()}
                      {o.devMode ? ' · dev mode' : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value as Order['status'])}
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABEL[s]}
                        </option>
                      ))}
                    </select>

                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => startEdit(o)}
                        className="text-burnt-orange hover:underline text-xs font-medium"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>

                {isEditing && draft ? (
                  <>
                    <div className="space-y-2">
                      {draft.items.map((i) => (
                        <div key={i.productId} className="flex items-center justify-between gap-3 font-body text-sm text-white/80">
                          <span className="flex-1">{i.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-white/40 text-xs">Qty</span>
                            <input
                              type="number"
                              min={1}
                              value={i.qty}
                              onChange={(e) => updateDraftItemQty(i.productId, Number(e.target.value))}
                              className="w-16 bg-white/10 border border-white/20 rounded px-2 py-1 font-mono text-xs"
                            />
                          </div>
                          <span className="w-20 text-right">${(i.price * i.qty).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between font-mono text-sm text-burnt-orange mt-2 pt-2 border-t border-white/10">
                      <span>Total</span>
                      <span>${draftSubtotal.toLocaleString()}</span>
                    </div>

                    <div className="mt-4">
                      <label className="block text-xs text-white/60 mb-1.5">Admin Notes</label>
                      <textarea
                        value={draft.adminNotes}
                        onChange={(e) => setDraft({ ...draft, adminNotes: e.target.value })}
                        rows={2}
                        placeholder="Internal notes about this order (not shown to the customer)"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm resize-y"
                      />
                    </div>

                    {error && <p className="font-body text-sm text-red-400 mt-2">{error}</p>}

                    <div className="flex gap-3 mt-4">
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => saveEdit(o.id)}
                        className="bg-burnt-orange text-white rounded-pill px-5 py-2 text-xs font-medium hover:bg-burnt-orange-hover transition-colors disabled:opacity-50"
                      >
                        {saving ? 'Saving…' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="border border-white/20 rounded-pill px-5 py-2 text-xs font-medium hover:bg-white/10 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {o.items.map((i) => (
                      <div key={i.productId} className="flex justify-between font-body text-sm text-white/70 py-1">
                        <span>
                          {i.name} × {i.qty}
                        </span>
                        <span>${(i.price * i.qty).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-mono text-sm text-burnt-orange mt-2 pt-2 border-t border-white/10">
                      <span>Total</span>
                      <span>${o.subtotal.toLocaleString()}</span>
                    </div>
                    {o.adminNotes && (
                      <p className="font-body text-xs text-white/50 italic mt-3 pt-3 border-t border-white/10">
                        Note: {o.adminNotes}
                      </p>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
