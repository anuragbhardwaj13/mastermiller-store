'use client';

import { CATEGORIES } from '@/types';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const categories = [
    { key: 'all', label: 'All', labelHindi: 'सभी' },
    ...Object.entries(CATEGORIES).map(([key, value]) => ({
      key,
      label: value.en,
      labelHindi: value.hi,
    })),
  ];

  return (
    <div className="mb-8 flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.key}
          onClick={() => onCategoryChange(category.key)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
            selectedCategory === category.key
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-charcoal border-cream-warm hover:border-tan hover:bg-cream'
          }`}
        >
          {category.label}
          <span className="ml-1.5 text-xs opacity-70">{category.labelHindi}</span>
        </button>
      ))}
    </div>
  );
}
