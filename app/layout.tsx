import type { Metadata, Viewport } from "next";
import { Manrope, Covered_By_Your_Grace } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ScrollToTop from "@/components/common/ScrollToTop";
import PageLoader from "@/components/common/PageLoader";
import ServiceWorker from "@/components/common/ServiceWorker";

// Maati theme fonts: Manrope (headings + body), Covered By Your Grace (taglines)
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const grace = Covered_By_Your_Grace({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-grace",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Master Miller - Fresh Milling Store | Organic Food Items in Gurugram",
  description:
    "Master Miller offers 100% natural, freshly packed organic food items including flour, spices, oils, pulses, and grains. Premium quality traditional milling in Gurugram.",
  keywords:
    "organic food, fresh milling, flour, spices, oils, pulses, grains, Gurugram, natural food, traditional milling",
  authors: [{ name: "Master Miller" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "Master Miller",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "Master Miller - Fresh Milling Store",
    description:
      "100% Natural, Freshly Packed, Premium Quality organic food items",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: "#4BAF47",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${grace.variable}`}>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <CartProvider>
          <ServiceWorker />
          <PageLoader />
          <AnnouncementBar />
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <ScrollToTop />
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#2E6B2C",
                color: "#fff",
                fontFamily: "Manrope, sans-serif",
                borderRadius: "10px",
                padding: "12px 20px",
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
