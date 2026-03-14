'use client';

import Image from 'next/image';
import { CartItem as CartItemType } from '@/types';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  const itemTotal = product.price * quantity;

  return (
    <div className="flex gap-4 py-5 border-b border-cream-dark last:border-0">
      {/* Product Image */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-cream">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted/40 text-xs">
            No Image
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-grow min-w-0">
        <p className="font-heading font-semibold text-charcoal leading-tight">{product.name}</p>
        {product.nameHindi && (
          <p className="text-xs text-muted mt-0.5">{product.nameHindi}</p>
        )}
        <p className="text-sm text-muted mt-1">₹{product.price} / {product.unit}</p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center border border-tan rounded-full overflow-hidden">
            <button
              onClick={() => updateQuantity(`${product.id}_${product.unit}`, quantity - 1)}
              className="px-3 py-1.5 hover:bg-cream transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5 text-charcoal" />
            </button>
            <span className="px-3 py-1.5 text-sm font-semibold text-charcoal min-w-[2rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(`${product.id}_${product.unit}`, quantity + 1)}
              className="px-3 py-1.5 hover:bg-cream transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5 text-charcoal" />
            </button>
          </div>

          <button
            onClick={() => removeFromCart(`${product.id}_${product.unit}`)}
            className="p-1.5 text-muted hover:text-red-500 transition-colors"
            aria-label="Remove from cart"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Item Total */}
      <div className="text-right shrink-0">
        <p className="font-heading font-bold text-lg text-primary">₹{itemTotal}</p>
        <p className="text-xs text-muted mt-0.5">{quantity} × ₹{product.price}</p>
      </div>
    </div>
  );
}
