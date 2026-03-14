/**
 * Seed Script for Master Miller Products
 *
 * This script pre-populates Firestore with sample products.
 * To run: node -r esbuild-register scripts/seedProducts.ts
 * Or add to package.json and run: npm run seed
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

// Firebase config - replace with your actual config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleProducts = [
  {
    name: 'Whole Wheat Atta',
    nameHindi: 'गेहूं का आटा',
    category: 'flour',
    description: 'Freshly ground whole wheat flour, rich in fiber and nutrients. Perfect for chapatis and parathas.',
    descriptionHindi: 'ताज़ा पिसा हुआ गेहूं का आटा, फाइबर और पोषक तत्वों से भरपूर। रोटी और पराठे के लिए एकदम सही।',
    price: 50,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500',
    inStock: true,
    featured: true,
  },
  {
    name: 'Desi Khand',
    nameHindi: 'देसी खांड',
    category: 'others',
    description: 'Traditional unrefined cane sugar, naturally sweet with a golden color and caramel notes.',
    descriptionHindi: 'पारंपरिक अपरिष्कृत गन्ने की चीनी, प्राकृतिक रूप से मीठी, सुनहरे रंग और कारमेल के स्वाद के साथ।',
    price: 120,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500',
    inStock: true,
    featured: true,
  },
  {
    name: 'Basmati Rice',
    nameHindi: 'बासमती चावल',
    category: 'grains',
    description: 'Premium aged basmati rice with long grains and aromatic fragrance.',
    descriptionHindi: 'प्रीमियम वृद्ध बासमती चावल, लंबे दाने और सुगंधित खुशबू के साथ।',
    price: 180,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500',
    inStock: true,
    featured: true,
  },
  {
    name: 'Desi Chana',
    nameHindi: 'देसी चना',
    category: 'pulses',
    description: 'High-quality desi chickpeas, protein-rich and perfect for curries and snacks.',
    descriptionHindi: 'उच्च गुणवत्ता वाला देसी चना, प्रोटीन से भरपूर और करी और स्नैक्स के लिए बिल्कुल सही।',
    price: 90,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1576181708455-7dad8c76a109?w=500',
    inStock: true,
    featured: false,
  },
  {
    name: 'Urad Dal',
    nameHindi: 'उड़द दाल',
    category: 'pulses',
    description: 'Premium quality split black gram, essential for south Indian dishes.',
    descriptionHindi: 'प्रीमियम गुणवत्ता विभाजित काली दाल, दक्षिण भारतीय व्यंजनों के लिए आवश्यक।',
    price: 140,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=500',
    inStock: true,
    featured: false,
  },
  {
    name: 'Laung (Clove)',
    nameHindi: 'लौंग',
    category: 'spices',
    description: 'Premium quality whole cloves, aromatic and perfect for spice blends.',
    descriptionHindi: 'प्रीमियम गुणवत्ता वाली साबुत लौंग, सुगंधित और मसाला मिश्रण के लिए एकदम सही।',
    price: 800,
    unit: '100g',
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a0b61b0c8b6f?w=500',
    inStock: true,
    featured: true,
  },
  {
    name: 'Cold-Pressed Mustard Oil',
    nameHindi: 'कोल्ड-प्रेस्ड सरसों का तेल',
    category: 'oils',
    description: 'Pure cold-pressed mustard oil, rich in omega-3 and antioxidants.',
    descriptionHindi: 'शुद्ध कोल्ड-प्रेस्ड सरसों का तेल, ओमेगा-3 और एंटीऑक्सीडेंट से भरपूर।',
    price: 250,
    unit: 'L',
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500',
    inStock: true,
    featured: true,
  },
  {
    name: 'Gagger Flour',
    nameHindi: 'गग्गर का आटा',
    category: 'flour',
    description: 'Traditional gagger flour, nutritious and perfect for healthy rotis.',
    descriptionHindi: 'पारंपरिक गग्गर का आटा, पौष्टिक और स्वस्थ रोटी के लिए एकदम सही।',
    price: 60,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500',
    inStock: true,
    featured: false,
  },
  {
    name: 'Soybean',
    nameHindi: 'सोयाबीन',
    category: 'grains',
    description: 'High-protein soybeans, excellent source of plant-based nutrition.',
    descriptionHindi: 'उच्च प्रोटीन सोयाबीन, पौधे आधारित पोषण का उत्कृष्ट स्रोत।',
    price: 70,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1565071559227-20ab25b7685e?w=500',
    inStock: true,
    featured: false,
  },
  {
    name: 'Dried Apricot',
    nameHindi: 'खुबानी',
    category: 'others',
    description: 'Premium quality dried apricots, naturally sweet and nutritious.',
    descriptionHindi: 'प्रीमियम गुणवत्ता वाली सूखी खुबानी, प्राकृतिक रूप से मीठी और पौष्टिक।',
    price: 600,
    unit: '250g',
    imageUrl: 'https://images.unsplash.com/photo-1600958998331-ad48b0cef831?w=500',
    inStock: true,
    featured: false,
  },
  {
    name: 'Dalchini (Cinnamon)',
    nameHindi: 'दालचीनी',
    category: 'spices',
    description: 'Premium Ceylon cinnamon sticks, aromatic and flavorful.',
    descriptionHindi: 'प्रीमियम सीलोन दालचीनी की छड़ें, सुगंधित और स्वादिष्ट।',
    price: 400,
    unit: '100g',
    imageUrl: 'https://images.unsplash.com/photo-1606425271394-c3ca9aa1a2e3?w=500',
    inStock: true,
    featured: false,
  },
  {
    name: 'Moong Dal',
    nameHindi: 'मूंग दाल',
    category: 'pulses',
    description: 'Split green gram dal, easy to digest and highly nutritious.',
    descriptionHindi: 'विभाजित हरी मूंग दाल, पचाने में आसान और अत्यधिक पौष्टिक।',
    price: 130,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1599909533661-3d655666e1d7?w=500',
    inStock: true,
    featured: false,
  },
  {
    name: 'Besan (Gram Flour)',
    nameHindi: 'बेसन',
    category: 'flour',
    description: 'Freshly ground chickpea flour, perfect for pakoras and sweets.',
    descriptionHindi: 'ताज़ा पिसा हुआ चने का आटा, पकौड़े और मिठाई के लिए एकदम सही।',
    price: 80,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1606312619070-d48b4caa9cdb?w=500',
    inStock: true,
    featured: false,
  },
  {
    name: 'Red Chilli Powder',
    nameHindi: 'लाल मिर्च पाउडर',
    category: 'spices',
    description: 'Pure red chilli powder, adds perfect heat and color to your dishes.',
    descriptionHindi: 'शुद्ध लाल मिर्च पाउडर, आपके व्यंजनों में सही गर्मी और रंग जोड़ता है।',
    price: 200,
    unit: '250g',
    imageUrl: 'https://images.unsplash.com/photo-1583297293892-0b9e08f39a03?w=500',
    inStock: true,
    featured: true,
  },
  {
    name: 'Cold-Pressed Coconut Oil',
    nameHindi: 'कोल्ड-प्रेस्ड नारियल तेल',
    category: 'oils',
    description: 'Virgin coconut oil, perfect for cooking and hair care.',
    descriptionHindi: 'शुद्ध नारियल तेल, खाना पकाने और बालों की देखभाल के लिए एकदम सही।',
    price: 300,
    unit: 'L',
    imageUrl: 'https://images.unsplash.com/photo-1582440383362-d6d464f42709?w=500',
    inStock: true,
    featured: false,
  },
];

async function seedProducts() {
  console.log('Starting to seed products...');

  const productsCollection = collection(db, 'products');

  for (const product of sampleProducts) {
    try {
      const docRef = await addDoc(productsCollection, {
        ...product,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      console.log(`✓ Added: ${product.name} (ID: ${docRef.id})`);
    } catch (error) {
      console.error(`✗ Failed to add ${product.name}:`, error);
    }
  }

  console.log('\nSeeding complete!');
  console.log(`Total products added: ${sampleProducts.length}`);
}

// Run the seed function
seedProducts().catch(console.error);
