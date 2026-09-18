import express from 'express';
import { supabase, supabaseAdmin } from '../supabase.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    let query = supabase.from('site_settings').select('*');
    if (!req.query.admin) query = query.eq('is_public', true);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.put('/:key', requireAdmin, async (req, res, next) => {
  try {
    const { value, is_public = false } = req.body;
    if (!value || typeof value !== 'object') {
      return res.status(400).json({ success: false, message: 'Value must be a valid JSON object.' });
    }

    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .upsert({ setting_key: req.params.key, setting_value: value, is_public }, { onConflict: 'setting_key' })
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

export default router;