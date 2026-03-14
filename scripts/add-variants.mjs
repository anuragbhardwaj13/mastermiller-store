/**
 * Master Miller — Add Variants + Fix Wrong Prices
 *
 * Adds `variants` array to each product in Firestore so the
 * dropdown shows all available sizes with prices.
 * Also fixes 2 wrongly priced items.
 *
 * Run: node scripts/add-variants.mjs
 */

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// ─── Variants map ─────────────────────────────────────────────────────────────
// Each entry: { match, variants: [{unit, price}], fix?: {price, unit} }
// fix = optional override to correct the base price/unit if wrong
const VARIANT_MAP = [
  // ─── ATTA (multi-size: 1kg/5kg/10kg) ─────────────────────────────────
  { match: name => /mp\s*(sharbati|wheat)\s*(chak|atta)/i.test(name) && !/multigrain/i.test(name),
    variants: [{ unit: '1 kg', price: 90 }, { unit: '5 kg', price: 440 }, { unit: '10 kg', price: 880 }] },
  { match: name => /sharbati\s*multigrain/i.test(name),
    variants: [{ unit: '1 kg', price: 120 }, { unit: '5 kg', price: 590 }, { unit: '10 kg', price: 1180 }] },
  { match: name => /khapli.*atta/i.test(name) && !/multigrain/i.test(name),
    variants: [{ unit: '1 kg', price: 213 }, { unit: '5 kg', price: 1055 }, { unit: '10 kg', price: 2110 }] },
  { match: name => /khapli.*multigrain/i.test(name),
    variants: [{ unit: '1 kg', price: 200 }, { unit: '5 kg', price: 990 }, { unit: '10 kg', price: 1980 }] },
  { match: name => /whole\s*wheat\s*chakki/i.test(name),
    variants: [{ unit: '1 kg', price: 90 }, { unit: '5 kg', price: 440 }, { unit: '10 kg', price: 880 }] },
  { match: name => /^multigrain\s*atta$/i.test(name),
    variants: [{ unit: '1 kg', price: 120 }, { unit: '5 kg', price: 590 }, { unit: '10 kg', price: 1180 }] },

  // Single-size atta
  { match: name => /(besan|gram\s*flour)/i.test(name), variants: [{ unit: '1 kg', price: 160 }] },
  { match: name => /makki|maize|corn\s*flour/i.test(name), variants: [{ unit: '1 kg', price: 82 }] },
  { match: name => /bajra/i.test(name) && /atta|flour/i.test(name), variants: [{ unit: '1 kg', price: 80 }] },
  { match: name => /kala\s*chana\s*atta/i.test(name), variants: [{ unit: '1 kg', price: 135 }] },
  { match: name => /ragi/i.test(name), variants: [{ unit: '1 kg', price: 130 }] },
  { match: name => /(jowar|jawar|sorghum).*atta/i.test(name), variants: [{ unit: '1 kg', price: 100 }] },
  { match: name => /jau|barley/i.test(name), variants: [{ unit: '1 kg', price: 90 }] },
  { match: name => /oats?\s*atta/i.test(name), variants: [{ unit: '1 kg', price: 220 }] },
  { match: name => /rajgira|amaranth/i.test(name), variants: [{ unit: '1 kg', price: 250 }] },
  { match: name => /rice\s*(flour|atta)/i.test(name), variants: [{ unit: '1 kg', price: 220 }] },
  { match: name => /maida|refined\s*flour/i.test(name), variants: [{ unit: '1 kg', price: 55 }] },

  // ─── GHEE ─────────────────────────────────────────────────────────────
  { match: name => /cow\s*ghee/i.test(name),
    variants: [{ unit: '500 ml', price: 1310 }, { unit: '1 L', price: 2610 }] },
  { match: name => /buffalo\s*ghee/i.test(name),
    variants: [{ unit: '500 ml', price: 900 }, { unit: '1 L', price: 1800 }] },

  // ─── OILS (with size in name — single variant) ────────────────────────
  { match: name => /yellow\s*mustard.*500/i.test(name), variants: [{ unit: '500 ml', price: 250 }] },
  { match: name => /yellow\s*mustard.*1\s*l/i.test(name), variants: [{ unit: '1 L', price: 495 }] },
  { match: name => /black\s*mustard.*500/i.test(name), variants: [{ unit: '500 ml', price: 230 }] },
  { match: name => /black\s*mustard.*1\s*l/i.test(name), variants: [{ unit: '1 L', price: 450 }] },
  { match: name => /black\s*mustard.*5\s*l/i.test(name), variants: [{ unit: '5 L', price: 2225 }] },
  { match: name => /sesame\s*oil.*500/i.test(name) && !/black/i.test(name), variants: [{ unit: '500 ml', price: 330 }] },
  { match: name => /sesame\s*oil.*1\s*l/i.test(name) && !/black/i.test(name), variants: [{ unit: '1 L', price: 650 }] },
  { match: name => /coconut\s*oil|virgin\s*coconut/i.test(name),
    variants: [{ unit: '500 ml', price: 490 }, { unit: '1 L', price: 980 }] },
  // Static oil products (no size in name)
  { match: name => /cold\s*pressed\s*mustard\s*oil/i.test(name) && !/black|yellow/i.test(name),
    variants: [{ unit: '500 ml', price: 230 }, { unit: '1 L', price: 450 }, { unit: '5 L', price: 2225 }] },
  { match: name => /cold\s*pressed\s*sesame\s*oil/i.test(name),
    variants: [{ unit: '500 ml', price: 330 }, { unit: '1 L', price: 650 }, { unit: '5 L', price: 3225 }] },
  { match: name => /cold\s*pressed\s*groundnut|peanut\s*oil/i.test(name),
    variants: [{ unit: '500 ml', price: 280 }, { unit: '1 L', price: 555 }, { unit: '5 L', price: 2750 }] },
  { match: name => /flaxseed\s*oil|alsi\s*oil/i.test(name), variants: [{ unit: '500 ml', price: 280 }] },

  // ─── SEEDS ────────────────────────────────────────────────────────────
  { match: name => /sabja/i.test(name), variants: [{ unit: '200 g', price: 135 }] },
  { match: name => /water\s*melon\s*seed/i.test(name), variants: [{ unit: '200 g', price: 250 }] },
  { match: name => /sun\s*flower\s*seed/i.test(name), variants: [{ unit: '200 g', price: 90 }] },
  { match: name => /chia\s*seed/i.test(name), variants: [{ unit: '200 g', price: 120 }] },
  { match: name => /musk\s*melon\s*seed/i.test(name), variants: [{ unit: '200 g', price: 230 }] },
  { match: name => /pumpkin\s*seed/i.test(name), variants: [{ unit: '200 g', price: 160 }] },
  { match: name => /flax\s*seed|alsi/i.test(name) && !/oil/i.test(name), variants: [{ unit: '200 g', price: 55 }] },

  // ─── MASALAS ──────────────────────────────────────────────────────────
  { match: name => /garam\s*masala/i.test(name), variants: [{ unit: '100 g', price: 175 }] },
  { match: name => /kitchen\s*king/i.test(name), variants: [{ unit: '100 g', price: 135 }] },
  { match: name => /shahi\s*paneer\s*masala/i.test(name), variants: [{ unit: '100 g', price: 145 }] },
  { match: name => /biryani\s*masala/i.test(name), variants: [{ unit: '100 g', price: 180 }] },
  { match: name => /meat\s*masala/i.test(name), variants: [{ unit: '100 g', price: 160 }] },
  { match: name => /rajma\s*masala/i.test(name), variants: [{ unit: '100 g', price: 130 }] },
  { match: name => /chole.*masala/i.test(name), variants: [{ unit: '100 g', price: 140 }] },
  { match: name => /chana\s*masala/i.test(name), variants: [{ unit: '100 g', price: 140 }] },
  { match: name => /sambar\s*masala/i.test(name), variants: [{ unit: '100 g', price: 120 }] },
  { match: name => /dal\s*makhni\s*masala/i.test(name), variants: [{ unit: '100 g', price: 120 }] },
  { match: name => /dum\s*aloo/i.test(name), variants: [{ unit: '100 g', price: 120 }] },
  { match: name => /chicken\s*masala/i.test(name), variants: [{ unit: '100 g', price: 145 }] },
  { match: name => /pav\s*bhaji/i.test(name), variants: [{ unit: '100 g', price: 120 }] },
  { match: name => /panipuri|gol\s*gappe/i.test(name), variants: [{ unit: '100 g', price: 120 }] },
  { match: name => /sandwich\s*masala/i.test(name), variants: [{ unit: '100 g', price: 120 }] },
  { match: name => /aloo\s*pra(n|)tha/i.test(name), variants: [{ unit: '100 g', price: 130 }] },
  { match: name => /roasted\s*jeera\s*masala/i.test(name), variants: [{ unit: '100 g', price: 110 }] },
  { match: name => /cha(a|)t\s*masala/i.test(name), variants: [{ unit: '100 g', price: 120 }] },
  { match: name => /raita\s*masala/i.test(name), variants: [{ unit: '100 g', price: 120 }] },
  { match: name => /jal\s*jeera/i.test(name), variants: [{ unit: '100 g', price: 100 }] },
  { match: name => /shikanji/i.test(name), variants: [{ unit: '100 g', price: 100 }] },
  { match: name => /chai\s*masala|tea\s*masala/i.test(name), variants: [{ unit: '100 g', price: 225 }] },

  // ─── POWDERS (multi-size) ─────────────────────────────────────────────
  { match: name => /turmeric.*powder|haldi.*powder/i.test(name),
    variants: [{ unit: '100 g', price: 40 }, { unit: '250 g', price: 100 }, { unit: '500 g', price: 200 }] },
  { match: name => /red\s*chilli.*kashmiri.*powder/i.test(name),
    variants: [{ unit: '100 g', price: 100 }, { unit: '250 g', price: 250 }, { unit: '500 g', price: 500 }] },
  { match: name => /red\s*chilli.*tikhi.*powder/i.test(name),
    variants: [{ unit: '100 g', price: 80 }, { unit: '250 g', price: 200 }, { unit: '500 g', price: 400 }] },
  { match: name => /red\s*chilli\s*powder/i.test(name) && !/kashmiri|tikhi/i.test(name),
    variants: [{ unit: '100 g', price: 80 }, { unit: '250 g', price: 200 }, { unit: '500 g', price: 400 }] },
  { match: name => /dhaniya\s*powder|coriander\s*powder/i.test(name),
    variants: [{ unit: '100 g', price: 35 }, { unit: '250 g', price: 88 }, { unit: '500 g', price: 175 }] },
  { match: name => /black\s*pepper\s*powder/i.test(name), variants: [{ unit: '100 g', price: 172 }] },
  { match: name => /amchur\s*powder|dry\s*mango\s*powder/i.test(name), variants: [{ unit: '100 g', price: 68 }] },
  { match: name => /jeera\s*powder|cumin\s*powder/i.test(name), variants: [{ unit: '100 g', price: 90 }] },
  { match: name => /elaichi\s*powder|cardamom\s*powder/i.test(name), variants: [{ unit: '100 g', price: 550 }] },
  { match: name => /sonth\s*powder|ginger\s*powder/i.test(name), variants: [{ unit: '100 g', price: 90 }] },
  { match: name => /saunf\s*powder|fennel\s*powder/i.test(name), variants: [{ unit: '100 g', price: 100 }] },
  { match: name => /dalchini\s*powder|cinnamon\s*powder/i.test(name), variants: [{ unit: '100 g', price: 90 }] },
  { match: name => /garlic\s*powder/i.test(name), variants: [{ unit: '100 g', price: 55 }] },
  { match: name => /chili?\s*flakes/i.test(name), variants: [{ unit: '100 g', price: 100 }] },
  { match: name => /oregano/i.test(name), variants: [{ unit: '100 g', price: 100 }] },
  { match: name => /black\s*salt|kala\s*namak/i.test(name), variants: [{ unit: '1 kg', price: 85 }] },
  { match: name => /sendha\s*namak|rock\s*salt/i.test(name),
    variants: [{ unit: '500 g', price: 63 }, { unit: '1 kg', price: 125 }] },
  { match: name => /coconut\s*powder/i.test(name),
    variants: [{ unit: '500 g', price: 325 }, { unit: '1 kg', price: 650 }] },

  // ─── WHOLE SPICES (multi-size) ────────────────────────────────────────
  { match: name => /red\s*chilli.*kashmiri.*whole/i.test(name),
    variants: [{ unit: '100 g', price: 85 }, { unit: '250 g', price: 213 }] },
  { match: name => /red\s*chilli.*tikhi.*whole/i.test(name),
    variants: [{ unit: '100 g', price: 65 }, { unit: '250 g', price: 163 }],
    fix: { price: 65, unit: '100 g' } },
  { match: name => /red\s*chilli\s*tadka/i.test(name),
    variants: [{ unit: '100 g', price: 65 }, { unit: '250 g', price: 163 }] },
  { match: name => /dhaniya\s*sabut|coriander\s*seed/i.test(name),
    variants: [{ unit: '100 g', price: 34 }, { unit: '250 g', price: 85 }, { unit: '500 g', price: 170 }] },
  { match: name => /jeera\s*sabut|cumin\s*seed/i.test(name) && !/shahi/i.test(name),
    variants: [{ unit: '100 g', price: 80 }, { unit: '250 g', price: 200 }, { unit: '500 g', price: 400 }] },
  { match: name => /shahi\s*jeera/i.test(name),
    variants: [{ unit: '50 g', price: 105 }, { unit: '100 g', price: 210 }] },
  { match: name => /ajwain/i.test(name), variants: [{ unit: '100 g', price: 90 }] },
  { match: name => /black\s*pepper\s*whole|black\s*pepper(?!\s*powder)/i.test(name) && !/powder/i.test(name),
    variants: [{ unit: '50 g', price: 78 }, { unit: '100 g', price: 155 }] },
  { match: name => /white\s*pepper/i.test(name), variants: [{ unit: '100 g', price: 130 }] },
  { match: name => /methi\s*dana|fenugreek\s*seed/i.test(name), variants: [{ unit: '200 g', price: 55 }] },
  { match: name => /dalchini.*indian|dalchini\s*\(/i.test(name) && !/sri\s*lanka|ceylon/i.test(name),
    variants: [{ unit: '100 g', price: 75 }] },
  { match: name => /dalchini.*sri\s*lanka|ceylon/i.test(name), variants: [{ unit: '100 g', price: 235 }] },
  { match: name => /saunf\s*whole|fennel\s*seed/i.test(name),
    variants: [{ unit: '100 g', price: 100 }, { unit: '250 g', price: 250 }] },
  { match: name => /sonth(?!\s*powder)/i.test(name) && !/powder/i.test(name),
    variants: [{ unit: '100 g', price: 140 }, { unit: '250 g', price: 350 }] },
  { match: name => /kala\s*til|black\s*sesame/i.test(name) && !/oil/i.test(name),
    variants: [{ unit: '100 g', price: 70 }] },
  { match: name => /white\s*til|white\s*sesame/i.test(name) && !/oil/i.test(name),
    variants: [{ unit: '100 g', price: 75 }] },
  { match: name => /badi\s*elaichi|black\s*cardamom/i.test(name), variants: [{ unit: '100 g', price: 350 }] },
  { match: name => /green\s*elaichi|green\s*cardamom/i.test(name), variants: [{ unit: '100 g', price: 700 }] },
  { match: name => /laung|clove/i.test(name), variants: [{ unit: '100 g', price: 200 }] },
  { match: name => /\brai\b|mustard\s*seed/i.test(name) && !/oil/i.test(name), variants: [{ unit: '100 g', price: 20 }] },
  { match: name => /anardana/i.test(name), variants: [{ unit: '100 g', price: 150 }] },
  { match: name => /kasuri\s*methi/i.test(name),
    variants: [{ unit: '100 g', price: 120 }],
    fix: { price: 120, unit: '100 g' } },
  { match: name => /tej\s*patta|bay\s*lea/i.test(name), variants: [{ unit: '100 g', price: 100 }] },
  { match: name => /khas[\s-]*khas|poppy/i.test(name), variants: [{ unit: '100 g', price: 300 }] },
  { match: name => /gulab\s*patti|rose\s*petal/i.test(name),
    variants: [{ unit: '50 g', price: 60 }, { unit: '100 g', price: 120 }] },
  { match: name => /javitri|mace/i.test(name),
    variants: [{ unit: '50 g', price: 230 }, { unit: '100 g', price: 460 }] },
  { match: name => /jaiphal|nutmeg/i.test(name),
    variants: [{ unit: '50 g', price: 75 }, { unit: '100 g', price: 150 }] },
  { match: name => /star\s*phool|star\s*anise/i.test(name),
    variants: [{ unit: '50 g', price: 95 }, { unit: '100 g', price: 190 }] },
  { match: name => /kalonji|nigella/i.test(name), variants: [{ unit: '100 g', price: 75 }] },
  { match: name => /\bhing\b|asafoetida/i.test(name), variants: [{ unit: '10 g', price: 300 }] },
  { match: name => /\bimli\b|tamarind/i.test(name), variants: [{ unit: '100 g', price: 55 }] },
  { match: name => /pudina|dried?\s*mint/i.test(name), variants: [{ unit: '100 g', price: 85 }] },

  // ─── DRY FRUITS (multi-size) ──────────────────────────────────────────
  { match: name => /cashew/i.test(name) && !/jumbo/i.test(name),
    variants: [{ unit: '250 g', price: 213 }, { unit: '500 g', price: 425 }, { unit: '1 kg', price: 850 }] },
  { match: name => /kali\s*kishmish|black\s*raisin/i.test(name),
    variants: [{ unit: '250 g', price: 413 }, { unit: '500 g', price: 825 }, { unit: '1 kg', price: 1650 }] },
  { match: name => /kishmish|raisin/i.test(name) && !/kali|black/i.test(name),
    variants: [{ unit: '250 g', price: 225 }, { unit: '500 g', price: 450 }, { unit: '1 kg', price: 900 }] },
  { match: name => /almond|badam/i.test(name) && !/gurbandi|oil/i.test(name),
    variants: [{ unit: '250 g', price: 550 }, { unit: '500 g', price: 1100 }, { unit: '1 kg', price: 2200 }] },
  { match: name => /apricot|khubani|khumani/i.test(name) && !/candy/i.test(name),
    variants: [{ unit: '250 g', price: 313 }, { unit: '500 g', price: 625 }, { unit: '1 kg', price: 1250 }] },
  { match: name => /pista|pistachio/i.test(name),
    variants: [{ unit: '250 g', price: 363 }, { unit: '500 g', price: 725 }, { unit: '1 kg', price: 1450 }] },
  { match: name => /anjeer|fig/i.test(name),
    variants: [{ unit: '250 g', price: 250 }, { unit: '500 g', price: 500 }, { unit: '1 kg', price: 1000 }] },

  // ─── PULSES (multi-size: 500g/1kg) ────────────────────────────────────
  { match: name => /chana\s*dal/i.test(name) && !/atta/i.test(name),
    variants: [{ unit: '500 g', price: 85 }, { unit: '1 kg', price: 170 }] },
  { match: name => /arhar|toor/i.test(name),
    variants: [{ unit: '500 g', price: 98 }, { unit: '1 kg', price: 195 }] },
  { match: name => /moong\s*(yellow|dal)/i.test(name) && !/green|whole|chilka/i.test(name),
    variants: [{ unit: '500 g', price: 88 }, { unit: '1 kg', price: 175 }] },
  { match: name => /moong\s*green\s*whole/i.test(name),
    variants: [{ unit: '500 g', price: 85 }, { unit: '1 kg', price: 170 }] },
  { match: name => /moong\s*green.*chilka/i.test(name),
    variants: [{ unit: '500 g', price: 85 }, { unit: '1 kg', price: 170 }] },
  { match: name => /kabuli/i.test(name),
    variants: [{ unit: '500 g', price: 88 }, { unit: '1 kg', price: 175 }] },
  { match: name => /desi\s*chana/i.test(name),
    variants: [{ unit: '500 g', price: 83 }, { unit: '1 kg', price: 165 }] },
  { match: name => /masoor\s*red|masoor\s*dal|red\s*lentil/i.test(name) && !/sabut|whole|malka/i.test(name),
    variants: [{ unit: '500 g', price: 90 }, { unit: '1 kg', price: 180 }] },
  { match: name => /urad.*kali.*sabut|urad.*sabut/i.test(name),
    variants: [{ unit: '500 g', price: 90 }, { unit: '1 kg', price: 180 }] },
  { match: name => /matki|moth/i.test(name),
    variants: [{ unit: '500 g', price: 73 }, { unit: '1 kg', price: 145 }] },
  { match: name => /lobia|black[\s-]*eyed/i.test(name),
    variants: [{ unit: '500 g', price: 120 }, { unit: '1 kg', price: 240 }] },
  { match: name => /soybean/i.test(name) && !/atta|oil/i.test(name),
    variants: [{ unit: '500 g', price: 75 }, { unit: '1 kg', price: 150 }] },
  { match: name => /rajma\s*red|rajma.*small/i.test(name),
    variants: [{ unit: '500 g', price: 113 }, { unit: '1 kg', price: 225 }] },
  { match: name => /rajma.*big/i.test(name) && !/red|small|chitra/i.test(name),
    variants: [{ unit: '500 g', price: 110 }, { unit: '1 kg', price: 220 }] },
  { match: name => /rajma\s*chitra/i.test(name),
    variants: [{ unit: '500 g', price: 110 }, { unit: '1 kg', price: 220 }] },
  { match: name => /white\s*peas/i.test(name),
    variants: [{ unit: '500 g', price: 165 }, { unit: '1 kg', price: 330 }] },
  { match: name => /urad.*black.*chilka/i.test(name),
    variants: [{ unit: '500 g', price: 93 }, { unit: '1 kg', price: 185 }] },
  { match: name => /urad\s*white/i.test(name),
    variants: [{ unit: '500 g', price: 98 }, { unit: '1 kg', price: 195 }] },
  { match: name => /urad\s*dal|black\s*gram/i.test(name) && !/white|chilka|sabut|kali/i.test(name),
    variants: [{ unit: '500 g', price: 98 }, { unit: '1 kg', price: 195 }] },
  { match: name => /green\s*peas|matar/i.test(name),
    variants: [{ unit: '500 g', price: 63 }, { unit: '1 kg', price: 125 }] },
  { match: name => /mix\s*dal.*sabut/i.test(name),
    variants: [{ unit: '500 g', price: 105 }, { unit: '1 kg', price: 210 }] },
  { match: name => /white\s*beans/i.test(name),
    variants: [{ unit: '500 g', price: 75 }, { unit: '1 kg', price: 150 }] },
  { match: name => /masoor.*sabut/i.test(name) && !/malka/i.test(name),
    variants: [{ unit: '500 g', price: 88 }, { unit: '1 kg', price: 175 }] },
  { match: name => /mix\s*dal.*chilka/i.test(name),
    variants: [{ unit: '500 g', price: 93 }, { unit: '1 kg', price: 185 }] },
  { match: name => /kulthi/i.test(name),
    variants: [{ unit: '500 g', price: 76 }, { unit: '1 kg', price: 152 }] },
  { match: name => /masoor\s*malk/i.test(name),
    variants: [{ unit: '500 g', price: 73 }, { unit: '1 kg', price: 145 }] },

  // ─── SWEETENERS ───────────────────────────────────────────────────────
  { match: name => /jaggery\s*powder/i.test(name),
    variants: [{ unit: '500 g', price: 75 }, { unit: '1 kg', price: 150 }] },
  { match: name => /jaggery|gur/i.test(name) && !/powder/i.test(name),
    variants: [{ unit: '500 g', price: 75 }, { unit: '1 kg', price: 150 }] },
  { match: name => /khand|desi\s*khand|raw\s*cane/i.test(name),
    variants: [{ unit: '500 g', price: 100 }, { unit: '1 kg', price: 200 }] },
  { match: name => /forest\s*honey/i.test(name), variants: [{ unit: '650 g', price: 899 }] },

  // ─── GRAINS ───────────────────────────────────────────────────────────
  { match: name => /dali(ya|a)/i.test(name) && !/jar/i.test(name),
    variants: [{ unit: '1 kg', price: 110 }, { unit: '2 kg', price: 220 }] },
  { match: name => /dali(ya|a).*jar/i.test(name),
    variants: [{ unit: '1 kg', price: 110 }] },
  { match: name => /premium\s*basmati/i.test(name), variants: [{ unit: '1 kg', price: 180 }] },
  { match: name => /brown\s*rice/i.test(name), variants: [{ unit: '1 kg', price: 160 }] },
  { match: name => /sesame\s*seed|^sesame\s*seeds\s*\(til\)$/i.test(name) && !/oil/i.test(name),
    variants: [{ unit: '100 g', price: 75 }] },
];

async function main() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Master Miller — Add Variants + Fix Wrong Prices');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const snap = await getDocs(collection(db, 'products'));
  console.log(`  Found ${snap.size} products\n`);

  let updated = 0;
  let fixed = 0;
  let skipped = 0;

  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    const name = data.name || '';

    let matched = false;
    for (const rule of VARIANT_MAP) {
      if (rule.match(name)) {
        matched = true;
        const update = {
          variants: rule.variants,
          updatedAt: Timestamp.now(),
        };

        // Fix wrong base price/unit if needed
        if (rule.fix) {
          update.price = rule.fix.price;
          update.unit = rule.fix.unit;
          console.log(`  🔧 ${name}: FIXED price ₹${data.price}/${data.unit} → ₹${rule.fix.price}/${rule.fix.unit}`);
          fixed++;
        }

        await updateDoc(doc(db, 'products', docSnap.id), update);
        const sizes = rule.variants.map(v => v.unit).join(', ');
        console.log(`  ✓  ${name}: ${rule.variants.length} variant(s) [${sizes}]`);
        updated++;
        break;
      }
    }

    if (!matched) {
      console.log(`  ─  ${name}: no variant rule — skipped`);
      skipped++;
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  Done!  ${updated} updated, ${fixed} prices fixed, ${skipped} skipped`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
