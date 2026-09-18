import express from 'express';
import { z } from 'zod';
import { supabase, supabaseAdmin } from '../supabase.js';
import { requireAdmin } from '../middleware/auth.js';
import { slugify, withUniqueSuffix } from '../utils/slug.js';

const router = express.Router();

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  icon: z.string().optional(),
  display_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});


router.get('/', async (req, res, next) => {
  try {
    let query = supabase.from('categories').select('*').order('display_order', { ascending: true });
    if (!req.query.admin) {
      query = query.eq('is_active', true);
    }
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { next(err); }
});


router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const validated = categorySchema.parse(req.body);
    const slug = withUniqueSuffix(slugify(validated.name));
    
    const { data, error } = await supabaseAdmin.from('categories').insert([{ ...validated, slug }]).select().single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ success: false, message: err.errors[0].message });
    next(err);
  }
});

router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const validated = categorySchema.partial().parse(req.body);
    if (validated.name) {
      validated.slug = withUniqueSuffix(slugify(validated.name));
    }
    
    const { data, error } = await supabaseAdmin.from('categories').update(validated).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ success: false, message: err.errors[0].message });
    next(err);
  }
});


router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    
    const { count } = await supabaseAdmin.from('menu_items').select('*', { count: 'exact', head: true }).eq('category_id', req.params.id);
    if (count > 0) {
      return res.status(400).json({ success: false, message: 'Cannot delete category with associated menu items.' });
    }

    const { error } = await supabaseAdmin.from('categories').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (err) { next(err); }
});

export default router;