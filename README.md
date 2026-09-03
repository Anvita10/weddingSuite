# Wedding Suite

A full-stack wedding planning & booking experience for hotels, built as discussed:
**Explore → Imagine → Build Your Wedding → Check Availability → Enquire**, backed
by a real database and a sales-side enquiry pipeline — not a static brochure site.

Stack: **React 19 + Vite + Tailwind CSS v4** (client) and **Node.js + Express +
SQLite (better-sqlite3)** (server). Fully responsive, mobile-first.

---

## 1. What's included

| Feature (from the concept) | Where it lives |
|---|---|
| Function-based venue explorer | `client/src/sections/Explore.jsx` + `GET /api/venues` |
| Royal/Contemporary/Classic + Day/Night preview | `client/src/sections/Imagine.jsx` |
| Build Your Wedding configurator | `client/src/sections/BuildWedding.jsx` |
| Live, indicative budget estimator | `POST /api/estimate` (transparent rule-based calc, never a fixed quote) |
| **Availability calendar** (open / filling fast / booked) | `client/src/sections/Availability.jsx` + `GET/PUT /api/availability` |
| Wedding Board ↔ Smart Enquiry pairing | `client/src/sections/WeddingBoard.jsx` |
| Real Wedding Stories | `client/src/sections/Stories.jsx` + `GET /api/stories` |
| Venue Matching (transparent % score, not a black box) | `client/src/sections/Venues.jsx` + `GET /api/venues/match` |
| FAQ | `client/src/sections/FAQ.jsx` |
| Enquiry form + WhatsApp handoff | `client/src/sections/Visit.jsx` + `POST /api/enquiries` |
| Hotel sales dashboard feed (admin) | `GET /api/enquiries` (token-protected) |

---

## 2. Quick start (development)

Requires Node 18+.

```bash
npm run install:all      # installs both server/ and client/ dependencies

cp server/.env.example server/.env
cp client/.env.example client/.env
# edit server/.env — at minimum set a real ADMIN_TOKEN and WHATSAPP_NUMBER

npm run seed              # creates the SQLite DB and seeds venues/stories/availability

npm run dev                # runs API (port 4000) and client (port 5173) together
```

Visit **http://localhost:5173**.

## 3. Production build & run (single service)

In production, Express serves the built React app itself — one process, one port.

```bash
npm run install:all
cp server/.env.example server/.env   # set real values, especially ADMIN_TOKEN
npm run seed
npm run build:client
NODE_ENV=production npm run prod       # serves both API and client on server/.env's PORT
```

Deploy targets this works well on as-is: a single VM/VPS (with pm2 or systemd),
Render, Railway, Fly.io, or any Docker host. For serverless platforms you would
swap SQLite for a hosted Postgres (see §5).

---

## 4. The database — what's "proper" about it

- **Real relational schema**, not flat JSON files: `venues`, `availability`,
  `stories`, `enquiries` tables with foreign-key pragma enabled and `CHECK`
  constraints on status enums (see `server/src/db/index.js`).
- **WAL mode** enabled for safe concurrent reads/writes under real traffic.
- **Indexes** on every access pattern the API actually uses: availability
  lookups by month, enquiries by status + recency for the sales dashboard,
  venue ordering.
- **Idempotent seeding**: `npm run seed` uses `ON CONFLICT` upserts for
  venues and only seeds stories/availability if empty — safe to re-run.
- **Input validation with `zod`** on every write endpoint before anything
  touches the database — no unvalidated data reaches SQL.
- **Parameterized queries throughout** (`better-sqlite3` prepared statements)
  — no string-concatenated SQL, so no SQL injection surface.

### Moving beyond SQLite
SQLite is genuinely production-appropriate for a single hotel property at this
scale (low write volume, one enquiry funnel). If you're deploying this across
many hotel properties simultaneously or need multi-instance horizontal
scaling, swap `better-sqlite3` for `pg` + a hosted Postgres — the schema in
`db/index.js` and the query shapes in `routes/*.js` translate almost directly
(the only SQLite-specific bits are `datetime('now')` and the `ON CONFLICT`
upsert syntax, both of which Postgres also supports with minor tweaks).

---

## 5. Environment variables

### `server/.env`
| Variable | Purpose |
|---|---|
| `PORT` | API port (default 4000) |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_ORIGIN` | Comma-separated allowed CORS origins in production |
| `DB_PATH` | SQLite file path |
| `ADMIN_TOKEN` | Bearer token protecting `/api/enquiries` (GET/PATCH) and availability updates — **change this before deploying** |
| `WHATSAPP_NUMBER` | E.164 number (no `+`) used to build the enquiry WhatsApp link |
| `HOTEL_NAME` | Shown in a couple of API responses |

### `client/.env`
| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Where the client calls the API (leave as `/api` in production single-service deploy) |
| `VITE_HOTEL_NAME` | Shown in nav/hero |
| `VITE_WHATSAPP_NUMBER` | Used by the sticky WhatsApp button |

---

## 6. Adding real hotel photography

Drop real photos into `client/public/images/` using the filenames listed in
that folder's own `README.md` (hero, décor styles, venues, stories). Every
image reference in the app gracefully falls back to a themed gradient tile if
the file isn't there yet — so the site never looks broken while photos are
still being sourced, and you can ship real photography incrementally.

---

## 7. Security notes for a real deployment

- `ADMIN_TOKEN` defaults to a placeholder — the server **refuses** admin
  requests until you set a real one (see `middleware/requireAdmin.js`).
- Helmet, CORS allow-listing, and rate limiting (300 req/15min general API,
  20 enquiries/hour) are already wired in `src/index.js`.
- The admin token is a simple shared secret, intentionally — fine for one or
  two hotel staff accounts. For a larger sales team with individual logins,
  replace it with proper session or JWT-based auth per staff member.
- Enquiry data includes phone/email — treat `server/data/*.db` as containing
  personal data and back it up / restrict access accordingly.

---

## 8. Project structure

```
wedding-suite/
├── server/
│   └── src/
│       ├── index.js            # Express app entry
│       ├── config/env.js
│       ├── db/{index,seed}.js
│       ├── middleware/
│       └── routes/{venues,availability,enquiries,stories,estimate}.js
└── client/
    └── src/
        ├── App.jsx
        ├── api/client.js
        ├── hooks/WeddingPlanContext.jsx
        ├── components/{Nav,Footer,StickyWhatsApp,PhotoTile}.jsx
        └── sections/{Hero,Explore,Imagine,BuildWedding,Availability,
                       WeddingBoard,Stories,Venues,FAQ,Visit}.jsx
```
