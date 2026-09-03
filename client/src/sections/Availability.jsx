import { useEffect, useState } from 'react';
import { Api } from '../api/client.js';
import { useWeddingPlan } from '../hooks/WeddingPlanContext.jsx';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const STATUS_STYLES = {
  available: 'border-available text-espresso',
  filling_fast: 'border-filling text-espresso',
  booked: 'bg-[#F2EEE3] text-[#b3a892] border-[#e6ddc9]',
};

const STATUS_DOT = {
  available: 'bg-available',
  filling_fast: 'bg-filling',
  booked: 'bg-booked',
};

export default function Availability() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1-indexed
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const { updatePlan } = useWeddingPlan();

  useEffect(() => {
    setLoading(true);
    Api.getAvailability(year, month)
      .then((data) => setDays(data.days))
      .catch(() => setDays([]))
      .finally(() => setLoading(false));
  }, [year, month]);

  const firstDow = new Date(year, month - 1, 1).getDay();
  const cells = [...Array(firstDow).fill(null), ...days];

  function changeMonth(delta) {
    let m = month + delta;
    let y = year;
    if (m < 1) { m = 12; y -= 1; }
    if (m > 12) { m = 1; y += 1; }
    setMonth(m);
    setYear(y);
  }

  function handlePick(day) {
    if (!day || day.status === 'booked') return;
    updatePlan({ preferredDate: day.date });
  }

  return (
    <section id="availability" className="bg-white px-5 py-16 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold">Check Availability</p>
        <h2 className="font-display mt-2 text-2xl font-black uppercase tracking-wide sm:text-4xl">
          See open dates, instantly
        </h2>
        <p className="font-accent mt-2 text-base text-espresso/70 sm:text-lg">
          No more back-and-forth calls just to ask &ldquo;is this date free?&rdquo;
        </p>

        <div className="mt-8 rounded-2xl border border-line bg-card p-6 sm:p-8">
          <div className="mb-5 flex items-center justify-between">
            <p className="font-display text-lg font-bold">
              {MONTH_NAMES[month - 1]} {year}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => changeMonth(-1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-sm"
                aria-label="Previous month"
              >
                ‹
              </button>
              <button
                onClick={() => changeMonth(1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-sm"
                aria-label="Next month"
              >
                ›
              </button>
            </div>
          </div>

          {loading ? (
            <p className="py-10 text-sm text-espresso/60">Loading calendar…</p>
          ) : (
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={i} className="pb-1 text-[10px] font-bold uppercase text-espresso/50 sm:text-[11px]">
                  {d}
                </div>
              ))}
              {cells.map((day, i) =>
                day ? (
                  <button
                    key={day.date}
                    onClick={() => handlePick(day)}
                    disabled={day.status === 'booked'}
                    className={`aspect-square rounded-lg border text-[11px] font-semibold transition-transform hover:scale-105 sm:text-[13px] ${STATUS_STYLES[day.status]}`}
                  >
                    <span className="block">{Number(day.date.slice(-2))}</span>
                    <span className={`mx-auto mt-0.5 block h-1.5 w-1.5 rounded-full ${STATUS_DOT[day.status]}`} />
                  </button>
                ) : (
                  <div key={`blank-${i}`} />
                )
              )}
            </div>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-4 text-[11px] text-espresso/70 sm:gap-6">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-available" /> Open</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-filling" /> Filling Fast</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-booked" /> Booked</span>
          </div>
          <p className="mt-3 text-[11px] text-espresso/50">
            Updated by the hotel&rsquo;s own team — tap a date to hold it for your enquiry.
          </p>

          <a
            href="#visit"
            className="mt-5 inline-block rounded-full bg-gold px-6 py-3 text-xs font-bold uppercase tracking-wide text-espresso"
          >
            Continue to Enquiry
          </a>
        </div>
      </div>
    </section>
  );
}
