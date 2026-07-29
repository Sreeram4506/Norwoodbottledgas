import { Router } from 'express';
import multer from 'multer';
import { requireAdmin } from '../middleware/auth.ts';
import { saveUpload } from '../lib/uploads.ts';

const router = Router();
router.use(requireAdmin);

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(new Error('Only JPEG, PNG, WebP, GIF, or SVG images are allowed'));
      return;
    }
    cb(null, true);
  },
});

router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No image file provided' });
    return;
  }

  try {
    const url = await saveUpload(req.file.buffer, req.file.originalname);
    res.status(201).json({ url });
  } catch (err) {
    res.status(500).json({ error: `Upload failed: ${(err as Error).message}` });
  }
});

export default router;
