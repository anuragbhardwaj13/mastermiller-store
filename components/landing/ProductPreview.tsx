'use client';

import Link from 'next/link';
import ProductCard from '../shop/ProductCard';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { Loader2 } from 'lucide-react';

const badgeRotation = ['Best Seller', 'New Arrival', 'Limited Stock', 'Popular'];

export default function ProductPreview() {
  const { products, loading } = useFeaturedProducts();

  return (
    <section className="section-padding bg-cream">
      <div className="container-custom">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-charcoal text-center mb-12 uppercase tracking-wide">
          Best Sellers
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={index < 4}
                  badge={badgeRotation[index % badgeRotation.length]}
                />
              ))}
            </div>

            <div className="flex justify-center mt-12">
              <Link
                href="/shop"
                className="bg-primary text-white font-bold text-sm uppercase px-10 py-3.5 rounded-lg hover:bg-primary-dark transition-colors tracking-widest"
              >
                View All
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl">
            <p className="font-heading text-2xl text-charcoal mb-2">No featured products yet</p>
            <p className="text-muted text-sm mb-6">Check back soon or browse our full catalogue</p>
            <Link
              href="/shop"
              className="inline-block bg-primary text-white font-bold text-sm uppercase px-10 py-3.5 rounded-lg hover:bg-primary-dark transition-colors tracking-widest"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
