import express from 'express';
import { z } from 'zod';
import { supabase, supabaseAdmin } from '../supabase.js';
import { requireAdmin } from '../middleware/auth.js';
import { slugify, withUniqueSuffix } from '../utils/slug.js';

const router = express.Router();

const menuItemSchema = z.object({
  category_id: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().nonnegative('Price must be positive'),
  image_url: z.string().url().optional().or(z.literal('')),
  is_featured: z.boolean().default(false),
  is_available: z.boolean().default(true),
  display_order: z.number().int().default(0),
});

router.get('/', async (req, res, next) => {
  try {
    let query = supabase.from('menu_items').select('*, categories(name, slug)').order('display_order', { ascending: true });
    
    if (req.query.category) query = query.eq('categories.slug', req.query.category);
    if (req.query.featured === 'true') query = query.eq('is_featured', true);
    if (req.query.available === 'true') query = query.eq('is_available', true);
    if (req.query.search) query = query.ilike('name', `%${req.query.search}%`);
    if (!req.query.admin) query = query.eq('is_available', true);

    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('menu_items').select('*, categories(name, slug)').eq('slug', req.params.slug).single();
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: 'Menu item not found.' });
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const validated = menuItemSchema.parse(req.body);
    const slug = withUniqueSuffix(slugify(validated.name));
    const { data, error } = await supabaseAdmin.from('menu_items').insert([{ ...validated, slug }]).select().single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ success: false, message: err.errors[0].message });
    next(err);
  }
});

router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const validated = menuItemSchema.partial().parse(req.body);
    if (validated.name) validated.slug = withUniqueSuffix(slugify(validated.name));
    const { data, error } = await supabaseAdmin.from('menu_items').update(validated).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ success: false, message: err.errors[0].message });
    next(err);
  }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { error } = await supabaseAdmin.from('menu_items').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Menu item deleted successfully.' });
  } catch (err) { next(err); }
});

export default router;