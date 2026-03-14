'use client';

import { Product, CATEGORIES } from '@/types';
import Image from 'next/image';
import { Edit, Trash2, Star, Package, Search } from 'lucide-react';
import { useState } from 'react';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = products.filter((p) => {
    const matchCat = filterCategory === 'all' || p.category === filterCategory;
    const matchSearch = search === '' || p.name.toLowerCase().includes(search.toLowerCase()) || p.nameHindi?.includes(search);
    return matchCat && matchSearch;
  });

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <Package className="w-16 h-16 text-cream-warm mx-auto mb-4" />
        <p className="font-heading text-xl font-bold text-charcoal mb-1">No products yet</p>
        <p className="text-sm text-muted">Click &quot;Add Product&quot; to create your first product.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-warm bg-cream/30 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted/50"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-cream-warm bg-cream/30 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
        >
          <option value="all">All Categories</option>
          {Object.entries(CATEGORIES).map(([key, val]) => (
            <option key={key} value={key}>{val.en}</option>
          ))}
        </select>
      </div>

      <p className="text-xs text-muted">{filtered.length} of {products.length} products</p>

      {/* Product Cards Grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl border border-cream-warm overflow-hidden hover:shadow-card transition-shadow group"
          >
            {/* Image */}
            <div className="relative h-40 bg-cream/50">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted/30">
                  <Package className="w-10 h-10 mb-1" />
                  <span className="text-xs">No image</span>
                </div>
              )}
              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-1.5">
                {product.featured && (
                  <span className="flex items-center gap-1 bg-yellow-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 fill-white" /> Featured
                  </span>
                )}
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${product.inStock ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              {/* Category badge */}
              <span className="absolute top-3 right-3 bg-charcoal/70 text-white text-[10px] font-bold px-2 py-1 rounded-full capitalize">
                {product.category}
              </span>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="font-heading font-bold text-charcoal text-lg leading-tight">
                {product.name}
              </h3>
              {product.nameHindi && (
                <p className="text-xs text-muted mt-0.5">{product.nameHindi}</p>
              )}
              <div className="flex items-center justify-between mt-3">
                <span className="font-heading text-xl font-bold text-primary">
                  &#x20B9;{product.price}
                  <span className="text-xs text-muted font-body font-normal ml-1">/ {product.unit}</span>
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-3 border-t border-cream-warm">
                <button
                  onClick={() => onEdit(product)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary hover:text-white transition-all"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                {confirmDelete === product.id ? (
                  <div className="flex-1 flex gap-1">
                    <button
                      onClick={() => { onDelete(product.id); setConfirmDelete(null); }}
                      className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="flex-1 py-2.5 rounded-xl bg-cream text-charcoal text-sm font-medium hover:bg-cream-warm transition-colors"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(product.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-500 text-sm font-medium hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted text-sm">No products match your search.</p>
        </div>
      )}
    </div>
  );
}
