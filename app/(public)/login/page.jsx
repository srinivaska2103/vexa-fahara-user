'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/schemas/auth.schema';
import { useLogin } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/auth.store';
import AuthLayout from '@/app/components/auth/AuthLayout';
import MobileAuthWrapper from '@/app/components/auth/MobileAuthWrapper';
import Link from 'next/link';
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.push('/customer/cafe');
    }
  }, [isHydrated, isAuthenticated, router]);

  // Separate hook instances for mobile and desktop forms so register refs do not collide
  const mobileForm = useForm({
    resolver: zodResolver(loginSchema),
  });

  const desktopForm = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onMobileSubmit = (data) => {
    login(data);
  };

  const onDesktopSubmit = (data) => {
    login(data);
  };

  return (
    <>
      {/* ── MOBILE VIEWPORT (<768px): Reference-Inspired Design ── */}
      <div className="block md:hidden">
        <MobileAuthWrapper 
          title="Sign in" 
          subtitle="Sign in to your Fahara account."
        >
          <form
            onSubmit={mobileForm.handleSubmit(onMobileSubmit)}
            className="space-y-4 pt-1"
            noValidate
          >
            {/* Email Address Field */}
            <div>
              <label
                htmlFor="mobile-login-email"
                className="block text-xs font-bold text-[#6B5B4F] mb-1.5"
              >
                Email
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-[#A67B5B] pointer-events-none">
                  <Mail size={16} strokeWidth={2} />
                </div>
                <input
                  id="mobile-login-email"
                  {...mobileForm.register('email')}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="demo@email.com"
                  suppressHydrationWarning
                  className={cn(
                    'w-full py-3 pl-9 pr-3 text-sm font-medium text-[#2C1810] placeholder:text-stone-300 rounded-2xl border bg-[#FFFDF9] focus:bg-white focus:outline-none transition-all shadow-2xs',
                    mobileForm.formState.errors.email
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-[#E8DED5] focus:border-[#6F4E37] focus:ring-2 focus:ring-[#DDB892]/30'
                  )}
                />
              </div>
              {mobileForm.formState.errors.email && (
                <p className="text-red-500 text-[11px] mt-1.5 font-semibold">
                  {mobileForm.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="mobile-login-password"
                className="block text-xs font-bold text-[#6B5B4F] mb-1.5"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-[#A67B5B] pointer-events-none">
                  <Lock size={16} strokeWidth={2} />
                </div>
                <input
                  id="mobile-login-password"
                  {...mobileForm.register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="enter your password"
                  suppressHydrationWarning
                  className={cn(
                    'w-full py-3 pl-9 pr-10 text-sm font-medium text-[#2C1810] placeholder:text-stone-300 rounded-2xl border bg-[#FFFDF9] focus:bg-white focus:outline-none transition-all tracking-wide shadow-2xs',
                    mobileForm.formState.errors.password
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-[#E8DED5] focus:border-[#6F4E37] focus:ring-2 focus:ring-[#DDB892]/30'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  suppressHydrationWarning
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A67B5B] hover:text-[#6F4E37] transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {mobileForm.formState.errors.password && (
                <p className="text-red-500 text-[11px] mt-1.5 font-semibold">
                  {mobileForm.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password Row (Exactly matching Reference Image 1) */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    {...mobileForm.register('rememberMe')}
                    className="peer sr-only"
                  />
                  <div className="w-4 h-4 rounded-md border border-[#DDB892] peer-checked:bg-[#6F4E37] peer-checked:border-[#6F4E37] transition-colors flex items-center justify-center bg-[#FFFDF9]">
                    <svg
                      className="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-stone-600 group-hover:text-[#2C1810] transition-colors">
                  Remember Me
                </span>
              </label>

              <Link
                href="/forgot-password"
                className="text-[11px] font-extrabold text-[#A67B5B] hover:text-[#6F4E37] transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Prominent Primary Pill Button (Matching Reference Image 1) */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isPending}
                suppressHydrationWarning
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#6F4E37] via-[#825C40] to-[#A67B5B] text-white text-sm font-extrabold tracking-wide shadow-[0_10px_25px_-5px_rgba(111,78,55,0.4)] active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-70 hover:brightness-105 cursor-pointer"
              >
                {isPending ? (
                  <Loader2 className="animate-spin mr-2" size={16} />
                ) : null}
                {isPending ? 'Signing in...' : 'Sign In'}
              </button>
            </div>

            {/* Bottom Switch Link: Don't have an Account ? Sign up */}
            <div className="pt-3 text-center">
              <p className="text-xs text-stone-500 font-medium">
                Don't have an account?{' '}
                <Link
                  href="/register"
                  className="font-extrabold text-[#6F4E37] hover:text-[#8D6345] transition-colors underline-offset-2 hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </MobileAuthWrapper>
      </div>

      {/* ── DESKTOP & TABLET VIEWPORT (md: 768px+): Untouched Existing Desktop UI ── */}
      <div className="hidden md:block">
        <AuthLayout title="Welcome Back" subtitle="Login to your Fahara account">
          <form
            onSubmit={desktopForm.handleSubmit(onDesktopSubmit)}
            className="space-y-5"
            noValidate
          >
            <div>
              <label className="block text-sm font-semibold text-[#2C1810] mb-1.5">
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6F4E37] group-focus-within:text-[#4A2614] transition-colors z-10">
                  <Mail size={20} strokeWidth={2.2} />
                </div>
                <input
                  {...desktopForm.register('email')}
                  type="email"
                  placeholder="Enter your email"
                  suppressHydrationWarning
                  className={cn(
                    'w-full pl-11 pr-4 py-3 rounded-xl border bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#DDB892] focus:bg-white transition-all shadow-sm font-medium text-[#2C1810] placeholder:text-gray-400',
                    desktopForm.formState.errors.email
                      ? 'border-red-400 ring-red-400'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                />
              </div>
              {desktopForm.formState.errors.email && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">
                  {desktopForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2C1810] mb-1.5">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6F4E37] group-focus-within:text-[#4A2614] transition-colors z-10">
                  <Lock size={20} strokeWidth={2.2} />
                </div>
                <input
                  {...desktopForm.register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  suppressHydrationWarning
                  className={cn(
                    'w-full pl-11 pr-12 py-3 rounded-xl border bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#DDB892] focus:bg-white transition-all shadow-sm font-medium text-[#2C1810] placeholder:text-gray-400',
                    desktopForm.formState.errors.password
                      ? 'border-red-400 ring-red-400'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6F4E37] hover:text-[#4A2614] transition-colors focus:outline-none z-10"
                  tabIndex={-1}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff size={20} strokeWidth={2.2} />
                  ) : (
                    <Eye size={20} strokeWidth={2.2} />
                  )}
                </button>
              </div>
              {desktopForm.formState.errors.password && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">
                  {desktopForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    {...desktopForm.register('rememberMe')}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 rounded border-2 border-gray-300 peer-checked:bg-[#6F4E37] peer-checked:border-[#6F4E37] transition-colors flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <span className="group-hover:text-[#2C1810] transition-colors">
                  Remember me
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-bold text-[#6F4E37] hover:text-[#A67B5B] transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-8 bg-gradient-to-r from-[#4A2614] to-[#B06D44] text-white py-4 rounded-full hover:shadow-[0_10px_25px_-5px_rgba(176,109,68,0.4)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center font-extrabold text-[17px] tracking-wide disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span className="relative flex items-center justify-center">
                {isPending ? (
                  <Loader2 className="animate-spin mr-2" size={22} />
                ) : null}
                {isPending ? 'Logging in...' : 'Login'}
                {!isPending && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                )}
              </span>
            </button>

            <p className="text-center text-sm text-gray-600 mt-8">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="font-bold text-[#6F4E37] hover:text-[#A67B5B] transition-colors"
              >
                Register here
              </Link>
            </p>
          </form>
        </AuthLayout>
      </div>
    </>
  );
}
