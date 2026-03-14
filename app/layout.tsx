import type { Metadata } from "next";
import { Cormorant_Garamond, Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ScrollToTop from "@/components/common/ScrollToTop";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
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
  openGraph: {
    title: "Master Miller - Fresh Milling Store",
    description:
      "100% Natural, Freshly Packed, Premium Quality organic food items",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${poppins.variable}`}>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <CartProvider>
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
                background: "#65371B",
                color: "#fff",
                fontFamily: "Poppins, sans-serif",
                borderRadius: "50px",
                padding: "12px 20px",
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
