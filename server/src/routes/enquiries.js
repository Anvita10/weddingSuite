import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db/index.js';
import { env } from '../config/env.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

export const enquiriesRouter = Router();

const createSchema = z.object({
  coupleNames: z.string().min(2).max(120),
  phone: z.string().min(7).max(20),
  email: z.string().email().optional().or(z.literal('')).transform((v) => v || null),
  preferredDate: z.string().optional().nullable(),
  guestCount: z.coerce.number().int().positive().max(5000),
  functions: z.array(z.string()).min(1),
  foodPreference: z.string().optional().nullable(),
  decorStyle: z.string().optional().nullable(),
  roomsNeeded: z.coerce.number().int().min(0).max(500).default(0),
  budgetMin: z.coerce.number().int().nonnegative().optional().nullable(),
  budgetMax: z.coerce.number().int().nonnegative().optional().nullable(),
  matchedVenue: z.string().optional().nullable(),
  siteVisitRequested: z.boolean().default(false),
});

function buildWhatsAppLink(payload) {
  if (!env.whatsappNumber) return null;
  const lines = [
    `NEW WEDDING ENQUIRY — ${env.hotelName}`,
    `Couple: ${payload.coupleNames}`,
    `Guests: ${payload.guestCount}`,
    `Functions: ${payload.functions.join(', ')}`,
    payload.decorStyle ? `Décor: ${payload.decorStyle}` : null,
    payload.roomsNeeded ? `Rooms: ${payload.roomsNeeded}` : null,
    payload.preferredDate ? `Preferred Date: ${payload.preferredDate}` : null,
    payload.budgetMin && payload.budgetMax ? `Estimated Budget: ₹${payload.budgetMin} - ₹${payload.budgetMax}` : null,
    payload.siteVisitRequested ? 'Site Visit: Requested' : null,
  ].filter(Boolean);
  const text = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${env.whatsappNumber}?text=${text}`;
}

// POST /api/enquiries — the "Smart Enquiry" submission from the couple's side
enquiriesRouter.post('/', (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid enquiry', details: parsed.error.flatten() });
  }
  const d = parsed.data;

  const info = db
    .prepare(
      `INSERT INTO enquiries
        (couple_names, phone, email, preferred_date, guest_count, functions, food_preference,
         decor_style, rooms_needed, budget_min, budget_max, matched_venue, site_visit_requested)
       VALUES (@coupleNames, @phone, @email, @preferredDate, @guestCount, @functions, @foodPreference,
               @decorStyle, @roomsNeeded, @budgetMin, @budgetMax, @matchedVenue, @siteVisitRequested)`
    )
    .run({
      coupleNames: d.coupleNames,
      phone: d.phone,
      email: d.email,
      preferredDate: d.preferredDate ?? null,
      guestCount: d.guestCount,
      functions: JSON.stringify(d.functions),
      foodPreference: d.foodPreference ?? null,
      decorStyle: d.decorStyle ?? null,
      roomsNeeded: d.roomsNeeded,
      budgetMin: d.budgetMin ?? null,
      budgetMax: d.budgetMax ?? null,
      matchedVenue: d.matchedVenue ?? null,
      siteVisitRequested: d.siteVisitRequested ? 1 : 0,
    });

  res.status(201).json({
    id: info.lastInsertRowid,
    whatsappLink: buildWhatsAppLink(d),
    message: 'Enquiry received. Our wedding team will reach out shortly.',
  });
});

const listQuerySchema = z.object({
  status: z.enum(['new', 'contacted', 'site_visit', 'won', 'lost']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

// GET /api/enquiries — the hotel sales team's dashboard feed (admin only)
enquiriesRouter.get('/', requireAdmin, (req, res) => {
  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid query', details: parsed.error.flatten() });
  const { status, page, pageSize } = parsed.data;

  const where = status ? 'WHERE status = ?' : '';
  const params = status ? [status] : [];
  const total = db.prepare(`SELECT COUNT(*) AS c FROM enquiries ${where}`).get(...params).c;
  const rows = db
    .prepare(`SELECT * FROM enquiries ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
    .all(...params, pageSize, (page - 1) * pageSize);

  res.json({
    total,
    page,
    pageSize,
    items: rows.map((r) => ({ ...r, functions: JSON.parse(r.functions) })),
  });
});

const statusSchema = z.object({
  status: z.enum(['new', 'contacted', 'site_visit', 'won', 'lost']),
});

// PATCH /api/enquiries/:id/status — move an enquiry through the pipeline (admin only)
enquiriesRouter.patch('/:id/status', requireAdmin, (req, res) => {
  const idSchema = z.coerce.number().int().positive();
  const idCheck = idSchema.safeParse(req.params.id);
  if (!idCheck.success) return res.status(400).json({ error: 'Invalid id' });

  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid status', details: parsed.error.flatten() });

  const result = db.prepare('UPDATE enquiries SET status = ? WHERE id = ?').run(parsed.data.status, idCheck.data);
  if (result.changes === 0) return res.status(404).json({ error: 'Enquiry not found' });

  res.json({ id: idCheck.data, status: parsed.data.status });
});
