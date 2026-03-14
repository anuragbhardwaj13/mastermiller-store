# Master Miller - Setup & Deployment Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Firebase Setup](#firebase-setup)
3. [Cloudinary Setup](#cloudinary-setup)
4. [Local Development](#local-development)
5. [Seeding Products](#seeding-products)
6. [Deployment to Vercel](#deployment-to-vercel)
7. [Post-Deployment](#post-deployment)

---

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- npm or yarn package manager
- A Firebase account (free tier works)
- A Cloudinary account (free tier works)
- A Vercel account (optional, for deployment)

---

## Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name your project: "master-miller" (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create Project"

### Step 2: Enable Firestore Database

1. In Firebase Console, go to "Build" > "Firestore Database"
2. Click "Create Database"
3. Choose "Start in production mode"
4. Select your preferred location (e.g., asia-south1 for India)
5. Click "Enable"

### Step 3: Set Firestore Security Rules

1. Go to "Firestore Database" > "Rules" tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products: Read for all, write only for authenticated admins
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Click "Publish"

### Step 4: Enable Authentication

1. Go to "Build" > "Authentication"
2. Click "Get Started"
3. Click on "Email/Password" provider
4. Enable it and click "Save"

### Step 5: Create Admin User

1. Go to "Authentication" > "Users" tab
2. Click "Add User"
3. Enter admin email (e.g., `admin@mastermillerstore.com`)
4. Enter a strong password
5. Click "Add User"

**IMPORTANT**: Save these credentials - you'll need them to access the admin panel!

### Step 6: Get Firebase Config

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (`</>`) to add a web app
4. Register app with nickname "Master Miller Website"
5. Copy the firebaseConfig object

You'll need these values:
```
apiKey: "..."
authDomain: "..."
projectId: "..."
storageBucket: "..."
messagingSenderId: "..."
appId: "..."
```

---

## Cloudinary Setup

### Step 1: Create Account

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Verify your email

### Step 2: Get Cloud Name

1. Go to the Dashboard
2. Find your "Cloud Name" (e.g., `dk1abcdefg`)
3. Copy it - you'll need this

### Step 3: Create Upload Preset

1. Go to Settings (gear icon) > Upload
2. Scroll to "Upload presets"
3. Click "Add upload preset"
4. Configure:
   - **Preset name**: `master-miller-products`
   - **Signing Mode**: Unsigned
   - **Folder**: `master-miller/products`
   - **Format**: Auto
5. Save

### Step 4: Note Your Credentials

You'll need:
- **Cloud Name**: Your cloud name from step 2
- **Upload Preset**: `master-miller-products` (or what you named it)

---

## Local Development

### Step 1: Install Dependencies

```bash
cd Master-miller
npm install
```

### Step 2: Create Environment File

```bash
cp .env.local.example .env.local
```

### Step 3: Configure Environment Variables

Open `.env.local` and fill in all the values:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=master-miller-products

# Contact Information (already filled)
NEXT_PUBLIC_WHATSAPP_NUMBER=919053140726
NEXT_PUBLIC_PHONE_1=918404003000
NEXT_PUBLIC_PHONE_2=918404002000
NEXT_PUBLIC_EMAIL=care@mastermillerstore.com
NEXT_PUBLIC_INSTAGRAM=@mastermillerstore
```

### Step 4: Start Development Server

```bash
npm run dev
```

The website will be available at [http://localhost:3000](http://localhost:3000)

---

## Seeding Products

To populate your database with sample products:

### Option 1: Manual Seeding (Recommended)

1. Log in to the admin panel at `http://localhost:3000/admin/login`
2. Use your Firebase admin credentials
3. Click "Add Product"
4. Fill in product details (name, category, price, etc.)
5. Upload an image using Cloudinary widget
6. Save product

### Option 2: Script Seeding

If you want to quickly populate with sample data:

```bash
npx ts-node scripts/seedProducts.ts
```

This will add 15 sample products with placeholder images.

---

## Deployment to Vercel

### Step 1: Push to GitHub

1. Create a new GitHub repository
2. Push your code:

```bash
git init
git add .
git commit -m "Initial commit: Master Miller website"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [Vercel](https://vercel.com/)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Add Environment Variables

In Vercel project settings:

1. Go to "Settings" > "Environment Variables"
2. Add all variables from your `.env.local` file
3. Make sure to add them for **all environments** (Production, Preview, Development)

### Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Your website will be live at `https://your-project.vercel.app`

### Step 5: Custom Domain (Optional)

1. Go to "Settings" > "Domains"
2. Add your custom domain (e.g., `mastermillerstore.com`)
3. Follow Vercel's DNS configuration instructions

---

## Post-Deployment

### 1. Test User Flow

- ✅ Browse products on landing page
- ✅ Filter products by category
- ✅ Add items to cart
- ✅ View cart and adjust quantities
- ✅ Click "Order on WhatsApp" - verify message format
- ✅ Check cart persists after page reload

### 2. Test Admin Panel

- ✅ Log in to admin panel at `/admin/login`
- ✅ Add a new product with image
- ✅ Edit existing product
- ✅ Delete a product
- ✅ Toggle featured status
- ✅ Mark product out of stock

### 3. Mobile Testing

- ✅ Test on mobile device (or Chrome DevTools mobile view)
- ✅ Verify navigation menu works
- ✅ Check cart icon in header
- ✅ Test WhatsApp redirect on mobile

### 4. SEO Verification

- ✅ View page source - check meta tags
- ✅ Run Lighthouse audit (aim for 90+ score)
- ✅ Test social media sharing (Open Graph tags)

---

## Troubleshooting

### Issue: "Firebase: Error (auth/unauthorized-domain)"

**Solution**: Add your deployment domain to Firebase authorized domains:
1. Go to Firebase Console > Authentication > Settings
2. Add your Vercel domain to "Authorized domains"

### Issue: Images not loading from Cloudinary

**Solution**:
1. Check your Cloudinary cloud name is correct
2. Verify upload preset exists and is set to "Unsigned"
3. Check browser console for CORS errors

### Issue: Admin login not working

**Solution**:
1. Verify admin user exists in Firebase Authentication
2. Check Firebase Authentication is enabled
3. Ensure environment variables are set correctly
4. Clear browser cookies and try again

### Issue: Products not showing on website

**Solution**:
1. Check Firestore security rules allow public read
2. Verify products collection has data
3. Check browser console for errors
4. Ensure Firebase config is correct

---

## Support & Contact

For issues or questions:
- **Email**: care@mastermillerstore.com
- **Phone**: +91 84040-03000

---

## Next Steps

After successful deployment:

1. **Add Real Product Images**: Replace placeholder images with actual product photos
2. **Populate Products**: Add all your real products through the admin panel
3. **Test Orders**: Place test orders via WhatsApp to verify workflow
4. **Monitor Analytics**: Set up Google Analytics (optional)
5. **Backup Data**: Regularly export Firestore data
6. **Update Content**: Customize landing page text and images

---

**Congratulations! Your Master Miller website is now live! 🎉**
