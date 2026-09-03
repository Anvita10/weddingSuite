import { useState } from 'react';

const GRADIENTS = [
  'from-[#8a5a30] to-[#2A1F14]',
  'from-[#C9A227] to-[#5a3d1c]',
  'from-[#a3623a] to-[#231710]',
  'from-[#7a4e28] to-[#1c130a]',
];

/**
 * Shows a real photo when `src` resolves, otherwise falls back to a themed
 * gradient tile so the layout never breaks before real venue photography is
 * uploaded to /public/images.
 *
 * Pass `fill` when you want this tile to absolutely cover an existing
 * `relative`-positioned parent (e.g. a hero section) — don't pass
 * "absolute inset-0" via `className` instead, it collides with the
 * `relative` this component sets internally and silently collapses to
 * zero height.
 */
export default function PhotoTile({
  src,
  alt = '',
  className = '',
  imgClassName = '',
  gradientIndex = 0,
  children,
  fill = false,
}) {
  const [failed, setFailed] = useState(false);
  const gradient = GRADIENTS[gradientIndex % GRADIENTS.length];
  const positionClass = fill ? 'absolute inset-0' : 'relative';

  return (
    <div className={`${positionClass} overflow-hidden bg-gradient-to-br ${gradient} ${className}`}>
      {src && !failed && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        />
      )}
      {children}
    </div>
  );
}