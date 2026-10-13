'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '@/schemas/auth.schema';
import { useForgotPassword } from '@/hooks/useAuth';
import AuthLayout from '@/app/components/auth/AuthLayout';
import MobileAuthWrapper from '@/app/components/auth/MobileAuthWrapper';
import Link from 'next/link';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ForgotPasswordPage() {
  const { mutate: forgotPassword, isPending } = useForgotPassword();
  
  const mobileForm = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const desktopForm = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onMobileSubmit = (data) => {
    forgotPassword(data);
  };

  const onDesktopSubmit = (data) => {
    forgotPassword(data);
  };

  return (
    <>
      {/* ── MOBILE VIEWPORT (<768px): Reference-Inspired Design ── */}
      <div className="block md:hidden">
        <MobileAuthWrapper 
          title="Forgot Password?" 
          subtitle="Enter the email address associated with your Fahara account to recover access."
        >
          <form
            onSubmit={mobileForm.handleSubmit(onMobileSubmit)}
            className="space-y-4 pt-1"
            noValidate
          >
            {/* Email Address Field */}
            <div>
              <label
                htmlFor="mobile-forgot-email"
                className="block text-xs font-bold text-[#6B5B4F] mb-1.5"
              >
                Email Address
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-[#A67B5B] pointer-events-none">
                  <Mail size={16} strokeWidth={2} />
                </div>
                <input
                  id="mobile-forgot-email"
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

            {/* Prominent Primary Pill Button */}
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
                {isPending ? 'Sending Link...' : 'Send Reset Link'}
              </button>
            </div>

            {/* Back to Sign In Link */}
            <div className="pt-3 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#6F4E37] hover:text-[#8D6345] transition-colors underline-offset-2 hover:underline"
              >
                <ArrowLeft size={13} strokeWidth={2.5} />
                Back to Sign In
              </Link>
            </div>
          </form>
        </MobileAuthWrapper>
      </div>

      {/* ── DESKTOP & TABLET VIEWPORT (md: 768px+): Untouched Existing Desktop UI ── */}
      <div className="hidden md:block">
        <AuthLayout title="Forgot Password" subtitle="Enter your email to receive a reset code">
          <form onSubmit={desktopForm.handleSubmit(onDesktopSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-semibold text-[#2C1810] mb-1.5">Email</label>
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
                    "w-full pl-11 pr-4 py-3 rounded-xl border bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#DDB892] focus:bg-white transition-all shadow-sm font-medium text-[#2C1810] placeholder:text-gray-400",
                    desktopForm.formState.errors.email ? "border-red-400 ring-red-400" : "border-gray-200 hover:border-gray-300"
                  )}
                />
              </div>
              {desktopForm.formState.errors.email && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">{desktopForm.formState.errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              suppressHydrationWarning
              className="w-full mt-8 bg-gradient-to-r from-[#4A2614] to-[#B06D44] text-white py-4 rounded-full hover:shadow-[0_10px_25px_-5px_rgba(176,109,68,0.4)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center font-extrabold text-[17px] tracking-wide disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span className="relative flex items-center justify-center">
                {isPending ? <Loader2 className="animate-spin mr-2" size={22} /> : null}
                {isPending ? 'Sending...' : 'Send Reset Code'}
                {!isPending && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                )}
              </span>
            </button>

            <p className="text-center text-sm text-gray-600 mt-8">
              Remember your password?{' '}
              <Link href="/login" className="font-bold text-[#6F4E37] hover:text-[#A67B5B] transition-colors">
                Back to Login
              </Link>
            </p>
          </form>
        </AuthLayout>
      </div>
    </>
  );
}
