import { Router } from 'express';
import { SiteContent } from '../models/SiteContent';

const router = Router();

export async function getOrCreateSiteContent() {
  let doc = await SiteContent.findOne({ key: 'main' });
  if (!doc) {
    doc = await SiteContent.create({ key: 'main' });
  }
  return doc;
}

router.get('/', async (_req, res) => {
  const doc = await getOrCreateSiteContent();
  res.json({ contact: doc.contact, discount: doc.discount });
});

export default router;
