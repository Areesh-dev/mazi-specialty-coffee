import express from 'express';
import { z } from 'zod';
import { supabase, supabaseAdmin } from '../supabase.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

const heroSchema = z.object({
  eyebrow: z.string().optional().nullable(),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  image_url: z.string().url(),
  cta_text: z.string().optional().nullable(),
  cta_url: z.string().url().optional().nullable().or(z.literal('')),
  display_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

router.get('/', async (req, res, next) => {
  try {
    let query = supabase.from('hero_slides').select('*').order('display_order', { ascending: true });
    if (!req.query.admin) query = query.eq('is_active', true);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const validated = heroSchema.parse(req.body);
    const { data, error } = await supabaseAdmin.from('hero_slides').insert([validated]).select().single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ success: false, message: err.errors[0].message });
    next(err);
  }
});

router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const validated = heroSchema.partial().parse(req.body);
    const { data, error } = await supabaseAdmin.from('hero_slides').update(validated).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ success: false, message: err.errors[0].message });
    next(err);
  }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { error } = await supabaseAdmin.from('hero_slides').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Hero slide deleted.' });
  } catch (err) { next(err); }
});

export default router;