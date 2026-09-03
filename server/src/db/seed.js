import { db } from './index.js';

const venues = [
  {
    slug: 'aranya-lawn',
    name: 'The Aranya Lawn',
    setting: 'Outdoor',
    min_guests: 100,
    max_guests: 500,
    supported_functions: JSON.stringify(['Wedding', 'Sangeet', 'Reception']),
    description: 'A sprawling open-air lawn framed by mature trees — ideal for a grand baraat and a starlit reception.',
    photo_url: '/images/venue-lawn.jpg',
    sort_order: 1,
  },
  {
    slug: 'maharaja-hall',
    name: 'The Maharaja Hall',
    setting: 'Indoor',
    min_guests: 80,
    max_guests: 350,
    supported_functions: JSON.stringify(['Wedding', 'Reception', 'Engagement']),
    description: 'A domed banquet hall with crystal chandeliers and gold detailing — our signature indoor wedding venue.',
    photo_url: '/images/venue-hall.jpg',
    sort_order: 2,
  },
  {
    slug: 'sunset-courtyard',
    name: 'Sunset Courtyard',
    setting: 'Semi-covered',
    min_guests: 50,
    max_guests: 200,
    supported_functions: JSON.stringify(['Mehendi', 'Sangeet', 'Engagement']),
    description: 'An intimate, sheltered courtyard that catches the evening light — perfect for mehendi and sangeet nights.',
    photo_url: '/images/venue-courtyard.jpg',
    sort_order: 3,
  },
];

const stories = [
  { couple_names: 'Priya & Arjun', event_month: 'March 2026', photo_url: '/images/story-1.jpg', quote: 'Every detail felt like it was made for us.', sort_order: 1 },
  { couple_names: 'Meera & Kabir', event_month: 'November 2025', photo_url: '/images/story-2.jpg', quote: 'Our guests are still talking about the sangeet night.', sort_order: 2 },
  { couple_names: 'Sana & Dev', event_month: 'February 2026', photo_url: '/images/story-3.jpg', quote: 'The lawn at golden hour was pure magic.', sort_order: 3 },
  { couple_names: 'Ritu & Aman', event_month: 'January 2026', photo_url: '/images/story-4.jpg', quote: 'Planning felt effortless from day one.', sort_order: 4 },
];

function seedVenues() {
  const insert = db.prepare(`
    INSERT INTO venues (slug, name, setting, min_guests, max_guests, supported_functions, description, photo_url, sort_order)
    VALUES (@slug, @name, @setting, @min_guests, @max_guests, @supported_functions, @description, @photo_url, @sort_order)
    ON CONFLICT(slug) DO UPDATE SET
      name=excluded.name, setting=excluded.setting, min_guests=excluded.min_guests,
      max_guests=excluded.max_guests, supported_functions=excluded.supported_functions,
      description=excluded.description, photo_url=excluded.photo_url, sort_order=excluded.sort_order
  `);
  const tx = db.transaction((rows) => rows.forEach((r) => insert.run(r)));
  tx(venues);
}

function seedStories() {
  const existing = db.prepare('SELECT COUNT(*) AS c FROM stories').get();
  if (existing.c > 0) return;
  const insert = db.prepare(`
    INSERT INTO stories (couple_names, event_month, photo_url, quote, sort_order)
    VALUES (@couple_names, @event_month, @photo_url, @quote, @sort_order)
  `);
  const tx = db.transaction((rows) => rows.forEach((r) => insert.run(r)));
  tx(stories);
}

function seedAvailability() {
  const existing = db.prepare('SELECT COUNT(*) AS c FROM availability').get();
  if (existing.c > 0) return;

  const insert = db.prepare('INSERT OR IGNORE INTO availability (date, status) VALUES (?, ?)');
  const tx = db.transaction((rows) => rows.forEach(([d, s]) => insert.run(d, s)));

  const rows = [];
  const today = new Date();
  // Seed the next 4 months with a believable mix of statuses.
  for (let m = 0; m < 4; m++) {
    const year = today.getFullYear();
    const month = today.getMonth() + m;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const iso = date.toISOString().slice(0, 10);
      const weekday = date.getDay(); // 0 Sun ... 6 Sat
      let status = 'available';
      // Weekends fill up faster — a plausible illustrative pattern.
      if (weekday === 0 || weekday === 6) {
        const r = Math.random();
        status = r < 0.5 ? 'booked' : r < 0.8 ? 'filling_fast' : 'available';
      } else {
        const r = Math.random();
        status = r < 0.15 ? 'booked' : r < 0.35 ? 'filling_fast' : 'available';
      }
      rows.push([iso, status]);
    }
  }
  tx(rows);
}

const DEFAULT_RATES = [
  { key: 'plate_classic', label: 'Classic — per plate', value: 800, unit: 'per plate' },
  { key: 'plate_contemporary', label: 'Contemporary — per plate', value: 1050, unit: 'per plate' },
  { key: 'plate_royal', label: 'Royal — per plate', value: 1400, unit: 'per plate' },
  { key: 'room_night', label: 'Room — per night', value: 3500, unit: 'per room / night' },
];

function seedRates() {
  const insert = db.prepare(`
    INSERT INTO rates (key, label, value, unit)
    VALUES (@key, @label, @value, @unit)
    ON CONFLICT(key) DO NOTHING
  `);
  const tx = db.transaction((rows) => rows.forEach((r) => insert.run(r)));
  tx(DEFAULT_RATES);
}

seedVenues();
seedStories();
seedAvailability();
seedRates();

// eslint-disable-next-line no-console
console.log('✅ Database seeded: venues, stories, availability, rates.');

// eslint-disable-next-line no-console
console.log('✅ Database seeded: venues, stories, availability.');
