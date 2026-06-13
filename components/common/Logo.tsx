import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  /** Rendered height in px for the logo lockup. Width scales automatically. */
  height?: number;
}

// Trimmed, transparent-background lockup — actual aspect ratio of the content.
const LOGO_ASPECT = 1051 / 595; // ≈ 1.77

/**
 * Master Miller header lockup (emblem + "MASTER MILLER" wordmark).
 * Uses /header-logo-trimmed.png — tightly cropped with a transparent
 * background so it stays crisp and well-sized on any backdrop.
 */
export default function Logo({ className = '', height = 56 }: LogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center ${className}`}
      aria-label="Master Miller — Home"
    >
      <Image
        src="/header-logo-trimmed.png"
        alt="Master Miller"
        width={Math.round(height * LOGO_ASPECT)}
        height={height}
        style={{ height, width: 'auto' }}
        className="object-contain"
        priority
      />
    </Link>
  );
}
