import PhotoTile from '../components/PhotoTile.jsx';
import { RingsIcon, LeafIcon, ToastIcon, SparkleIcon } from '../components/icons.jsx';

const CATEGORIES = [
  { Icon: RingsIcon, label: 'Wedding' },
  { Icon: LeafIcon, label: 'Mehendi' },
  { Icon: ToastIcon, label: 'Reception' },
  { Icon: SparkleIcon, label: 'Complete Celebration' },
];

export default function Hero({ hotelName = 'The Grand Aranya' }) {
  return (
    <section id="top" className="relative flex min-h-[560px] items-end sm:min-h-[640px]">
      <PhotoTile
        src="/images/hero.jpg"
        alt={`${hotelName} wedding venue`}
        gradientIndex={1}
        fill
        imgClassName="brightness-[0.8]"
      >
        {/* Bottom-to-top gradient for the content block, PLUS a centered
            radial vignette so the headline always sits over a dark patch
            no matter how bright or busy the underlying photo is. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,rgba(0,0,0,0.45),transparent)]" />
      </PhotoTile>

      <div className="relative z-10 mx-auto w-full max-w-3xl px-5 pb-14 pt-24 text-center sm:px-10 sm:pb-16">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold drop-shadow-md sm:text-xs">
          {hotelName} · Weddings &amp; Celebrations
        </p>
        <h1 className="font-display mt-3 text-4xl font-black uppercase leading-[1.1] tracking-wide text-ivory drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] sm:text-6xl">
          Your Wedding. Your Way.
        </h1>
        <p className="font-accent mt-4 text-lg text-ivory/90 drop-shadow-md sm:text-2xl">
          Imagine it. Build it. Celebrate it.
        </p>

        <div className="mt-7">
          <a
            href="#build"
            className="inline-block rounded-full bg-gold px-7 py-3.5 text-xs font-bold uppercase tracking-wide text-espresso sm:px-9 sm:text-sm"
          >
            Plan Your Wedding
          </a>
        </div>


        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {CATEGORIES.map((c) => (
            <div
              key={c.label}
              className="rounded-2xl bg-card/95 px-3 py-5 text-center shadow-lg shadow-black/10"
            >
              <c.Icon className="mx-auto text-gold" />
              <div className="mt-2 text-xs font-bold sm:text-sm">{c.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}