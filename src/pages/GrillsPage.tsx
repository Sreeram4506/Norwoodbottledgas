import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Flame } from 'lucide-react';
import Navigation from '@/components/Navigation';
import FloatingCTA from '@/components/FloatingCTA';
import Footer from '@/sections/Footer';
import { api, type Product } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useContactDetails } from '@/config/siteContent';

export default function GrillsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [category, setCategory] = useState<'all' | 'grill' | 'accessory'>('all');
  const [error, setError] = useState<string | null>(null);
  const { items, addItem, updateQty } = useCart();
  const contact = useContactDetails();

  const cartQtyFor = (productId: string) => items.find((i) => i.productId === productId)?.qty ?? 0;

  useEffect(() => {
    let cancelled = false;
    setProducts(null);
    setError(null);

    const query = category === 'all' ? '' : `?category=${category}`;
    api
      .get<{ products: Product[] }>(`/products${query}`)
      .then((res) => {
        if (!cancelled) setProducts(res.products);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load the grill catalog. Please try again shortly.');
      });

    return () => {
      cancelled = true;
    };
  }, [category]);

  return (
    <div className="relative">
      <Navigation />
      <main className="pt-32 md:pt-40 pb-20 md:pb-32 bg-grill-paper min-h-[70vh]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-12">
          <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 pb-8 border-b border-grill-line">
            <div>
              <small className="font-mono text-xs uppercase tracking-[0.14em] text-grill-brand">
                Authorized MHP Dealer
              </small>
              <h1 className="font-display text-[38px] md:text-[64px] leading-[0.95] uppercase text-grill-ink mt-2">
                Grill Sales
              </h1>
              <p className="font-body text-grill-muted mt-3 max-w-[520px]">
                {products ? `Showing ${products.length} product${products.length === 1 ? '' : 's'}` : 'Browse our lineup below, or call us and we’ll help you pick the right grill.'}
              </p>
            </div>

            <div className="flex gap-2">
              {(['all', 'grill', 'accessory'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`font-mono text-xs uppercase tracking-wide rounded-full px-4 py-2.5 border transition-colors duration-200 ${
                    category === c
                      ? 'bg-grill-ink text-white border-grill-ink'
                      : 'bg-grill-panel text-grill-ink-soft border-grill-line-strong hover:border-grill-brand-hot'
                  }`}
                >
                  {c === 'all' ? 'All' : c === 'grill' ? 'Grills' : 'Accessories'}
                </button>
              ))}
            </div>
          </header>

          {error && <p className="font-body text-red-600">{error}</p>}

          {!products && !error && <p className="font-body text-grill-muted">Loading grills…</p>}

          {products && products.length === 0 && (
            <p className="font-body text-grill-muted">No products in this category yet — check back soon.</p>
          )}

          {products && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {products.map((p) => (
                <article
                  key={p.id}
                  className="group relative flex flex-col bg-grill-panel border border-grill-line rounded-[10px] overflow-hidden shadow-[0_1px_0_rgba(49,35,27,0.04)] hover:-translate-y-1.5 hover:border-grill-steel/30 hover:shadow-grill-md transition-all duration-300"
                >
                  {(p.isPlaceholder || !p.inStock) && (
                    <span
                      className={`absolute z-10 left-3.5 top-3.5 font-mono text-[10px] uppercase tracking-wide rounded-full px-2.5 py-1 ${
                        !p.inStock
                          ? 'bg-red-600/90 text-white'
                          : 'bg-white/95 text-grill-brand border border-grill-brand-hot/25'
                      }`}
                    >
                      {!p.inStock ? 'Out of stock' : 'Placeholder'}
                    </span>
                  )}

                  <Link
                    to={`/grills/${p.slug}`}
                    className="aspect-square flex items-center justify-center p-7"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(49,95,103,0.10), transparent 42%), radial-gradient(circle at 45% 30%, rgba(255,255,255,0.94), rgba(232,236,228,0.82) 55%, rgba(201,208,196,0.55))',
                    }}
                  >
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-contain drop-shadow-[0_20px_24px_rgba(24,27,27,0.16)] group-hover:scale-[1.06] group-hover:-translate-y-1 transition-transform duration-500"
                      loading="lazy"
                    />
                  </Link>

                  <div className="flex flex-col flex-1 gap-3 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <Link to={`/grills/${p.slug}`}>
                        <h2 className="font-display text-xl leading-tight text-grill-ink hover:text-grill-brand transition-colors">
                          {p.name}
                        </h2>
                      </Link>
                      <strong className="font-mono text-base text-grill-ink shrink-0">${p.price.toLocaleString()}</strong>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-xs px-2 py-1 rounded-full bg-grill-panel-warm text-grill-ink-soft group-hover:bg-grill-steel/10 group-hover:text-grill-steel transition-colors">
                        {p.category === 'grill' ? 'Grill' : 'Accessory'}
                      </span>
                      {p.brand && (
                        <span className="text-xs px-2 py-1 rounded-full bg-grill-panel-warm text-grill-ink-soft group-hover:bg-grill-steel/10 group-hover:text-grill-steel transition-colors">
                          {p.brand}
                        </span>
                      )}
                    </div>

                    <p className="font-body text-sm text-grill-muted line-clamp-2 min-h-[40px]">{p.description}</p>

                    <div className="grid grid-cols-[1fr_auto] gap-2.5 mt-auto pt-1">
                      <Link
                        to={`/grills/${p.slug}`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-md border border-grill-line-strong bg-grill-panel px-3 py-2.5 font-mono text-[11px] font-bold uppercase tracking-wide text-grill-ink-soft hover:border-grill-steel/40 transition-colors"
                      >
                        View Details
                      </Link>
                      {cartQtyFor(p.id) > 0 ? (
                        <div className="inline-flex items-center justify-between rounded-md bg-grill-brand-hot text-white shadow-[0_16px_34px_rgba(255,92,0,0.22)] overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateQty(p.id, cartQtyFor(p.id) - 1)}
                            aria-label="Decrease quantity in cart"
                            className="px-3 py-2.5 hover:bg-grill-brand-strong transition-colors"
                          >
                            −
                          </button>
                          <span className="font-mono text-[13px] font-bold min-w-[18px] text-center">
                            {cartQtyFor(p.id)}
                          </span>
                          <button
                            type="button"
                            disabled={cartQtyFor(p.id) >= p.stock}
                            onClick={() => updateQty(p.id, Math.min(p.stock, cartQtyFor(p.id) + 1))}
                            aria-label="Increase quantity in cart"
                            className="px-3 py-2.5 hover:bg-grill-brand-strong transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={!p.inStock}
                          onClick={() => addItem(p, 1)}
                          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-grill-brand-hot px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-wide text-white shadow-[0_16px_34px_rgba(255,92,0,0.22)] hover:bg-grill-brand-strong transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none whitespace-nowrap"
                        >
                          Quick Add
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-14 flex items-center gap-3 bg-grill-charcoal text-white rounded-xl px-6 py-5">
            <Flame className="text-grill-brand-hot shrink-0" size={22} />
            <p className="font-body text-sm text-white/80">
              Not sure which grill fits your space? Call us and we’ll walk you through sizing, fuel type, and
              installation.
            </p>
            <a
              href={contact.phoneHref}
              className="ml-auto shrink-0 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-white hover:text-grill-brand-hot transition-colors"
            >
              Call {contact.phoneDisplay} <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
