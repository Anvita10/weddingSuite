import { useState } from 'react';

const FAQS = [
  {
    q: 'Is the estimated budget a fixed quote?',
    a: 'No — it\'s an indicative range based on your guest count, functions, and décor style. Your final quote is confirmed by our wedding team once we understand your full requirements.',
  },
  {
    q: 'Can we visit before booking?',
    a: 'Absolutely. Use the "Continue to Enquiry" step to request a site visit — we\'ll coordinate a date that works around the availability calendar.',
  },
  {
    q: 'Do you assist with décor and catering?',
    a: 'Yes, all packages include our in-house catering and decor team. You\'re also welcome to bring your own vendors for select services — ask your wedding coordinator for details.',
  },
  {
    q: 'How do we hold a date?',
    a: 'Tapping an open date on the availability calendar attaches it to your enquiry. A date is formally held once our team confirms your booking advance.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section className="bg-white px-5 py-16 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold">Good to Know</p>
          <h2 className="font-display mt-2 text-2xl font-black uppercase tracking-wide sm:text-4xl">
            Common questions
          </h2>
        </div>

        <div className="mt-8">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="border-t border-line last:border-b">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between py-4 text-left text-[14.5px] font-semibold"
                >
                  <span>{item.q}</span>
                  <span className="ml-4 text-lg text-gold">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <p className="pb-4 pr-8 text-[13.5px] leading-relaxed text-espresso/70">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
