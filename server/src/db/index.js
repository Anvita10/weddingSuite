import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { env } from '../config/env.js';

const dbDir = path.dirname(env.dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new Database(env.dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS venues (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  setting TEXT NOT NULL,            -- e.g. Indoor / Outdoor / Semi-covered
  min_guests INTEGER NOT NULL,
  max_guests INTEGER NOT NULL,
  supported_functions TEXT NOT NULL, -- JSON array: ["Wedding","Sangeet",...]
  description TEXT,
  photo_url TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS availability (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT UNIQUE NOT NULL,        -- ISO date YYYY-MM-DD
  status TEXT NOT NULL CHECK (status IN ('available','filling_fast','booked'))
);

CREATE TABLE IF NOT EXISTS stories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  couple_names TEXT NOT NULL,
  event_month TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  quote TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Pricing lives here, not in code, so the sales team can update it from the
-- admin dashboard without a developer touching a file or redeploying.
CREATE TABLE IF NOT EXISTS rates (
  key TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  value REAL NOT NULL,
  unit TEXT NOT NULL,          -- e.g. "per plate", "per room per night"
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  couple_names TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  preferred_date TEXT,
  guest_count INTEGER NOT NULL,
  functions TEXT NOT NULL,          -- JSON array
  food_preference TEXT,
  decor_style TEXT,
  rooms_needed INTEGER DEFAULT 0,
  budget_min INTEGER,
  budget_max INTEGER,
  matched_venue TEXT,
  site_visit_requested INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','site_visit','won','lost')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Indexes for the query patterns the API actually uses in production:
-- availability lookups by month (prefix scan on date), the sales dashboard
-- filtering/sorting enquiries by status and recency, and venue ordering.
CREATE INDEX IF NOT EXISTS idx_availability_date ON availability(date);
CREATE INDEX IF NOT EXISTS idx_enquiries_status_created ON enquiries(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_venues_sort ON venues(sort_order);
`);

