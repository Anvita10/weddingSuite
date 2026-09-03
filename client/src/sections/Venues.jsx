import { useEffect, useState } from 'react';
import { Api } from '../api/client.js';
import { useWeddingPlan } from '../hooks/WeddingPlanContext.jsx';
import PhotoTile from '../components/PhotoTile.jsx';

export default function Venues() {
  const { plan } = useWeddingPlan();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Api.matchVenues(plan.guests, plan.functions)
      .then(setVenues)
      .catch(() => setVenues([]))
      .finally(() => setLoading(false));
  }, [plan.guests, plan.functions]);

  return (
    <section id="venues" className="bg-ivory px-5 py-16 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold">Suggested For You</p>
        <h2 className="font-display mt-2 text-2xl font-black uppercase tracking-wide sm:text-4xl">
          Venues matched to your celebration
        </h2>
        <p className="font-accent mt-2 text-base text-espresso/70 sm:text-lg">
          Based on {plan.guests} guests · {plan.decorStyle} décor · {plan.functions.join(' + ')}
        </p>

        {loading ? (
          <p className="mt-10 text-sm text-espresso/60">Matching venues…</p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {venues.map((v, i) => (
              <div key={v.id} className="overflow-hidden rounded-2xl border border-line bg-card text-left">
                <PhotoTile src={v.photo_url} alt={v.name} gradientIndex={i} className="h-36" />
                <div className="p-4">
                  <p className="font-display text-[17px]">{v.name}</p>
                  <p className="mt-1 text-xs text-espresso/60">
                    {v.setting} · up to {v.max_guests} guests
                  </p>
                  <span className="mt-2.5 inline-block rounded-full bg-gold/15 px-2.5 py-1 text-[11px] font-bold text-gold">
                    {v.matchPercent}% Match
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
