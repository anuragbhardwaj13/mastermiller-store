"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { ShoppingBag, ArrowLeft, Trash2 } from "lucide-react";

export default function CartPage() {
  const { cart, clearCart, getCartCount } = useCart();
  const itemCount = getCartCount();

  const handleClearCart = () => {
    if (window.confirm("Remove all items from your cart?")) {
      clearCart();
    }
  };

  // Empty cart
  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-cream flex items-center justify-center px-4">
        <div className="text-center py-16 max-w-sm">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <ShoppingBag className="w-11 h-11 text-primary" />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal mb-3">
            Your cart is empty
          </h1>
          <p className="text-muted mb-8">
            Looks like you haven&apos;t added anything yet. Explore our freshly
            milled products.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 min-h-[52px] px-8 rounded-btn bg-primary text-white font-bold hover:bg-accent active:bg-accent-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="container-custom py-8 sm:py-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors mb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue shopping
          </Link>
          <div className="flex items-end justify-between gap-3">
            <div>
              <span className="font-script text-primary text-xl sm:text-2xl block leading-none mb-0.5">
                Your Order
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-charcoal">
                Shopping Cart
              </h1>
            </div>
            <button
              onClick={handleClearCart}
              className="inline-flex items-center gap-1.5 h-10 px-3 rounded-full text-sm text-muted hover:text-red-600 hover:bg-red-50 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
              aria-label="Clear all items from cart"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear all</span>
            </button>
          </div>
        </div>

        {/* Cart Content */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-cream-warm shadow-card px-4 sm:px-6">
              {cart.map((item) => (
                <CartItem
                  key={`${item.product.id}_${item.product.unit}`}
                  item={item}
                />
              ))}
            </div>
            <p className="text-xs text-muted mt-3 px-1">
              {itemCount} item{itemCount !== 1 ? "s" : ""} in your cart
            </p>
          </div>

          {/* Cart Summary — sticky on desktop, stacks below items on smaller screens */}
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
