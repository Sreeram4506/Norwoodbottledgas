import { Router } from 'express';
import { z } from 'zod';
import { Product } from '../models/Product';
import { requireAdmin } from '../middleware/auth';

const router = Router();
router.use(requireAdmin);

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
    isActive: p.isActive,
    isPlaceholder: p.isPlaceholder,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const productSchema = z.object({
  name: z.string().trim().min(1).max(200),
  category: z.enum(['grill', 'accessory']).default('grill'),
  brand: z.string().trim().max(120).optional(),
  model: z.string().trim().max(120).optional(),
  description: z.string().max(5000).optional(),
  specs: z.record(z.string(), z.string()).optional(),
  price: z.number().min(0),
  images: z.array(z.string()).optional(),
  stock: z.number().min(0).default(0),
  isActive: z.boolean().optional(),
  slug: z.string().trim().max(200).optional(),
});

router.get('/', async (_req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 });
  res.json({ products: products.map(serialize) });
});

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json({ product: serialize(product) });
});

router.post('/', async (req, res) => {
  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    return;
  }
  const data = parsed.data;
  const baseSlug = slugify(data.slug || data.name);
  let slug = baseSlug;
  let suffix = 1;
  while (await Product.exists({ slug })) {
    slug = `${baseSlug}-${suffix++}`;
  }

  const product = await Product.create({ ...data, slug, isPlaceholder: false });
  res.status(201).json({ product: serialize(product) });
});

router.put('/:id', async (req, res) => {
  const parsed = productSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    return;
  }
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  Object.assign(product, parsed.data, { isPlaceholder: false });
  await product.save();
  res.json({ product: serialize(product) });
});

router.patch('/:id/stock', async (req, res) => {
  const parsed = z.object({ stock: z.number().min(0) }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input' });
    return;
  }
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { stock: parsed.data.stock },
    { new: true }
  );
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json({ product: serialize(product) });
});

router.delete('/:id', async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.status(204).end();
});

export default router;
