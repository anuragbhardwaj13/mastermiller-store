'use client';

import { Suspense, useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import CategoryFilter from '@/components/shop/CategoryFilter';
import ProductGrid from '@/components/shop/ProductGrid';
import Loader from '@/components/common/Loader';
import { Search, X } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const { products, loading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch =
      searchTerm === '' ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.nameHindi?.includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  }), [products, selectedCategory, searchTerm]);

  return (
    <>
      <div className="container-custom py-10">
        {/* Search + Filter row */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search products"
              className="w-full pl-10 pr-11 min-h-[44px] rounded-full border border-cream-warm bg-white text-sm text-charcoal placeholder-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus:border-primary transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full text-muted hover:text-charcoal hover:bg-cream-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {!loading && (
            <span className="text-xs text-muted whitespace-nowrap">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Category Filter */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Products Grid */}
        {loading ? (
          <Loader label="Loading products…" />
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </div>
    </>
  );
}

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Page Header */}
      <div className="bg-white border-b border-cream-warm">
        <div className="container-custom py-10">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">Catalogue</span>
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-charcoal mt-2 leading-tight">
            Our <span className="italic text-primary">Products</span>
          </h1>
          <p className="text-muted text-sm mt-3 max-w-xl">
            Browse our complete range of freshly milled organic food items — flour, spices, cold-pressed oils, pulses, and more.
          </p>
        </div>
      </div>

      <Suspense fallback={<Loader label="Loading products…" />}>
        <ShopContent />
      </Suspense>
    </div>
  );
}
