import { Router } from 'express';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { db } from '../db/index.js';

export const adminRouter = Router();

// GET /api/admin/verify — the login screen calls this once to check the
// access code is correct before storing it, so the UI can show a clear
// "wrong code" message instead of failing silently on the first real request.
adminRouter.get('/verify', requireAdmin, (req, res) => {
  const newCount = db.prepare(`SELECT COUNT(*) AS c FROM enquiries WHERE status = 'new'`).get().c;
  res.json({ ok: true, newEnquiries: newCount });
});
