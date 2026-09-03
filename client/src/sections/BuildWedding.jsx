import { useEffect, useRef } from 'react';
import { useWeddingPlan } from '../hooks/WeddingPlanContext.jsx';

const ALL_FUNCTIONS = ['Wedding', 'Reception', 'Mehendi', 'Sangeet', 'Engagement'];
const FOOD_OPTIONS = ['Veg', 'Non-Veg', 'Both'];
const DECOR_OPTIONS = ['Royal', 'Contemporary', 'Classic'];

function formatINR(n) {
  return `₹${(n / 100000).toFixed(1)}L`;
}

export default function BuildWedding() {
  const { plan, updatePlan, toggleFunction, estimate, estimateLoading, refreshEstimate } =
    useWeddingPlan();

  const debounceRef = useRef(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => refreshEstimate(), 350);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan.guests, plan.functions, plan.decorStyle, plan.roomsNeeded]);

  return (
    <section id="build" className="bg-ivory px-5 py-16 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold">Build Your Wedding</p>
          <h2 className="font-display mt-2 text-2xl font-black uppercase tracking-wide sm:text-4xl">
            Design your celebration
          </h2>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Configurator panel */}
          <div className="rounded-2xl border border-line bg-card p-6 sm:p-8">
            <div className="mb-6">
              <div className="mb-3 flex justify-between text-[13px] font-bold">
                <span>Number of Guests</span>
                <span className="font-display text-gold">{plan.guests}</span>
              </div>
              <input
                type="range"
                min={50}
                max={1000}
                step={10}
                value={plan.guests}
                onChange={(e) => updatePlan({ guests: Number(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="mb-6">
              <p className="mb-3 text-[13px] font-bold">Celebration Functions</p>
              <div className="flex flex-wrap gap-2">
                {ALL_FUNCTIONS.map((fn) => (
                  <button
                    key={fn}
                    onClick={() => toggleFunction(fn)}
                    className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors ${
                      plan.functions.includes(fn)
                        ? 'border-gold bg-gold text-espresso'
                        : 'border-line bg-white text-espresso/70'
                    }`}
                  >
                    {fn}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-3 text-[13px] font-bold">Food Preference</p>
                <div className="flex gap-2">
                  {FOOD_OPTIONS.map((f) => (
                    <button
                      key={f}
                      onClick={() => updatePlan({ foodPreference: f })}
                      className={`flex-1 rounded-lg border px-2 py-2.5 text-xs font-semibold ${
                        plan.foodPreference === f
                          ? 'border-espresso bg-espresso text-ivory'
                          : 'border-line bg-white text-espresso/70'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-3 text-[13px] font-bold">Décor Style</p>
                <div className="flex gap-2">
                  {DECOR_OPTIONS.map((d) => (
                    <button
                      key={d}
                      onClick={() => updatePlan({ decorStyle: d })}
                      className={`flex-1 rounded-lg border px-2 py-2.5 text-xs font-semibold ${
                        plan.decorStyle === d
                          ? 'border-gold bg-gold text-espresso'
                          : 'border-line bg-white text-espresso/70'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="mb-3 flex justify-between text-[13px] font-bold">
                <span>Rooms Needed</span>
                <span className="font-display text-gold">{plan.roomsNeeded}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={plan.roomsNeeded}
                onChange={(e) => updatePlan({ roomsNeeded: Number(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>

          {/* Summary panel */}
          <div className="rounded-2xl bg-espresso p-6 text-ivory sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold">Your Wedding Plan</p>
            <p className="font-display mt-1 text-lg">{plan.coupleNames || 'Your Names'}</p>

            <div className="mt-4 divide-y divide-white/10 text-[13px]">
              <div className="flex justify-between py-2.5">
                <span className="text-ivory/60">Guests</span>
                <span>{plan.guests}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-ivory/60">Functions</span>
                <span className="text-right">{plan.functions.join(' + ')}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-ivory/60">Décor</span>
                <span>{plan.decorStyle}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-ivory/60">Rooms</span>
                <span>{plan.roomsNeeded}</span>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-gold/40 bg-gold/10 p-4">
              <p className="text-[10.5px] font-bold uppercase tracking-wide text-gold">
                Estimated Budget Range
              </p>
              <p className="font-display mt-1.5 text-2xl">
                {estimateLoading && !estimate
                  ? 'Calculating…'
                  : estimate
                  ? `${formatINR(estimate.estimatedRange.low)} – ${formatINR(estimate.estimatedRange.high)}`
                  : '—'}
              </p>
              <p className="mt-1.5 text-[11px] text-ivory/60">
                {estimate?.disclaimer || 'Indicative only — confirmed with our wedding team.'}
              </p>
            </div>

            <a
              href="#availability"
              className="mt-5 block rounded-full bg-gold py-3 text-center text-xs font-bold uppercase tracking-wide text-espresso"
            >
              Check Available Dates
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
