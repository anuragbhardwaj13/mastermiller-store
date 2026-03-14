'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative w-full bg-primary overflow-hidden">
      {/* Full-width banner */}
      <div className="relative w-full aspect-[16/7] md:aspect-[16/6] lg:aspect-[16/5]">
        {/* Background gradient fallback when no image */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-dark to-primary" />

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
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center">
          <div className="container-custom">
            <div className="max-w-xl space-y-5">
              <span className="inline-block text-xs font-body font-semibold tracking-[0.2em] uppercase text-white/90 border border-white/30 rounded-full px-4 py-1.5">
                100% Natural & Freshly Packed
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1]">
                Master<br />
                <span className="italic text-tan">Miller</span>
              </h1>
              <p className="text-white/80 text-sm md:text-base max-w-md leading-relaxed">
                Experience the purity of traditionally milled grains, aromatic spices, cold-pressed oils — freshly packed with care.
              </p>
              <Link
                href="/shop"
                className="inline-block bg-tan text-primary font-semibold text-sm md:text-base px-8 py-3 rounded-full hover:bg-tan-light transition-colors"
              >
                SHOP NOW
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
