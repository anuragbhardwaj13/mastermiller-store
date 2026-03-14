'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/firebase/auth';
import { useAuth } from '@/hooks/useAuth';
import Logo from '@/components/common/Logo';
import { Mail, Lock, Eye, EyeOff, Shield, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

// Security: allowed admin emails
const ALLOWED_EMAILS = ['admin@mastermillerstore.com', 'mastermiller65@gmail.com'];
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [lockCountdown, setLockCountdown] = useState(0);
  const router = useRouter();
  const { user, loading } = useAuth();
  const emailRef = useRef<HTMLInputElement>(null);

  // Load lockout state from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem('admin-login-lockout');
    if (stored) {
      const { until, count } = JSON.parse(stored);
      if (until && Date.now() < until) {
        setLockedUntil(until);
        setAttempts(count);
      } else {
        sessionStorage.removeItem('admin-login-lockout');
      }
    }
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    if (!lockedUntil) { setLockCountdown(0); return; }
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000));
      setLockCountdown(remaining);
      if (remaining <= 0) {
        setLockedUntil(null);
        setAttempts(0);
        sessionStorage.removeItem('admin-login-lockout');
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [lockedUntil]);

  useEffect(() => {
    if (user && !loading) {
      router.push('/admin/dashboard');
    }
  }, [user, loading, router]);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const isLocked = lockedUntil !== null && Date.now() < lockedUntil;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLocked) {
      toast.error(`Account locked. Try again in ${lockCountdown} seconds.`);
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Security: check email whitelist before even attempting Firebase auth
    if (!ALLOWED_EMAILS.includes(trimmedEmail)) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_DURATION;
        setLockedUntil(until);
        sessionStorage.setItem('admin-login-lockout', JSON.stringify({ until, count: newAttempts }));
        toast.error('Too many failed attempts. Account locked for 5 minutes.');
      } else {
        toast.error('Invalid credentials');
      }
      return;
    }

    setIsLoading(true);

    const { user: loggedInUser, error } = await signIn(trimmedEmail, password);

    if (error) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_DURATION;
        setLockedUntil(until);
        sessionStorage.setItem('admin-login-lockout', JSON.stringify({ until, count: newAttempts }));
        toast.error('Too many failed attempts. Account locked for 5 minutes.');
      } else {
        // Don't reveal specific error details
        toast.error(`Invalid credentials (${MAX_ATTEMPTS - newAttempts} attempts remaining)`);
      }
      setIsLoading(false);
    } else if (loggedInUser) {
      setAttempts(0);
      sessionStorage.removeItem('admin-login-lockout');
      toast.success('Welcome back!');
      router.push('/admin/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream py-12 px-4">
      <div className="w-full max-w-[420px]">
        {/* Card */}
        <div className="bg-white rounded-2xl border border-tan/50 shadow-lg p-8 sm:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Logo />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-heading text-2xl font-bold text-charcoal mb-1">
              Admin Portal
            </h1>
            <p className="text-sm text-muted">
              Secure access for store management
            </p>
          </div>

          {/* Lockout Warning */}
          {isLocked && (
            <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-700">Account Temporarily Locked</p>
                <p className="text-xs text-red-600 mt-1">
                  Too many failed attempts. Try again in{' '}
                  <span className="font-bold">{Math.floor(lockCountdown / 60)}:{String(lockCountdown % 60).padStart(2, '0')}</span>
                </p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted/60" />
                <input
                  ref={emailRef}
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLocked}
                  className="w-full bg-cream/60 border border-tan/60 rounded-xl py-3 pl-11 pr-4 text-sm text-charcoal placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="admin@mastermillerstore.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-charcoal mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted/60" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLocked}
                  className="w-full bg-cream/60 border border-tan/60 rounded-xl py-3 pl-11 pr-12 text-sm text-charcoal placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted/60 hover:text-charcoal transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isLocked}
              className="w-full bg-primary text-white font-semibold text-sm py-3.5 rounded-full hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Security footer */}
          <div className="mt-6 flex items-center justify-center gap-2 text-muted/60">
            <Shield className="w-3.5 h-3.5" />
            <p className="text-xs">Protected admin access</p>
          </div>
        </div>

        {/* Bottom hint */}
        <p className="text-center text-xs text-muted/50 mt-4">
          Unauthorized access attempts are logged
        </p>
      </div>
    </div>
  );
}
