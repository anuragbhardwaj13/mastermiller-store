import Hero from '@/components/landing/Hero';
import TrustBadges from '@/components/landing/TrustBadges';
import ShopByCategory from '@/components/landing/ShopByCategory';
import ProductPreview from '@/components/landing/ProductPreview';
import About from '@/components/landing/About';
import Features from '@/components/landing/Features';
import Contact from '@/components/landing/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBadges />
      <ShopByCategory />
      <ProductPreview />
      <About />
      <Features />
      <Contact />
    </>
  );
}
