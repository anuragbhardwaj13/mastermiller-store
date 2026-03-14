'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';
import { createProduct, updateProduct, deleteProduct } from '@/lib/firebase/firestore';
import { signOut } from '@/lib/firebase/auth';
import ProductList from '@/components/admin/ProductList';
import ProductForm from '@/components/admin/ProductForm';
import { Product } from '@/types';
import { Plus, LogOut, Loader2, Package, CheckCircle2, Star, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { products, loading: productsLoading, refetch } = useProducts();

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, authLoading, router]);

  const handleCreate = () => {
    setEditingProduct(undefined);
    setShowForm(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: any) => {
    if (editingProduct) {
      const { error } = await updateProduct(editingProduct.id, data);
      if (error) {
        toast.error(`Failed to update product: ${error}`);
      } else {
        toast.success('Product updated successfully!');
        setShowForm(false);
        setEditingProduct(undefined);
        refetch();
      }
    } else {
      const { error } = await createProduct(data);
      if (error) {
        toast.error(`Failed to create product: ${error}`);
      } else {
        toast.success('Product created successfully!');
        setShowForm(false);
        refetch();
      }
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await deleteProduct(id);
    if (error) {
      toast.error(`Failed to delete product: ${error}`);
    } else {
      toast.success('Product deleted successfully!');
      refetch();
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(undefined);
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      router.push('/admin/login');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const totalProducts = products.length;
  const inStockCount = products.filter(p => p.inStock).length;
  const outOfStockCount = totalProducts - inStockCount;
  const featuredCount = products.filter(p => p.featured).length;

  return (
    <div className="min-h-screen bg-cream">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-charcoal">
              Product Manager
            </h1>
            <p className="text-sm text-muted mt-1">Manage your Master Miller product catalogue</p>
          </div>

          <div className="flex items-center gap-3">
            {!showForm && (
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-primary-dark transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 border border-cream-warm text-muted text-sm px-4 py-2.5 rounded-xl hover:bg-cream hover:text-charcoal transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {!showForm && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-cream-warm p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-heading font-bold text-charcoal">{totalProducts}</p>
                <p className="text-xs text-muted">Total Products</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-cream-warm p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-heading font-bold text-green-600">{inStockCount}</p>
                <p className="text-xs text-muted">In Stock</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-cream-warm p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <Package className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-heading font-bold text-red-500">{outOfStockCount}</p>
                <p className="text-xs text-muted">Out of Stock</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-cream-warm p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center shrink-0">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-heading font-bold text-yellow-600">{featuredCount}</p>
                <p className="text-xs text-muted">Featured</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {showForm ? (
          <ProductForm
            product={editingProduct}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        ) : productsLoading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : (
          <ProductList
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
