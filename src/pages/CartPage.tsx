import { Link } from 'react-router';
import { Lock, ShoppingBag, Trash2, Truck } from 'lucide-react';
import Navigation from '@/components/Navigation';
import FloatingCTA from '@/components/FloatingCTA';
import Footer from '@/sections/Footer';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal } = useCart();

  return (
    <div className="relative">
      <Navigation />
      <main className="pt-32 md:pt-40 pb-20 md:pb-32 bg-grill-paper min-h-[70vh]">
        <div className="max-w-[920px] mx-auto px-5 md:px-12">
          <small className="font-mono text-xs uppercase tracking-[0.14em] text-grill-brand">Your Cart</small>
          <h1 className="font-display text-[32px] md:text-[48px] uppercase leading-[0.95] text-grill-ink mt-2 mb-8">
            Review &amp; Checkout
          </h1>

          {items.length === 0 ? (
            <div className="bg-grill-panel border border-grill-line rounded-[10px] shadow-grill-sm p-10 text-center">
              <ShoppingBag className="mx-auto text-grill-muted mb-4" size={32} />
              <p className="font-body text-grill-muted mb-6">Your cart is empty.</p>
              <Link
                to="/grills"
                className="inline-block bg-grill-brand-hot text-white rounded-md px-6 py-3 font-mono text-xs font-bold uppercase tracking-wide hover:bg-grill-brand-strong transition-colors duration-300"
              >
                Shop Grills
              </Link>
            </div>
          ) : (
            <div className="bg-grill-panel border border-grill-line rounded-[10px] shadow-grill-sm overflow-hidden">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-4 p-5 border-b border-grill-line last:border-b-0"
                >
                  <div className="w-20 h-20 rounded-[10px] bg-grill-panel-warm shrink-0 flex items-center justify-center overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-lg text-grill-ink truncate">{item.name}</p>
                    <p className="font-mono text-sm text-grill-brand mt-1">${item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center border border-grill-line-strong rounded-md overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateQty(item.productId, item.qty - 1)}
                      className="px-3 py-2 text-grill-ink hover:bg-grill-panel-warm transition-colors"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="font-mono text-sm w-8 text-center">{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.productId, item.qty + 1)}
                      className="px-3 py-2 text-grill-ink hover:bg-grill-panel-warm transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="text-grill-muted hover:text-red-600 transition-colors p-2"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              <div className="p-6 bg-grill-panel-warm/40">
                <div className="flex items-center justify-between mb-5">
                  <span className="font-display text-xl text-grill-ink">Subtotal</span>
                  <span className="font-mono text-2xl font-bold text-grill-brand">${subtotal.toLocaleString()}</span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-grill-muted">
                    <span className="flex items-center gap-1.5 text-xs">
                      <Lock size={13} /> Secure checkout
                    </span>
                    <span className="flex items-center gap-1.5 text-xs">
                      <Truck size={13} /> Local delivery available
                    </span>
                  </div>
                  <Link
                    to="/checkout"
                    className="text-center bg-grill-brand-hot text-white rounded-md px-8 py-3.5 font-mono text-xs font-bold uppercase tracking-wide hover:bg-grill-brand-strong transition-colors duration-300"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
