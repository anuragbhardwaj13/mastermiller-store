export interface ProductVariant {
  unit: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  nameHindi?: string;
  category: 'flour' | 'spices' | 'oils' | 'pulses' | 'grains' | 'ghee' | 'honey' | 'dry-fruits' | 'others';
  description: string;
  descriptionHindi?: string;
  price: number;
  unit: string;
  variants?: ProductVariant[];
  imageUrl: string;
  inStock: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  uid: string;
  email: string;
}

export const CATEGORIES = {
  flour: { en: 'Flour', hi: 'आटा' },
  spices: { en: 'Spices', hi: 'मसाले' },
  oils: { en: 'Oils', hi: 'तेल' },
  pulses: { en: 'Pulses', hi: 'दाल' },
  grains: { en: 'Grains', hi: 'अनाज' },
  ghee: { en: 'Ghee', hi: 'घी' },
  honey: { en: 'Honey', hi: 'शहद' },
  'dry-fruits': { en: 'Dry Fruits', hi: 'मेवे' },
  others: { en: 'Others', hi: 'अन्य' },
} as const;

export const UNITS = ['kg', 'g', 'L', 'ml', 'piece'] as const;
