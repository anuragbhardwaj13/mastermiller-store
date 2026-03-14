/**
 * Compare current Firebase prices against official price list (dry run)
 */
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
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

// Official price list - { name pattern, correct price, correct unit }
const OFFICIAL = [
  // ATTA
  { pattern: /mp\s*(sharbati|wheat)\s*(chak|atta)/i, exclude: /multigrain/i, price: 90, unit: '1 kg', label: 'MP SHARBATI CHAKI ATTA' },
  { pattern: /sharbati\s*multigrain/i, price: 120, unit: '1 kg', label: 'SHARBATI MULTIGRAIN ATTA' },
  { pattern: /mp\s*regular\s*wheat/i, exclude: /multigrain/i, price: 75, unit: '1 kg', label: 'MP REGULAR WHEAT ATTA' },
  { pattern: /khapli.*atta/i, exclude: /multigrain/i, price: 213, unit: '1 kg', label: 'KHAPLI CHAKI ATTA' },
  { pattern: /khapli.*multigrain/i, price: 200, unit: '1 kg', label: 'KHAPLI MULTIGRAIN ATTA' },
  { pattern: /(besan|gram\s*flour)/i, price: 160, unit: '1 kg', label: 'BESAN' },
  { pattern: /makki|maize|corn\s*flour/i, price: 82, unit: '1 kg', label: 'MAKKI ATTA' },
  { pattern: /bajra/i, price: 80, unit: '1 kg', label: 'BAJRA ATTA' },
  { pattern: /kala\s*chana\s*atta/i, price: 135, unit: '1 kg', label: 'CHANA DESI ATTA' },
  { pattern: /ragi/i, price: 130, unit: '1 kg', label: 'RAGI ATTA' },
  { pattern: /(jowar|jawar|sorghum).*atta/i, price: 100, unit: '1 kg', label: 'JAWAR ATTA' },
  { pattern: /jau|barley/i, price: 90, unit: '1 kg', label: 'JOA ATTA' },
  { pattern: /oats?\s*atta/i, price: 220, unit: '1 kg', label: 'OTS ATTA' },
  { pattern: /rajgira|amaranth/i, price: 250, unit: '1 kg', label: 'RAJGIRA ATTA' },
  { pattern: /rice\s*(flour|atta)/i, price: 220, unit: '1 kg', label: 'RICE ATTA' },
  { pattern: /maida|refined\s*flour/i, price: 55, unit: '1 kg', label: 'MAIDA' },
  { pattern: /whole\s*wheat\s*chakki/i, price: 90, unit: '1 kg', label: 'MP SHARBATI (static)' },
  { pattern: /^multigrain\s*atta$/i, price: 120, unit: '1 kg', label: 'MULTIGRAIN ATTA (static)' },

  // GHEE & OILS
  { pattern: /cow\s*ghee/i, price: 1310, unit: '500 ml', label: 'A2 COW GHEE' },
  { pattern: /buffalo\s*ghee/i, price: 900, unit: '500 ml', label: 'DESI GHEE BUFFALO' },
  { pattern: /coconut\s*oil/i, price: 490, unit: '500 ml', label: 'COCONUT OIL' },
  { pattern: /yellow\s*mustard.*500/i, price: 250, unit: '500 ml', label: 'YELLOW MUSTARD OIL 500ml' },
  { pattern: /yellow\s*mustard.*1\s*l/i, price: 495, unit: '1 L', label: 'YELLOW MUSTARD OIL 1L' },
  { pattern: /black\s*mustard.*500/i, price: 230, unit: '500 ml', label: 'BLACK MUSTARD OIL 500ml' },
  { pattern: /black\s*mustard.*1\s*l/i, price: 450, unit: '1 L', label: 'BLACK MUSTARD OIL 1L' },
  { pattern: /black\s*mustard.*5\s*l/i, price: 2225, unit: '5 L', label: 'BLACK MUSTARD OIL 5L' },
  { pattern: /sesame\s*oil.*500/i, exclude: /black/i, price: 330, unit: '500 ml', label: 'SESAME OIL 500ml' },
  { pattern: /sesame\s*oil.*1\s*l/i, exclude: /black/i, price: 650, unit: '1 L', label: 'SESAME OIL 1L' },
  { pattern: /virgin\s*coconut/i, price: 490, unit: '500 ml', label: 'COCONUT OIL (virgin)' },

  // MASALAS
  { pattern: /garam\s*masala/i, price: 175, unit: '100 g', label: 'GARAM MASALA' },
  { pattern: /kitchen\s*king/i, price: 135, unit: '100 g', label: 'KITCHEN KING MASALA' },
  { pattern: /shahi\s*paneer\s*masala/i, price: 145, unit: '100 g', label: 'SHAHI PANEER MASALA' },
  { pattern: /biryani\s*masala/i, price: 180, unit: '100 g', label: 'BIRYANI MASALA' },
  { pattern: /meat\s*masala/i, price: 160, unit: '100 g', label: 'MEAT MASALA' },
  { pattern: /rajma\s*masala/i, price: 130, unit: '100 g', label: 'RAJMA MASALA' },
  { pattern: /chole.*masala/i, price: 140, unit: '100 g', label: 'CHOLE MASALA' },
  { pattern: /chana\s*masala/i, price: 140, unit: '100 g', label: 'CHANA MASALA' },
  { pattern: /sambar\s*masala/i, price: 120, unit: '100 g', label: 'SAMBAR MASALA' },
  { pattern: /dal\s*makhni\s*masala/i, price: 120, unit: '100 g', label: 'DAL MAKHNI MASALA' },
  { pattern: /dum\s*aloo/i, price: 120, unit: '100 g', label: 'DUM ALOO MASALA' },
  { pattern: /chicken\s*masala/i, price: 145, unit: '100 g', label: 'CHICKEN MASALA' },
  { pattern: /pav\s*bhaji/i, price: 120, unit: '100 g', label: 'PAV BHAJI MASALA' },
  { pattern: /panipuri|gol\s*gappe/i, price: 120, unit: '100 g', label: 'PANIPURI MASALA' },
  { pattern: /sandwich\s*masala/i, price: 120, unit: '100 g', label: 'SANDWICH MASALA' },
  { pattern: /aloo\s*pra(n|)tha/i, price: 130, unit: '100 g', label: 'ALOO PRANTHA MASALA' },
  { pattern: /roasted\s*jeera\s*masala/i, price: 110, unit: '100 g', label: 'ROASTED JEERA MASALA' },
  { pattern: /cha(a|)t\s*masala/i, price: 120, unit: '100 g', label: 'CHAT MASALA' },
  { pattern: /raita\s*masala/i, price: 120, unit: '100 g', label: 'RAITA MASALA' },
  { pattern: /jal\s*jeera/i, price: 100, unit: '100 g', label: 'JAL JEERA MASALA' },
  { pattern: /shikanji/i, price: 100, unit: '100 g', label: 'SHIKANJI' },
  { pattern: /chai\s*masala|tea\s*masala/i, price: 225, unit: '100 g', label: 'CHAI MASALA' },

  // POWDERS
  { pattern: /turmeric.*powder|haldi.*powder/i, price: 40, unit: '100 g', label: 'TURMERIC POWDER' },
  { pattern: /red\s*chilli.*kashmiri.*powder/i, price: 100, unit: '100 g', label: 'RED CHILLI KASHMIRI POWDER' },
  { pattern: /red\s*chilli.*tikhi.*powder/i, price: 80, unit: '100 g', label: 'RED CHILLI TIKHI POWDER' },
  { pattern: /red\s*chilli\s*powder/i, exclude: /kashmiri|tikhi/i, price: 80, unit: '100 g', label: 'RED CHILLI POWDER (generic)' },
  { pattern: /dhaniya\s*powder|coriander\s*powder/i, price: 35, unit: '100 g', label: 'DHANIYA POWDER' },
  { pattern: /black\s*pepper\s*powder/i, price: 172, unit: '100 g', label: 'BLACK PEPPER POWDER' },
  { pattern: /amchur\s*powder|dry\s*mango\s*powder/i, price: 68, unit: '100 g', label: 'AMCHUR POWDER' },
  { pattern: /jeera\s*powder|cumin\s*powder/i, price: 90, unit: '100 g', label: 'JEERA POWDER' },
  { pattern: /elaichi\s*powder|cardamom\s*powder/i, price: 550, unit: '100 g', label: 'ELAICHI POWDER' },
  { pattern: /sonth\s*powder|ginger\s*powder/i, price: 90, unit: '100 g', label: 'SONTH POWDER' },
  { pattern: /saunf\s*powder|fennel\s*powder/i, price: 100, unit: '100 g', label: 'SAUNF POWDER' },
  { pattern: /dalchini\s*powder|cinnamon\s*powder/i, price: 90, unit: '100 g', label: 'DALCHINI POWDER' },
  { pattern: /garlic\s*powder/i, price: 55, unit: '100 g', label: 'GARLIC POWDER' },
  { pattern: /chili?\s*flakes/i, price: 100, unit: '100 g', label: 'CHILI FLAKES' },
  { pattern: /oregano/i, price: 100, unit: '100 g', label: 'OREGANO' },
  { pattern: /black\s*salt|kala\s*namak/i, price: 85, unit: '1 kg', label: 'BLACK SALT' },
  { pattern: /sendha\s*namak|rock\s*salt/i, price: 63, unit: '500 g', label: 'SENDHA NAMAK' },
  { pattern: /coconut\s*powder/i, price: 325, unit: '500 g', label: 'COCONUT POWDER' },

  // WHOLE SPICES
  { pattern: /red\s*chilli.*kashmiri.*whole/i, price: 85, unit: '100 g', label: 'RED CHILLI KASHMIRI WHOLE' },
  { pattern: /red\s*chilli.*tikhi.*whole/i, price: 65, unit: '100 g', label: 'RED CHILLI TIKHI WHOLE' },
  { pattern: /red\s*chilli\s*tadka/i, price: 65, unit: '100 g', label: 'RED CHILLI TADKA' },
  { pattern: /dhaniya\s*sabut|coriander\s*seed/i, price: 34, unit: '100 g', label: 'DHANIYA SABUT' },
  { pattern: /jeera\s*sabut|cumin\s*seed/i, exclude: /shahi/i, price: 80, unit: '100 g', label: 'JEERA SABUT' },
  { pattern: /shahi\s*jeera/i, price: 105, unit: '50 g', label: 'SHAHI JEERA' },
  { pattern: /ajwain/i, price: 90, unit: '100 g', label: 'AJWAIN' },
  { pattern: /black\s*pepper\s*whole|black\s*pepper(?!\s*powder)/i, exclude: /powder/i, price: 78, unit: '50 g', label: 'BLACK PEPPER WHOLE' },
  { pattern: /white\s*pepper/i, price: 130, unit: '100 g', label: 'WHITE PEPPER' },
  { pattern: /methi\s*dana|fenugreek\s*seed/i, price: 55, unit: '200 g', label: 'METHI DANA' },
  { pattern: /dalchini.*indian|dalchini\s*whole|cinnamon\s*stick/i, exclude: /sri\s*lanka|ceylon/i, price: 75, unit: '100 g', label: 'DALCHINI INDIAN' },
  { pattern: /dalchini.*sri\s*lanka|ceylon/i, price: 235, unit: '100 g', label: 'DALCHINI SRI LANKA' },
  { pattern: /saunf\s*whole|fennel\s*seed/i, price: 100, unit: '100 g', label: 'SAUNF WHOLE' },
  { pattern: /sonth(?!\s*powder)/i, exclude: /powder/i, price: 140, unit: '100 g', label: 'SONTH WHOLE' },
  { pattern: /kala\s*til|black\s*sesame/i, exclude: /oil/i, price: 70, unit: '100 g', label: 'KALA TIL' },
  { pattern: /white\s*til|white\s*sesame/i, exclude: /oil/i, price: 75, unit: '100 g', label: 'WHITE TIL' },
  { pattern: /badi\s*elaichi|black\s*cardamom/i, price: 350, unit: '100 g', label: 'BADI ELAICHI' },
  { pattern: /green\s*elaichi|green\s*cardamom/i, price: 700, unit: '100 g', label: 'GREEN ELAICHI' },
  { pattern: /laung|clove/i, price: 200, unit: '100 g', label: 'LAUNG' },
  { pattern: /\brai\b|mustard\s*seed/i, exclude: /oil/i, price: 20, unit: '100 g', label: 'RAI' },
  { pattern: /anardana/i, price: 150, unit: '100 g', label: 'ANARDANA' },
  { pattern: /kasuri\s*methi/i, price: 120, unit: '100 g', label: 'KASURI METHI' },
  { pattern: /tej\s*patta|bay\s*lea/i, price: 100, unit: '100 g', label: 'TEJ PATTA' },
  { pattern: /khas[\s-]*khas|poppy/i, price: 300, unit: '100 g', label: 'KHAS KHAS' },
  { pattern: /gulab\s*patti|rose\s*petal/i, price: 60, unit: '50 g', label: 'GULAB PATTI' },
  { pattern: /javitri|mace/i, price: 230, unit: '50 g', label: 'JAVITRI' },
  { pattern: /jaiphal|nutmeg/i, price: 75, unit: '50 g', label: 'JAIPHAL' },
  { pattern: /star\s*phool|star\s*anise/i, price: 95, unit: '50 g', label: 'STAR PHOOL' },
  { pattern: /kalonji|nigella/i, price: 75, unit: '100 g', label: 'KALONJI' },
  { pattern: /\bhing\b|asafoetida/i, price: 300, unit: '10 g', label: 'HING' },
  { pattern: /\bimli\b|tamarind/i, price: 55, unit: '100 g', label: 'IMLI' },
  { pattern: /pudina|dried?\s*mint/i, price: 85, unit: '100 g', label: 'PUDINA PATTA' },

  // DRY FRUITS
  { pattern: /cashew/i, exclude: /jumbo/i, price: 213, unit: '250 g', label: 'CASHEW 240' },
  { pattern: /kali\s*kishmish|black\s*raisin/i, price: 413, unit: '250 g', label: 'KALI KISHMISH' },
  { pattern: /kishmish|raisin/i, exclude: /kali|black/i, price: 225, unit: '250 g', label: 'KISHMISH GREEN' },
  { pattern: /almond|badam/i, exclude: /gurbandi|oil/i, price: 550, unit: '250 g', label: 'BADAM CALIFORNIA' },
  { pattern: /apricot|khubani|khumani/i, exclude: /candy/i, price: 313, unit: '250 g', label: 'APRICOT KHUMANI' },
  { pattern: /pista|pistachio/i, price: 363, unit: '250 g', label: 'PISTA SHELL' },
  { pattern: /anjeer|fig/i, price: 250, unit: '250 g', label: 'ANJEER PREMIUM' },

  // PULSES
  { pattern: /chana\s*dal/i, exclude: /atta/i, price: 85, unit: '500 g', label: 'CHANA DAL' },
  { pattern: /arhar|toor/i, price: 98, unit: '500 g', label: 'ARHAR DAL' },
  { pattern: /moong\s*(yellow|dal)/i, exclude: /green|whole|chilka/i, price: 88, unit: '500 g', label: 'MOONG YELLOW' },
  { pattern: /moong\s*green\s*whole/i, price: 85, unit: '500 g', label: 'MOONG GREEN WHOLE' },
  { pattern: /moong\s*green.*chilka/i, price: 85, unit: '500 g', label: 'MOONG GREEN CHILKA' },
  { pattern: /kabuli/i, price: 88, unit: '500 g', label: 'KABULI CHOLE' },
  { pattern: /desi\s*chana/i, price: 83, unit: '500 g', label: 'DESI CHANA' },
  { pattern: /masoor\s*red|masoor\s*dal|red\s*lentil/i, exclude: /sabut|whole|malka/i, price: 90, unit: '500 g', label: 'MASOOR RED' },
  { pattern: /urad.*kali.*sabut|urad.*sabut/i, price: 90, unit: '500 g', label: 'URAD KALI SABUT' },
  { pattern: /matki|moth/i, price: 73, unit: '500 g', label: 'MATKI' },
  { pattern: /lobia|black[\s-]*eyed/i, price: 120, unit: '500 g', label: 'LOBIA' },
  { pattern: /soybean/i, exclude: /atta|oil/i, price: 75, unit: '500 g', label: 'SOYBEAN' },
  { pattern: /rajma\s*red|rajma.*small/i, price: 113, unit: '500 g', label: 'RAJMA RED' },
  { pattern: /rajma.*big/i, price: 110, unit: '500 g', label: 'RAJMA BIG' },
  { pattern: /rajma\s*chitra/i, price: 110, unit: '500 g', label: 'RAJMA CHITRA' },
  { pattern: /white\s*peas/i, price: 165, unit: '500 g', label: 'WHITE PEAS' },
  { pattern: /urad.*black.*chilka/i, price: 93, unit: '500 g', label: 'URAD BLACK CHILKA' },
  { pattern: /urad\s*white/i, price: 98, unit: '500 g', label: 'URAD WHITE' },
  { pattern: /urad\s*dal|black\s*gram/i, exclude: /white|chilka|sabut|kali/i, price: 98, unit: '500 g', label: 'URAD DAL' },
  { pattern: /green\s*peas|matar/i, price: 63, unit: '500 g', label: 'GREEN PEAS' },
  { pattern: /mix\s*dal.*sabut/i, price: 105, unit: '500 g', label: 'MIX DAL SABUT' },
  { pattern: /white\s*beans/i, price: 75, unit: '500 g', label: 'WHITE BEANS' },
  { pattern: /masoor.*sabut/i, exclude: /malka/i, price: 88, unit: '500 g', label: 'MASOOR SABUT' },
  { pattern: /mix\s*dal.*chilka/i, price: 93, unit: '500 g', label: 'MIX DAL CHILKA' },
  { pattern: /kulthi/i, price: 76, unit: '500 g', label: 'KULTHI DAL' },
  { pattern: /masoor\s*malk/i, price: 73, unit: '500 g', label: 'MASOOR MALKHA' },

  // SWEETENERS
  { pattern: /jaggery\s*powder|jaggery.*gur.*powder/i, price: 75, unit: '500 g', label: 'JAGGERY POWDER' },
  { pattern: /jaggery|gur/i, exclude: /powder/i, price: 75, unit: '500 g', label: 'JAGGERY' },
  { pattern: /khand|desi\s*khand|raw\s*cane/i, price: 100, unit: '500 g', label: 'KHAND DESI' },
  { pattern: /forest\s*honey/i, price: 899, unit: '650 g', label: 'FOREST HONEY' },

  // GRAINS
  { pattern: /dali(ya|a)(?!.*jar)/i, price: 110, unit: '1 kg', label: 'DALIYA' },
  { pattern: /dali(ya|a).*jar/i, price: 110, unit: '1 kg', label: 'DALIYA JAR' },
  { pattern: /premium\s*basmati/i, price: 180, unit: '1 kg', label: 'PREMIUM BASMATI' },
  { pattern: /brown\s*rice/i, price: 160, unit: '1 kg', label: 'BROWN RICE' },

  // SEEDS
  { pattern: /flax\s*seed|alsi/i, exclude: /oil/i, price: 55, unit: '200 g', label: 'FLAX SEEDS' },
  { pattern: /sesame\s*seed|^til$/i, exclude: /oil/i, price: 75, unit: '100 g', label: 'WHITE TIL (seed)' },
];

async function main() {
  const snap = await getDocs(collection(db, 'products'));
  console.log(`\nFound ${snap.size} products in Firebase\n`);

  const wrong = [];
  const correct = [];
  const unmatched = [];

  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    const name = data.name || '';

    let matched = false;
    for (const rule of OFFICIAL) {
      if (rule.pattern.test(name)) {
        if (rule.exclude && rule.exclude.test(name)) continue;
        matched = true;

        const priceOk = data.price === rule.price;
        const unitOk = data.unit === rule.unit;

        if (!priceOk || !unitOk) {
          wrong.push({
            name,
            current: `₹${data.price} / ${data.unit}`,
            correct: `₹${rule.price} / ${rule.unit}`,
            label: rule.label,
          });
        } else {
          correct.push({ name, price: `₹${data.price} / ${data.unit}` });
        }
        break;
      }
    }
    if (!matched) {
      unmatched.push({ name, price: `₹${data.price} / ${data.unit}`, category: data.category });
    }
  }

  if (wrong.length > 0) {
    console.log('═══════════════════════════════════════════════════════');
    console.log(`  ❌ WRONGLY PRICED (${wrong.length} products)`);
    console.log('═══════════════════════════════════════════════════════');
    for (const w of wrong) {
      console.log(`  ${w.name}`);
      console.log(`    Currently: ${w.current}  →  Should be: ${w.correct}`);
      console.log('');
    }
  }

  console.log('═══════════════════════════════════════════════════════');
  console.log(`  ✓ CORRECTLY PRICED (${correct.length} products)`);
  console.log('═══════════════════════════════════════════════════════');
  for (const c of correct) {
    console.log(`  ✓ ${c.name} — ${c.price}`);
  }

  if (unmatched.length > 0) {
    console.log('\n═══════════════════════════════════════════════════════');
    console.log(`  ? NOT IN PRICE LIST (${unmatched.length} products)`);
    console.log('═══════════════════════════════════════════════════════');
    for (const u of unmatched) {
      console.log(`  ? ${u.name} — ${u.price} [${u.category}]`);
    }
  }

  console.log(`\nSummary: ${correct.length} correct, ${wrong.length} wrong, ${unmatched.length} not matched`);
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
