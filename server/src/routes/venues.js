import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db/index.js';

export const venuesRouter = Router();

function serializeVenue(row) {
  return { ...row, supported_functions: JSON.parse(row.supported_functions) };
}

// GET /api/venues — list all venues
venuesRouter.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM venues ORDER BY sort_order ASC').all();
  res.json(rows.map(serializeVenue));
});

const matchQuerySchema = z.object({
  guests: z.coerce.number().int().positive().max(5000).optional(),
  functions: z.string().optional(), // comma-separated
});

// GET /api/venues/match?guests=300&functions=Wedding,Reception
// Simple, transparent rule-based scoring — NOT a black-box algorithm.
venuesRouter.get('/match', (req, res) => {
  const parsed = matchQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid query', details: parsed.error.flatten() });
  }
  const { guests, functions } = parsed.data;
  const wantedFunctions = functions ? functions.split(',').map((f) => f.trim()).filter(Boolean) : [];

  const rows = db.prepare('SELECT * FROM venues ORDER BY sort_order ASC').all().map(serializeVenue);

  const scored = rows.map((venue) => {
    let score = 0;
    let maxScore = 0;

    // Capacity fit (0-60 points)
    maxScore += 60;
    if (guests) {
      if (guests >= venue.min_guests && guests <= venue.max_guests) {
        score += 60;
      } else if (guests < venue.min_guests) {
        const gap = venue.min_guests - guests;
        score += Math.max(0, 60 - gap * 0.3);
      } else {
        const gap = guests - venue.max_guests;
        score += Math.max(0, 60 - gap * 0.2);
      }
    } else {
      score += 30; // neutral if not specified
    }

    // Function coverage (0-40 points)
    maxScore += 40;
    if (wantedFunctions.length > 0) {
      const covered = wantedFunctions.filter((f) => venue.supported_functions.includes(f)).length;
      score += (covered / wantedFunctions.length) * 40;
    } else {
      score += 20;
    }

    const percent = Math.round((score / maxScore) * 100);
    return { ...venue, matchPercent: Math.min(99, Math.max(35, percent)) };
  });

  scored.sort((a, b) => b.matchPercent - a.matchPercent);
  res.json(scored);
});

// GET /api/venues/:slug
venuesRouter.get('/:slug', (req, res) => {
  const row = db.prepare('SELECT * FROM venues WHERE slug = ?').get(req.params.slug);
  if (!row) return res.status(404).json({ error: 'Venue not found' });
  res.json(serializeVenue(row));
});
