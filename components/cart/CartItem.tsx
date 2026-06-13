'use client';

import Image from 'next/image';
import { CartItem as CartItemType } from '@/types';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ImageOff } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  const itemTotal = product.price * quantity;
  const itemKey = `${product.id}_${product.unit}`;

  const handleRemove = () => {
    // Guard against accidental taps wiping an item.
    if (window.confirm(`Remove ${product.name} from your cart?`)) {
      removeFromCart(itemKey);
    }
  };

  return (
    <div className="flex gap-3 sm:gap-4 py-4 sm:py-5 border-b border-cream-warm last:border-0">
      {/* Product Image */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-cream-dark border border-cream-warm">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-muted/50">
            <ImageOff className="w-5 h-5" />
            <span className="text-[10px]">No image</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-grow min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-heading font-bold text-charcoal leading-tight truncate">
              {product.name}
            </p>
            {product.nameHindi && (
              <p className="text-xs text-muted mt-0.5 truncate">{product.nameHindi}</p>
            )}
            <p className="text-sm text-muted mt-1">
              ₹{product.price.toLocaleString('en-IN')}{' '}
              <span className="text-muted/70">/ {product.unit}</span>
            </p>
          </div>

          {/* Item total (right-aligned, always visible) */}
          <div className="text-right shrink-0">
            <p className="font-heading font-bold text-base sm:text-lg text-primary">
              ₹{itemTotal.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Quantity Controls + Remove */}
        <div className="flex items-center justify-between gap-3 mt-3">
          <div
            className="flex items-center border border-cream-warm rounded-full overflow-hidden"
            role="group"
            aria-label={`Quantity for ${product.name}`}
          >
            <button
              onClick={() => updateQuantity(itemKey, quantity - 1)}
              disabled={quantity <= 1}
              className="w-11 h-11 flex items-center justify-center text-charcoal hover:bg-cream-dark active:bg-cream-warm transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span
              className="min-w-[2.5rem] text-center text-sm font-bold text-charcoal tabular-nums"
              aria-live="polite"
            >
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(itemKey, quantity + 1)}
              className="w-11 h-11 flex items-center justify-center text-charcoal hover:bg-cream-dark active:bg-cream-warm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleRemove}
            className="inline-flex items-center gap-1.5 h-11 px-3 rounded-full text-sm text-muted hover:text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
            aria-label={`Remove ${product.name} from cart`}
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
}
