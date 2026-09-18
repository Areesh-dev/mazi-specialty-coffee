import express from 'express';
import { z } from 'zod';
import { supabase, supabaseAdmin } from '../supabase.js';
import { requireAdmin } from '../middleware/auth.js';
import { slugify, withUniqueSuffix } from '../utils/slug.js';

const router = express.Router();

const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  cover_image_url: z.string().url().optional().or(z.literal('')),
  event_date: z.string(),
  event_time: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  is_published: z.boolean().default(false),
});

const gallerySchema = z.object({
  image_url: z.string().url(),
  display_order: z.number().int().default(0),
});

router.get('/', async (req, res, next) => {
  try {
    let query = supabase.from('events').select('*').order('event_date', { ascending: false });
    if (!req.query.admin) query = query.eq('is_published', true);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const { data: event, error: eventError } = await supabase.from('events').select('*').eq('slug', req.params.slug).single();
    if (eventError || !event) return res.status(404).json({ success: false, message: 'Event not found.' });
    
    const { data: gallery, error: galleryError } = await supabase.from('event_gallery').select('*').eq('event_id', event.id).order('display_order', { ascending: true });
    if (galleryError) throw galleryError;

    res.json({ success: true, data: { ...event, gallery: gallery || [] } });
  } catch (err) { next(err); }
});

router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const validated = eventSchema.parse(req.body);
    const slug = withUniqueSuffix(slugify(validated.title));
    const { data, error } = await supabaseAdmin.from('events').insert([{ ...validated, slug }]).select().single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ success: false, message: err.errors[0].message });
    next(err);
  }
});

router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const validated = eventSchema.partial().parse(req.body);
    if (validated.title) validated.slug = withUniqueSuffix(slugify(validated.title));
    const { data, error } = await supabaseAdmin.from('events').update(validated).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ success: false, message: err.errors[0].message });
    next(err);
  }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { error } = await supabaseAdmin.from('events').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Event deleted successfully.' });
  } catch (err) { next(err); }
});

// Gallery Routes
router.post('/:id/gallery', requireAdmin, async (req, res, next) => {
  try {
    const validated = gallerySchema.parse(req.body);
    const { data, error } = await supabaseAdmin.from('event_gallery').insert([{ ...validated, event_id: req.params.id }]).select().single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ success: false, message: err.errors[0].message });
    next(err);
  }
});

router.delete('/:eventId/gallery/:galleryId', requireAdmin, async (req, res, next) => {
  try {
    const { error } = await supabaseAdmin.from('event_gallery').delete().eq('id', req.params.galleryId).eq('event_id', req.params.eventId);
    if (error) throw error;
    res.json({ success: true, message: 'Gallery image removed.' });
  } catch (err) { next(err); }
});

export default router;