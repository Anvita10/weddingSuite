import { useState } from 'react';
import { Api } from '../api/client.js';
import { useWeddingPlan } from '../hooks/WeddingPlanContext.jsx';

export default function Visit() {
  const { plan, updatePlan, estimate } = useWeddingPlan();
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | done | error
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!plan.coupleNames || !phone || !plan.guests) {
      setStatus('error');
      setResult({ message: 'Please share your name, phone number, and guest count.' });
      return;
    }
    setStatus('submitting');
    try {
      const payload = {
        coupleNames: plan.coupleNames,
        phone,
        email,
        preferredDate: plan.preferredDate || null,
        guestCount: plan.guests,
        functions: plan.functions,
        foodPreference: plan.foodPreference,
        decorStyle: plan.decorStyle,
        roomsNeeded: plan.roomsNeeded,
        budgetMin: estimate?.estimatedRange?.low ?? null,
        budgetMax: estimate?.estimatedRange?.high ?? null,
        matchedVenue: null,
        siteVisitRequested: true,
      };
      const data = await Api.submitEnquiry(payload);
      setResult(data);
      setStatus('done');
    } catch (err) {
      setStatus('error');
      setResult({ message: err?.response?.data?.error || 'Something went wrong. Please try again.' });
    }
  }

  return (
    <section id="visit" className="px-5 py-16 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-5xl rounded-3xl bg-espresso p-7 text-ivory sm:p-14">
        <div className="grid gap-10 sm:grid-cols-2 sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold">Request a Site Visit</p>
            <h2 className="font-display mt-2 text-2xl font-black uppercase sm:text-3xl">
              Let&rsquo;s start planning
            </h2>
            <p className="mt-3 text-sm text-ivory/70 sm:text-base">
              Share a few details — we&rsquo;ll prepare your full plan and hand it to our wedding team on
              WhatsApp.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl border border-gold/35 bg-white/5 p-6">
            <Field label="Your Name">
              <input
                value={plan.coupleNames}
                onChange={(e) => updatePlan({ coupleNames: e.target.value })}
                placeholder="e.g. Anvita & Rahul"
                className="input"
              />
            </Field>
            <Field label="Phone Number">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 98765 43210"
                className="input"
              />
            </Field>
            <Field label="Email (optional)">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                type="email"
                className="input"
              />
            </Field>
            <Field label="Preferred Date">
              <input
                value={plan.preferredDate}
                onChange={(e) => updatePlan({ preferredDate: e.target.value })}
                placeholder="e.g. 2026-12-08, or flexible"
                className="input"
              />
            </Field>
            <Field label="Guest Count">
              <input
                type="number"
                value={plan.guests}
                onChange={(e) => updatePlan({ guests: Number(e.target.value) })}
                className="input"
              />
            </Field>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="mt-2 w-full rounded-full bg-[#3FA34D] py-3.5 text-sm font-bold text-white disabled:opacity-60"
            >
              {status === 'submitting' ? 'Sending…' : 'Send Enquiry on WhatsApp'}
            </button>

            {status === 'error' && (
              <p className="mt-3 text-xs text-red-300">{result?.message}</p>
            )}

            {status === 'done' && (
              <div className="mt-4 rounded-xl bg-white/10 p-4 text-center">
                <p className="text-sm font-semibold text-gold">Enquiry received!</p>
                <p className="mt-1 text-xs text-ivory/70">
                  Our wedding team will reach out shortly. You can also send it directly now:
                </p>
                {result?.whatsappLink ? (
                  <a
                    href={result.whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block rounded-full bg-[#3FA34D] px-5 py-2.5 text-xs font-bold text-white"
                  >
                    Open WhatsApp
                  </a>
                ) : (
                  <p className="mt-2 text-[11px] text-ivory/50">
                    (Set WHATSAPP_NUMBER in the server .env to enable the direct WhatsApp link.)
                  </p>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="mb-3.5 block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gold">{label}</span>
      {children}
    </label>
  );
}
