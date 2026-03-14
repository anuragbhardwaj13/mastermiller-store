import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base = 'font-body font-medium rounded-full transition-all duration-200 inline-flex items-center justify-center tracking-wide';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark disabled:bg-muted disabled:cursor-not-allowed',
    secondary: 'bg-secondary text-white hover:bg-secondary-dark disabled:bg-muted disabled:cursor-not-allowed',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white disabled:border-muted disabled:text-muted disabled:cursor-not-allowed',
    ghost: 'text-primary hover:bg-cream disabled:text-muted disabled:cursor-not-allowed',
  };

  const sizes = {
    sm: 'px-5 py-2 text-sm',
    md: 'px-7 py-2.5 text-sm',
    lg: 'px-9 py-3.5 text-base',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className} ${
        (disabled || isLoading) ? 'opacity-60 cursor-not-allowed' : ''
      }`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}
