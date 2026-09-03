const LINKS = [
  { href: '#explore', label: 'Explore' },
  { href: '#imagine', label: 'Imagine' },
  { href: '#build', label: 'Build' },
  { href: '#availability', label: 'Availability' },
  { href: '#stories', label: 'Stories' },
  { href: '#venues', label: 'Venues' },
];

export default function Nav({ hotelName = 'The Grand Aranya' }) {
  return (
    <nav className="sticky top-0 z-40 border-b border-line/70 bg-ivory/95 backdrop-blur px-5 py-4 sm:px-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <a href="#top" className="font-display text-sm font-black tracking-[0.06em] sm:text-base">
          {hotelName.toUpperCase()}
        </a>
        <div className="hidden gap-6 text-[12.5px] font-semibold text-espresso/80 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-gold transition-colors">
              {l.label}
            </a>
          ))}
        </div>
        <a
          href="#visit"
          className="rounded-full bg-gold px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-espresso sm:px-5 sm:text-xs"
        >
          Enquire
        </a>
      </div>
    </nav>
  );
}
