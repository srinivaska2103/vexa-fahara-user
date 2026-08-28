'use client';

import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema } from '@/schemas/auth.schema';
import { useResetPassword } from '@/hooks/useAuth';
import AuthLayout from '@/app/components/auth/AuthLayout';
import { Loader2, Eye, EyeOff, Lock, KeyRound, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const emailParam = searchParams.get('email');
  const identifier = idParam || emailParam || '';
  
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: resetPassword, isPending } = useResetPassword();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: identifier
    }
  });

  const onSubmit = (data) => {
    resetPassword(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {identifier ? (
        <input type="hidden" {...register('email')} />
      ) : (
        <div>
          <label className="block text-sm font-semibold text-[#2C1810] mb-1.5">Email or User ID</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6F4E37] group-focus-within:text-[#4A2614] transition-colors z-10">
              <Mail size={20} strokeWidth={2.2} />
            </div>
            <input
              {...register('email')}
              type="text"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-[#2C1810] font-medium focus:outline-none focus:ring-2 focus:ring-[#DDB892]"
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-[#2C1810] mb-1.5">6-Digit OTP</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6F4E37] group-focus-within:text-[#4A2614] transition-colors z-10">
            <KeyRound size={20} strokeWidth={2.2} />
          </div>
          <input
            {...register('otp')}
            type="text"
            maxLength={6}
            placeholder="••••••"
            className={cn(
              "w-full pl-11 pr-4 py-3 rounded-xl border bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#DDB892] transition-all text-center tracking-widest font-mono text-lg font-bold text-[#2C1810]",
              errors.otp ? "border-red-400 ring-red-400" : "border-gray-200 hover:border-gray-300"
            )}
          />
        </div>
        {errors.otp && <p className="text-red-500 text-xs mt-1.5 text-center font-medium">{errors.otp.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#2C1810] mb-1.5">New Password</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6F4E37] group-focus-within:text-[#4A2614] transition-colors z-10">
            <Lock size={20} strokeWidth={2.2} />
          </div>
          <input
            {...register('newPassword')}
            type={showNewPassword ? 'text' : 'password'}
            placeholder="Create new password"
            className={cn(
              "w-full pl-11 pr-12 py-3 rounded-xl border bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#DDB892] transition-all font-medium text-[#2C1810]",
              errors.newPassword ? "border-red-400 ring-red-400" : "border-gray-200 hover:border-gray-300"
            )}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6F4E37] hover:text-[#4A2614] transition-colors focus:outline-none z-10"
            tabIndex={-1}
            title={showNewPassword ? "Hide password" : "Show password"}
          >
            {showNewPassword ? <EyeOff size={20} strokeWidth={2.2} /> : <Eye size={20} strokeWidth={2.2} />}
          </button>
        </div>
        {errors.newPassword && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.newPassword.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#2C1810] mb-1.5">Confirm New Password</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6F4E37] group-focus-within:text-[#4A2614] transition-colors z-10">
            <Lock size={20} strokeWidth={2.2} />
          </div>
          <input
            {...register('confirmPassword')}
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm new password"
            className={cn(
              "w-full pl-11 pr-12 py-3 rounded-xl border bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#DDB892] transition-all font-medium text-[#2C1810]",
              errors.confirmPassword ? "border-red-400 ring-red-400" : "border-gray-200 hover:border-gray-300"
            )}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6F4E37] hover:text-[#4A2614] transition-colors focus:outline-none z-10"
            tabIndex={-1}
            title={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <EyeOff size={20} strokeWidth={2.2} /> : <Eye size={20} strokeWidth={2.2} />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.confirmPassword.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full mt-6 bg-[var(--color-primary)] text-white py-2 rounded-lg hover:bg-[var(--color-secondary)] transition-colors flex items-center justify-center font-semibold disabled:opacity-70"
      >
        {isPending ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
        {isPending ? 'Resetting...' : 'Reset Password'}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout title="Reset Password" subtitle="Create a new password for your account">
      <Suspense fallback={<div className="flex justify-center"><Loader2 className="animate-spin text-[var(--color-primary)]" /></div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
