import { Router } from 'express';
import { Product } from '../models/Product';

const router = Router();

function serialize(p: InstanceType<typeof Product>) {
  return {
    id: String(p._id),
    slug: p.slug,
    name: p.name,
    category: p.category,
    brand: p.brand,
    model: p.model,
    description: p.description,
    specs: Object.fromEntries(p.specs ?? []),
    price: p.price,
    images: p.images,
    stock: p.stock,
    inStock: p.stock > 0,
    isPlaceholder: p.isPlaceholder,
  };
}

router.get('/', async (req, res) => {
  const category = typeof req.query.category === 'string' ? req.query.category : undefined;
  const filter: Record<string, unknown> = { isActive: true };
  if (category) filter.category = category;

  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json({ products: products.map(serialize) });
});

router.get('/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true });
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json({ product: serialize(product) });
});

export default router;
