import express from 'express';
import multer from 'multer';
import { supabaseAdmin } from '../supabase.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();


const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP are allowed.'));
    }
  },
});

router.post('/', requireAdmin, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided.' });
    }

    const { bucket, folder } = req.body;
    const validBuckets = ['profile-images', 'hero-images', 'menu-images', 'collaboration-images', 'event-images', 'review-images', 'site-assets'];
    
    if (!bucket || !validBuckets.includes(bucket)) {
      return res.status(400).json({ success: false, message: 'Invalid or missing bucket name.' });
    }

    const fileExt = req.file.originalname.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabaseAdmin.storage.from(bucket).getPublicUrl(filePath);

    res.status(200).json({ 
      success: true, 
      data: { 
        url: publicUrl, 
        path: filePath,
        bucket 
      } 
    });
  } catch (err) { next(err); }
});

export default router;