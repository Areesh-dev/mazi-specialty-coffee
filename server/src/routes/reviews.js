
import express from 'express';
import { z } from 'zod';
import { supabase, supabaseAdmin } from '../supabase.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

const reviewSchema = z.object({
  customer_name: z.string().min(1, 'Name is required'),
  email: z.string().email().optional().or(z.literal('')),
  rating: z.number().int().min(1).max(5),
  review_text: z.string().min(1, 'Review text is required'),
  image_url: z.string().url().optional().or(z.literal('')),
});

router.get('/', async (req, res, next) => {
  try {
    const isAdminRequest = req.query.admin === 'true';
    
    const client = isAdminRequest ? supabaseAdmin : supabase;
    
    let query = client.from('reviews').select('*').order('created_at', { ascending: false });
    
    if (isAdminRequest) {
      if (req.query.status) query = query.eq('status', req.query.status);
    } else {
      query = query.eq('status', 'APPROVED');
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { next(err); }
});


router.post('/', async (req, res, next) => {
  try {
    const validated = reviewSchema.parse(req.body);
    
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .insert([{ ...validated, status: 'PENDING' }])
      .select()
      .single();
      
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ success: false, message: err.errors[0].message });
    next(err);
  }
});

router.patch('/:id/status', requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['APPROVED', 'DECLINED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Must be APPROVED or DECLINED.' });
    }
    const { data, error } = await supabaseAdmin.from('reviews').update({ status }).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { error } = await supabaseAdmin.from('reviews').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Review deleted.' });
  } catch (err) { next(err); }
});

export default router;