import { Router } from 'express';
import { ContactSubmission } from '../models/ContactSubmission.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();
router.use(requireAdmin);

function serialize(s: InstanceType<typeof ContactSubmission>) {
  return {
    id: String(s._id),
    name: s.name,
    phone: s.phone,
    message: s.message,
    read: s.read,
    createdAt: s.createdAt,
  };
}

router.get('/', async (_req, res) => {
  const submissions = await ContactSubmission.find({}).sort({ createdAt: -1 });
  res.json({ submissions: submissions.map(serialize) });
});

router.patch('/:id/read', async (req, res) => {
  const submission = await ContactSubmission.findById(req.params.id);
  if (!submission) {
    res.status(404).json({ error: 'Submission not found' });
    return;
  }
  submission.read = true;
  await submission.save();
  res.json({ submission: serialize(submission) });
});

router.delete('/:id', async (req, res) => {
  const submission = await ContactSubmission.findByIdAndDelete(req.params.id);
  if (!submission) {
    res.status(404).json({ error: 'Submission not found' });
    return;
  }
  res.status(204).end();
});

export default router;
