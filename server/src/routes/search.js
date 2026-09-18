import express from 'express';
import { supabase } from '../supabase.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.status(400).json({ success: false, message: 'Search query is required.' });
    }

    const searchTerm = `%${q.trim()}%`;

    const [menu, categories, events, collaborations] = await Promise.all([
      supabase.from('menu_items').select('id, name, slug, description, price').eq('is_available', true).ilike('name', searchTerm),
      supabase.from('categories').select('id, name, slug, description').eq('is_active', true).ilike('name', searchTerm),
      supabase.from('events').select('id, title, slug, description').eq('is_published', true).ilike('title', searchTerm),
      supabase.from('collaborations').select('id, title, partner_name, description').eq('is_published', true).ilike('title', searchTerm),
    ]);

    res.json({
      success: true,
      data: {
        menu: menu.data || [],
        categories: categories.data || [],
        events: events.data || [],
        collaborations: collaborations.data || [],
      }
    });
  } catch (err) { next(err); }
});

export default router;