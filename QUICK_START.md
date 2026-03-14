# Master Miller - Quick Start Guide ⚡

Get your website running in 10 minutes!

## 1. Install Dependencies (2 min)

```bash
npm install
```

## 2. Setup Firebase (3 min)

1. Create Firebase project at https://console.firebase.google.com/
2. Enable Firestore Database (production mode)
3. Enable Authentication > Email/Password
4. Create admin user in Authentication
5. Copy Firebase config from Project Settings

## 3. Setup Cloudinary (2 min)

1. Sign up at https://cloudinary.com/
2. Get your Cloud Name from dashboard
3. Create upload preset: Settings > Upload > Add upload preset
   - Name: `master-miller-products`
   - Signing Mode: Unsigned

## 4. Configure Environment (1 min)

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and paste your Firebase and Cloudinary credentials.

## 5. Run Development Server (1 min)

```bash
npm run dev
```

Open http://localhost:3000

## 6. Access Admin Panel (1 min)

1. Go to http://localhost:3000/admin/login
2. Login with your Firebase admin credentials
3. Start adding products!

---

## 🎯 Key Features

### Customer Side:
- **Landing Page**: Hero, About, Features, Contact sections
- **Shop Page**: Browse products with category filters
- **Cart**: Add items, stored in localStorage
- **WhatsApp Checkout**: Order directly via WhatsApp

### Admin Side:
- **Dashboard**: View all products with stats
- **Add/Edit Products**: Full CRUD operations
- **Image Upload**: Upload to Cloudinary directly
- **Bilingual Support**: English + Hindi product names

---

## 📱 Test the Flow

### Customer Journey:
1. Visit homepage
2. Click "Shop Now"
3. Filter by category (Flour, Spices, etc.)
4. Add items to cart
5. Go to cart
6. Click "Order on WhatsApp"
7. WhatsApp opens with formatted order!

### Admin Journey:
1. Login at `/admin/login`
2. Click "Add Product"
3. Fill product details (English + Hindi)
4. Upload image
5. Save!

---

## 🚀 Deploy to Vercel

1. Push code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions.

---

## 📞 Need Help?

- **Complete Setup Guide**: See `SETUP_GUIDE.md`
- **README**: See `README.md`
- **Contact**: care@mastermillerstore.com

Happy selling! 🌾
