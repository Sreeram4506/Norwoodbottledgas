import { Router } from 'express';
import type Stripe from 'stripe';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { getStripe, isStripeConfigured } from '../lib/stripe.js';

const router = Router();

// Mounted with express.raw() in server/index.ts so we can verify the Stripe signature.
router.post('/stripe', async (req, res) => {
  if (!isStripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    res.status(400).json({ error: 'Stripe is not configured' });
    return;
  }

  const signature = req.headers['stripe-signature'];
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      req.body as Buffer,
      signature as string,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    res.status(400).json({ error: `Webhook signature verification failed: ${(err as Error).message}` });
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const order = await Order.findOne({ stripeSessionId: session.id });
    if (order && order.status === 'pending_payment') {
      order.status = 'paid';
      await order.save();
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.qty } });
      }
    }
  }

  res.json({ received: true });
});

export default router;
