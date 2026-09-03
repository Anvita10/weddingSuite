import { useWeddingPlan } from '../hooks/WeddingPlanContext.jsx';

function formatINR(n) {
  return `₹${(n / 100000).toFixed(1)}L`;
}

export default function WeddingBoard() {
  const { plan, estimate } = useWeddingPlan();
  const budget =
    estimate ? `${formatINR(estimate.estimatedRange.low)}–${formatINR(estimate.estimatedRange.high)}` : '—';

  return (
    <section className="bg-ivory px-5 py-16 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold">Your Plan, Their Enquiry</p>
        <h2 className="font-display mt-2 text-2xl font-black uppercase tracking-wide sm:text-4xl">
          One plan, understood by both sides
        </h2>

        <div className="mt-10 grid items-center gap-5 sm:grid-cols-[1fr_auto_1fr]">
          <div className="rounded-2xl border border-line bg-card p-6 text-left">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold">Your Wedding Board</p>
            <p className="font-display mt-1 text-lg">{plan.coupleNames || 'Your Names'}</p>
            <dl className="mt-3 divide-y divide-line text-[12.5px]">
              <div className="flex justify-between py-2">
                <dt className="text-espresso/60">Functions</dt>
                <dd>{plan.functions.join(' + ')}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-espresso/60">Décor</dt>
                <dd>{plan.decorStyle}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-espresso/60">Guests</dt>
                <dd>{plan.guests}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-espresso/60">Budget</dt>
                <dd>{budget}</dd>
              </div>
            </dl>
          </div>

          <div className="hidden text-2xl text-gold sm:block">→</div>

          <div className="rounded-2xl border-2 border-dashed border-gold bg-white p-6 text-left">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-available">New Wedding Enquiry</p>
            <p className="font-display mt-1 text-lg">{plan.coupleNames || 'Your Names'}</p>
            <dl className="mt-3 divide-y divide-line text-[12.5px]">
              <div className="flex justify-between py-2">
                <dt className="text-espresso/60">Functions</dt>
                <dd>{plan.functions.join(' + ')}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-espresso/60">Rooms</dt>
                <dd>{plan.roomsNeeded}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-espresso/60">Preferred Date</dt>
                <dd>{plan.preferredDate || 'Flexible'}</dd>
              </div>
            </dl>
            <span className="mt-3 inline-block rounded-full bg-available/15 px-2.5 py-1 text-[10px] font-bold uppercase text-available">
              Site Visit Requested
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
