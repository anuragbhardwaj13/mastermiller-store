'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { ShoppingCart, Menu, X, Search, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';

// 44px touch target with focus-visible ring for all header icon actions.
const iconBtn =
  'relative w-11 h-11 inline-flex items-center justify-center rounded-full text-charcoal hover:text-primary hover:bg-cream-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40';

function CartBadge({ count }: { count: number }) {
  return (
    <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
      {count > 99 ? '99+' : count}
    </span>
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const leftLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/#about', label: 'Our Story' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href.split('#')[0]) && href.split('#')[0] !== '/';
  };

  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}>
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Left Nav Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8 flex-1">
            {leftLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-bold uppercase tracking-wide transition-colors duration-200 ${
                  isActive(link.href)
                    ? 'text-primary'
                    : 'text-charcoal hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Center Logo */}
          <div className="flex justify-center md:flex-1">
            <Logo height={52} />
          </div>

          {/* Right Icons (Desktop) */}
          <div className="hidden md:flex items-center justify-end gap-1 flex-1">
            <Link href="/shop" className={iconBtn} aria-label="Search products">
              <Search className="w-5 h-5" />
            </Link>
            <Link href="/admin/login" className={iconBtn} aria-label="Account">
              <User className="w-5 h-5" />
            </Link>
            <Link href="/cart" className={iconBtn} aria-label={`Shopping cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}>
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && <CartBadge count={cartCount} />}
            </Link>
          </div>

          {/* Mobile: icons right */}
          <div className="flex md:hidden items-center gap-0.5">
            <Link href="/cart" className={iconBtn} aria-label={`Shopping cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}>
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && <CartBadge count={cartCount} />}
            </Link>
            <button
              className={iconBtn}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-cream-warm mt-4">
            <div className="flex flex-col gap-1">
              {[...leftLinks, { href: '/#contact', label: 'Contact' }].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center min-h-[48px] px-4 text-sm font-bold uppercase tracking-wide rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                    isActive(link.href)
                      ? 'text-primary bg-primary/10'
                      : 'text-charcoal hover:text-primary hover:bg-cream-dark'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
