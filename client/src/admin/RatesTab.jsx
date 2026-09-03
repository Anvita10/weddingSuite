import { useEffect, useState } from 'react';
import { AdminApi } from './adminApi.js';

export default function RatesTab() {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState({});
  const [savingKey, setSavingKey] = useState(null);
  const [savedKey, setSavedKey] = useState(null);

  function load() {
    setLoading(true);
    AdminApi.getRates()
      .then((data) => {
        setRates(data);
        setDrafts(Object.fromEntries(data.map((r) => [r.key, r.value])));
      })
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleSave(key) {
    setSavingKey(key);
    setSavedKey(null);
    try {
      await AdminApi.updateRate(key, drafts[key]);
      setSavedKey(key);
      setTimeout(() => setSavedKey(null), 1800);
      load();
    } finally {
      setSavingKey(null);
    }
  }

  if (loading) return <p className="py-10 text-center text-sm text-espresso/50">Loading rates…</p>;

  return (
    <div className="max-w-xl">
      <p className="mb-1 text-sm text-espresso/60">
        These numbers directly drive the budget estimate couples see on the website. Changes apply
        immediately — no need to tell anyone or wait for a website update.
      </p>

      <div className="mt-5 space-y-3">
        {rates.map((r) => {
          const changed = Number(drafts[r.key]) !== r.value;
          return (
            <div key={r.key} className="flex items-center gap-3 rounded-xl border border-line bg-card p-4">
              <div className="flex-1">
                <p className="text-sm font-bold">{r.label}</p>
                <p className="text-[11px] text-espresso/50">{r.unit}</p>
              </div>
              <span className="text-espresso/40">₹</span>
              <input
                type="number"
                min="0"
                value={drafts[r.key] ?? ''}
                onChange={(e) => setDrafts((d) => ({ ...d, [r.key]: e.target.value }))}
                className="w-28 rounded-lg border border-line px-2.5 py-2 text-right text-sm outline-none focus:border-gold"
              />
              <button
                onClick={() => handleSave(r.key)}
                disabled={!changed || savingKey === r.key}
                className="rounded-full bg-gold px-4 py-2 text-xs font-bold text-espresso disabled:opacity-40"
              >
                {savingKey === r.key ? 'Saving…' : savedKey === r.key ? 'Saved ✓' : 'Save'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
