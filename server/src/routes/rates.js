import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db/index.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

export const ratesRouter = Router();

// GET /api/rates — used by the live estimator AND the admin Rates tab.
// Public on purpose: the couple-facing budget calculator needs it too.
ratesRouter.get('/', (req, res) => {
  const rows = db.prepare('SELECT key, label, value, unit, updated_at FROM rates ORDER BY key').all();
  res.json(rows);
});

const updateSchema = z.object({
  value: z.coerce.number().nonnegative().max(1000000),
});

// PUT /api/rates/:key — admin only. This is the entire "pricing engine" —
// deliberately just a number per rate, no formulas exposed, to keep the
// sales-facing UI simple.
ratesRouter.put('/:key', requireAdmin, (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Provide a numeric value', details: parsed.error.flatten() });

  const result = db
    .prepare(`UPDATE rates SET value = ?, updated_at = datetime('now') WHERE key = ?`)
    .run(parsed.data.value, req.params.key);

  if (result.changes === 0) return res.status(404).json({ error: 'Unknown rate key' });

  const row = db.prepare('SELECT key, label, value, unit, updated_at FROM rates WHERE key = ?').get(req.params.key);
  res.json(row);
});
