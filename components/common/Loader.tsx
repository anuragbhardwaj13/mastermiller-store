import Image from 'next/image';

interface LoaderProps {
  /** Full-screen overlay vs inline block */
  fullScreen?: boolean;
  /** Optional label shown under the logo */
  label?: string;
  className?: string;
}

/**
 * Branded loader — Master Miller logo inside a spinning purple ring.
 * Uses /logo.png (the official brand mark) so loading states stay on-brand.
 */
export default function Loader({
  fullScreen = false,
  label,
  className = '',
}: LoaderProps) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-20 h-20">
        {/* Spinning brand ring */}
        <span className="absolute inset-0 rounded-full border-[3px] border-cream-warm border-t-primary border-r-accent animate-spin" />
        {/* Master Miller logo centered */}
        <span className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Master Miller"
            width={48}
            height={48}
            className="h-11 w-11 object-contain"
            priority
          />
        </span>
      </div>
      {label && (
        <p className="text-sm font-medium tracking-wide text-muted">{label}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center py-20 ${className}`}>
      {spinner}
    </div>
  );
}
