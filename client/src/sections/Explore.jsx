import { useEffect, useMemo, useState } from 'react';
import { Api } from '../api/client.js';
import PhotoTile from '../components/PhotoTile.jsx';

const TABS = ['Wedding', 'Mehendi', 'Sangeet', 'Reception'];

export default function Explore() {
  const [venues, setVenues] = useState([]);
  const [tab, setTab] = useState('Wedding');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Api.getVenues()
      .then(setVenues)
      .catch(() => setError('Could not load venues right now.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => venues.filter((v) => v.supported_functions.includes(tab)),
    [venues, tab]
  );
  const list = filtered.length ? filtered : venues;

  return (
    <section id="explore" className="bg-ivory px-5 py-16 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold">Explore</p>
        <h2 className="font-display mt-2 text-2xl font-black uppercase tracking-wide sm:text-4xl">
          Every celebration, styled for itself
        </h2>

        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full border px-4 py-2 text-xs font-bold transition-colors sm:text-[13px] ${
                tab === t
                  ? 'border-gold bg-gold text-espresso'
                  : 'border-line bg-white text-espresso/70 hover:border-gold/60'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading && <p className="mt-10 text-sm text-espresso/60">Loading venues…</p>}
        {error && <p className="mt-10 text-sm text-red-700">{error}</p>}

        {!loading && !error && (
          <div
            className={`mx-auto mt-10 grid grid-cols-1 gap-4 ${
              list.length === 1 ? 'sm:grid-cols-1 sm:max-w-md' : list.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'
            }`}
          >
            {list.map((v, i) => (
              <PhotoTile
                key={v.id}
                src={v.photo_url}
                alt={v.name}
                gradientIndex={i}
                className="h-56 rounded-2xl"
              >
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-4 text-left">
                  <p className="text-sm font-bold text-white">
                    {v.name} · up to {v.max_guests} guests
                  </p>
                </div>
              </PhotoTile>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
