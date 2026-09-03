import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import { env } from './config/env.js';
import './db/index.js'; // ensures schema is created on boot

import { venuesRouter } from './routes/venues.js';
import { availabilityRouter } from './routes/availability.js';
import { enquiriesRouter } from './routes/enquiries.js';
import { storiesRouter } from './routes/stories.js';
import { estimateRouter } from './routes/estimate.js';
import { ratesRouter } from './routes/rates.js';
import { adminRouter } from './routes/admin.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '200kb' }));
app.use(morgan(env.isProd ? 'combined' : 'dev'));

app.use(
  cors({
    origin: env.isProd ? env.clientOrigin : true,
    credentials: false,
  })
);

// General API rate limit — generous for normal browsing, protective against abuse/scraping.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

// Stricter limit specifically on enquiry submission to prevent spam.
const enquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many enquiries submitted from this network. Please try again later.' },
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hotel: env.hotelName, env: env.nodeEnv, time: new Date().toISOString() });
});

app.use('/api/venues', venuesRouter);
app.use('/api/availability', availabilityRouter);
app.use('/api/stories', storiesRouter);
app.use('/api/estimate', estimateRouter);
app.use('/api/rates', ratesRouter);
app.use('/api/admin', adminRouter);
app.use('/api/enquiries', enquiryLimiter, enquiriesRouter);

// --- Serve the built React app in production (single-service deploy) ---
const clientDist = path.resolve(__dirname, '../../client/dist');
if (env.isProd && fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.use('/api', notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`🌼 ${env.hotelName} Wedding Suite API running on http://localhost:${env.port} [${env.nodeEnv}]`);
});

