import express from 'express';
import { z } from 'zod';
import { supabase, supabaseAdmin } from '../supabase.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

const collabSchema = z.object({
  title: z.string().min(1),
  partner_name: z.string().min(1),
  description: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  event_date: z.string().optional().nullable(),
  external_url: z.string().url().optional().nullable().or(z.literal('')),
  is_published: z.boolean().default(false),
  display_order: z.number().int().default(0),
});

router.get('/', async (req, res, next) => {
  try {
    let query = supabase.from('collaborations').select('*').order('display_order', { ascending: true });
    if (!req.query.admin) query = query.eq('is_published', true);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const validated = collabSchema.parse(req.body);
    const { data, error } = await supabaseAdmin.from('collaborations').insert([validated]).select().single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ success: false, message: err.errors[0].message });
    next(err);
  }
});

router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const validated = collabSchema.partial().parse(req.body);
    const { data, error } = await supabaseAdmin.from('collaborations').update(validated).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ success: false, message: err.errors[0].message });
    next(err);
  }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { error } = await supabaseAdmin.from('collaborations').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Collaboration deleted.' });
  } catch (err) { next(err); }
});

export default router;