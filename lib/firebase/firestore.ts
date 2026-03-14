import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Product } from '@/types';

const productsCollection = collection(db, 'products');

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(
      query(productsCollection, orderBy('createdAt', 'desc'))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Get featured products
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(
      query(productsCollection, where('featured', '==', true))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Product[];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(
      query(productsCollection, where('category', '==', category))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Product[];
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
};

// Get single product
export const getProduct = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
      } as Product;
    }
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

// Create product
export const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(productsCollection, {
      ...productData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return { id: docRef.id, error: null };
  } catch (error: any) {
    console.error('Error creating product:', error);
    return { id: null, error: error.message };
  }
};

// Update product
export const updateProduct = async (id: string, productData: Partial<Product>) => {
  try {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, {
      ...productData,
      updatedAt: Timestamp.now(),
    });
    return { error: null };
  } catch (error: any) {
    console.error('Error updating product:', error);
    return { error: error.message };
  }
};

// Delete product
export const deleteProduct = async (id: string) => {
  try {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
    return { error: null };
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return { error: error.message };
  }
};
