import express from 'express';
import { supabaseAdmin } from '../supabase.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const [
      { count: totalCategories },
      { count: activeMenuItems },
      { count: totalCollaborations },
      { count: publishedEvents },
      { count: upcomingEvents },
      { count: pendingReviews },
      { count: approvedReviews }
    ] = await Promise.all([
      supabaseAdmin.from('categories').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('menu_items').select('*', { count: 'exact', head: true }).eq('is_available', true),
      supabaseAdmin.from('collaborations').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('events').select('*', { count: 'exact', head: true }).eq('is_published', true),
      supabaseAdmin.from('upcoming_events').select('*', { count: 'exact', head: true }).eq('is_published', true),
      supabaseAdmin.from('reviews').select('*', { count: 'exact', head: true }).eq('status', 'PENDING'),
      supabaseAdmin.from('reviews').select('*', { count: 'exact', head: true }).eq('status', 'APPROVED'),
    ]);

    res.json({
      success: true,
      data: {
        totalCategories,
        activeMenuItems,
        totalCollaborations,
        publishedEvents,
        upcomingEvents,
        pendingReviews,
        approvedReviews,
      }
    });
  } catch (err) { next(err); }
});

export default router;