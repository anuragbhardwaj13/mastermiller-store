'use client';

import { useCart } from '@/context/CartContext';
import Button from '../common/Button';
import { redirectToWhatsApp } from '@/lib/whatsapp';
import { ShoppingBag, MessageCircle } from 'lucide-react';

export default function CartSummary() {
  const { cart, getCartTotal, getCartCount } = useCart();
  const total = getCartTotal();
  const itemCount = getCartCount();

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;
    redirectToWhatsApp(cart);
  };

  return (
    <div className="bg-white rounded-2xl border border-cream-dark p-6 sticky top-24">
      <h2 className="font-heading text-2xl font-bold text-charcoal mb-6">Order Summary</h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm text-muted">
          <span>Items ({itemCount})</span>
          <span className="font-medium text-charcoal">₹{total}</span>
        </div>
        <div className="flex justify-between text-sm text-muted">
          <span>Delivery</span>
          <span className="text-primary font-medium">Free</span>
        </div>
        <div className="border-t border-cream-dark pt-3 flex justify-between items-center">
          <span className="font-semibold text-charcoal">Total</span>
          <span className="font-heading text-2xl font-bold text-primary">₹{total}</span>
        </div>
      </div>

      <Button
        onClick={handleWhatsAppOrder}
        disabled={cart.length === 0}
        className="w-full mb-4"
        size="lg"
      >
        <MessageCircle className="w-5 h-5 mr-2" />
        Order on WhatsApp
      </Button>

      <div className="flex items-start gap-3 bg-cream rounded-xl p-4">
        <ShoppingBag className="w-4 h-4 text-primary mt-0.5 shrink-0" />
        <p className="text-xs text-muted leading-relaxed">
          Click "Order on WhatsApp" to send your order directly to us. We'll confirm availability and delivery details.
        </p>
      </div>
    </div>
  );
}
