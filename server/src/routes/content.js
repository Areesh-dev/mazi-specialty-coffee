import express from 'express';
import { z } from 'zod';
import { supabase, supabaseAdmin } from '../supabase.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('website_content').select('*');
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.get('/:section', async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('website_content').select('*').eq('section_key', req.params.section).single();
    if (error && error.code !== 'PGRST116') throw error;
    res.json({ success: true, data: data || null });
  } catch (err) { next(err); }
});

router.put('/:section', requireAdmin, async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content || typeof content !== 'object') {
      return res.status(400).json({ success: false, message: 'Content must be a valid JSON object.' });
    }

    const { data, error } = await supabaseAdmin
      .from('website_content')
      .upsert({ section_key: req.params.section, content }, { onConflict: 'section_key' })
      .select()
      .single();
      
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

export default router;