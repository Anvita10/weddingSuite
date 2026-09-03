import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db/index.js';
import { env } from '../config/env.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

export const availabilityRouter = Router();

const monthQuerySchema = z.object({
  year: z.coerce.number().int().min(2020).max(2100),
  month: z.coerce.number().int().min(1).max(12), // 1-indexed for a human-friendly API
});

// GET /api/availability?year=2026&month=12
availabilityRouter.get('/', (req, res) => {
  const parsed = monthQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Provide numeric year and month (1-12).', details: parsed.error.flatten() });
  }
  const { year, month } = parsed.data;
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  const rows = db
    .prepare('SELECT date, status FROM availability WHERE date LIKE ? ORDER BY date ASC')
    .all(`${prefix}%`);

  res.json({
    year,
    month,
    hotelName: env.hotelName,
    note: 'Dates reflect the hotel team\'s own calendar. Update via PUT /api/availability/:date (admin only).',
    days: rows,
  });
});

const updateSchema = z.object({
  status: z.enum(['available', 'filling_fast', 'booked']),
});

// PUT /api/availability/:date  (admin only) — the hotel's own team keeps this current.
availabilityRouter.put('/:date', requireAdmin, (req, res) => {
  const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
  const dateCheck = dateSchema.safeParse(req.params.date);
  if (!dateCheck.success) return res.status(400).json({ error: 'date must be YYYY-MM-DD' });

  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid status', details: parsed.error.flatten() });

  db.prepare(
    `INSERT INTO availability (date, status) VALUES (?, ?)
     ON CONFLICT(date) DO UPDATE SET status = excluded.status`
  ).run(dateCheck.data, parsed.data.status);

  res.json({ date: dateCheck.data, status: parsed.data.status });
});

const bulkSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(['available', 'filling_fast', 'booked']),
});

// PUT /api/availability-bulk (admin only) — set a whole date range at once,
// e.g. "block off this whole week" — the one bit of complexity worth having
// because typing 7 individual dates by hand is genuinely tedious.
availabilityRouter.put('/bulk/range', requireAdmin, (req, res) => {
  const parsed = bulkSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });

  const { startDate, endDate, status } = parsed.data;
  if (endDate < startDate) return res.status(400).json({ error: 'endDate must be on or after startDate' });

  const start = new Date(startDate);
  const end = new Date(endDate);
  const dayMs = 24 * 60 * 60 * 1000;
  if ((end - start) / dayMs > 366) {
    return res.status(400).json({ error: 'Range too large — please choose 366 days or fewer.' });
  }

  const upsert = db.prepare(
    `INSERT INTO availability (date, status) VALUES (?, ?)
     ON CONFLICT(date) DO UPDATE SET status = excluded.status`
  );
  const tx = db.transaction((dates) => dates.forEach((d) => upsert.run(d, status)));

  const dates = [];
  for (let d = new Date(start); d <= end; d = new Date(d.getTime() + dayMs)) {
    dates.push(d.toISOString().slice(0, 10));
  }
  tx(dates);

  res.json({ updated: dates.length, startDate, endDate, status });
});

