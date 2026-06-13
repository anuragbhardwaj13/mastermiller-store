'use client';

import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  badge?: string;
}

const categoryColors: Record<string, string> = {
  flour: '#E9D1BF',
  spices: '#F5C6A0',
  oils: '#F0D9A0',
  pulses: '#D4E8C2',
  grains: '#E2D4B8',
  ghee: '#FAE5C0',
  honey: '#F9D77E',
  'dry-fruits': '#D9C5A0',
  others: '#D9D9D9',
};

const badgeStyles: Record<string, { label: string; bg: string }> = {
  'Best Seller': { label: 'Best Seller', bg: 'bg-primary' },
  'New Arrival': { label: 'New Arrival', bg: 'bg-secondary' },
  'Limited Stock': { label: 'Limited Stock', bg: 'bg-accent' },
  'Popular': { label: 'Popular', bg: 'bg-amber-dark' },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= Math.floor(rating)
                ? 'fill-yellow-500 text-yellow-500'
                : star - 0.5 <= rating
                ? 'fill-yellow-500/50 text-yellow-500'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-muted">({rating.toFixed(2)}/5 Star)</span>
    </div>
  );
}

export default function ProductCard({ product, priority = false, badge }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);

  // Build variants list: use product.variants if available, otherwise fallback to single price/unit
  const variants = product.variants && product.variants.length > 0
    ? product.variants
    : [{ unit: product.unit, price: product.price }];

  const currentVariant = variants[selectedIdx] || variants[0];

  const handleAddToCart = () => {
    // Pass product with selected variant's price and unit
    addToCart({ ...product, price: currentVariant.price, unit: currentVariant.unit }, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const placeholderBg = categoryColors[product.category] || '#E9D1BF';
  const rating = 4.5 + (product.name.length % 5) * 0.1;
  const badgeInfo = badge ? badgeStyles[badge] : product.featured ? badgeStyles['Best Seller'] : null;

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-cream-warm hover:border-tan transition-all duration-200 shadow-card hover:shadow-card-hover">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden" style={{ background: placeholderBg }}>
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={priority}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 opacity-40">
            <ShoppingCart className="w-10 h-10 text-primary" />
            <span className="text-xs font-medium text-primary capitalize">{product.category}</span>
          </div>
        )}

        {/* Badge */}
        {badgeInfo && (
          <span className={`absolute top-3 left-3 text-[11px] font-semibold text-white px-3 py-1.5 rounded-full ${badgeInfo.bg}`}>
            {badgeInfo.label}
          </span>
        )}
        {!product.inStock && (
          <span className="absolute top-3 right-3 text-[11px] font-semibold bg-charcoal/70 text-white px-3 py-1.5 rounded-full">
            Out of Stock
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-heading font-bold text-lg text-charcoal leading-snug line-clamp-2 text-center">
          {product.name}
        </h3>

        {/* Star Rating */}
        <div className="flex justify-center">
          <StarRating rating={rating} />
        </div>

        {/* Price */}
        <p className="text-center font-heading text-xl font-bold text-charcoal">
          &#x20B9; {currentVariant.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          <span className="text-sm font-normal text-muted"> / {currentVariant.unit}</span>
        </p>

        {/* Unit selector + Add to Cart */}
        {product.inStock ? (
          <div className="flex items-center gap-2 pt-2">
            <div className="flex-1 relative">
              <select
                className="w-full appearance-none bg-white border border-cream-warm rounded-btn pl-3 pr-8 min-h-[44px] text-sm text-charcoal cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus:border-primary"
                value={selectedIdx}
                onChange={(e) => setSelectedIdx(Number(e.target.value))}
                aria-label={`Select size for ${product.name}`}
              >
                {variants.map((v, i) => (
                  <option key={v.unit} value={i}>
                    {v.unit} — ₹{v.price}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-3 h-3 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              className="min-h-[44px] bg-primary text-white text-xs font-bold uppercase px-4 rounded-btn hover:bg-accent active:bg-accent-dark transition-colors tracking-wider whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label={`Add ${product.name} to cart`}
            >
              {added ? 'Added!' : 'Add to Cart'}
            </button>
          </div>
        ) : (
          <button disabled className="w-full min-h-[44px] bg-cream-dark text-muted text-xs font-bold uppercase px-4 rounded-btn tracking-wider mt-2 cursor-not-allowed">
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
}
