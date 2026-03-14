/**
 * Master Miller — Update Product Prices & Units
 *
 * Fetches all products from Firestore, matches them against the
 * official price list, and updates price + unit fields.
 *
 * Run: node scripts/update-prices.mjs
 */

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
dotenv.config({ path: join(ROOT, '.env.local') });

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

// ─── Price list mapping ─────────────────────────────────────────────────────
// Key: lowercase product name keywords → { price, unit }
// For multi-size products, we use the smallest/base unit price.
const PRICE_MAP = [
  // ─── ATTA / FLOUR ──────────────────────────────────────────────────────
  { match: name => /mp\s*(sharbati|wheat)\s*(chak|atta)/i.test(name) && !/multigrain/i.test(name), price: 90, unit: '1 kg' },
  { match: name => /sharbati\s*multigrain/i.test(name), price: 120, unit: '1 kg' },
  { match: name => /mp\s*regular\s*wheat\s*atta/i.test(name) && !/multigrain/i.test(name), price: 75, unit: '1 kg' },
  { match: name => /mp\s*regular\s*wheat\s*multigrain/i.test(name), price: 112, unit: '1 kg' },
  { match: name => /multigrain\s*pure\s*atta|gluten\s*free/i.test(name), price: 126, unit: '1 kg' },
  { match: name => /khapli.*atta/i.test(name) && !/multigrain/i.test(name), price: 213, unit: '1 kg' },
  { match: name => /khapli.*multigrain/i.test(name), price: 200, unit: '1 kg' },
  { match: name => /besan|gram\s*flour/i.test(name) && !/mota/i.test(name), price: 160, unit: '1 kg' },
  { match: name => /makki|maize|corn\s*flour/i.test(name), price: 82, unit: '1 kg' },
  { match: name => /bajra/i.test(name), price: 80, unit: '1 kg' },
  { match: name => /kala\s*chana\s*atta|chana\s*desi.*atta/i.test(name), price: 135, unit: '1 kg' },
  { match: name => /soya\s*bean.*atta/i.test(name), price: 150, unit: '1 kg' },
  { match: name => /ragi/i.test(name), price: 130, unit: '1 kg' },
  { match: name => /jowar|jawar|sorghum/i.test(name) && /atta|flour/i.test(name), price: 100, unit: '1 kg' },
  { match: name => /jau|barley/i.test(name), price: 90, unit: '1 kg' },
  { match: name => /oats?\s*atta/i.test(name), price: 220, unit: '1 kg' },
  { match: name => /rajgira|amaranth/i.test(name), price: 250, unit: '1 kg' },
  { match: name => /rice\s*(flour|atta)/i.test(name), price: 220, unit: '1 kg' },
  { match: name => /kutu/i.test(name), price: 200, unit: '1 kg' },
  { match: name => /samak|sanwa/i.test(name), price: 220, unit: '1 kg' },
  { match: name => /satu/i.test(name) && /protein/i.test(name), price: 160, unit: '1 kg' },
  { match: name => /satu/i.test(name) && !/protein/i.test(name), price: 160, unit: '1 kg' },
  { match: name => /maida|refined\s*flour/i.test(name), price: 55, unit: '1 kg' },
  { match: name => /whole\s*wheat\s*chakki/i.test(name), price: 90, unit: '1 kg' },
  { match: name => /multigrain\s*atta/i.test(name) && !/khapli|sharbati|mp|pure/i.test(name), price: 120, unit: '1 kg' },
  { match: name => /quinoa/i.test(name), price: 360, unit: '1 kg' },

  // ─── OILS & GHEE ───────────────────────────────────────────────────────
  { match: name => /a2\s*cow\s*ghee|cow\s*ghee/i.test(name), price: 1310, unit: '500 ml' },
  { match: name => /buffalo\s*ghee|desi\s*ghee\s*buffalo/i.test(name), price: 900, unit: '500 ml' },
  { match: name => /coconut\s*oil/i.test(name), price: 490, unit: '500 ml' },
  { match: name => /yellow\s*mustard.*500/i.test(name), price: 250, unit: '500 ml' },
  { match: name => /yellow\s*mustard.*1\s*l/i.test(name), price: 495, unit: '1 L' },
  { match: name => /black\s*mustard.*500/i.test(name), price: 230, unit: '500 ml' },
  { match: name => /black\s*mustard.*1\s*l/i.test(name), price: 450, unit: '1 L' },
  { match: name => /black\s*mustard.*5\s*l/i.test(name), price: 2225, unit: '5 L' },
  { match: name => /peanut|groundnut/i.test(name) && /500/i.test(name), price: 280, unit: '500 ml' },
  { match: name => /peanut|groundnut/i.test(name) && /1\s*l/i.test(name), price: 555, unit: '1 L' },
  { match: name => /sesame\s*oil.*500/i.test(name) && !/black/i.test(name), price: 330, unit: '500 ml' },
  { match: name => /sesame\s*oil.*1\s*l/i.test(name) && !/black/i.test(name), price: 650, unit: '1 L' },
  { match: name => /black\s*sesame\s*oil/i.test(name), price: 350, unit: '500 ml' },
  { match: name => /flaxseed\s*oil|alsi\s*oil/i.test(name), price: 280, unit: '500 ml' },
  // Generic oil fallbacks (for static products without size in name)
  { match: name => /mustard\s*oil/i.test(name) && !/black|yellow/i.test(name) && !/500|1l|5l/i.test(name), price: 450, unit: '1 L' },
  { match: name => /sesame\s*oil/i.test(name) && !/500|1l/i.test(name) && !/black/i.test(name), price: 650, unit: '1 L' },
  { match: name => /groundnut\s*oil/i.test(name) && !/500|1l|5l/i.test(name), price: 555, unit: '1 L' },
  { match: name => /coconut\s*oil/i.test(name) && !/500|1l/i.test(name), price: 490, unit: '500 ml' },

  // ─── SEEDS ─────────────────────────────────────────────────────────────
  { match: name => /sabja/i.test(name), price: 135, unit: '200 g' },
  { match: name => /water\s*melon\s*seed/i.test(name), price: 250, unit: '200 g' },
  { match: name => /sun\s*flower\s*seed/i.test(name), price: 90, unit: '200 g' },
  { match: name => /chia\s*seed/i.test(name), price: 120, unit: '200 g' },
  { match: name => /musk\s*melon\s*seed/i.test(name), price: 230, unit: '200 g' },
  { match: name => /pumpkin\s*seed/i.test(name), price: 160, unit: '200 g' },
  { match: name => /flax\s*seed|alsi\s*beej|alsi(?!\s*oil)/i.test(name) && !/oil/i.test(name), price: 55, unit: '200 g' },

  // ─── MASALAS ───────────────────────────────────────────────────────────
  { match: name => /garam\s*masala/i.test(name), price: 175, unit: '100 g' },
  { match: name => /kitchen\s*king/i.test(name), price: 135, unit: '100 g' },
  { match: name => /shahi\s*paneer\s*masala/i.test(name), price: 145, unit: '100 g' },
  { match: name => /biryani\s*masala/i.test(name), price: 180, unit: '100 g' },
  { match: name => /meat\s*masala/i.test(name), price: 160, unit: '100 g' },
  { match: name => /rajma\s*masala/i.test(name), price: 130, unit: '100 g' },
  { match: name => /chole\s*jabardast|chole\s*masala/i.test(name), price: 140, unit: '100 g' },
  { match: name => /chana\s*masala/i.test(name), price: 140, unit: '100 g' },
  { match: name => /sambar\s*masala/i.test(name), price: 120, unit: '100 g' },
  { match: name => /dal\s*makhni\s*masala/i.test(name), price: 120, unit: '100 g' },
  { match: name => /dum\s*aloo/i.test(name), price: 120, unit: '100 g' },
  { match: name => /chicken\s*masala/i.test(name), price: 145, unit: '100 g' },
  { match: name => /pav\s*bhaji/i.test(name), price: 120, unit: '100 g' },
  { match: name => /panipuri|gol\s*gappe/i.test(name), price: 120, unit: '100 g' },
  { match: name => /sandwich\s*masala/i.test(name), price: 120, unit: '100 g' },
  { match: name => /aloo\s*prantha|aloo\s*paratha/i.test(name), price: 130, unit: '100 g' },
  { match: name => /roasted\s*jeera\s*masala/i.test(name), price: 110, unit: '100 g' },
  { match: name => /chat\s*masala|chaat\s*masala/i.test(name), price: 120, unit: '100 g' },
  { match: name => /raita\s*masala/i.test(name), price: 120, unit: '100 g' },
  { match: name => /jal\s*jeera/i.test(name), price: 100, unit: '100 g' },
  { match: name => /shikanji/i.test(name), price: 100, unit: '100 g' },
  { match: name => /chai\s*masala|tea\s*masala/i.test(name), price: 225, unit: '100 g' },

  // ─── POWDERS ───────────────────────────────────────────────────────────
  { match: name => /turmeric|haldi/i.test(name) && /powder/i.test(name), price: 40, unit: '100 g' },
  { match: name => /kashmiri.*chilli.*powder|red\s*chilli.*kashmiri.*powder/i.test(name), price: 100, unit: '100 g' },
  { match: name => /tikhi.*chilli.*powder|red\s*chilli.*tikhi/i.test(name), price: 80, unit: '100 g' },
  { match: name => /red\s*chilli\s*powder/i.test(name) && !/kashmiri|tikhi/i.test(name), price: 80, unit: '100 g' },
  { match: name => /dhaniya\s*powder|coriander\s*powder/i.test(name), price: 35, unit: '100 g' },
  { match: name => /black\s*pepper\s*powder|kali\s*mirch\s*powder/i.test(name), price: 172, unit: '100 g' },
  { match: name => /amchur\s*powder|amchoor|dry\s*mango\s*powder/i.test(name), price: 68, unit: '100 g' },
  { match: name => /jeera\s*powder|cumin\s*powder/i.test(name), price: 90, unit: '100 g' },
  { match: name => /elaichi\s*powder|cardamom\s*powder/i.test(name), price: 550, unit: '100 g' },
  { match: name => /sonth\s*powder|ginger\s*powder/i.test(name), price: 90, unit: '100 g' },
  { match: name => /saunf\s*powder|fennel\s*powder/i.test(name), price: 100, unit: '100 g' },
  { match: name => /dalchini\s*powder|cinnamon\s*powder/i.test(name), price: 90, unit: '100 g' },
  { match: name => /garlic\s*powder/i.test(name), price: 55, unit: '100 g' },
  { match: name => /chili\s*flakes|chilli\s*flakes/i.test(name), price: 100, unit: '100 g' },
  { match: name => /oregano/i.test(name), price: 100, unit: '100 g' },
  { match: name => /black\s*salt|kala\s*namak/i.test(name), price: 85, unit: '1 kg' },
  { match: name => /sendha\s*namak|rock\s*salt/i.test(name), price: 63, unit: '500 g' },
  { match: name => /coconut\s*powder/i.test(name), price: 325, unit: '500 g' },

  // ─── WHOLE SPICES ──────────────────────────────────────────────────────
  { match: name => /kashmiri.*chilli.*whole|red\s*chilli.*kashmiri.*whole/i.test(name), price: 85, unit: '100 g' },
  { match: name => /tikhi.*chilli.*whole|red\s*chilli.*tikhi.*whole/i.test(name), price: 65, unit: '100 g' },
  { match: name => /red\s*chilli\s*tadka/i.test(name), price: 65, unit: '100 g' },
  { match: name => /dhaniya\s*sabut|coriander\s*seed/i.test(name), price: 34, unit: '100 g' },
  { match: name => /jeera\s*sabut|cumin\s*seed/i.test(name) && !/shahi/i.test(name), price: 80, unit: '100 g' },
  { match: name => /shahi\s*jeera/i.test(name), price: 105, unit: '50 g' },
  { match: name => /ajwain/i.test(name), price: 90, unit: '100 g' },
  { match: name => /black\s*pepper\s*whole|kali\s*mirch\s*whole|black\s*pepper(?!\s*powder)/i.test(name) && !/powder/i.test(name), price: 78, unit: '50 g' },
  { match: name => /white\s*pepper/i.test(name), price: 130, unit: '100 g' },
  { match: name => /methi\s*dana|fenugreek/i.test(name), price: 55, unit: '200 g' },
  { match: name => /dalchini.*indian|indian.*dalchini|dalchini\s*whole|cinnamon\s*stick/i.test(name) && !/sri\s*lanka|ceylon/i.test(name), price: 75, unit: '100 g' },
  { match: name => /dalchini.*sri\s*lanka|ceylon.*cinnamon/i.test(name), price: 235, unit: '100 g' },
  { match: name => /saunf\s*whole|fennel\s*seed/i.test(name), price: 100, unit: '100 g' },
  { match: name => /sonth(?!\s*powder)/i.test(name) && !/powder/i.test(name), price: 140, unit: '100 g' },
  { match: name => /kala\s*til|black\s*sesame\s*seed/i.test(name) && !/oil/i.test(name), price: 70, unit: '100 g' },
  { match: name => /white\s*til|white\s*sesame|sesame\s*seed/i.test(name) && !/oil/i.test(name), price: 75, unit: '100 g' },
  { match: name => /badi\s*elaichi|black\s*cardamom/i.test(name), price: 350, unit: '100 g' },
  { match: name => /green\s*elaichi|green\s*cardamom|chhoti\s*elaichi/i.test(name), price: 700, unit: '100 g' },
  { match: name => /laung|clove/i.test(name), price: 200, unit: '100 g' },
  { match: name => /\brai\b|mustard\s*seed/i.test(name) && !/oil/i.test(name), price: 20, unit: '100 g' },
  { match: name => /anardana/i.test(name), price: 150, unit: '100 g' },
  { match: name => /kasuri\s*methi/i.test(name), price: 120, unit: '100 g' },
  { match: name => /tej\s*patta|bay\s*lea/i.test(name), price: 100, unit: '100 g' },
  { match: name => /khas[\s-]*khas|poppy\s*seed/i.test(name), price: 300, unit: '100 g' },
  { match: name => /gulab\s*patti|rose\s*petal/i.test(name), price: 60, unit: '50 g' },
  { match: name => /javitri|mace/i.test(name), price: 230, unit: '50 g' },
  { match: name => /jaiphal|nutmeg/i.test(name), price: 75, unit: '50 g' },
  { match: name => /star\s*phool|star\s*anise/i.test(name), price: 95, unit: '50 g' },
  { match: name => /kalonji|nigella/i.test(name), price: 75, unit: '100 g' },
  { match: name => /\bhing\b|asafoetida/i.test(name), price: 300, unit: '10 g' },
  { match: name => /\bimli\b|tamarind/i.test(name), price: 55, unit: '100 g' },
  { match: name => /pudina\s*patta|dried?\s*mint/i.test(name), price: 85, unit: '100 g' },

  // ─── DRY FRUITS ────────────────────────────────────────────────────────
  { match: name => /jumbo\s*cashew|cashew.*180/i.test(name), price: 563, unit: '250 g' },
  { match: name => /cashew.*240|cashew/i.test(name) && !/jumbo|180/i.test(name), price: 213, unit: '250 g' },
  { match: name => /kali\s*kishmish|black\s*raisin/i.test(name), price: 413, unit: '250 g' },
  { match: name => /kishmish\s*laung|green\s*raisin|raisin/i.test(name) && !/black|kali/i.test(name), price: 225, unit: '250 g' },
  { match: name => /badam\s*gurbandi|gurbandi\s*almond/i.test(name), price: 350, unit: '250 g' },
  { match: name => /badam\s*california|california\s*almond|almond/i.test(name) && !/gurbandi|oil/i.test(name), price: 550, unit: '250 g' },
  { match: name => /akhrot\s*shell|walnut\s*shell/i.test(name), price: 400, unit: '250 g' },
  { match: name => /akhrot\s*split|walnut\s*split|walnut/i.test(name) && !/shell/i.test(name), price: 575, unit: '250 g' },
  { match: name => /apricot\s*candy/i.test(name), price: 750, unit: '250 g' },
  { match: name => /apricot|khubani|khumani/i.test(name) && !/candy/i.test(name), price: 313, unit: '250 g' },
  { match: name => /pista|pistachio/i.test(name), price: 363, unit: '250 g' },
  { match: name => /anjeer|fig/i.test(name), price: 250, unit: '250 g' },
  { match: name => /khajoor|khajor|dates?\s*madjul|medjool/i.test(name), price: 500, unit: '250 g' },

  // ─── PULSES ────────────────────────────────────────────────────────────
  { match: name => /chana\s*dal/i.test(name) && !/atta/i.test(name), price: 85, unit: '500 g' },
  { match: name => /arhar|toor\s*dal/i.test(name), price: 98, unit: '500 g' },
  { match: name => /moong\s*(yellow|dal)/i.test(name) && !/green|whole|chilka/i.test(name), price: 88, unit: '500 g' },
  { match: name => /moong\s*green\s*whole/i.test(name), price: 85, unit: '500 g' },
  { match: name => /moong\s*green.*chilka/i.test(name), price: 85, unit: '500 g' },
  { match: name => /moong\s*dal/i.test(name) && /split/i.test(name), price: 88, unit: '500 g' },
  { match: name => /kabuli\s*(chol|chan)/i.test(name), price: 88, unit: '500 g' },
  { match: name => /desi\s*chana/i.test(name), price: 83, unit: '500 g' },
  { match: name => /masoor\s*red|masoor\s*dal|red\s*lentil/i.test(name) && !/sabut|whole|malka/i.test(name), price: 90, unit: '500 g' },
  { match: name => /urad.*kali.*sabut|urad\s*black.*whole|urad.*sabut/i.test(name), price: 90, unit: '500 g' },
  { match: name => /matki|moth\s*dal/i.test(name), price: 73, unit: '500 g' },
  { match: name => /lobia|black[\s-]*eyed/i.test(name), price: 120, unit: '500 g' },
  { match: name => /soybean/i.test(name) && !/atta|flour|oil/i.test(name), price: 75, unit: '500 g' },
  { match: name => /rajma\s*red|rajma.*small/i.test(name), price: 113, unit: '500 g' },
  { match: name => /rajma.*big|rajma(?!\s*(red|chitra|small))/i.test(name) && !/red|small|chitra/i.test(name), price: 110, unit: '500 g' },
  { match: name => /rajma\s*chitra/i.test(name), price: 110, unit: '500 g' },
  { match: name => /white\s*peas/i.test(name), price: 165, unit: '500 g' },
  { match: name => /urad.*black.*chilka/i.test(name), price: 93, unit: '500 g' },
  { match: name => /urad\s*white|urad\s*dal.*white/i.test(name), price: 98, unit: '500 g' },
  { match: name => /urad\s*dal|black\s*gram/i.test(name) && !/white|chilka|sabut|whole/i.test(name), price: 98, unit: '500 g' },
  { match: name => /green\s*peas|matar/i.test(name), price: 63, unit: '500 g' },
  { match: name => /mix\s*dal.*sabut/i.test(name), price: 105, unit: '500 g' },
  { match: name => /white\s*beans/i.test(name), price: 75, unit: '500 g' },
  { match: name => /masoor.*sabut|masoor.*whole/i.test(name) && !/malka/i.test(name), price: 88, unit: '500 g' },
  { match: name => /mix\s*dal.*chilka/i.test(name), price: 93, unit: '500 g' },
  { match: name => /kulthi/i.test(name), price: 76, unit: '500 g' },
  { match: name => /masoor\s*malka/i.test(name), price: 73, unit: '500 g' },
  { match: name => /kabuli\s*chana|chickpea/i.test(name), price: 88, unit: '500 g' },

  // ─── SWEETENERS ────────────────────────────────────────────────────────
  { match: name => /jaggery.*organic.*cube/i.test(name), price: 125, unit: '500 g' },
  { match: name => /jaggery\s*powder.*organic/i.test(name), price: 125, unit: '500 g' },
  { match: name => /jaggery.*mp/i.test(name) && /powder/i.test(name), price: 75, unit: '500 g' },
  { match: name => /jaggery.*mp/i.test(name) && !/powder/i.test(name), price: 75, unit: '500 g' },
  { match: name => /jaggery\s*powder|jaggery.*gur.*powder/i.test(name) && !/organic|mp/i.test(name), price: 75, unit: '500 g' },
  { match: name => /jaggery|gur/i.test(name) && !/powder|organic|mp/i.test(name), price: 75, unit: '500 g' },
  { match: name => /khand\s*desi|desi\s*khand|raw\s*cane/i.test(name), price: 100, unit: '500 g' },
  { match: name => /forest\s*honey/i.test(name), price: 899, unit: '650 g' },

  // ─── RICE & GRAINS ─────────────────────────────────────────────────────
  { match: name => /sabudana|sago/i.test(name), price: 83, unit: '500 g' },
  { match: name => /poha|flatten\s*rice/i.test(name), price: 63, unit: '500 g' },
  { match: name => /daliya|dalia|broken\s*wheat/i.test(name) && !/jar/i.test(name), price: 110, unit: '1 kg' },
  { match: name => /daliya.*jar|dalia.*jar/i.test(name), price: 110, unit: '1 kg' },
  { match: name => /kolam|lachkari/i.test(name), price: 155, unit: '1 kg' },
  { match: name => /premium\s*basmati/i.test(name), price: 180, unit: '1 kg' },
  { match: name => /sona\s*masoori/i.test(name), price: 120, unit: '1 kg' },
  { match: name => /red\s*rice/i.test(name), price: 160, unit: '1 kg' },
  { match: name => /black\s*rice/i.test(name), price: 300, unit: '1 kg' },
  { match: name => /tukda\s*rice/i.test(name), price: 75, unit: '1 kg' },
  { match: name => /brown\s*rice/i.test(name), price: 160, unit: '1 kg' },
  { match: name => /basmati/i.test(name) && !/premium/i.test(name), price: 180, unit: '1 kg' },

  // ─── HEALTHY SPREADS ───────────────────────────────────────────────────
  { match: name => /peanut\s*butter.*natural/i.test(name), price: 400, unit: '1 kg' },
  { match: name => /peanut\s*butter.*honey/i.test(name), price: 450, unit: '1 kg' },
  { match: name => /peanut\s*butter.*jaggery/i.test(name), price: 500, unit: '1 kg' },
];

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Master Miller — Update Product Prices & Units');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const snap = await getDocs(collection(db, 'products'));
  console.log(`  Found ${snap.size} products in Firestore\n`);

  let updated = 0;
  let skipped = 0;
  let notFound = 0;

  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    const name = data.name || '';

    // Find matching price entry
    const match = PRICE_MAP.find(entry => entry.match(name));

    if (match) {
      const needsUpdate = data.price !== match.price || data.unit !== match.unit;
      if (needsUpdate) {
        await updateDoc(doc(db, 'products', docSnap.id), {
          price: match.price,
          unit: match.unit,
          updatedAt: Timestamp.now(),
        });
        console.log(`  ✓  ${name}: ₹${data.price}/${data.unit} → ₹${match.price}/${match.unit}`);
        updated++;
      } else {
        console.log(`  ─  ${name}: already correct (₹${match.price}/${match.unit})`);
        skipped++;
      }
    } else {
      console.log(`  ?  ${name}: no match in price list — skipped`);
      notFound++;
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  Done!  ${updated} updated, ${skipped} already correct, ${notFound} not in price list`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  process.exit(0);
}

main().catch(err => {
  console.error('\n❌  Error:', err);
  process.exit(1);
});
