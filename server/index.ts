import express from 'express';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import { attachUser } from './middleware/auth';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import adminProductRoutes from './routes/adminProducts';
import adminUploadRoutes from './routes/adminUploads';
import checkoutRoutes from './routes/checkout';
import orderRoutes from './routes/orders';
import adminOrderRoutes from './routes/adminOrders';
import siteContentRoutes from './routes/siteContent';
import adminSiteContentRoutes from './routes/adminSiteContent';
import webhookRoutes from './routes/webhooks';

const app = express();

// Stripe webhook needs the raw request body for signature verification, so
// it must be registered before the global express.json() body parser.
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRoutes);

app.use(express.json());
app.use(cookieParser());
app.use(attachUser);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/admin/uploads', adminUploadRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/site-content', siteContentRoutes);
app.use('/api/admin/site-content', adminSiteContentRoutes);
app.use('/api', orderRoutes);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ error: err.message });
    return;
  }
  if (err instanceof Error && err.message.includes('allowed')) {
    res.status(400).json({ error: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
