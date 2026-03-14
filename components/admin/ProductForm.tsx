'use client';

import { useState, useEffect, useRef } from 'react';
import { Product, CATEGORIES, UNITS } from '@/types';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { Upload, X, ImageIcon, Save, ArrowLeft, Package, Tag, IndianRupee, Weight, FileText, Star, CheckCircle2 } from 'lucide-react';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export default function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    nameHindi: product?.nameHindi || '',
    category: product?.category || 'flour',
    description: product?.description || '',
    descriptionHindi: product?.descriptionHindi || '',
    price: product?.price || 0,
    unit: product?.unit || 'kg',
    imageUrl: product?.imageUrl || '',
    inStock: product?.inStock ?? true,
    featured: product?.featured ?? false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (result: any) => {
    setFormData(prev => ({ ...prev, imageUrl: result.info.secure_url }));
  };

  const observerRef = useRef<MutationObserver | null>(null);

  const handleWidgetOpen = () => {
    // Watch for Cloudinary widget overlay removal and reset body overflow
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new MutationObserver(() => {
      if (!document.querySelector('iframe[src*="cloudinary"]')) {
        document.body.style.overflow = '';
        observerRef.current?.disconnect();
      }
    });
    observerRef.current.observe(document.body, { childList: true, subtree: true });
  };

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Back button */}
      <button
        type="button"
        onClick={onCancel}
        className="flex items-center gap-2 text-sm text-muted hover:text-charcoal transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column — Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Name Card */}
          <div className="bg-white rounded-2xl border border-cream-warm p-6 space-y-5">
            <div className="flex items-center gap-2 text-charcoal mb-1">
              <Package className="w-5 h-5 text-primary" />
              <h3 className="font-heading text-xl font-bold">Product Details</h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  Product Name (English) *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-cream-warm bg-cream/30 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted/50"
                  placeholder="e.g., Whole Wheat Flour"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  Product Name (Hindi)
                </label>
                <input
                  type="text"
                  name="nameHindi"
                  value={formData.nameHindi}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-cream-warm bg-cream/30 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted/50"
                  placeholder="e.g., गेहूं का आटा"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Category *</span>
                </label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-cream-warm bg-cream/30 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer appearance-none"
                >
                  {Object.entries(CATEGORIES).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.en} / {value.hi}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  <span className="flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5" /> Price *</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm">&#x20B9;</span>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-cream-warm bg-cream/30 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  <span className="flex items-center gap-1"><Weight className="w-3.5 h-3.5" /> Unit *</span>
                </label>
                <select
                  name="unit"
                  required
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-cream-warm bg-cream/30 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer appearance-none"
                >
                  {UNITS.map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-white rounded-2xl border border-cream-warm p-6 space-y-5">
            <div className="flex items-center gap-2 text-charcoal mb-1">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="font-heading text-xl font-bold">Description</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                English *
              </label>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-cream-warm bg-cream/30 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-y placeholder:text-muted/50"
                placeholder="Describe the product in a few sentences..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                Hindi (Optional)
              </label>
              <textarea
                name="descriptionHindi"
                value={formData.descriptionHindi}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-cream-warm bg-cream/30 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-y placeholder:text-muted/50"
                placeholder="उत्पाद का विवरण..."
              />
            </div>
          </div>
        </div>

        {/* Right Column — Image + Toggles */}
        <div className="space-y-6">
          {/* Image Upload Card */}
          <div className="bg-white rounded-2xl border border-cream-warm p-6 space-y-4">
            <div className="flex items-center gap-2 text-charcoal mb-1">
              <ImageIcon className="w-5 h-5 text-primary" />
              <h3 className="font-heading text-xl font-bold">Product Image</h3>
            </div>

            {formData.imageUrl ? (
              <div className="relative aspect-square rounded-xl overflow-hidden border border-cream-warm">
                <Image
                  src={formData.imageUrl}
                  alt="Product preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                  className="absolute top-3 right-3 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onSuccess={handleImageUpload}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => { handleWidgetOpen(); open(); }}
                    className="w-full aspect-square border-2 border-dashed border-cream-warm rounded-xl flex flex-col items-center justify-center hover:border-primary hover:bg-cream/50 transition-all group cursor-pointer"
                  >
                    <Upload className="w-10 h-10 text-muted group-hover:text-primary mb-3 transition-colors" />
                    <span className="text-sm font-medium text-muted group-hover:text-charcoal transition-colors">
                      Click to upload
                    </span>
                    <span className="text-xs text-muted/60 mt-1">PNG, JPG up to 5MB</span>
                  </button>
                )}
              </CldUploadWidget>
            )}
          </div>

          {/* Status Toggles Card */}
          <div className="bg-white rounded-2xl border border-cream-warm p-6 space-y-4">
            <h3 className="font-heading text-xl font-bold text-charcoal">Status</h3>

            {/* In Stock Toggle */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-cream/50 cursor-pointer group hover:bg-cream transition-colors">
              <div className="flex items-center gap-3">
                <CheckCircle2 className={`w-5 h-5 ${formData.inStock ? 'text-green-500' : 'text-muted/40'}`} />
                <div>
                  <p className="text-sm font-medium text-charcoal">In Stock</p>
                  <p className="text-xs text-muted">Product is available for purchase</p>
                </div>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-checked:bg-green-500 rounded-full transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm peer-checked:translate-x-5 transition-transform" />
              </div>
            </label>

            {/* Featured Toggle */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-cream/50 cursor-pointer group hover:bg-cream transition-colors">
              <div className="flex items-center gap-3">
                <Star className={`w-5 h-5 ${formData.featured ? 'text-yellow-500 fill-yellow-500' : 'text-muted/40'}`} />
                <div>
                  <p className="text-sm font-medium text-charcoal">Featured</p>
                  <p className="text-xs text-muted">Show on homepage Best Sellers</p>
                </div>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-checked:bg-yellow-500 rounded-full transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm peer-checked:translate-x-5 transition-transform" />
              </div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3.5 px-6 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {product ? 'Update Product' : 'Create Product'}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="w-full py-3.5 px-6 rounded-xl border border-cream-warm text-muted font-medium hover:bg-cream hover:text-charcoal transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
