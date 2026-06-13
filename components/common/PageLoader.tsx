'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

/**
 * Opening page loader — Maati-style preloader: a full-screen white overlay
 * with a dual spinning ring (green + amber) and the Master Miller logo,
 * shown on first load and faded out once the app is interactive.
 *
 * Robustness: it fades on the EARLIEST of (a) window 'load', (b) a rAF after
 * mount (React has hydrated and painted), or (c) a hard 3s cap — so it can
 * never get stuck. It mounts once in the root layout, so client-side route
 * changes don't re-trigger it.
 */
export default function PageLoader() {
  const [loaded, setLoaded] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setLoaded(true);
    };

    // (a) full page load
    if (document.readyState === 'complete') {
      // Already loaded — fade almost immediately after a paint.
      requestAnimationFrame(() => requestAnimationFrame(finish));
    } else {
      window.addEventListener('load', finish, { once: true });
    }

    // (b) the component has mounted (hydrated) — give a short, pleasant beat.
    const minBeat = setTimeout(finish, 700);

    // (c) hard safety cap so it never hangs.
    const cap = setTimeout(finish, 3000);

    return () => {
      window.removeEventListener('load', finish);
      clearTimeout(minBeat);
      clearTimeout(cap);
    };
  }, []);

  // Remove from the DOM after the fade-out completes.
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => setHidden(true), 500);
    return () => clearTimeout(t);
  }, [loaded]);

  if (hidden) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-cream transition-opacity duration-500 ${
        loaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex items-center justify-center w-[120px] h-[120px]">
        {/* Outer ring — green */}
        <span className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
        {/* Inner ring — amber, spins the other way */}
        <span
          className="absolute inset-[14px] rounded-full border-4 border-transparent border-t-amber"
          style={{ animation: 'spin 1.4s linear infinite reverse' }}
        />
        {/* Master Miller logo */}
        <Image
          src="/logo.png"
          alt="Master Miller"
          width={56}
          height={56}
          className="h-14 w-14 object-contain"
          priority
        />
      </div>
    </div>
  );
}
