import { Router } from 'express';
import { z } from 'zod';
import { requireAdmin } from '../middleware/auth.ts';
import { getOrCreateSiteContent } from './siteContent.ts';

const router = Router();
router.use(requireAdmin);

const updateSchema = z.object({
  contact: z.object({
    phoneHref: z.string().trim().startsWith('tel:'),
    phoneDisplay: z.string().trim().min(1),
    addressLine: z.string().trim().min(1),
    email: z.string().trim().email(),
    winterHours: z.string().trim().min(1),
  }),
  discount: z.object({
    title: z.string().trim().min(1),
    messages: z.array(z.string()),
  }),
});

router.put('/', async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    return;
  }
  const doc = await getOrCreateSiteContent();
  doc.contact = parsed.data.contact;
  doc.discount = {
    title: parsed.data.discount.title,
    messages: parsed.data.discount.messages.map((m) => m.trim()).filter(Boolean),
  };
  await doc.save();
  res.json({ contact: doc.contact, discount: doc.discount });
});

export default router;
