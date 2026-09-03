import { useEffect, useState } from 'react';
import { AdminApi } from './adminApi.js';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const CYCLE = ['available', 'filling_fast', 'booked'];
const STATUS_STYLES = {
  available: 'border-available bg-white',
  filling_fast: 'border-filling bg-white',
  booked: 'bg-[#F2EEE3] border-[#e6ddc9]',
};
const STATUS_DOT = { available: 'bg-available', filling_fast: 'bg-filling', booked: 'bg-booked' };

export default function CalendarTab() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingDate, setSavingDate] = useState(null);

  // Bulk form state
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');
  const [rangeStatus, setRangeStatus] = useState('booked');
  const [bulkSaving, setBulkSaving] = useState(false);
  const [bulkMessage, setBulkMessage] = useState('');

  function load() {
    setLoading(true);
    AdminApi.getAvailability(year, month)
      .then((data) => setDays(data.days))
      .finally(() => setLoading(false));
  }

  useEffect(load, [year, month]);

  function changeMonth(delta) {
    let m = month + delta;
    let y = year;
    if (m < 1) { m = 12; y -= 1; }
    if (m > 12) { m = 1; y += 1; }
    setMonth(m);
    setYear(y);
  }

  async function handleDayClick(day) {
    const currentIndex = CYCLE.indexOf(day.status);
    const next = CYCLE[(currentIndex + 1) % CYCLE.length];
    setSavingDate(day.date);
    try {
      await AdminApi.setDate(day.date, next);
      setDays((prev) => prev.map((d) => (d.date === day.date ? { ...d, status: next } : d)));
    } finally {
      setSavingDate(null);
    }
  }

  async function handleBulkSubmit(e) {
    e.preventDefault();
    if (!rangeStart || !rangeEnd) return;
    setBulkSaving(true);
    setBulkMessage('');
    try {
      const res = await AdminApi.setRange(rangeStart, rangeEnd, rangeStatus);
      setBulkMessage(`Updated ${res.updated} date(s).`);
      load();
    } catch (err) {
      setBulkMessage(err?.response?.data?.error || 'Something went wrong.');
    } finally {
      setBulkSaving(false);
    }
  }

  const firstDow = new Date(year, month - 1, 1).getDay();
  const cells = [...Array(firstDow).fill(null), ...days];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="rounded-2xl border border-line bg-card p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-display text-lg font-bold">{MONTH_NAMES[month - 1]} {year}</p>
          <div className="flex gap-2">
            <button onClick={() => changeMonth(-1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-line">‹</button>
            <button onClick={() => changeMonth(1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-line">›</button>
          </div>
        </div>

        <p className="mb-3 text-xs text-espresso/50">Tap a date to cycle: Open → Filling Fast → Booked</p>

        {loading ? (
          <p className="py-10 text-center text-sm text-espresso/50">Loading…</p>
        ) : (
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className="pb-1 text-center text-[10px] font-bold uppercase text-espresso/40">{d}</div>
            ))}
            {cells.map((day, i) =>
              day ? (
                <button
                  key={day.date}
                  onClick={() => handleDayClick(day)}
                  disabled={savingDate === day.date}
                  className={`aspect-square rounded-lg border text-[11px] font-semibold transition-transform hover:scale-105 sm:text-[13px] ${STATUS_STYLES[day.status]} ${savingDate === day.date ? 'opacity-50' : ''}`}
                >
                  <span className="block">{Number(day.date.slice(-2))}</span>
                  <span className={`mx-auto mt-0.5 block h-1.5 w-1.5 rounded-full ${STATUS_DOT[day.status]}`} />
                </button>
              ) : (
                <div key={`b-${i}`} />
              )
            )}
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-4 text-[11px] text-espresso/60">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-available" /> Open</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-filling" /> Filling Fast</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-booked" /> Booked</span>
        </div>
      </div>

      <div className="h-fit rounded-2xl border border-line bg-card p-5 sm:p-6">
        <p className="font-display text-base font-bold">Update a Range</p>
        <p className="mt-1 text-xs text-espresso/50">Useful for blocking off a whole week at once.</p>

        <form onSubmit={handleBulkSubmit} className="mt-4 space-y-3">
          <Field label="From">
            <input type="date" value={rangeStart} onChange={(e) => setRangeStart(e.target.value)} className="field-input" />
          </Field>
          <Field label="To">
            <input type="date" value={rangeEnd} onChange={(e) => setRangeEnd(e.target.value)} className="field-input" />
          </Field>
          <Field label="Set status to">
            <select value={rangeStatus} onChange={(e) => setRangeStatus(e.target.value)} className="field-input">
              <option value="available">Open</option>
              <option value="filling_fast">Filling Fast</option>
              <option value="booked">Booked</option>
            </select>
          </Field>
          <button
            type="submit"
            disabled={bulkSaving}
            className="w-full rounded-full bg-gold py-2.5 text-xs font-bold text-espresso disabled:opacity-60"
          >
            {bulkSaving ? 'Updating…' : 'Update Dates'}
          </button>
          {bulkMessage && <p className="text-center text-xs text-espresso/60">{bulkMessage}</p>}
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-espresso/50">{label}</span>
      {children}
    </label>
  );
}
