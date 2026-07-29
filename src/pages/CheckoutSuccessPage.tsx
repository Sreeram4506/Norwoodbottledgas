import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { CheckCircle2 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import FloatingCTA from '@/components/FloatingCTA';
import Footer from '@/sections/Footer';
import { useCart } from '@/context/CartContext';
import { api, type Order } from '@/lib/api';

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order');
  const isDev = searchParams.get('dev') === '1';
  const { clear } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!orderId) return;
    api
      .get<{ order: Order }>(`/orders/${orderId}`)
      .then((res) => setOrder(res.order))
      .catch(() => setError('Could not load your order confirmation, but your payment was recorded.'));
  }, [orderId]);

  return (
    <div className="relative">
      <Navigation />
      <main className="pt-32 md:pt-40 pb-20 md:pb-32 bg-grill-paper min-h-[70vh]">
        <div className="max-w-[640px] mx-auto px-5 md:px-12 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#ECF8F0] flex items-center justify-center">
            <CheckCircle2 className="text-[#16733A]" size={30} />
          </div>
          <small className="font-mono text-xs uppercase tracking-[0.14em] text-grill-brand">Order Confirmed</small>
          <h1 className="font-display text-[32px] md:text-[48px] uppercase leading-[0.95] text-grill-ink mt-2 mb-3">
            Thank You
          </h1>
          <p className="font-body text-grill-muted">Your order has been placed.</p>

          {isDev && (
            <p className="font-mono text-xs text-grill-muted bg-grill-panel-warm border border-grill-line rounded-md px-4 py-2 inline-block mt-4">
              Dev mode: no real payment was processed (Stripe isn't configured yet).
            </p>
          )}

          {error && <p className="font-body text-sm text-red-600 mt-4">{error}</p>}

          {order && (
            <div className="bg-grill-panel border border-grill-line rounded-[10px] shadow-grill-sm p-6 md:p-8 mt-6 text-left">
              <p className="font-mono text-xs text-grill-muted mb-3">Order #{order.id}</p>
              {order.items.map((i) => (
                <div key={i.productId} className="flex justify-between font-body text-sm text-grill-ink-soft py-1.5">
                  <span>
                    {i.name} × {i.qty}
                  </span>
                  <span>${(i.price * i.qty).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between font-mono text-base font-bold text-grill-brand mt-3 pt-3 border-t border-grill-line">
                <span>Total</span>
                <span>${order.subtotal.toLocaleString()}</span>
              </div>
            </div>
          )}

          <Link
            to="/grills"
            className="inline-block mt-8 bg-grill-brand-hot text-white rounded-md px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wide hover:bg-grill-brand-strong transition-colors duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
