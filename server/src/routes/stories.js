import { Router } from 'express';
import { db } from '../db/index.js';

export const storiesRouter = Router();

// GET /api/stories — real wedding story cards
storiesRouter.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM stories ORDER BY sort_order ASC').all();
  res.json(rows);
});
