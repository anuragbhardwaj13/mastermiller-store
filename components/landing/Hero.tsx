'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative w-full bg-cream overflow-hidden">
      {/*
        Mobile: a min-height section so the content (tagline + heading +
        paragraph + buttons) always has room and never clips. The image is a
        true background behind it.
        md+: a fixed cinematic aspect-ratio banner.
      */}
      <div className="relative w-full min-h-[560px] sm:min-h-[480px] md:min-h-0 md:aspect-[16/6] lg:aspect-[16/5]">
        {/* Hero banner image */}
        <Image
          src="/hero-banner.png"
          alt="Master Miller - Fresh Milling Store"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />

        {/* Overlay for text readability — stronger on mobile, directional on desktop */}
        <div className="absolute inset-0 bg-charcoal/55 md:bg-gradient-to-r md:from-charcoal/75 md:via-charcoal/40 md:to-transparent" />

        {/* Content overlay */}
        <div className="relative md:absolute md:inset-0 flex items-center min-h-[560px] sm:min-h-[480px] md:min-h-0">
          <div className="container-custom py-12 md:py-0">
            <div className="max-w-xl space-y-4">
              {/* Handwritten tagline */}
              <span className="font-script text-amber text-2xl md:text-3xl block leading-none">
                Freshly Milled Goodness
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08]">
                Pure, Natural &amp;
                <br />
                <span className="text-amber">Freshly Packed</span>
              </h1>
              <p className="text-white/90 text-sm md:text-base max-w-md leading-relaxed">
                Experience the purity of traditionally milled grains, aromatic
                spices, and cold-pressed oils — freshly packed with care at
                Master Miller.
              </p>
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center min-h-[52px] bg-primary text-white font-bold text-sm md:text-base uppercase tracking-wide px-8 rounded-btn hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  Shop Now
                </Link>
                <Link
                  href="/#about"
                  className="inline-flex items-center justify-center min-h-[52px] border-2 border-white/70 text-white font-bold text-sm md:text-base uppercase tracking-wide px-8 rounded-btn hover:bg-white hover:text-charcoal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  Our Story
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
