# Master Miller - Fresh Milling Store

A modern e-commerce website for Master Miller, an organic food store in Gurugram selling fresh milling products, spices, oils, and more.

## Features

- 🛍️ **E-Commerce Storefront**: Browse products by category with bilingual support (English & Hindi)
- 🛒 **Shopping Cart**: Add items to cart with localStorage persistence
- 💬 **WhatsApp Checkout**: Order directly via WhatsApp with auto-generated message
- 🔐 **Admin Panel**: Manage product catalog with Firebase Authentication
- 📱 **Responsive Design**: Mobile-first design that works on all devices
- 🌿 **Beautiful UI**: Organic, earthy design matching the brand aesthetic
- 🔥 **Firebase Backend**: Real-time database and authentication
- ☁️ **Cloudinary Integration**: Optimized image hosting and delivery

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore + Authentication)
- **Image Hosting**: Cloudinary
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account
- Cloudinary account

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Master-miller
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory:
   ```bash
   cp .env.local.example .env.local
   ```

4. Add your environment variables to `.env.local`:
   - Firebase configuration (from Firebase Console)
   - Cloudinary cloud name and upload preset
   - WhatsApp number and contact details

### Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Enable Authentication (Email/Password)
4. Create an admin user in Authentication
5. Set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Cloudinary Setup

1. Create a Cloudinary account
2. Get your Cloud Name from the dashboard
3. Create an upload preset (Settings > Upload > Upload presets)
4. Add both to your `.env.local` file

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Seeding Sample Products

To populate your database with sample products:

1. Ensure your Firebase environment variables are set
2. Run the seed script:
   ```bash
   npx ts-node scripts/seedProducts.ts
   ```

## Project Structure

```
master-miller/
├── app/                    # Next.js 14 App Router pages
│   ├── page.tsx           # Landing page
│   ├── shop/              # Product catalog
│   ├── cart/              # Shopping cart
│   └── admin/             # Admin panel
├── components/            # React components
│   ├── common/           # Shared components
│   ├── landing/          # Landing page sections
│   ├── shop/             # Shop components
│   ├── cart/             # Cart components
│   └── admin/            # Admin components
├── lib/                  # Utilities and configurations
│   ├── firebase/         # Firebase setup and functions
│   ├── whatsapp.ts      # WhatsApp integration
│   └── cloudinary.ts    # Cloudinary helpers
├── hooks/               # Custom React hooks
├── context/             # React Context providers
├── types/               # TypeScript type definitions
└── scripts/             # Utility scripts

## Admin Panel

Access the admin panel at `/admin/login`

**Features:**
- Add, edit, delete products
- Upload product images to Cloudinary
- Toggle stock status and featured products
- Bilingual product support

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add all environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

## Environment Variables

See `.env.local.example` for all required environment variables.

## Features Roadmap

- [x] Landing page with hero, about, features
- [x] Product catalog with categories
- [x] Shopping cart with localStorage
- [x] WhatsApp checkout integration
- [x] Admin panel with CRUD operations
- [x] Cloudinary image uploads
- [x] Bilingual support (English + Hindi)
- [x] Responsive design
- [ ] Online payment integration
- [ ] Customer accounts
- [ ] Order history tracking
- [ ] Product reviews and ratings

## License

© 2024 Master Miller. All rights reserved.

## Contact

- **Phone**: +91 84040-03000, +91 84040-02000
- **Email**: care@mastermillerstore.com
- **Instagram**: [@mastermillerstore](https://instagram.com/mastermillerstore)
- **Address**: Shop No. 2 & 3, Near Indian Oil Petrol Pump, Nirvana Country, Golf Course Extension Road, Sector 65, Gurugram – 122102, Haryana
