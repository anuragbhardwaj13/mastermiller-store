/**
 * Master Miller — Seed Spices & Pulses ONLY
 *
 * Uploads images from /prices/Spices/ and /prices/Pulses/ to Cloudinary,
 * then adds products to Firestore WITHOUT deleting existing products.
 *
 * Run: node scripts/seed-spices-pulses.mjs
 */

import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const IMAGES_BASE = '/Users/anuragbhardwaj/Developer/frontend/prices';

dotenv.config({ path: join(ROOT, '.env.local') });

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY    = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.error('Missing Cloudinary credentials in .env.local');
  process.exit(1);
}

cloudinary.config({ cloud_name: CLOUD_NAME, api_key: API_KEY, api_secret: API_SECRET });

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

// ─── SPICES ──────────────────────────────────────────────────────────────────
const SPICES = [
  { name: 'Red Chilli (Kashmiri) Whole', nameHindi: 'कश्मीरी लाल मिर्च साबुत', price: 85, unit: '100g', imageFile: 'Spices/red chilli whole.png', publicId: 'master-miller/spices/red-chilli-kashmiri-whole', description: 'Bright red Kashmiri chillies — mild heat with deep colour. Perfect for gravies, tandoori marinades, and rich curries.', featured: true },
  { name: 'Red Chilli (Tikhi) Whole', nameHindi: 'तीखी लाल मिर्च साबुत', price: 65, unit: '100g', imageFile: 'Spices/red chilli whole.png', publicId: 'master-miller/spices/red-chilli-tikhi-whole', description: 'Fiery hot red chillies for those who love intense heat. Essential for pickles, chutneys, and spicy tadkas.' },
  { name: 'Dhaniya Sabut (Coriander Seeds)', nameHindi: 'धनिया साबुत', price: 34, unit: '100g', imageFile: 'Spices/dhaniya.png', publicId: 'master-miller/spices/dhaniya-sabut', description: 'Aromatic whole coriander seeds with a warm citrusy flavour. Freshly sourced and essential for every Indian kitchen.' },
  { name: 'Jeera Sabut (Cumin Seeds)', nameHindi: 'जीरा साबुत', price: 80, unit: '100g', imageFile: 'Spices/jeera.png', publicId: 'master-miller/spices/jeera-sabut', description: 'Bold and earthy whole cumin seeds. A foundational spice for tadka, rice dishes, and masala blends.', featured: true },
  { name: 'Shahi Jeera Sabut', nameHindi: 'शाही जीरा साबुत', price: 105, unit: '50g', imageFile: 'Spices/jeera.png', publicId: 'master-miller/spices/shahi-jeera-sabut', description: 'Royal cumin (caraway) with a delicate, slightly sweet aroma. Used in biryanis, pulaos, and Mughlai dishes.' },
  { name: 'Ajwain Sabut (Carom Seeds)', nameHindi: 'अजवाइन साबुत', price: 90, unit: '100g', imageFile: 'Spices/ajwain.png', publicId: 'master-miller/spices/ajwain-sabut', description: 'Pungent carom seeds with strong thymol aroma. Excellent digestive aid and essential in parathas and pakoras.' },
  { name: 'Black Pepper Whole', nameHindi: 'काली मिर्च साबुत', price: 78, unit: '50g', imageFile: 'Spices/black pepper.png', publicId: 'master-miller/spices/black-pepper-whole', description: 'Premium whole black peppercorns — bold, sharp, and aromatic. The king of spices for seasoning and marinades.', featured: true },
  { name: 'White Pepper Whole', nameHindi: 'सफेद मिर्च साबुत', price: 130, unit: '100g', imageFile: 'Spices/black pepper.png', publicId: 'master-miller/spices/white-pepper-whole', description: 'Milder than black pepper with a clean, earthy heat. Preferred for white sauces, soups, and light-coloured dishes.' },
  { name: 'Methi Dana (Fenugreek Seeds)', nameHindi: 'मेथी दाना', price: 55, unit: '200g', imageFile: 'Spices/methi.png', publicId: 'master-miller/spices/methi-dana', description: 'Bitter-sweet fenugreek seeds rich in fibre and iron. Used in pickles, spice blends, and for blood sugar management.' },
  { name: 'Dalchini (Indian Cinnamon)', nameHindi: 'दालचीनी (भारतीय)', price: 75, unit: '100g', imageFile: 'Spices/dalchini.png', publicId: 'master-miller/spices/dalchini-indian', description: 'Thick-bark Indian cinnamon (cassia) with a warm, bold flavour. Essential for garam masala, biryanis, and chai.' },
  { name: 'Dalchini (Sri Lanka Cinnamon)', nameHindi: 'दालचीनी (श्रीलंका)', price: 235, unit: '100g', imageFile: 'Spices/dalchini.png', publicId: 'master-miller/spices/dalchini-srilanka', description: 'True Ceylon cinnamon — delicate, sweet, and thin-barked. Superior aroma, lower coumarin content. Premium quality.' },
  { name: 'Saunf Whole (Fennel Seeds)', nameHindi: 'सौंफ साबुत', price: 100, unit: '100g', imageFile: 'Spices/saunf.png', publicId: 'master-miller/spices/saunf-whole', description: 'Sweet and aromatic fennel seeds. A natural mouth freshener and digestive aid. Used in panch phoron and desserts.' },
  { name: 'Sonth (Dry Ginger)', nameHindi: 'सोंठ', price: 140, unit: '100g', imageFile: 'Spices/sonth (dry ginger).png', publicId: 'master-miller/spices/sonth', description: 'Dried ginger root with concentrated warmth and spice. Used in chai masala, winter remedies, and baking.' },
  { name: 'Kala Til (Black Sesame)', nameHindi: 'काला तिल', price: 70, unit: '100g', imageFile: 'Spices/saunf.png', publicId: 'master-miller/spices/kala-til', description: 'Nutrient-dense black sesame seeds rich in calcium and iron. Popular in til laddoo, chutney, and winter snacks.' },
  { name: 'White Til (Desi Rajasthan)', nameHindi: 'सफेद तिल (देसी राजस्थान)', price: 75, unit: '100g', imageFile: 'Spices/saunf.png', publicId: 'master-miller/spices/white-til', description: 'Authentic Rajasthani white sesame seeds. Nutty flavour, excellent for tahini, laddu, and oil extraction.' },
  { name: 'Badi Elaichi (Black Cardamom)', nameHindi: 'बड़ी इलायची', price: 350, unit: '100g', imageFile: 'Spices/badi elaichi.png', publicId: 'master-miller/spices/badi-elaichi', description: 'Smoky, camphor-like black cardamom pods. Adds depth to biryanis, kormas, and slow-cooked meat dishes.' },
  { name: 'Green Elaichi (Green Cardamom)', nameHindi: 'छोटी इलायची', price: 700, unit: '100g', imageFile: 'Spices/choti elaichi.png', publicId: 'master-miller/spices/green-elaichi', description: 'Intensely fragrant green cardamom — the queen of spices. Essential for chai, kheer, and festive sweets.', featured: true },
  { name: 'Laung (Cloves)', nameHindi: 'लौंग', price: 200, unit: '100g', imageFile: 'Spices/laung.png', publicId: 'master-miller/spices/laung', description: 'Potent whole cloves with antiseptic and warming properties. Key in garam masala, chai, and dental remedies.' },
  { name: 'Rai (Mustard Seeds)', nameHindi: 'राई', price: 20, unit: '100g', imageFile: 'Spices/dhaniya.png', publicId: 'master-miller/spices/rai', description: 'Tiny black mustard seeds that pop and sizzle in tadka. Foundation of South Indian and Gujarati tempering.' },
  { name: 'Anardana Churan (Pomegranate Powder)', nameHindi: 'अनारदाना चूर्ण', price: 150, unit: '100g', imageFile: 'Spices/sonth powder.png', publicId: 'master-miller/spices/anardana-churan', description: 'Tangy dried pomegranate seed powder. Adds a fruity sourness to chaats, chutneys, and stuffed parathas.' },
  { name: 'Kasuri Methi (Dried Fenugreek Leaves)', nameHindi: 'कसूरी मेथी', price: 120, unit: '100g', imageFile: 'Spices/methi.png', publicId: 'master-miller/spices/kasuri-methi', description: 'Sun-dried fenugreek leaves with a rich, bitter-sweet aroma. Crushes beautifully into butter chicken, dal, and naan.' },
  { name: 'Tej Patta (Bay Leaves)', nameHindi: 'तेज पत्ता', price: 100, unit: '100g', imageFile: 'Spices/tej patta.png', publicId: 'master-miller/spices/tej-patta', description: 'Aromatic Indian bay leaves for tempering. Adds a warm, herbal background note to curries, rice, and dal.' },
  { name: 'Khas Khas (Poppy Seeds)', nameHindi: 'खसखस', price: 300, unit: '100g', imageFile: 'Spices/saunf.png', publicId: 'master-miller/spices/khas-khas', description: 'Tiny white poppy seeds used as a thickener in Mughlai gravies. Adds a nutty richness to kormas and halwa.' },
  { name: 'Javitri (Mace)', nameHindi: 'जावित्री', price: 230, unit: '50g', imageFile: 'Spices/chakri phool.png', publicId: 'master-miller/spices/javitri', description: 'Lacy, aromatic mace — the outer covering of nutmeg. Adds a warm, delicate flavour to biryanis and Mughlai dishes.' },
  { name: 'Jaiphal (Nutmeg)', nameHindi: 'जायफल', price: 75, unit: '50g', imageFile: 'Spices/chakri phool.png', publicId: 'master-miller/spices/jaiphal', description: 'Whole nutmeg with a warm, slightly sweet, aromatic flavour. Grate fresh into garam masala, desserts, and chai.' },
  { name: 'Star Phool (Star Anise)', nameHindi: 'चक्र फूल', price: 95, unit: '50g', imageFile: 'Spices/chakri phool.png', publicId: 'master-miller/spices/star-phool', description: 'Beautiful star-shaped spice with a sweet liquorice flavour. Used in biryanis, Chinese five-spice, and pho.' },
  { name: 'Kalonji (Nigella Seeds)', nameHindi: 'कलौंजी', price: 75, unit: '100g', imageFile: 'Spices/ajwain.png', publicId: 'master-miller/spices/kalonji', description: 'Peppery black nigella seeds with an onion-like taste. Popular in naan, pickles, and Bengali panch phoron.' },
  { name: 'Hing (Asafoetida)', nameHindi: 'हींग', price: 300, unit: '10g', imageFile: 'Spices/sonth powder.png', publicId: 'master-miller/spices/hing', description: 'Potent asafoetida resin — a tiny pinch transforms dal and sabzi. Powerful digestive aid and umami booster.' },
  { name: 'Imli (Tamarind)', nameHindi: 'इमली', price: 55, unit: '100g', imageFile: 'Spices/sonth (dry ginger).png', publicId: 'master-miller/spices/imli', description: 'Tangy tamarind pulp, essential for sambar, rasam, chutneys, and pani puri. Natural souring agent.' },
  { name: 'Pudina Patta (Dried Mint)', nameHindi: 'पुदीना पत्ता', price: 85, unit: '100g', imageFile: 'Spices/tej patta.png', publicId: 'master-miller/spices/pudina-patta', description: 'Sun-dried mint leaves with a cool, refreshing aroma. Perfect for raita, chutneys, and herbal teas.' },
  // Powder/masala spices
  { name: 'Dhaniya Powder (Coriander)', nameHindi: 'धनिया पाउडर', price: 40, unit: '100g', imageFile: 'Spices/dhaniya powder.png', publicId: 'master-miller/spices/dhaniya-powder', description: 'Freshly ground coriander powder with a citrusy warmth. Foundation spice for every Indian curry and sabzi.' },
  { name: 'Red Chilli Powder', nameHindi: 'लाल मिर्च पाउडर', price: 50, unit: '100g', imageFile: 'Spices/red chilli powder.png', publicId: 'master-miller/spices/red-chilli-powder', description: 'Vibrant red chilli powder blended for balanced heat and colour. Stone-ground to retain essential oils.' },
  { name: 'Jeera Powder (Cumin)', nameHindi: 'जीरा पाउडर', price: 90, unit: '100g', imageFile: 'Spices/jeera powder.png', publicId: 'master-miller/spices/jeera-powder', description: 'Freshly ground cumin powder with a deep, earthy aroma. Enhances chaats, raita, and spice blends.' },
  { name: 'Turmeric Powder (Haldi)', nameHindi: 'हल्दी पाउडर', price: 35, unit: '100g', imageFile: 'Spices/turmeric powder.png', publicId: 'master-miller/spices/turmeric-powder', description: 'Bright yellow turmeric powder rich in curcumin. Anti-inflammatory, antiseptic — the golden spice of India.', featured: true },
  { name: 'Sonth Powder (Dry Ginger)', nameHindi: 'सोंठ पाउडर', price: 150, unit: '100g', imageFile: 'Spices/sonth powder.png', publicId: 'master-miller/spices/sonth-powder', description: 'Finely ground dry ginger powder. Warming and pungent — used in chai masala, laddu, and Ayurvedic remedies.' },
  { name: 'Garam Masala', nameHindi: 'गरम मसाला', price: 60, unit: '100g', imageFile: 'Spices/garam masala.png', publicId: 'master-miller/spices/garam-masala', description: 'Aromatic blend of cinnamon, cardamom, cloves, pepper, and more. The finishing touch for any North Indian dish.', featured: true },
  { name: 'Biryani Masala', nameHindi: 'बिरयानी मसाला', price: 70, unit: '100g', imageFile: 'Spices/biryani masala.png', publicId: 'master-miller/spices/biryani-masala', description: 'Fragrant spice blend crafted for perfect biryani. Star anise, mace, nutmeg, and more — restaurant-quality at home.' },
  { name: 'Kitchen King Masala', nameHindi: 'किचन किंग मसाला', price: 65, unit: '100g', imageFile: 'Spices/kitchen king masala.png', publicId: 'master-miller/spices/kitchen-king-masala', description: 'All-purpose spice mix for quick, flavourful sabzis and gravies. One spoonful transforms any vegetable dish.' },
  { name: 'Chicken Masala', nameHindi: 'चिकन मसाला', price: 70, unit: '100g', imageFile: 'Spices/chicken masala.png', publicId: 'master-miller/spices/chicken-masala', description: 'Bold, robust spice blend designed for chicken curries, tikkas, and kebabs. Deep flavour with balanced heat.' },
  { name: 'Pav Bhaji Masala', nameHindi: 'पाव भाजी मसाला', price: 65, unit: '100g', imageFile: 'Spices/pav bhaji masala.png', publicId: 'master-miller/spices/pav-bhaji-masala', description: 'Tangy, spicy blend for Mumbai-style pav bhaji. Adds authentic street-food flavour to mashed vegetables.' },
  { name: 'Dal Makhni Masala', nameHindi: 'दाल मखनी मसाला', price: 65, unit: '100g', imageFile: 'Spices/dal makhni masala.png', publicId: 'master-miller/spices/dal-makhni-masala', description: 'Creamy, smoky spice blend for restaurant-style dal makhni. Just add butter and slow-cook to perfection.' },
  { name: 'Rajma Masala', nameHindi: 'राजमा मसाला', price: 65, unit: '100g', imageFile: 'Spices/rajma masala.png', publicId: 'master-miller/spices/rajma-masala', description: 'Hearty spice blend for thick, flavourful rajma curry. Tangy, warm, and perfectly balanced for kidney beans.' },
  { name: 'Shahi Paneer Masala', nameHindi: 'शाही पनीर मसाला', price: 70, unit: '100g', imageFile: 'Spices/shahi paneer masala.png', publicId: 'master-miller/spices/shahi-paneer-masala', description: 'Rich, royal spice blend for creamy shahi paneer. Cashew-friendly, fragrant, and subtly sweet.' },
  { name: 'Chilli Flakes', nameHindi: 'चिल्ली फ्लेक्स', price: 55, unit: '100g', imageFile: 'Spices/chilli flakes.png', publicId: 'master-miller/spices/chilli-flakes', description: 'Crushed red chilli flakes for pizza, pasta, and garnishing. Adds a quick burst of heat to any dish.' },
];

// ─── PULSES ──────────────────────────────────────────────────────────────────
const PULSES = [
  { name: 'Chana Dal', nameHindi: 'चना दाल', price: 85, unit: '500g', imageFile: 'Pulses/chana dal.png', publicId: 'master-miller/pulses/chana-dal', description: 'Split Bengal gram with a sweet, nutty flavour. Versatile dal for everyday cooking, snacks, and sweets.', featured: true },
  { name: 'Arhar Dal (Toor)', nameHindi: 'अरहर दाल', price: 98, unit: '500g', imageFile: 'Pulses/toor daal (arhar dal).png', publicId: 'master-miller/pulses/arhar-dal', description: 'Yellow pigeon pea dal — the most popular dal in Indian households. Smooth, comforting, and protein-rich.', featured: true },
  { name: 'Moong Yellow Dal', nameHindi: 'मूंग पीली दाल', price: 88, unit: '500g', imageFile: 'Pulses/yellow moong.png', publicId: 'master-miller/pulses/moong-yellow', description: 'Split yellow moong dal — light, easy to digest, and quick to cook. Perfect for khichdi and dal tadka.' },
  { name: 'Moong Green Whole', nameHindi: 'मूंग हरी साबुत', price: 85, unit: '500g', imageFile: 'Pulses/green moong whole.png', publicId: 'master-miller/pulses/moong-green-whole', description: 'Whole green moong beans — excellent for sprouting, salads, and hearty curries. High in protein and fibre.' },
  { name: 'Moong Green Chilka', nameHindi: 'मूंग हरी छिलका', price: 85, unit: '500g', imageFile: 'Pulses/green moong chilka.png', publicId: 'master-miller/pulses/moong-green-chilka', description: 'Split green moong with skin. Retains more nutrients than skinless variety. Great for dal and soups.' },
  { name: 'Kabuli Chole (Chickpeas)', nameHindi: 'काबुली छोले', price: 88, unit: '500g', imageFile: 'Pulses/kabuli chana.png', publicId: 'master-miller/pulses/kabuli-chole', description: 'Large white chickpeas for chole bhature, hummus, and salads. Creamy texture when cooked. Premium quality.' },
  { name: 'Desi Chana (Black Chickpeas)', nameHindi: 'देसी काला चना', price: 83, unit: '500g', imageFile: 'Pulses/desi kala chana.png', publicId: 'master-miller/pulses/desi-chana', description: 'Small, dark desi chickpeas with firm texture. Rich in protein and fibre. Great for chana masala and sprouts.' },
  { name: 'Masoor Red Dal', nameHindi: 'मसूर लाल दाल', price: 90, unit: '500g', imageFile: 'Pulses/red masoor whole.png', publicId: 'master-miller/pulses/masoor-red', description: 'Quick-cooking red lentils that melt into silky, comforting dal. Staple in every Indian kitchen. High protein.' },
  { name: 'Urad Kali Sabut (Black Gram)', nameHindi: 'उड़द काली साबुत', price: 90, unit: '500g', imageFile: 'Pulses/black urad whole.png', publicId: 'master-miller/pulses/urad-kali-sabut', description: 'Whole black urad — the soul of dal makhni. Rich, creamy, and packed with protein. Slow-cook for best results.' },
  { name: 'Matki Dal (Moth Beans)', nameHindi: 'मटकी दाल', price: 73, unit: '500g', imageFile: 'Pulses/moth beans (matki).png', publicId: 'master-miller/pulses/matki-dal', description: 'Small, brown moth beans perfect for misal pav and sprouted salads. Quick-cooking with a distinctive earthy taste.' },
  { name: 'Lobia (Black-Eyed Peas)', nameHindi: 'लोबिया', price: 120, unit: '500g', imageFile: 'Pulses/white lobia.png', publicId: 'master-miller/pulses/lobia', description: 'Creamy black-eyed peas with the signature dark eye. Popular in curries and salads. Rich in folate and fibre.' },
  { name: 'Soybean', nameHindi: 'सोयाबीन', price: 75, unit: '500g', imageFile: 'Pulses/soy beans.png', publicId: 'master-miller/pulses/soybean', description: 'Protein-rich whole soybeans. Use for soy milk, tofu, sprouts, or curries. Complete plant-based protein source.' },
  { name: 'Rajma Red Small', nameHindi: 'राजमा लाल छोटा', price: 113, unit: '500g', imageFile: 'Pulses/red rajma small.png', publicId: 'master-miller/pulses/rajma-red-small', description: 'Small red kidney beans from the hills — cook faster and absorb spices beautifully. Perfect rajma chawal.' },
  { name: 'Rajma Big', nameHindi: 'राजमा बड़ा', price: 110, unit: '500g', imageFile: 'Pulses/red rajma big.png', publicId: 'master-miller/pulses/rajma-big', description: 'Large red kidney beans with a meaty texture. Classic choice for hearty rajma curry. Rich in protein and iron.' },
  { name: 'Rajma Chitra', nameHindi: 'राजमा चित्रा', price: 110, unit: '500g', imageFile: 'Pulses/chitra rajma.png', publicId: 'master-miller/pulses/rajma-chitra', description: 'Speckled chitra rajma from Himalayan valleys. Unique flavour, creamy texture, and beautiful presentation.' },
  { name: 'White Peas (Safed Matar)', nameHindi: 'सफेद मटर', price: 65, unit: '500g', imageFile: 'Pulses/white peas.png', publicId: 'master-miller/pulses/white-peas', description: 'Dried white peas for ragda, ghugni, and chaat. Hearty and filling with a mild, sweet flavour.' },
  { name: 'Urad Black Chilka', nameHindi: 'उड़द काली छिलका', price: 93, unit: '500g', imageFile: 'Pulses/black urad chilka.png', publicId: 'master-miller/pulses/urad-black-chilka', description: 'Split black urad with skin intact. More fibre than washed variety. Excellent for nutritious everyday dal.' },
  { name: 'Urad White (Dhuli)', nameHindi: 'उड़द सफेद धुली', price: 98, unit: '500g', imageFile: 'Pulses/white urad dal.png', publicId: 'master-miller/pulses/urad-white', description: 'Skinless white urad — essential for idli, dosa batter, and medu vada. Creamy and smooth when soaked.' },
  { name: 'Green Peas (Matar)', nameHindi: 'हरे मटर', price: 63, unit: '500g', imageFile: 'Pulses/white peas.png', publicId: 'master-miller/pulses/green-peas', description: 'Dried green peas — sweet and earthy. Soak and cook for matar paneer, pulao, or comforting winter soup.' },
  { name: 'Mix Dal Sabut', nameHindi: 'मिक्स दाल साबुत', price: 105, unit: '500g', imageFile: 'Pulses/green moong whole.png', publicId: 'master-miller/pulses/mix-dal-sabut', description: 'A balanced mix of whole lentils for a protein-packed, nutritious dal. Multiple textures and flavours in one pot.' },
  { name: 'White Beans', nameHindi: 'सफेद राजमा', price: 75, unit: '500g', imageFile: 'Pulses/white lobia.png', publicId: 'master-miller/pulses/white-beans', description: 'Mild, creamy white beans perfect for soups, stews, and salads. Absorb flavours beautifully when slow-cooked.' },
  { name: 'Masoor Sabut (Whole Brown Lentils)', nameHindi: 'मसूर साबुत', price: 88, unit: '500g', imageFile: 'Pulses/red masoor whole.png', publicId: 'master-miller/pulses/masoor-sabut', description: 'Whole brown lentils with skin — earthy, hearty, and full of fibre. Holds shape when cooked. Rich in iron.' },
  { name: 'Mix Dal Chilka', nameHindi: 'मिक्स दाल छिलका', price: 93, unit: '500g', imageFile: 'Pulses/green moong chilka.png', publicId: 'master-miller/pulses/mix-dal-chilka', description: 'Mixed split lentils with skin for a fibre-rich, colourful dal. Quick to cook with balanced nutrition.' },
  { name: 'Kulthi Dal (Horse Gram)', nameHindi: 'कुल्थी दाल', price: 76, unit: '500g', imageFile: 'Pulses/moth beans (matki).png', publicId: 'master-miller/pulses/kulthi-dal', description: 'Protein-rich horse gram, popular in South Indian cuisine. Known for its medicinal properties and earthy flavour.' },
  { name: 'Masoor Malkha Sabut', nameHindi: 'मसूर मल्का साबुत', price: 73, unit: '500g', imageFile: 'Pulses/red masoor whole.png', publicId: 'master-miller/pulses/masoor-malkha-sabut', description: 'Whole masoor malkha with orange flesh and brown skin. Cooks down to a creamy, comforting dal.' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
async function uploadImage(imageFile, publicId) {
  const fullPath = join(IMAGES_BASE, imageFile);
  if (!existsSync(fullPath)) {
    console.warn(`  !! Image not found: ${fullPath}`);
    return '';
  }
  try {
    const result = await cloudinary.uploader.upload(fullPath, {
      public_id: publicId,
      overwrite: true,
      resource_type: 'image',
      folder: '',
    });
    return result.secure_url;
  } catch (err) {
    console.error(`  !! Upload failed for ${imageFile}: ${err.message}`);
    return '';
  }
}

async function main() {
  const ALL = [
    ...SPICES.map(p => ({ ...p, category: 'spices' })),
    ...PULSES.map(p => ({ ...p, category: 'pulses' })),
  ];

  console.log('\n============================================');
  console.log('  Master Miller — Seed Spices & Pulses');
  console.log(`  ${SPICES.length} spices + ${PULSES.length} pulses = ${ALL.length} products`);
  console.log('============================================\n');

  // Step 1: Upload images
  console.log('Step 1/2 — Uploading images to Cloudinary...\n');
  const imageUrls = {};
  for (const p of ALL) {
    process.stdout.write(`  ${p.name}...`);
    const url = await uploadImage(p.imageFile, p.publicId);
    imageUrls[p.publicId] = url;
    console.log(url ? ' done' : ' skipped');
  }

  // Step 2: Add to Firestore (without deleting existing products)
  console.log('\nStep 2/2 — Adding to Firestore (keeping existing products)...\n');
  const productsCol = collection(db, 'products');
  let added = 0;
  let failed = 0;

  for (const p of ALL) {
    const { imageFile, publicId, ...data } = p;
    try {
      await addDoc(productsCol, {
        ...data,
        inStock: data.inStock ?? true,
        featured: data.featured ?? false,
        imageUrl: imageUrls[publicId] || '',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      console.log(`  + ${p.name}`);
      added++;
    } catch (err) {
      console.error(`  ! ${p.name}: ${err.message}`);
      failed++;
    }
  }

  console.log('\n============================================');
  console.log(`  Done! ${added} added, ${failed} failed.`);
  console.log('============================================\n');
  process.exit(0);
}

main().catch(err => {
  console.error('\nSeed error:', err);
  process.exit(1);
});
