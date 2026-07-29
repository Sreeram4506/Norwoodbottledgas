import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { CheckCircle2, ShieldCheck, Truck } from 'lucide-react';
import Navigation from '@/components/Navigation';
import FloatingCTA from '@/components/FloatingCTA';
import Footer from '@/sections/Footer';
import { api, type Product } from '@/lib/api';
import { useCart } from '@/context/CartContext';

const GALLERY_BG =
  'linear-gradient(135deg, rgba(49,95,103,0.11), transparent 45%), radial-gradient(circle at 45% 30%, rgba(255,255,255,0.94), rgba(232,236,228,0.82) 55%, rgba(201,208,196,0.55))';

export default function GrillDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setProduct(null);
    setNotFound(false);

    api
      .get<{ product: Product }>(`/products/${slug}`)
      .then((res) => {
        if (!cancelled) {
          setProduct(res.product);
          setActiveImage(res.product.images[0] ?? null);
        }
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <div className="relative">
      <Navigation />
      <main className="pt-32 md:pt-40 pb-20 md:pb-32 bg-grill-paper min-h-[70vh]">
        <div className="max-w-[1200px] mx-auto px-5 md:px-12">
          <Link
            to="/grills"
            className="font-mono text-xs uppercase tracking-wide text-grill-muted hover:text-grill-brand-hot transition-colors"
          >
            ← Back to Grill Sales
          </Link>

          {notFound && (
            <p className="font-body text-grill-muted mt-8">
              We couldn't find that product. It may have been removed from the catalog.
            </p>
          )}

          {!product && !notFound && <p className="font-body text-grill-muted mt-8">Loading…</p>}

          {product && (
            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-16 mt-6">
              {/* Gallery */}
              <section>
                <div
                  className="relative aspect-square rounded-[10px] border border-grill-line shadow-grill-sm overflow-hidden flex items-center justify-center p-10"
                  style={{ background: GALLERY_BG }}
                >
                  {product.isPlaceholder && (
                    <span className="absolute left-4 top-4 z-10 bg-white/95 text-grill-brand border border-grill-brand-hot/25 font-mono text-[10px] uppercase tracking-wide rounded-full px-2.5 py-1">
                      Placeholder
                    </span>
                  )}
                  {activeImage && (
                    <img
                      src={activeImage}
                      alt={product.name}
                      className="w-full h-full object-contain drop-shadow-[0_20px_24px_rgba(24,27,27,0.16)]"
                    />
                  )}
                </div>

                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3 mt-3">
                    {product.images.map((img) => (
                      <button
                        key={img}
                        onClick={() => setActiveImage(img)}
                        className={`aspect-square rounded-[10px] overflow-hidden border bg-grill-panel transition-all ${
                          activeImage === img
                            ? 'border-2 border-grill-brand-hot shadow-[0_12px_24px_rgba(255,92,0,0.12)]'
                            : 'border-grill-line hover:-translate-y-0.5'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </section>

              {/* Details */}
              <section className="bg-grill-panel/70 backdrop-blur border border-grill-line rounded-[10px] shadow-grill-sm p-6 md:p-8">
                <small className="font-mono text-xs uppercase tracking-[0.14em] text-grill-brand">
                  {product.category === 'grill' ? 'Grill' : 'Accessory'}
                  {product.brand ? ` · ${product.brand}` : ''}
                </small>
                <h1 className="font-display text-[32px] md:text-[44px] leading-[0.95] uppercase text-grill-ink mt-2">
                  {product.name}
                </h1>
                <div className="font-mono text-3xl md:text-4xl font-bold text-grill-brand mt-5">
                  ${product.price.toLocaleString()}
                </div>
                <p className="font-body text-base text-grill-muted mt-4 leading-relaxed">{product.description}</p>

                <div className="grid grid-cols-3 gap-2.5 my-7">
                  <div className="flex flex-col items-center justify-center gap-1.5 min-h-[72px] p-3 border border-grill-line rounded-[10px] bg-grill-panel text-center">
                    <Truck size={18} className="text-grill-brand-hot" />
                    <span className="font-body text-xs text-grill-ink-soft">Local delivery</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1.5 min-h-[72px] p-3 border border-grill-line rounded-[10px] bg-grill-panel text-center">
                    <ShieldCheck size={18} className="text-grill-brand-hot" />
                    <span className="font-body text-xs text-grill-ink-soft">Warranty backed</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1.5 min-h-[72px] p-3 border border-grill-line rounded-[10px] bg-grill-panel text-center">
                    <CheckCircle2 size={18} className="text-grill-brand-hot" />
                    <span className="font-body text-xs text-grill-ink-soft">Setup available</span>
                  </div>
                </div>

                {Object.keys(product.specs).length > 0 && (
                  <div className="mb-7">
                    <h3 className="font-mono text-xs uppercase tracking-[0.1em] text-grill-ink mb-3">Specs</h3>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {Object.entries(product.specs).map(([k, v]) => (
                        <div
                          key={k}
                          className="flex justify-between gap-3 border border-grill-line rounded-[10px] bg-grill-panel px-3.5 py-2.5"
                        >
                          <dt className="font-body text-sm text-grill-muted capitalize">{k}</dt>
                          <dd className="font-body text-sm text-grill-ink font-medium text-right">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-grill-line-strong rounded-md overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="px-4 py-2.5 text-grill-ink hover:bg-grill-panel-warm transition-colors"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="font-mono text-sm w-8 text-center">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.min(product.stock || 1, q + 1))}
                      className="px-4 py-2.5 text-grill-ink hover:bg-grill-panel-warm transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={!product.inStock}
                    onClick={() => {
                      addItem(product, qty);
                      setAdded(true);
                      window.setTimeout(() => setAdded(false), 2000);
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-grill-brand-hot px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wide text-white shadow-[0_16px_34px_rgba(255,92,0,0.28)] hover:bg-grill-brand-strong transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>

                {added && (
                  <div className="mt-4 flex items-center gap-3">
                    <p className="font-body text-sm text-grill-sage">Added to cart.</p>
                    <button
                      type="button"
                      onClick={() => navigate('/cart')}
                      className="font-body text-sm text-grill-brand hover:underline"
                    >
                      View cart →
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-grill-line">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-[#ECF8F0] text-[#16733A]">
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                  <p className="font-body text-sm text-grill-muted">
                    {product.inStock ? `${product.stock} available` : 'Check back soon, or call us to special-order.'}
                  </p>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
