import { Router } from 'express';
import { z } from 'zod';
import { ContactSubmission } from '../models/ContactSubmission.js';

const router = Router();

const submitSchema = z.object({
  name: z.string().trim().min(1).max(200),
  phone: z.string().trim().min(1).max(40),
  message: z.string().max(5000).optional().default(''),
});

router.post('/', async (req, res) => {
  const parsed = submitSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    return;
  }
  await ContactSubmission.create(parsed.data);
  res.status(201).json({ ok: true });
});

export default router;
