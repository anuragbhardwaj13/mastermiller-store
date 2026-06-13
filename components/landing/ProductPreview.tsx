'use client';

import Link from 'next/link';
import ProductCard from '../shop/ProductCard';
import { useFeaturedProducts } from '@/hooks/useProducts';
import Loader from '@/components/common/Loader';

const badgeRotation = ['Best Seller', 'New Arrival', 'Limited Stock', 'Popular'];

export default function ProductPreview() {
  const { products, loading } = useFeaturedProducts();

  return (
    <section className="section-padding bg-white border-y border-cream-warm">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="font-script text-primary text-2xl md:text-3xl block leading-none mb-1">
            Customer Favourites
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold text-charcoal">
            Best Sellers
          </h2>
        </div>

        {loading ? (
          <Loader label="Loading best sellers…" />
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
                className="bg-primary text-white font-bold text-sm uppercase px-10 py-3.5 rounded-btn hover:bg-accent transition-colors tracking-widest"
              >
                View All
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-cream-dark rounded-2xl border border-cream-warm">
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
