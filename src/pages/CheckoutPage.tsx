import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Lock, ShieldCheck, Truck } from 'lucide-react';
import Navigation from '@/components/Navigation';
import FloatingCTA from '@/components/FloatingCTA';
import Footer from '@/sections/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // `user` can still be loading (async /auth/me) when this page mounts after
  // a full page navigation, so the useState initial value above can miss it.
  useEffect(() => {
    if (!user) return;
    setName((prev) => prev || user.name);
    setEmail((prev) => prev || user.email);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await api.post<{ url: string }>('/checkout/create-session', {
        items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
        contact: { name, email, phone },
      });
      window.location.href = res.url;
    } catch {
      setError('Could not start checkout. Please check your details and try again.');
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="relative">
        <Navigation />
        <main className="pt-32 md:pt-40 pb-20 md:pb-32 bg-grill-paper min-h-[70vh]">
          <div className="max-w-[700px] mx-auto px-5 md:px-12 text-center">
            <p className="font-body text-grill-muted mb-6">Your cart is empty.</p>
            <Link to="/grills" className="text-grill-brand hover:underline font-body">
              Shop Grills
            </Link>
          </div>
        </main>
        <Footer />
        <FloatingCTA />
      </div>
    );
  }

  return (
    <div className="relative">
      <Navigation />
      <main className="pt-32 md:pt-40 pb-20 md:pb-32 bg-grill-paper min-h-[70vh]">
        <div className="max-w-[1080px] mx-auto px-5 md:px-12">
          <small className="font-mono text-xs uppercase tracking-[0.14em] text-grill-brand">Secure Checkout</small>
          <h1 className="font-display text-[32px] md:text-[48px] uppercase leading-[0.95] text-grill-ink mt-2 mb-8">
            Complete Your Order
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
            <form onSubmit={handleSubmit} className="space-y-5">
              <section className="bg-grill-panel border border-grill-line rounded-[10px] shadow-grill-sm p-6 md:p-7">
                <h2 className="font-display text-xl text-grill-ink mb-5">Contact Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block sm:col-span-2">
                    <span className="block text-sm text-grill-muted mb-2">Full Name</span>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-grill-line-strong rounded-md px-4 py-3 font-body focus:border-grill-steel/50 focus:outline-none focus:ring-4 focus:ring-grill-steel/10 transition-colors"
                    />
                  </label>
                  <label className="block">
                    <span className="block text-sm text-grill-muted mb-2">Email</span>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-grill-line-strong rounded-md px-4 py-3 font-body focus:border-grill-steel/50 focus:outline-none focus:ring-4 focus:ring-grill-steel/10 transition-colors"
                    />
                  </label>
                  <label className="block">
                    <span className="block text-sm text-grill-muted mb-2">Phone</span>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-grill-line-strong rounded-md px-4 py-3 font-body focus:border-grill-steel/50 focus:outline-none focus:ring-4 focus:ring-grill-steel/10 transition-colors"
                    />
                  </label>
                </div>
              </section>

              {error && <p className="font-body text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-grill-brand-hot text-white rounded-md px-8 py-4 font-mono text-xs font-bold uppercase tracking-wide hover:bg-grill-brand-strong transition-colors duration-300 disabled:opacity-50"
              >
                {submitting ? 'Redirecting…' : 'Continue to Payment'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="w-full text-center font-body text-sm text-grill-muted hover:text-grill-brand transition-colors"
              >
                ← Back to cart
              </button>
            </form>

            <aside className="lg:sticky lg:top-[132px] bg-grill-panel border border-grill-line rounded-[10px] shadow-grill-sm p-6">
              <h2 className="font-display text-xl text-grill-ink mb-4 pb-4 border-b border-grill-line">
                Order Summary
              </h2>
              {items.map((i) => (
                <div key={i.productId} className="flex items-center gap-3 py-3 border-b border-grill-line last:border-b-0">
                  <div className="w-[60px] h-[60px] rounded-md bg-grill-panel-warm shrink-0 flex items-center justify-center overflow-hidden">
                    <img src={i.image} alt={i.name} className="w-full h-full object-contain p-1" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-body text-sm text-grill-ink font-medium truncate">{i.name}</p>
                    <p className="font-mono text-xs text-grill-muted">Qty {i.qty}</p>
                  </div>
                  <b className="font-mono text-sm text-grill-ink shrink-0">${(i.price * i.qty).toLocaleString()}</b>
                </div>
              ))}

              <div className="flex justify-between font-mono text-lg font-bold text-grill-ink mt-4 pt-4 border-t border-grill-line">
                <span>Total</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>

              <div className="grid gap-2 mt-5 pt-5 border-t border-grill-line text-grill-muted">
                <span className="flex items-center gap-2 text-xs">
                  <Lock size={13} /> Secure checkout
                </span>
                <span className="flex items-center gap-2 text-xs">
                  <Truck size={13} /> Local delivery available
                </span>
                <span className="flex items-center gap-2 text-xs">
                  <ShieldCheck size={13} /> Backed by our warranty
                </span>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
