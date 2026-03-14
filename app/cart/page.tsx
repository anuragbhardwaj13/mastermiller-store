"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import Button from "@/components/common/Button";
import { ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { cart, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center py-16 px-4">
          <ShoppingBag className="w-20 h-20 text-tan mx-auto mb-6" />
          <h1 className="font-heading text-4xl font-bold text-charcoal mb-3">
            Your cart is empty
          </h1>
          <p className="text-muted mb-8 max-w-xs mx-auto">
            Add some fresh products from our store.
          </p>
          <Link href="/shop">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="container-custom py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">
              Your Order
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-charcoal mt-1">
              Shopping Cart
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-muted hover:text-red-500 transition-colors"
          >
            Clear all
          </button>
        </div>

        {/* Cart Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-cream-dark px-6">
              {cart.map((item) => (
                <CartItem key={`${item.product.id}_${item.product.unit}`} item={item} />
              ))}
            </div>
            <Link href="/shop" className="block mt-4">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
