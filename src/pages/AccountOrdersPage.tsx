import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import Navigation from '@/components/Navigation';
import FloatingCTA from '@/components/FloatingCTA';
import Footer from '@/sections/Footer';
import { api, type Order } from '@/lib/api';

const STATUS_LABEL: Record<Order['status'], string> = {
  pending_payment: 'Pending Payment',
  paid: 'Paid',
  fulfilled: 'Fulfilled',
  cancelled: 'Cancelled',
};

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    api
      .get<{ orders: Order[] }>('/account/orders')
      .then((res) => setOrders(res.orders))
      .catch(() => setOrders([]));
  }, []);

  return (
    <div className="relative">
      <Navigation />
      <main className="pt-28 md:pt-36 pb-20 md:pb-32 bg-warm-sand min-h-[70vh]">
        <div className="max-w-[800px] mx-auto px-5 md:px-12">
          <Link to="/account" className="font-body text-sm text-warm-gray hover:text-burnt-orange transition-colors">
            ← My Account
          </Link>
          <h1 className="font-display text-[32px] md:text-[40px] text-warm-charcoal mt-3 mb-8">Order History</h1>

          {!orders && <p className="font-body text-warm-gray">Loading…</p>}

          {orders && orders.length === 0 && (
            <div className="bg-white rounded-xl shadow-card p-8 text-center">
              <p className="font-body text-warm-gray mb-5">You haven't placed any orders yet.</p>
              <Link to="/grills" className="text-burnt-orange hover:underline font-body">
                Shop Grills
              </Link>
            </div>
          )}

          {orders && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="bg-white rounded-xl shadow-card p-5 md:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-mono text-xs text-warm-muted">#{o.id}</p>
                    <span className="font-mono text-[10px] uppercase tracking-wide bg-warm-cream rounded-pill px-3 py-1 text-warm-charcoal">
                      {STATUS_LABEL[o.status]}
                    </span>
                  </div>
                  {o.items.map((i) => (
                    <div key={i.productId} className="flex justify-between font-body text-sm text-warm-gray py-1">
                      <span>
                        {i.name} × {i.qty}
                      </span>
                      <span>${(i.price * i.qty).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-mono text-sm text-burnt-orange mt-2 pt-2 border-t border-border-light">
                    <span>Total</span>
                    <span>${o.subtotal.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
