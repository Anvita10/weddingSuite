import { useState } from 'react';
import PhotoTile from '../components/PhotoTile.jsx';

const STYLES = {
  Royal: {
    title: 'Royal Décor',
    caption: 'Gold drapery · Floral chandeliers · Warm candlelight',
    photo: '/images/style-royal.jpg',
  },
  Contemporary: {
    title: 'Contemporary Décor',
    caption: 'Clean lines · Neutral palette · Statement lighting',
    photo: '/images/style-contemporary.jpg',
  },
  Classic: {
    title: 'Classic Décor',
    caption: 'Ivory florals · Traditional mandap · Soft daylight',
    photo: '/images/style-classic.jpg',
  },
};

export default function Imagine() {
  const [style, setStyle] = useState('Royal');
  const [night, setNight] = useState(false);
  const current = STYLES[style];

  return (
    <section id="imagine" className="bg-white px-5 py-16 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold">Imagine</p>
        <h2 className="font-display mt-2 text-2xl font-black uppercase tracking-wide sm:text-4xl">
          See your wedding, before it happens
        </h2>

        <div className="relative mt-8 h-72 overflow-hidden rounded-2xl sm:h-[420px]">
          <PhotoTile
            src={current.photo}
            alt={`${style} décor style`}
            gradientIndex={2}
            fill
          >
            <div
              className={`absolute inset-0 transition-colors ${
                night ? 'bg-black/55' : 'bg-black/15'
              }`}
            />
          </PhotoTile>

          <div className="absolute left-1/2 top-5 flex -translate-x-1/2 gap-1.5 rounded-full bg-white/15 p-1.5 backdrop-blur">
            {Object.keys(STYLES).map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                  style === s ? 'bg-gold text-espresso' : 'text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={() => setNight((n) => !n)}
            className="absolute right-5 top-5 rounded-full bg-white/15 px-3.5 py-2 text-xs font-bold text-white backdrop-blur"
          >
            {night ? '🌙 Night' : '☀ Day'}
          </button>

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-6 text-left">
            <p className="font-display text-lg text-white sm:text-xl">{current.title}</p>
            <p className="mt-1 text-xs text-ivory/85 sm:text-sm">{current.caption}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
