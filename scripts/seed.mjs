/**
 * Master Miller — Full Seed Script
 *
 * 1. Uploads product images from /prices/ to Cloudinary
 * 2. Seeds all products to Firebase Firestore
 *
 * Prerequisites:
 *   npm install cloudinary dotenv
 *
 * Required in .env.local:
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<from cloudinary.com/console>
 *   CLOUDINARY_API_KEY=762851531319664
 *   CLOUDINARY_API_SECRET=vD1uTHWuSimbrTy9xatCPlnuaXA
 *   NEXT_PUBLIC_FIREBASE_API_KEY=...  (already set)
 *
 * Run: npm run seed
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, Timestamp } from 'firebase/firestore';
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const IMAGES_BASE = '/Users/anuragbhardwaj/Developer/frontend/prices';

// ─── Load env ────────────────────────────────────────────────────────────────
dotenv.config({ path: join(ROOT, '.env.local') });

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY    = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUD_NAME || CLOUD_NAME === 'your_cloud_name') {
  console.error('\n❌  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set.');
  console.error('   Open .env.local and set it to your cloud name from cloudinary.com/console\n');
  process.exit(1);
}

cloudinary.config({ cloud_name: CLOUD_NAME, api_key: API_KEY, api_secret: API_SECRET });

// ─── Firebase ─────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db  = getFirestore(app);

// ─── Product definitions ───────────────────────────────────────────────────────
// imageFile paths are relative to IMAGES_BASE
const PRODUCTS = [
  // ─── FLOUR / ATTA ──────────────────────────────────────────────────────────
  {
    name: 'MP Wheat Atta',
    nameHindi: 'एमपी गेहूं आटा',
    category: 'flour',
    description: 'Premium Madhya Pradesh wheat, stone-ground to retain natural bran. Makes soft, fluffy rotis with a rich wheat flavour.',
    price: 55,
    unit: 'kg',
    imageFile: 'atta/mp atta.png',
    publicId: 'master-miller/atta/mp-wheat-atta',
    inStock: true,
    featured: true,
  },
  {
    name: 'Khapli Wheat Atta',
    nameHindi: 'खापली गेहूं आटा',
    category: 'flour',
    description: 'Ancient emmer wheat (khapli) with a lower gluten index — ideal for diabetics. Stone-milled to preserve nutrients.',
    price: 85,
    unit: 'kg',
    imageFile: 'atta/khapli atta.png',
    publicId: 'master-miller/atta/khapli-wheat-atta',
    inStock: true,
    featured: true,
  },
  {
    name: 'Khapli Multigrain Atta',
    nameHindi: 'खापली मल्टीग्रेन आटा',
    category: 'flour',
    description: 'A wholesome blend of khapli wheat, ragi, jowar, bajra, and oats. High-fibre, high-protein alternative to plain atta.',
    price: 95,
    unit: 'kg',
    imageFile: 'atta/khapli multigrain atta.png',
    publicId: 'master-miller/atta/khapli-multigrain-atta',
    inStock: true,
    featured: false,
  },
  {
    name: 'Sharbati Multigrain Atta',
    nameHindi: 'शरबती मल्टीग्रेन आटा',
    category: 'flour',
    description: 'Silky sharbati wheat blended with six nutritious grains. Light, digestible, and perfect for everyday rotis.',
    price: 90,
    unit: 'kg',
    imageFile: 'atta/sharbati multigrain atta.png',
    publicId: 'master-miller/atta/sharbati-multigrain-atta',
    inStock: true,
    featured: true,
  },
  {
    name: 'Bajra Atta',
    nameHindi: 'बाजरा आटा',
    category: 'flour',
    description: 'Pearl millet flour rich in iron, calcium, and fibre. Traditional winter staple for warm, hearty rotis.',
    price: 50,
    unit: 'kg',
    imageFile: 'atta/bajra atta.png',
    publicId: 'master-miller/atta/bajra-atta',
    inStock: true,
    featured: false,
  },
  {
    name: 'Besan (Gram Flour)',
    nameHindi: 'बेसन',
    category: 'flour',
    description: 'Freshly ground chickpea flour with a rich nutty aroma. Essential for pakoras, cheela, kadhi, and festive sweets.',
    price: 85,
    unit: 'kg',
    imageFile: 'atta/besan.png',
    publicId: 'master-miller/atta/besan',
    inStock: true,
    featured: false,
  },
  {
    name: 'Jau Atta (Barley Flour)',
    nameHindi: 'जौ आटा',
    category: 'flour',
    description: 'Stone-milled barley flour high in beta-glucan fibre. Supports heart health and blood sugar management.',
    price: 60,
    unit: 'kg',
    imageFile: 'atta/jau atta.png',
    publicId: 'master-miller/atta/jau-atta',
    inStock: true,
    featured: false,
  },
  {
    name: 'Jowar Atta (Sorghum Flour)',
    nameHindi: 'ज्वार आटा',
    category: 'flour',
    description: 'Gluten-free sorghum flour, stone-milled for maximum nutrition. Great for diabetics and health-conscious eaters.',
    price: 65,
    unit: 'kg',
    imageFile: 'atta/jawar atta.png',
    publicId: 'master-miller/atta/jowar-atta',
    inStock: true,
    featured: false,
  },
  {
    name: 'Kala Chana Atta',
    nameHindi: 'काला चना आटा',
    category: 'flour',
    description: 'Flour ground from desi black chickpeas — protein-rich, high in fibre, and full of earthy flavour.',
    price: 80,
    unit: 'kg',
    imageFile: 'atta/kala chana atta.png',
    publicId: 'master-miller/atta/kala-chana-atta',
    inStock: true,
    featured: false,
  },
  {
    name: 'Makki Atta (Corn Flour)',
    nameHindi: 'मक्की आटा',
    category: 'flour',
    description: 'Coarsely ground maize flour for authentic Makki di Roti. Naturally gluten-free and full of antioxidants.',
    price: 55,
    unit: 'kg',
    imageFile: 'atta/makki atta.png',
    publicId: 'master-miller/atta/makki-atta',
    inStock: true,
    featured: false,
  },
  {
    name: 'Oats Atta',
    nameHindi: 'ओट्स आटा',
    category: 'flour',
    description: 'Rolled oats ground into fine flour — rich in soluble fibre. Blends well with wheat flour for nutritious rotis.',
    price: 110,
    unit: 'kg',
    imageFile: 'atta/ots atta.png',
    publicId: 'master-miller/atta/oats-atta',
    inStock: true,
    featured: false,
  },
  {
    name: 'Ragi Atta (Finger Millet)',
    nameHindi: 'रागी आटा',
    category: 'flour',
    description: 'Finger millet flour, a superfood packed with calcium and amino acids. Excellent for weight management and bone health.',
    price: 75,
    unit: 'kg',
    imageFile: 'atta/ragi atta.png',
    publicId: 'master-miller/atta/ragi-atta',
    inStock: true,
    featured: false,
  },
  {
    name: 'Rajgira Atta (Amaranth)',
    nameHindi: 'राजगिरा आटा',
    category: 'flour',
    description: 'Gluten-free amaranth flour, popular during fasting (vrat). High in protein, calcium, and iron.',
    price: 150,
    unit: 'kg',
    imageFile: 'atta/rajgira atta.png',
    publicId: 'master-miller/atta/rajgira-atta',
    inStock: true,
    featured: false,
  },
  {
    name: 'Rice Flour',
    nameHindi: 'चावल का आटा',
    category: 'flour',
    description: 'Finely milled rice flour, gluten-free and light. Perfect for idiyappam, appam, murukku, and crispy coatings.',
    price: 60,
    unit: 'kg',
    imageFile: 'atta/rice flour.png',
    publicId: 'master-miller/atta/rice-flour',
    inStock: true,
    featured: false,
  },

  // ─── OILS ──────────────────────────────────────────────────────────────────
  {
    name: 'Black Mustard Oil (500ml)',
    nameHindi: 'काली सरसों तेल (500ml)',
    category: 'oils',
    description: 'Cold-pressed (kachi ghani) black mustard oil with a bold, pungent aroma. Rich in omega-3 and natural antioxidants. No heat treatment — full nutrition preserved.',
    price: 120,
    unit: '500ml',
    imageFile: 'more products/black mustard oil 500ml.png',
    publicId: 'master-miller/oils/black-mustard-oil-500ml',
    inStock: true,
    featured: false,
  },
  {
    name: 'Black Mustard Oil (1L)',
    nameHindi: 'काली सरसों तेल (1L)',
    category: 'oils',
    description: 'Cold-pressed (kachi ghani) black mustard oil with a bold, pungent aroma. Rich in omega-3 and natural antioxidants. No heat treatment — full nutrition preserved.',
    price: 220,
    unit: '1L',
    imageFile: 'more products/black mustard oil 1L.png',
    publicId: 'master-miller/oils/black-mustard-oil-1l',
    inStock: true,
    featured: true,
  },
  {
    name: 'Black Mustard Oil (5L)',
    nameHindi: 'काली सरसों तेल (5L)',
    category: 'oils',
    description: 'Cold-pressed (kachi ghani) black mustard oil — economy pack for the family kitchen. Bold flavour, full nutrition, zero additives.',
    price: 950,
    unit: '5L',
    imageFile: 'more products/black mustard oil 5L.png',
    publicId: 'master-miller/oils/black-mustard-oil-5l',
    inStock: true,
    featured: false,
  },
  {
    name: 'Yellow Mustard Oil (500ml)',
    nameHindi: 'पीली सरसों तेल (500ml)',
    category: 'oils',
    description: 'Cold-pressed yellow mustard oil with a milder flavour than black mustard. Great for marinades, pickles, and light cooking.',
    price: 110,
    unit: '500ml',
    imageFile: 'more products/yellow mustard oil  500ml.png',
    publicId: 'master-miller/oils/yellow-mustard-oil-500ml',
    inStock: true,
    featured: false,
  },
  {
    name: 'Yellow Mustard Oil (1L)',
    nameHindi: 'पीली सरसों तेल (1L)',
    category: 'oils',
    description: 'Cold-pressed yellow mustard oil with a milder flavour than black mustard. Great for marinades, pickles, and light cooking.',
    price: 200,
    unit: '1L',
    imageFile: 'more products/yellow mustard oil 1L.png',
    publicId: 'master-miller/oils/yellow-mustard-oil-1l',
    inStock: true,
    featured: false,
  },
  {
    name: 'Sesame Oil (500ml)',
    nameHindi: 'तिल का तेल (500ml)',
    category: 'oils',
    description: 'Wood-pressed white sesame (til) oil, rich in antioxidants and healthy fats. Nutty flavour, ideal for cooking, drizzling, and skin care.',
    price: 200,
    unit: '500ml',
    imageFile: 'more products/sesame oil 500ml.png',
    publicId: 'master-miller/oils/sesame-oil-500ml',
    inStock: true,
    featured: false,
  },
  {
    name: 'Sesame Oil (1L)',
    nameHindi: 'तिल का तेल (1L)',
    category: 'oils',
    description: 'Wood-pressed white sesame (til) oil, rich in antioxidants and healthy fats. Nutty flavour, ideal for cooking, drizzling, and skin care.',
    price: 380,
    unit: '1L',
    imageFile: 'more products/sesame oil 1L.png',
    publicId: 'master-miller/oils/sesame-oil-1l',
    inStock: true,
    featured: true,
  },
  {
    name: 'Virgin Coconut Oil',
    nameHindi: 'नारियल तेल',
    category: 'oils',
    description: 'Cold-pressed virgin coconut oil — unrefined, chemical-free, and naturally fragrant. Excellent for high-heat cooking, hair, and skin care.',
    price: 480,
    unit: '500ml',
    imageFile: 'more products/coconut oil.png',
    publicId: 'master-miller/oils/coconut-oil',
    inStock: true,
    featured: false,
  },

  // ─── GHEE ──────────────────────────────────────────────────────────────────
  {
    name: 'Cow Ghee',
    nameHindi: 'देसी गाय का घी',
    category: 'ghee',
    description: 'Pure desi cow ghee prepared using the traditional bilona (hand-churned) method. Golden, fragrant, and full of natural goodness.',
    price: 850,
    unit: '500g',
    imageFile: 'more products/cow ghee.png',
    publicId: 'master-miller/ghee/cow-ghee',
    inStock: true,
    featured: true,
  },
  {
    name: 'Buffalo Ghee',
    nameHindi: 'भैंस का घी',
    category: 'ghee',
    description: 'Rich, creamy buffalo ghee with a higher fat content and mild flavour. Ideal for halwas, kheer, and festive cooking.',
    price: 650,
    unit: '500g',
    imageFile: 'more products/buffalo ghee.png',
    publicId: 'master-miller/ghee/buffalo-ghee',
    inStock: true,
    featured: false,
  },

  // ─── HONEY ─────────────────────────────────────────────────────────────────
  {
    name: 'Forest Honey',
    nameHindi: 'जंगली शहद',
    category: 'honey',
    description: 'Raw, unprocessed forest honey collected from wild beehives. Dark, rich, and intensely floral — packed with enzymes and antioxidants.',
    price: 380,
    unit: '500g',
    imageFile: 'more products/forest honey.png',
    publicId: 'master-miller/honey/forest-honey',
    inStock: true,
    featured: true,
  },

  // ─── GRAINS ────────────────────────────────────────────────────────────────
  {
    name: 'Dalia (Broken Wheat)',
    nameHindi: 'दलिया',
    category: 'grains',
    description: 'Coarsely broken whole wheat — a high-fibre, low-GI staple. Great for breakfast porridge, khichdi, or a light wholesome meal.',
    price: 65,
    unit: 'kg',
    imageFile: 'more products/dalia.png',
    publicId: 'master-miller/grains/dalia',
    inStock: true,
    featured: false,
  },
  {
    name: 'Dalia (Jar Pack)',
    nameHindi: 'दलिया (जार)',
    category: 'grains',
    description: 'Coarsely broken whole wheat in a resealable jar. Stays fresh longer — perfect for gifting and daily use.',
    price: 120,
    unit: '500g',
    imageFile: 'more products/dalia jar.png',
    publicId: 'master-miller/grains/dalia-jar',
    inStock: true,
    featured: false,
  },
  {
    name: 'Premium Basmati Rice (Jar)',
    nameHindi: 'बासमती चावल (जार)',
    category: 'grains',
    description: 'Aged long-grain basmati with a delicate floral aroma — presented in a premium resealable jar. Perfect for biryanis and pulaos.',
    price: 220,
    unit: '1kg',
    imageFile: 'more products/rice jar.png',
    publicId: 'master-miller/grains/rice-jar',
    inStock: true,
    featured: true,
  },

  // ─── OTHERS ────────────────────────────────────────────────────────────────
  {
    name: 'Desi Khand (Raw Cane Sugar)',
    nameHindi: 'देसी खांड',
    category: 'others',
    description: 'Traditional unrefined cane sugar with golden colour and subtle caramel notes. A healthier alternative to refined white sugar.',
    price: 120,
    unit: 'kg',
    imageFile: 'more products/desi khand.png',
    publicId: 'master-miller/others/desi-khand',
    inStock: true,
    featured: true,
  },
  {
    name: 'Jaggery (Gur)',
    nameHindi: 'गुड़',
    category: 'others',
    description: 'Natural unrefined jaggery made from fresh sugarcane juice. Rich in iron and minerals — the traditional sweetener of India.',
    price: 85,
    unit: 'kg',
    imageFile: 'more products/jaggery.png',
    publicId: 'master-miller/others/jaggery',
    inStock: true,
    featured: false,
  },

  // ─── DRY FRUITS ────────────────────────────────────────────────────────────
  {
    name: 'Almonds (Badam)',
    nameHindi: 'बादाम',
    category: 'dry-fruits',
    description: 'Premium California almonds — crunchy, nutritious, and rich in Vitamin E, magnesium, and healthy fats. Sourced fresh and packed with care.',
    price: 560,
    unit: '500g',
    imageFile: 'dry fruits/almonds.png',
    publicId: 'master-miller/dry-fruits/almonds',
    inStock: true,
    featured: true,
  },
  {
    name: 'Cashews (Kaju)',
    nameHindi: 'काजू',
    category: 'dry-fruits',
    description: 'Whole premium cashews, creamy and buttery in texture. Rich in zinc and heart-healthy fats. Great for snacking and cooking.',
    price: 640,
    unit: '500g',
    imageFile: 'dry fruits/cashews.png',
    publicId: 'master-miller/dry-fruits/cashews',
    inStock: true,
    featured: false,
  },
  {
    name: 'Pistachios (Pista)',
    nameHindi: 'पिस्ता',
    category: 'dry-fruits',
    description: 'Roasted unsalted pistachios with a naturally sweet, rich flavour. Packed with protein, fibre, and antioxidants.',
    price: 760,
    unit: '500g',
    imageFile: 'dry fruits/pista.png',
    publicId: 'master-miller/dry-fruits/pistachios',
    inStock: true,
    featured: false,
  },
  {
    name: 'Raisins (Kishmish)',
    nameHindi: 'किशमिश',
    category: 'dry-fruits',
    description: 'Plump golden raisins, naturally sweet and chewy. Rich in iron and instant energy. Perfect for snacking, baking, and rice dishes.',
    price: 240,
    unit: '500g',
    imageFile: 'dry fruits/raisins.png',
    publicId: 'master-miller/dry-fruits/raisins',
    inStock: true,
    featured: false,
  },
  {
    name: 'Black Raisins (Kaali Kishmish)',
    nameHindi: 'काली किशमिश',
    category: 'dry-fruits',
    description: 'Seedless black raisins with an intense sweet-tart flavour. Rich in antioxidants and natural iron. Great for chutneys and desserts.',
    price: 260,
    unit: '500g',
    imageFile: 'dry fruits/black raisins (kaali kishmish).png',
    publicId: 'master-miller/dry-fruits/black-raisins',
    inStock: true,
    featured: false,
  },
  {
    name: 'Dried Apricot (Khubani)',
    nameHindi: 'खुबानी',
    category: 'dry-fruits',
    description: 'Soft, naturally dried apricots with a honey-sweet flavour. Rich in beta-carotene, potassium, and dietary fibre.',
    price: 300,
    unit: '500g',
    imageFile: 'dry fruits/apricot.png',
    publicId: 'master-miller/dry-fruits/apricot',
    inStock: true,
    featured: false,
  },
  {
    name: 'Figs (Anjeer)',
    nameHindi: 'अंजीर',
    category: 'dry-fruits',
    description: 'Premium dried figs, naturally sweet and deeply nourishing. High in calcium, iron, and fibre. Soak overnight for best results.',
    price: 400,
    unit: '500g',
    imageFile: 'dry fruits/figs (anjeer).png',
    publicId: 'master-miller/dry-fruits/figs',
    inStock: true,
    featured: false,
  },
];

// ─── Upload image to Cloudinary ───────────────────────────────────────────────
async function uploadImage(imageFile, publicId) {
  const fullPath = join(IMAGES_BASE, imageFile);

  if (!existsSync(fullPath)) {
    console.warn(`  ⚠  Image not found: ${fullPath} — skipping upload, imageUrl will be empty`);
    return '';
  }

  try {
    const result = await cloudinary.uploader.upload(fullPath, {
      public_id: publicId,
      overwrite: true,
      resource_type: 'image',
      folder: '', // public_id already includes folder path
    });
    return result.secure_url;
  } catch (err) {
    console.error(`  ✗  Cloudinary upload failed for ${imageFile}:`, err.message);
    return '';
  }
}

// ─── Seed Firestore ───────────────────────────────────────────────────────────
async function clearExistingProducts() {
  const snap = await getDocs(collection(db, 'products'));
  if (snap.empty) return;
  console.log(`  Clearing ${snap.size} existing products...`);
  await Promise.all(snap.docs.map(doc => deleteDoc(doc.ref)));
}

async function main() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Master Miller — Image Upload + Firestore Seed');
  console.log(`  Cloudinary cloud: ${CLOUD_NAME}`);
  console.log(`  Products to seed: ${PRODUCTS.length}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Step 1: Upload all images
  console.log('Step 1/2 — Uploading images to Cloudinary...\n');
  const imageUrls = {};
  for (const product of PRODUCTS) {
    process.stdout.write(`  Uploading: ${product.name}...`);
    const url = await uploadImage(product.imageFile, product.publicId);
    imageUrls[product.publicId] = url;
    console.log(url ? ` ✓` : ` skipped`);
  }

  // Step 2: Seed Firestore
  console.log('\nStep 2/2 — Seeding Firestore...\n');
  await clearExistingProducts();

  const productsCol = collection(db, 'products');
  let added = 0;
  let failed = 0;

  for (const product of PRODUCTS) {
    const { imageFile, publicId, ...data } = product;
    try {
      await addDoc(productsCol, {
        ...data,
        imageUrl: imageUrls[publicId] || '',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      console.log(`  ✓  ${product.name}`);
      added++;
    } catch (err) {
      console.error(`  ✗  ${product.name}: ${err.message}`);
      failed++;
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  Done!  ${added} products seeded, ${failed} failed.`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  process.exit(0);
}

main().catch(err => {
  console.error('\n❌  Seed script error:', err);
  process.exit(1);
});
