'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/schemas/auth.schema';
import { useRegister } from '@/hooks/useAuth';
import AuthLayout from '@/app/components/auth/AuthLayout';
import MobileAuthWrapper from '@/app/components/auth/MobileAuthWrapper';
import Link from 'next/link';
import { Loader2, User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const { mutate: registerUser, isPending } = useRegister();

  // Separate mobile and desktop forms so React Hook Form ref registration is clean
  const mobileForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      roleName: 'CUSTOMER',
    },
  });

  const desktopForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      roleName: 'CUSTOMER',
    },
  });

  const onMobileSubmit = (data) => {
    if (confirmPassword && confirmPassword !== data.password) {
      setConfirmPasswordError("Passwords don't match");
      return;
    }
    setConfirmPasswordError('');
    registerUser(data);
  };

  const onDesktopSubmit = (data) => {
    registerUser(data);
  };

  return (
    <>
      {/* ── MOBILE VIEWPORT (<768px): Reference-Inspired Design ── */}
      <div className="block md:hidden">
        <MobileAuthWrapper 
          title="Create Account"
          subtitle="Join Fahara and discover places for your special moments."
        >
          <form
            onSubmit={mobileForm.handleSubmit(onMobileSubmit)}
            className="space-y-3.5 pt-1"
            noValidate
          >
            <input type="hidden" {...mobileForm.register('roleName')} value="CUSTOMER" />

            {/* Full Name Field */}
            <div>
              <label
                htmlFor="mobile-reg-name"
                className="block text-xs font-bold text-[#6B5B4F] mb-1.5"
              >
                Full Name
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-[#A67B5B] pointer-events-none">
                  <User size={16} strokeWidth={2} />
                </div>
                <input
                  id="mobile-reg-name"
                  {...mobileForm.register('name')}
                  type="text"
                  autoComplete="name"
                  placeholder="Simon Njege"
                  suppressHydrationWarning
                  className={cn(
                    'w-full py-3 pl-9 pr-3 text-sm font-medium text-[#2C1810] placeholder:text-stone-300 rounded-2xl border bg-[#FFFDF9] focus:bg-white focus:outline-none transition-all shadow-2xs',
                    mobileForm.formState.errors.name
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-[#E8DED5] focus:border-[#6F4E37] focus:ring-2 focus:ring-[#DDB892]/30'
                  )}
                />
              </div>
              {mobileForm.formState.errors.name && (
                <p className="text-red-500 text-[11px] mt-1.5 font-semibold">
                  {mobileForm.formState.errors.name.message}
                </p>
              )}
            </div>

            {/* Email Address Field */}
            <div>
              <label
                htmlFor="mobile-reg-email"
                className="block text-xs font-bold text-[#6B5B4F] mb-1.5"
              >
                Email Address
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-[#A67B5B] pointer-events-none">
                  <Mail size={16} strokeWidth={2} />
                </div>
                <input
                  id="mobile-reg-email"
                  {...mobileForm.register('email')}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="simonnjege@gmail.com"
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

            {/* Phone Number Field */}
            <div>
              <label
                htmlFor="mobile-reg-phone"
                className="block text-xs font-bold text-[#6B5B4F] mb-1.5"
              >
                Phone Number
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-[#A67B5B] pointer-events-none">
                  <Phone size={16} strokeWidth={2} />
                </div>
                <input
                  id="mobile-reg-phone"
                  {...mobileForm.register('phoneNumber')}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="9876543210"
                  suppressHydrationWarning
                  className={cn(
                    'w-full py-3 pl-9 pr-3 text-sm font-medium text-[#2C1810] placeholder:text-stone-300 rounded-2xl border bg-[#FFFDF9] focus:bg-white focus:outline-none transition-all shadow-2xs',
                    mobileForm.formState.errors.phoneNumber
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-[#E8DED5] focus:border-[#6F4E37] focus:ring-2 focus:ring-[#DDB892]/30'
                  )}
                />
              </div>
              {mobileForm.formState.errors.phoneNumber && (
                <p className="text-red-500 text-[11px] mt-1.5 font-semibold">
                  {mobileForm.formState.errors.phoneNumber.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="mobile-reg-password"
                className="block text-xs font-bold text-[#6B5B4F] mb-1.5"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-[#A67B5B] pointer-events-none">
                  <Lock size={16} strokeWidth={2} />
                </div>
                <input
                  id="mobile-reg-password"
                  {...mobileForm.register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
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

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="mobile-reg-confirm-password"
                className="block text-xs font-bold text-[#6B5B4F] mb-1.5"
              >
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-[#A67B5B] pointer-events-none">
                  <Lock size={16} strokeWidth={2} />
                </div>
                <input
                  id="mobile-reg-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  suppressHydrationWarning
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (confirmPasswordError) setConfirmPasswordError('');
                  }}
                  className={cn(
                    'w-full py-3 pl-9 pr-10 text-sm font-medium text-[#2C1810] placeholder:text-stone-300 rounded-2xl border bg-[#FFFDF9] focus:bg-white focus:outline-none transition-all tracking-wide shadow-2xs',
                    confirmPasswordError
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-[#E8DED5] focus:border-[#6F4E37] focus:ring-2 focus:ring-[#DDB892]/30'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  suppressHydrationWarning
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A67B5B] hover:text-[#6F4E37] transition-colors p-1"
                >
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {confirmPasswordError && (
                <p className="text-red-500 text-[11px] mt-1.5 font-semibold">
                  {confirmPasswordError}
                </p>
              )}
            </div>

            {/* Single Prominent Primary Action Button */}
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
                {isPending ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>

            {/* Bottom Switch Link: Already have an account ? Sign In */}
            <div className="pt-3 text-center">
              <p className="text-xs text-stone-500 font-medium">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-extrabold text-[#6F4E37] hover:text-[#8D6345] transition-colors underline-offset-2 hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </MobileAuthWrapper>
      </div>

      {/* ── DESKTOP & TABLET VIEWPORT (md: 768px+): Untouched Existing Desktop UI ── */}
      <div className="hidden md:block">
        <AuthLayout title="Create Account" subtitle="Join Fahara today">
          <form
            onSubmit={desktopForm.handleSubmit(onDesktopSubmit)}
            className="space-y-4"
            noValidate
          >
            <input type="hidden" {...desktopForm.register('roleName')} value="CUSTOMER" />

            <div>
              <label className="block text-sm font-semibold text-[#2C1810] mb-1.5">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6F4E37] group-focus-within:text-[#4A2614] transition-colors z-10">
                  <User size={20} strokeWidth={2.2} />
                </div>
                <input
                  {...desktopForm.register('name')}
                  type="text"
                  placeholder="Enter your name"
                  className={cn(
                    'w-full pl-11 pr-4 py-3 rounded-xl border bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#DDB892] focus:bg-white transition-all shadow-sm font-medium text-[#2C1810] placeholder:text-gray-400',
                    desktopForm.formState.errors.name
                      ? 'border-red-400 ring-red-400'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                />
              </div>
              {desktopForm.formState.errors.name && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">
                  {desktopForm.formState.errors.name.message}
                </p>
              )}
            </div>

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
                Phone Number
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6F4E37] group-focus-within:text-[#4A2614] transition-colors z-10">
                  <Phone size={20} strokeWidth={2.2} />
                </div>
                <input
                  {...desktopForm.register('phoneNumber')}
                  type="tel"
                  placeholder="Enter phone number"
                  className={cn(
                    'w-full pl-11 pr-4 py-3 rounded-xl border bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#DDB892] focus:bg-white transition-all shadow-sm font-medium text-[#2C1810] placeholder:text-gray-400',
                    desktopForm.formState.errors.phoneNumber
                      ? 'border-red-400 ring-red-400'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                />
              </div>
              {desktopForm.formState.errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">
                  {desktopForm.formState.errors.phoneNumber.message}
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
                  placeholder="Create a password"
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
                {isPending ? 'Creating Account...' : 'Register'}
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
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-bold text-[#6F4E37] hover:text-[#A67B5B] transition-colors"
              >
                Login here
              </Link>
            </p>
          </form>
        </AuthLayout>
      </div>
    </>
  );
}
