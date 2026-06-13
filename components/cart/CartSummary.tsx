'use client';

import { useCart } from '@/context/CartContext';
import { redirectToWhatsApp } from '@/lib/whatsapp';
import { MessageCircle, ShieldCheck, Truck } from 'lucide-react';

const FREE_DELIVERY_THRESHOLD = 499;

export default function CartSummary() {
  const { cart, getCartTotal, getCartCount } = useCart();
  const total = getCartTotal();
  const itemCount = getCartCount();

  const qualifiesFreeDelivery = total >= FREE_DELIVERY_THRESHOLD;
  const amountToFree = Math.max(0, FREE_DELIVERY_THRESHOLD - total);
  const progress = Math.min(100, (total / FREE_DELIVERY_THRESHOLD) * 100);

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;
    redirectToWhatsApp(cart);
  };

  return (
    <div className="bg-white rounded-2xl border border-cream-warm shadow-card p-5 sm:p-6 lg:sticky lg:top-28">
      <h2 className="font-heading text-xl sm:text-2xl font-bold text-charcoal mb-5">
        Order Summary
      </h2>

      {/* Free delivery progress */}
      <div className="mb-5 rounded-xl bg-cream-dark border border-cream-warm p-3.5">
        <div className="flex items-center gap-2 text-sm">
          <Truck className="w-4 h-4 text-secondary shrink-0" />
          {qualifiesFreeDelivery ? (
            <span className="text-secondary font-medium">
              You&apos;ve unlocked free delivery!
            </span>
          ) : (
            <span className="text-charcoal">
              Add{' '}
              <span className="font-bold text-primary">
                ₹{amountToFree.toLocaleString('en-IN')}
              </span>{' '}
              more for free delivery
            </span>
          )}
        </div>
        <div
          className="mt-2.5 h-1.5 rounded-full bg-cream-warm overflow-hidden"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progress toward free delivery"
        >
          <div
            className="h-full bg-secondary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Breakdown */}
      <dl className="space-y-3 mb-5">
        <div className="flex justify-between text-sm">
          <dt className="text-muted">Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</dt>
          <dd className="font-medium text-charcoal tabular-nums">
            ₹{total.toLocaleString('en-IN')}
          </dd>
        </div>
        <div className="flex justify-between text-sm">
          <dt className="text-muted">Delivery</dt>
          <dd className={`font-medium ${qualifiesFreeDelivery ? 'text-secondary' : 'text-muted'}`}>
            {qualifiesFreeDelivery ? 'Free' : 'Calculated at confirmation'}
          </dd>
        </div>
        <div className="border-t border-cream-warm pt-3 flex justify-between items-center">
          <dt className="font-bold text-charcoal">Total</dt>
          <dd className="font-heading text-2xl font-bold text-primary tabular-nums">
            ₹{total.toLocaleString('en-IN')}
          </dd>
        </div>
      </dl>

      {/* Checkout CTA */}
      <button
        onClick={handleWhatsAppOrder}
        disabled={cart.length === 0}
        className="w-full min-h-[52px] inline-flex items-center justify-center gap-2 rounded-btn bg-primary text-white font-bold text-sm sm:text-base hover:bg-accent active:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
      >
        <MessageCircle className="w-5 h-5" />
        Order on WhatsApp
      </button>

      {/* Trust note */}
      <div className="mt-4 flex items-start gap-2.5 text-xs text-muted leading-relaxed">
        <ShieldCheck className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
        <p>
          Your order is sent to us on WhatsApp. We&apos;ll confirm availability,
          delivery details, and payment before dispatch.
        </p>
      </div>
    </div>
  );
}
