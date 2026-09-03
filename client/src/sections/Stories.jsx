import { useEffect, useState } from 'react';
import { Api } from '../api/client.js';
import PhotoTile from '../components/PhotoTile.jsx';

export default function Stories() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    Api.getStories().then(setStories).catch(() => setStories([]));
  }, []);

  if (!stories.length) return null;

  return (
    <section id="stories" className="bg-white px-5 py-16 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold">Real Celebrations</p>
        <h2 className="font-display mt-2 text-2xl font-black uppercase tracking-wide sm:text-4xl">
          Stories from The Grand Aranya
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {stories.map((s, i) => (
            <PhotoTile
              key={s.id}
              src={s.photo_url}
              alt={s.couple_names}
              gradientIndex={i}
              className="h-56 rounded-2xl sm:h-72"
            >
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-3.5 text-left">
                <p className="text-xs font-bold text-white">
                  {s.couple_names} · {s.event_month}
                </p>
              </div>
            </PhotoTile>
          ))}
        </div>
      </div>
    </section>
  );
}
