'use client';

import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema } from '@/schemas/auth.schema';
import { useResetPassword } from '@/hooks/useAuth';
import AuthLayout from '@/app/components/auth/AuthLayout';
import { Loader2, Eye, EyeOff } from 'lucide-react';
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
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Email or User ID</label>
          <input
            {...register('email')}
            type="text"
            className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-white text-gray-800"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">6-Digit OTP</label>
        <input
          {...register('otp')}
          type="text"
          maxLength={6}
          placeholder="••••••"
          className={cn(
            "w-full px-4 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all text-center tracking-widest font-mono text-lg",
            errors.otp ? "border-[var(--color-danger)]" : "border-[var(--color-border)]"
          )}
        />
        {errors.otp && <p className="text-[var(--color-danger)] text-xs mt-1 text-center">{errors.otp.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">New Password</label>
        <div className="relative">
          <input
            {...register('newPassword')}
            type={showNewPassword ? 'text' : 'password'}
            placeholder="Create new password"
            className={cn(
              "w-full px-4 py-2 pr-10 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all",
              errors.newPassword ? "border-[var(--color-danger)]" : "border-[var(--color-border)]"
            )}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
            tabIndex={-1}
            title={showNewPassword ? "Hide password" : "Show password"}
          >
            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.newPassword && <p className="text-[var(--color-danger)] text-xs mt-1">{errors.newPassword.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Confirm New Password</label>
        <div className="relative">
          <input
            {...register('confirmPassword')}
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm new password"
            className={cn(
              "w-full px-4 py-2 pr-10 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all",
              errors.confirmPassword ? "border-[var(--color-danger)]" : "border-[var(--color-border)]"
            )}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
            tabIndex={-1}
            title={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-[var(--color-danger)] text-xs mt-1">{errors.confirmPassword.message}</p>}
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
