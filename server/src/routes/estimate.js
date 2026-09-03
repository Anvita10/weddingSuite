import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db/index.js';

export const estimateRouter = Router();

const schema = z.object({
  guests: z.coerce.number().int().positive().max(5000),
  functions: z.array(z.string()).min(1),
  decorStyle: z.enum(['Royal', 'Contemporary', 'Classic']).default('Classic'),
  roomsNeeded: z.coerce.number().int().min(0).max(500).default(0),
});

// Function weight relative to a full Wedding day — kept as code, not a DB
// setting, since it's a product-shape decision rather than something a
// sales person needs to tune day-to-day. Plate/room rates ARE in the DB
// (see routes/rates.js) precisely because those DO change often.
const FUNCTION_MULTIPLIER = {
  Wedding: 1,
  Reception: 0.8,
  Sangeet: 0.55,
  Mehendi: 0.4,
  Engagement: 0.45,
};

function getRate(key, fallback) {
  const row = db.prepare('SELECT value FROM rates WHERE key = ?').get(key);
  return row ? row.value : fallback;
}

// POST /api/estimate — used live by the "Build Your Wedding" configurator.
// Reads plate/room rates from the database so the sales team's edits in the
// admin Rates tab take effect immediately, with no redeploy.
// Always returned as an explicit range with a disclaimer — never a single confirmed number.
estimateRouter.post('/', (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
  }
  const { guests, functions, decorStyle, roomsNeeded } = parsed.data;

  const plateRateKey = `plate_${decorStyle.toLowerCase()}`;
  const plateRate = getRate(plateRateKey, 1000);
  const roomRate = getRate('room_night', 3500);

  const functionCost = functions.reduce((sum, fn) => {
    const mult = FUNCTION_MULTIPLIER[fn] ?? 0.5;
    return sum + guests * plateRate * mult;
  }, 0);

  const roomCost = roomsNeeded * roomRate;
  const midpoint = functionCost + roomCost;

  const low = Math.round((midpoint * 0.9) / 10000) * 10000;
  const high = Math.round((midpoint * 1.15) / 10000) * 10000;

  res.json({
    guests,
    functions,
    decorStyle,
    roomsNeeded,
    estimatedRange: { low, high, currency: 'INR' },
    disclaimer: 'Indicative only — your final quote is confirmed with our wedding team.',
  });
});