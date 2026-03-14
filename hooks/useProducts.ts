'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { getAllProducts, getFeaturedProducts, getProductsByCategory } from '@/lib/firebase/firestore';
import { staticProducts } from '@/lib/staticProducts';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      // Fall back to static catalogue when Firebase is empty or not configured
      setProducts(data.length > 0 ? data : staticProducts);
      setError(null);
    } catch (err) {
      // Firebase not configured yet — show static products
      setProducts(staticProducts);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, refetch: fetchProducts };
};

export const useFeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getFeaturedProducts();
        if (data.length > 0) {
          setProducts(data);
        } else {
          // Fall back to featured items from static catalogue
          setProducts(staticProducts.filter((p) => p.featured));
        }
      } catch {
        setProducts(staticProducts.filter((p) => p.featured));
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return { products, loading };
};

export const useProductsByCategory = (category: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchByCategory = async () => {
      try {
        let data: Product[];
        if (category === 'all') {
          data = await getAllProducts();
        } else {
          data = await getProductsByCategory(category);
        }
        if (data.length > 0) {
          setProducts(data);
        } else {
          const filtered = category === 'all'
            ? staticProducts
            : staticProducts.filter((p) => p.category === category);
          setProducts(filtered);
        }
      } catch {
        const filtered = category === 'all'
          ? staticProducts
          : staticProducts.filter((p) => p.category === category);
        setProducts(filtered);
      } finally {
        setLoading(false);
      }
    };
    fetchByCategory();
  }, [category]);

  return { products, loading };
};
