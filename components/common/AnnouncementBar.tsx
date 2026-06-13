'use client';

import { useState, useEffect } from 'react';
import { Phone, Mail } from 'lucide-react';

/**
 * Header top bar — recreates Maati's thin announcement bar above the main
 * header: a rotating promo message on the left and contact details on the
 * right. Uses the brand purple background.
 */
const messages = [
  'Get Pure & 100% Natural Products — Freshly Milled to Order',
  'Free Shipping On All Orders Over ₹499',
  'Traditionally Milled • No Chemicals • No Preservatives',
  'Visit Our Store in Sector 65, Gurugram',
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-primary text-white text-xs">
      <div className="container-custom flex items-center justify-between h-9">
        {/* Rotating promo message (carousel) */}
        <div className="relative flex-1 overflow-hidden h-9">
          {messages.map((msg, i) => (
            <span
              key={msg}
              className={`absolute inset-0 flex items-center font-medium tracking-wide transition-all duration-500 ${
                i === index
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}
            >
              {msg}
            </span>
          ))}
        </div>

        {/* Contact info (hidden on small screens) */}
        <div className="hidden md:flex items-center gap-5 shrink-0 pl-4">
          <a
            href="tel:+918404003000"
            className="flex items-center gap-1.5 hover:text-amber transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            +91 84040-03000
          </a>
          <a
            href="mailto:mastermiller65@gmail.com"
            className="flex items-center gap-1.5 hover:text-amber transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            mastermiller65@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
