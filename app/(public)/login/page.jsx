'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/schemas/auth.schema';
import { useLogin } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/auth.store';
import AuthLayout from '@/app/components/auth/AuthLayout';
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

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    login(data);
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Login to your Fahara account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-[#2C1810] mb-1.5">Email</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6F4E37] group-focus-within:text-[#4A2614] transition-colors z-10">
              <Mail size={20} strokeWidth={2.2} />
            </div>
            <input
              {...register('email')}
              type="email"
              placeholder="Enter your email"
              className={cn(
                "w-full pl-11 pr-4 py-3 rounded-xl border bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#DDB892] focus:bg-white transition-all shadow-sm font-medium text-[#2C1810] placeholder:text-gray-400",
                errors.email ? "border-red-400 ring-red-400" : "border-gray-200 hover:border-gray-300"
              )}
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#2C1810] mb-1.5">Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6F4E37] group-focus-within:text-[#4A2614] transition-colors z-10">
              <Lock size={20} strokeWidth={2.2} />
            </div>
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className={cn(
                "w-full pl-11 pr-12 py-3 rounded-xl border bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#DDB892] focus:bg-white transition-all shadow-sm font-medium text-[#2C1810] placeholder:text-gray-400",
                errors.password ? "border-red-400 ring-red-400" : "border-gray-200 hover:border-gray-300"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6F4E37] hover:text-[#4A2614] transition-colors focus:outline-none z-10"
              tabIndex={-1}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} strokeWidth={2.2} /> : <Eye size={20} strokeWidth={2.2} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between mt-2">
          <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer group">
            <div className="relative flex items-center">
              <input type="checkbox" {...register('rememberMe')} className="peer sr-only" />
              <div className="w-5 h-5 rounded border-2 border-gray-300 peer-checked:bg-[#6F4E37] peer-checked:border-[#6F4E37] transition-colors flex items-center justify-center">
                <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <span className="group-hover:text-[#2C1810] transition-colors">Remember me</span>
          </label>
          <Link href="/forgot-password" className="text-sm font-bold text-[#6F4E37] hover:text-[#A67B5B] transition-colors">
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
            {isPending ? <Loader2 className="animate-spin mr-2" size={22} /> : null}
            {isPending ? 'Logging in...' : 'Login'}
            {!isPending && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </span>
        </button>

        <p className="text-center text-sm text-gray-600 mt-8">
          Don't have an account?{' '}
          <Link href="/register" className="font-bold text-[#6F4E37] hover:text-[#A67B5B] transition-colors">
            Register here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
