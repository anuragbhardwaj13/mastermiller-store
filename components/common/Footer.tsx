import Link from "next/link";
import { MapPin, Phone, Mail, Instagram, Clock } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white/70">
      <div className="container-custom pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4 lg:col-span-1">
            <div className="bg-white/10 backdrop-blur px-4 py-3 rounded-xl inline-block">
              <Logo className="[&_span]:text-white [&_.text-muted]:text-white/60" />
            </div>
            <p className="text-sm leading-relaxed text-white/60">
              100% Natural, Freshly Packed, Premium Quality organic food items
              for your healthy lifestyle.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-white text-xl font-semibold mb-5">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "Home" },
                { href: "/shop", label: "Shop" },
                { href: "/#about", label: "About Us" },
                { href: "/cart", label: "Cart" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-tan transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-white text-xl font-semibold mb-5">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 mt-0.5 shrink-0 text-tan" />
                <div className="text-sm text-white/60 space-y-1">
                  <a
                    href="tel:+918404003000"
                    className="hover:text-tan transition-colors block"
                  >
                    +91 84040-03000
                  </a>
                  <a
                    href="tel:+918404002000"
                    className="hover:text-tan transition-colors block"
                  >
                    +91 84040-02000
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-tan" />
                <a
                  href="mailto:mastermiller65@gmail.com"
                  className="text-sm text-white/60 hover:text-tan transition-colors"
                >
                  mastermiller65@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Instagram className="w-4 h-4 mt-0.5 shrink-0 text-tan" />
                <a
                  href="https://www.instagram.com/mastermiller_store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/60 hover:text-tan transition-colors"
                >
                  @mastermiller_store
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-tan" />
                <span className="text-sm text-white/60">
                  Mon–Sun, 10am – 9pm
                </span>
              </li>
            </ul>
          </div>

          {/* Address */}
          <div>
            <h3 className="font-heading text-white text-xl font-semibold mb-5">
              Visit Us
            </h3>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-tan" />
              <address className="not-italic text-sm text-white/60 leading-relaxed">
                Shop No. 2 & 3, Near Indian Oil Petrol Pump,
                <br />
                Golf Course Extension Road,
                <br />
                Sector 65, Gurugram – 122102,
                <br />
                Haryana, India
              </address>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/40">
          <p>&copy; {currentYear} Master Miller. All rights reserved.</p>
          <p>GSTIN: 06ABFFB2229N1ZE</p>
        </div>
      </div>
    </footer>
  );
}
