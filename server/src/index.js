import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { errorHandler, notFoundHandler } from './middleware/error.js';


import categoriesRouter from './routes/categories.js';
import menuRouter from './routes/menu.js';
import collaborationsRouter from './routes/collaborations.js';
import eventsRouter from './routes/events.js';
import upcomingEventsRouter from './routes/upcomingEvents.js';
import reviewsRouter from './routes/reviews.js';
import heroRouter from './routes/hero.js';
import contentRouter from './routes/content.js';
import settingsRouter from './routes/settings.js';
import uploadRouter from './routes/upload.js';
import searchRouter from './routes/search.js';
import adminStatsRouter from './routes/adminStats.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;


app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));



const publicReadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: process.env.NODE_ENV === 'development' ? 5000 : 300, 
  message: { success: false, message: 'Too many requests, please try again later.' }
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' }
});

app.use('/api', (req, res, next) => {
  if (req.method === 'GET') {
    return publicReadLimiter(req, res, next);
  }
  return strictLimiter(req, res, next);
});


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Mazi API is running smoothly.' });
});


app.use('/api/categories', categoriesRouter);
app.use('/api/menu', menuRouter);
app.use('/api/collaborations', collaborationsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/upcoming-events', upcomingEventsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/hero', heroRouter);
app.use('/api/content', contentRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/search', searchRouter);
app.use('/api/admin/stats', adminStatsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});