import Link from 'next/link';
import Image from 'next/image';

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
      <Image
        src="/logo.png"
        alt="Master Miller"
        width={500}
        height={500}
        className="h-10 w-10"
        priority
      />
    </Link>
  );
}
