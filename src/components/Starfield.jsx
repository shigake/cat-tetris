import React, { useMemo } from 'react';

/**
 * Lightweight CSS-only animated starfield background.
 * Renders 35 tiny dots that twinkle via CSS animation.
 * Uses no framer-motion to keep bundle/CPU cost minimal.
 */
export default function Starfield({ count = 35, className = '' }) {
  const stars = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${(i * 37 + 13) % 100}%`,
      top: `${(i * 53 + 7) % 100}%`,
      size: (i % 3) + 1,
      delay: `${(i * 0.17) % 3}s`,
      dur: `${2 + (i % 3)}s`,
    }))
  , [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {stars.map(s => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white starfield-twinkle"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            animationDuration: s.dur,
          }}
        />
      ))}
    </div>
  );
}
