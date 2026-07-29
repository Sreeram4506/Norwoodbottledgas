import { Router } from 'express';
import { z } from 'zod';
import { Product } from '../models/Product.ts';
import { Order } from '../models/Order.ts';
import { getStripe, isStripeConfigured } from '../lib/stripe.ts';
import { getAppBaseUrl } from '../lib/appUrl.ts';

const router = Router();

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        qty: z.number().int().min(1).max(50),
      })
    )
    .min(1),
  contact: z.object({
    name: z.string().trim().min(1).max(200),
    email: z.string().trim().email(),
    phone: z.string().trim().max(40).optional().default(''),
  }),
});

router.post('/create-session', async (req, res) => {
  const parsed = checkoutSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    return;
  }
  const { items, contact } = parsed.data;

  const productIds = items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds }, isActive: true });
  const productById = new Map(products.map((p) => [String(p._id), p]));

  const orderItems: { productId: string; name: string; price: number; qty: number }[] = [];
  for (const item of items) {
    const product = productById.get(item.productId);
    if (!product) {
      res.status(400).json({ error: `Product ${item.productId} is not available` });
      return;
    }
    if (product.stock < item.qty) {
      res.status(400).json({ error: `Not enough stock for ${product.name}` });
      return;
    }
    orderItems.push({ productId: item.productId, name: product.name, price: product.price, qty: item.qty });
  }

  const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  const order = await Order.create({
    userId: req.user?.id ?? null,
    items: orderItems,
    subtotal,
    status: 'pending_payment',
    contact,
  });

  const baseUrl = getAppBaseUrl(req);

  if (!isStripeConfigured()) {
    // Dev-mode fallback so checkout is fully testable without a real Stripe
    // account. Marks the order paid immediately and decrements stock.
    // NOT for production use — set STRIPE_SECRET_KEY to enable real payments.
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.qty } });
    }
    order.status = 'paid';
    order.devMode = true;
    await order.save();
    res.json({ url: `${baseUrl}/checkout/success?order=${order._id}&dev=1` });
    return;
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: contact.email,
    line_items: orderItems.map((item) => ({
      quantity: item.qty,
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(item.price * 100),
        product_data: { name: item.name },
      },
    })),
    success_url: `${baseUrl}/checkout/success?order=${order._id}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/checkout/cancel?order=${order._id}`,
    metadata: { orderId: String(order._id) },
  });

  order.stripeSessionId = session.id;
  await order.save();

  res.json({ url: session.url });
});

export default router;
