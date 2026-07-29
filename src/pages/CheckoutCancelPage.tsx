import { Link } from 'react-router';
import Navigation from '@/components/Navigation';
import FloatingCTA from '@/components/FloatingCTA';
import Footer from '@/sections/Footer';

export default function CheckoutCancelPage() {
  return (
    <div className="relative">
      <Navigation />
      <main className="pt-32 md:pt-40 pb-20 md:pb-32 bg-grill-paper min-h-[70vh]">
        <div className="max-w-[640px] mx-auto px-5 md:px-12 text-center">
          <small className="font-mono text-xs uppercase tracking-[0.14em] text-grill-brand">Checkout</small>
          <h1 className="font-display text-[32px] md:text-[48px] uppercase leading-[0.95] text-grill-ink mt-2 mb-4">
            Order Cancelled
          </h1>
          <p className="font-body text-grill-muted mb-8">
            No payment was made. Your cart is still saved if you'd like to try again.
          </p>
          <Link
            to="/cart"
            className="inline-block bg-grill-brand-hot text-white rounded-md px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wide hover:bg-grill-brand-strong transition-colors duration-300"
          >
            Back to Cart
          </Link>
        </div>
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
