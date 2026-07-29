import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { api, type Order, type Product } from '@/lib/api';

const LOW_STOCK_THRESHOLD = 3;

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<{ orders: Order[] }>('/admin/orders'),
      api.get<{ products: Product[] }>('/admin/products'),
    ])
      .then(([o, p]) => {
        setOrders(o.orders);
        setProducts(p.products);
      })
      .finally(() => setLoading(false));
  }, []);

  const pendingCount = orders.filter((o) => o.status === 'pending_payment').length;
  const paidCount = orders.filter((o) => o.status === 'paid').length;
  const lowStock = products.filter((p) => p.isActive && p.stock <= LOW_STOCK_THRESHOLD);

  if (loading) return <p className="font-body text-white/60">Loading…</p>;

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <p className="font-mono text-xs uppercase text-white/50">Total Orders</p>
          <p className="font-display text-3xl mt-2">{orders.length}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <p className="font-mono text-xs uppercase text-white/50">Awaiting Fulfillment</p>
          <p className="font-display text-3xl mt-2">{paidCount}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <p className="font-mono text-xs uppercase text-white/50">Pending Payment</p>
          <p className="font-display text-3xl mt-2">{pendingCount}</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="font-display text-xl">Low Stock ({LOW_STOCK_THRESHOLD} or fewer)</p>
          <Link to="/admin/inventory" className="font-body text-sm text-burnt-orange hover:underline">
            Manage inventory →
          </Link>
        </div>
        {lowStock.length === 0 ? (
          <p className="font-body text-sm text-white/50">All products are well-stocked.</p>
        ) : (
          <ul className="space-y-2">
            {lowStock.map((p) => (
              <li key={p.id} className="flex justify-between font-body text-sm">
                <span>{p.name}</span>
                <span className="text-burnt-orange">{p.stock} left</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
