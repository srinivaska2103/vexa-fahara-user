'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '@/schemas/auth.schema';
import { useForgotPassword } from '@/hooks/useAuth';
import AuthLayout from '@/app/components/auth/AuthLayout';
import Link from 'next/link';
import { Loader2, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ForgotPasswordPage() {
  const { mutate: forgotPassword, isPending } = useForgotPassword();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data) => {
    forgotPassword(data);
  };

  return (
    <AuthLayout title="Forgot Password" subtitle="Enter your email to receive a reset code">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#2C1810] mb-1.5">Email</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#6F4E37] transition-colors">
              <Mail size={18} />
            </div>
            <input
              {...register('email')}
              type="email"
              placeholder="Enter your email"
              className={cn(
                "w-full pl-10 pr-4 py-3 rounded-xl border bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#DDB892] focus:bg-white transition-all shadow-sm",
                errors.email ? "border-red-400 ring-red-400" : "border-gray-200 hover:border-gray-300"
              )}
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isPending}
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
  );
}
