import { useEffect, useState } from 'react';
import { AdminApi } from './adminApi.js';

const STATUS_LABELS = {
  new: 'New',
  contacted: 'Contacted',
  site_visit: 'Site Visit',
  won: 'Won',
  lost: 'Lost',
};

const STATUS_COLORS = {
  new: 'bg-gold/15 text-gold',
  contacted: 'bg-[#D98B3D]/15 text-[#D98B3D]',
  site_visit: 'bg-espresso/10 text-espresso',
  won: 'bg-available/15 text-available',
  lost: 'bg-red-100 text-red-600',
};

function formatINR(n) {
  if (!n) return '—';
  return `₹${(n / 100000).toFixed(1)}L`;
}

export default function EnquiriesTab() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  function load() {
    setLoading(true);
    AdminApi.getEnquiries(filter || undefined)
      .then((data) => setItems(data.items))
      .finally(() => setLoading(false));
  }

  useEffect(load, [filter]);

  async function handleStatusChange(id, status) {
    setUpdatingId(id);
    try {
      await AdminApi.updateEnquiryStatus(id, status);
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status } : it)));
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <FilterChip label="All" active={filter === ''} onClick={() => setFilter('')} />
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <FilterChip key={key} label={label} active={filter === key} onClick={() => setFilter(key)} />
        ))}
      </div>

      {loading ? (
        <p className="py-10 text-center text-sm text-espresso/50">Loading enquiries…</p>
      ) : items.length === 0 ? (
        <p className="py-10 text-center text-sm text-espresso/50">No enquiries here yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((it) => (
            <div key={it.id} className="rounded-xl border border-line bg-card p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-base font-bold">{it.couple_names}</p>
                  <p className="mt-0.5 text-xs text-espresso/60">
                    {it.phone} {it.email ? `· ${it.email}` : ''}
                  </p>
                </div>
                <select
                  value={it.status}
                  disabled={updatingId === it.id}
                  onChange={(e) => handleStatusChange(it.id, e.target.value)}
                  className={`rounded-full border-0 px-3 py-1.5 text-xs font-bold ${STATUS_COLORS[it.status]}`}
                >
                  {Object.entries(STATUS_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12.5px] text-espresso/70 sm:grid-cols-4">
                <Detail label="Guests" value={it.guest_count} />
                <Detail label="Functions" value={it.functions.join(', ')} />
                <Detail label="Date" value={it.preferred_date || 'Flexible'} />
                <Detail label="Budget" value={`${formatINR(it.budget_min)}–${formatINR(it.budget_max)}`} />
              </div>

              {!!it.site_visit_requested && (
                <span className="mt-3 inline-block rounded-full bg-available/15 px-2.5 py-1 text-[10px] font-bold uppercase text-available">
                  Site Visit Requested
                </span>
              )}
              <p className="mt-2 text-[11px] text-espresso/40">
                Received {new Date(it.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-xs font-bold ${
        active ? 'border-gold bg-gold text-espresso' : 'border-line bg-white text-espresso/60'
      }`}
    >
      {label}
    </button>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <span className="block text-[10px] uppercase tracking-wide text-espresso/40">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
