'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifyOTPSchema } from '@/schemas/auth.schema';
import { useVerifyOTP } from '@/hooks/useAuth';
import AuthLayout from '@/app/components/auth/AuthLayout';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  
  const { mutate: verifyOTP, isPending } = useVerifyOTP();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(verifyOTPSchema),
    defaultValues: {
      email: emailParam
    }
  });

  const onSubmit = (data) => {
    verifyOTP(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-[#2C1810] mb-1.5">Email</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6F4E37] z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </div>
          <input
            {...register('email')}
            type="email"
            readOnly
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 font-medium cursor-not-allowed shadow-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#2C1810] mb-1.5">6-Digit OTP</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6F4E37] group-focus-within:text-[#4A2614] transition-colors z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <input
            {...register('otp')}
            type="text"
            maxLength={6}
            placeholder="••••••"
            className={cn(
              "w-full pl-11 pr-4 py-3 rounded-xl border bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#DDB892] focus:bg-white transition-all shadow-sm tracking-widest font-mono text-lg font-bold text-[#2C1810]",
              errors.otp ? "border-red-400 ring-red-400" : "border-gray-200 hover:border-gray-300"
            )}
          />
        </div>
        {errors.otp && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.otp.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full mt-8 bg-gradient-to-r from-[#4A2614] to-[#B06D44] text-white py-4 rounded-full hover:shadow-[0_10px_25px_-5px_rgba(176,109,68,0.4)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center font-extrabold text-[17px] tracking-wide disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
        <span className="relative flex items-center justify-center">
          {isPending ? <Loader2 className="animate-spin mr-2" size={22} /> : null}
          {isPending ? 'Verifying...' : 'Verify Email'}
          {!isPending && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          )}
        </span>
      </button>
    </form>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthLayout title="Verify Your Email" subtitle="Enter the 6-digit OTP sent to your email">
      <Suspense fallback={<div className="flex justify-center"><Loader2 className="animate-spin text-[var(--color-primary)]" /></div>}>
        <VerifyEmailForm />
      </Suspense>
    </AuthLayout>
  );
}
