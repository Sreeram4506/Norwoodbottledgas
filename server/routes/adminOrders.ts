import { Router } from 'express';
import { z } from 'zod';
import { Order } from '../models/Order.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();
router.use(requireAdmin);

function serialize(o: InstanceType<typeof Order>) {
  return {
    id: String(o._id),
    userId: o.userId ? String(o.userId) : null,
    items: o.items,
    subtotal: o.subtotal,
    status: o.status,
    contact: o.contact,
    adminNotes: o.adminNotes,
    devMode: o.devMode,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}

router.get('/', async (req, res) => {
  const status = typeof req.query.status === 'string' ? req.query.status : undefined;
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  const orders = await Order.find(filter).sort({ createdAt: -1 });
  res.json({ orders: orders.map(serialize) });
});

router.get('/:id', async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  res.json({ order: serialize(order) });
});

const updateSchema = z.object({
  status: z.enum(['pending_payment', 'paid', 'fulfilled', 'cancelled']).optional(),
  contact: z
    .object({
      name: z.string().trim().min(1),
      email: z.string().trim().email(),
      phone: z.string().trim().max(40).optional().default(''),
    })
    .optional(),
  adminNotes: z.string().max(2000).optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        name: z.string().trim().min(1),
        price: z.number().min(0),
        qty: z.number().int().min(1).max(999),
      })
    )
    .min(1)
    .optional(),
});

router.patch('/:id', async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    return;
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  const { status, contact, adminNotes, items } = parsed.data;
  if (status !== undefined) order.status = status;
  if (contact !== undefined) order.contact = contact;
  if (adminNotes !== undefined) order.adminNotes = adminNotes;
  if (items !== undefined) {
    // Mongoose casts a plain array of objects into the DocumentArray at
    // runtime; the cast here just satisfies the stricter subdocument type.
    order.items = items as unknown as typeof order.items;
    order.subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  await order.save();
  res.json({ order: serialize(order) });
});

export default router;
