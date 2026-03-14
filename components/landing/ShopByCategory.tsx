'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const categories = [
  { key: 'flour', label: 'Atta & Flour', icon: '/icons/atta.png' },
  { key: 'spices', label: 'Spices', icon: '/icons/spice.png' },
  { key: 'oils', label: 'Oils', icon: '/icons/oils.png' },
  { key: 'pulses', label: 'Pulses & Dal', icon: '/icons/pulse.png' },
  { key: 'grains', label: 'Grains & Rice', icon: '/icons/rice.png' },
  { key: 'ghee', label: 'Ghee', icon: '/icons/ghee.png' },
  { key: 'honey', label: 'Honey', icon: '/icons/honey.png' },
  { key: 'dry-fruits', label: 'Dry Fruits', icon: '/icons/DryFruit.png' },
  { key: 'others', label: 'Others', icon: '/icons/other.png' },
];

export default function ShopByCategory() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    setTimeout(checkScroll, 400);
  };

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-charcoal text-center mb-12 uppercase tracking-wide">
          Shop by Category
        </h2>

        <div className="relative">
          {/* Carousel */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-8 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((cat) => (
              <Link
                key={cat.key}
                href={`/shop?category=${cat.key}`}
                className="flex flex-col items-center gap-4 shrink-0 group snap-start"
              >
                <div className="w-44 h-44 md:w-52 md:h-52 rounded-full relative bg-primary/90 group-hover:bg-primary transition-colors duration-300 shadow-card group-hover:shadow-card-hover overflow-hidden">
                  <Image
                    src={cat.icon}
                    alt={cat.label}
                    fill
                    sizes="(max-width: 768px) 176px, 208px"
                    className="object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-charcoal group-hover:text-primary transition-colors">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Navigation arrows */}
          <div className="flex justify-center gap-3 mt-8">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-10 h-10 rounded-full border border-cream-warm flex items-center justify-center text-charcoal hover:bg-cream disabled:opacity-30 transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-10 h-10 rounded-full border border-cream-warm flex items-center justify-center text-charcoal hover:bg-cream disabled:opacity-30 transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
