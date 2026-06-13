import { RotateCcw, Truck, Clock } from 'lucide-react';

/**
 * Trust badges row — recreates Maati's hero icon-box strip:
 * three left-aligned icon boxes, each with a headline + sub-line.
 * (Return Policy / Free Shipping / Fast Delivery)
 */
const badges = [
  {
    icon: RotateCcw,
    title: 'Return Policy',
    desc: 'Money Back Guarantee',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    desc: 'On All Orders Over ₹499',
  },
  {
    icon: Clock,
    title: 'Fast Delivery',
    desc: 'Deliver Within 5 Days',
  },
];

export default function TrustBadges() {
  return (
    <section className="bg-white border-b border-cream-warm">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {badges.map((badge) => (
            <div
              key={badge.title}
              className="flex items-center gap-4 sm:justify-center"
            >
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary shrink-0">
                <badge.icon className="w-6 h-6" />
              </span>
              <div>
                <h3 className="font-heading text-lg font-bold text-charcoal leading-tight">
                  {badge.title}
                </h3>
                <p className="text-sm text-muted">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
