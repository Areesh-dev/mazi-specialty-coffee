import express from 'express';
import { z } from 'zod';
import { supabase, supabaseAdmin } from '../supabase.js';
import { requireAdmin } from '../middleware/auth.js';
import { slugify, withUniqueSuffix } from '../utils/slug.js';

const router = express.Router();

const upcomingEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  poster_url: z.string().url().optional().or(z.literal('')),
  event_date: z.string(),
  event_time: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  booking_url: z.string().url().optional().nullable().or(z.literal('')),
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(false),
});

router.get('/', async (req, res, next) => {
  try {
    let query = supabase.from('upcoming_events').select('*').order('event_date', { ascending: true });
    if (!req.query.admin) {
      const today = new Date().toISOString().split('T')[0];
      query = query.eq('is_published', true).gte('event_date', today);
    }
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const validated = upcomingEventSchema.parse(req.body);
    const slug = withUniqueSuffix(slugify(validated.title));
    const { data, error } = await supabaseAdmin.from('upcoming_events').insert([{ ...validated, slug }]).select().single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ success: false, message: err.errors[0].message });
    next(err);
  }
});

router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const validated = upcomingEventSchema.partial().parse(req.body);
    if (validated.title) validated.slug = withUniqueSuffix(slugify(validated.title));
    const { data, error } = await supabaseAdmin.from('upcoming_events').update(validated).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ success: false, message: err.errors[0].message });
    next(err);
  }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { error } = await supabaseAdmin.from('upcoming_events').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Upcoming event deleted.' });
  } catch (err) { next(err); }
});

export default router;