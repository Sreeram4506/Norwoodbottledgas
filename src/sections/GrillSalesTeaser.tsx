import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { api, type Product } from '@/lib/api';

export default function GrillSalesTeaser() {
  const sectionRef = useScrollAnimation();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api
      .get<{ products: Product[] }>('/products?category=grill')
      .then((res) => setProducts(res.products.slice(0, 3)))
      .catch(() => setProducts([]));
  }, []);

  if (products.length === 0) return null;

  return (
    <section id="grill-sales" ref={sectionRef} className="w-full bg-warm-cream py-20 md:py-40">
      <div className="max-w-[1280px] mx-auto px-5 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-16">
          <div>
            <h2
              className="font-display text-[32px] md:text-[56px] text-warm-charcoal"
              data-animate
              data-y="40"
              data-duration="0.8"
            >
              Grill Sales
            </h2>
            <p className="font-body text-warm-gray/90 mt-3 max-w-[560px]" data-animate data-y="30" data-duration="0.7">
              Authorized MHP Grills dealer — shop our lineup of stainless steel gas grills.
            </p>
          </div>
          <Link
            to="/grills"
            className="shrink-0 bg-burnt-orange text-white rounded-pill px-6 py-3 text-sm font-medium hover:bg-burnt-orange-hover transition-colors duration-300"
          >
            Shop All Grills
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((p) => (
            <Link
              key={p.id}
              to={`/grills/${p.slug}`}
              className="bg-white rounded-xl shadow-card overflow-hidden hover:-translate-y-1.5 hover:shadow-float transition-all duration-350 group"
              data-animate
              data-y="60"
              data-stagger="0.2"
              data-duration="0.8"
            >
              <div
                className="aspect-[4/3] flex items-center justify-center p-8"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(90,125,108,0.12), transparent 42%), radial-gradient(circle at 45% 30%, rgba(255,255,255,0.95), rgba(242,235,227,0.85) 55%, rgba(208,200,190,0.5))',
                }}
              >
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-full h-full object-contain drop-shadow-[0_16px_20px_rgba(45,41,38,0.14)] group-hover:scale-[1.06] transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl text-warm-charcoal">{p.name}</h3>
                <p className="font-mono text-sm text-burnt-orange mt-2">${p.price.toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
