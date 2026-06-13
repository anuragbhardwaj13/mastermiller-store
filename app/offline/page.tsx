import Link from 'next/link';
import Image from 'next/image';
import { WifiOff } from 'lucide-react';

export const metadata = {
  title: 'Offline — Master Miller',
};

export default function OfflinePage() {
  return (
    <div className="min-h-[70vh] bg-cream flex items-center justify-center px-4">
      <div className="text-center max-w-sm py-16">
        <Image
          src="/header-logo-trimmed.png"
          alt="Master Miller"
          width={180}
          height={102}
          className="h-14 w-auto mx-auto mb-8 object-contain"
        />
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
          <WifiOff className="w-9 h-9 text-primary" />
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-charcoal mb-3">
          You&apos;re offline
        </h1>
        <p className="text-muted mb-8">
          We couldn&apos;t reach the internet. Check your connection and try
          again — pages you&apos;ve already visited will still work.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center min-h-[52px] px-8 rounded-btn bg-primary text-white font-bold hover:bg-accent transition-colors"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}
