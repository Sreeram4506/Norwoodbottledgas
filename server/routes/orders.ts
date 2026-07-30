import { Router } from 'express';
import { Order } from '../models/Order.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function serialize(o: InstanceType<typeof Order>) {
  return {
    id: String(o._id),
    items: o.items,
    subtotal: o.subtotal,
    status: o.status,
    contact: o.contact,
    devMode: o.devMode,
    createdAt: o.createdAt,
  };
}

router.get('/account/orders', requireAuth, async (req, res) => {
  const orders = await Order.find({ userId: req.user!.id }).sort({ createdAt: -1 });
  res.json({ orders: orders.map(serialize) });
});

// Order confirmation lookup (used by the checkout success page). Order ids
// are unguessable ObjectIds; if the order belongs to a logged-in account we
// still require that account to match before returning it.
router.get('/orders/:id', async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  if (order.userId && String(order.userId) !== req.user?.id) {
    res.status(403).json({ error: 'Not authorized to view this order' });
    return;
  }
  res.json({ order: serialize(order) });
});

export default router;
