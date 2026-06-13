'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative w-full bg-cream overflow-hidden">
      {/* Full-width banner */}
      <div className="relative w-full aspect-[16/8] sm:aspect-[16/7] md:aspect-[16/6] lg:aspect-[16/5]">
        {/* Hero banner image */}
        <Image
          src="/hero-banner.png"
          alt="Master Miller - Fresh Milling Store"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />

        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/75 via-charcoal/40 to-transparent" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center">
          <div className="container-custom">
            <div className="max-w-xl space-y-4">
              {/* Maati-style handwritten tagline */}
              <span className="font-script text-amber text-2xl md:text-3xl block leading-none">
                Freshly Milled Goodness
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05]">
                Pure, Natural &amp;
                <br />
                <span className="text-amber">Freshly Packed</span>
              </h1>
              <p className="text-white/85 text-sm md:text-base max-w-md leading-relaxed">
                Experience the purity of traditionally milled grains, aromatic
                spices, and cold-pressed oils — freshly packed with care at
                Master Miller.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/shop"
                  className="inline-block bg-primary text-white font-bold text-sm md:text-base uppercase tracking-wide px-8 py-3.5 rounded-btn hover:bg-accent transition-colors"
                >
                  Shop Now
                </Link>
                <Link
                  href="/#about"
                  className="inline-block border-2 border-white/70 text-white font-bold text-sm md:text-base uppercase tracking-wide px-8 py-3.5 rounded-btn hover:bg-white hover:text-charcoal transition-colors"
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
