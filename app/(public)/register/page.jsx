'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/schemas/auth.schema';
import { useRegister } from '@/hooks/useAuth';
import AuthLayout from '@/app/components/auth/AuthLayout';
import Link from 'next/link';
import { Loader2, User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: registerUser, isPending } = useRegister();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      roleName: 'CUSTOMER'
    }
  });

  const onSubmit = (data) => {
    registerUser(data);
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join Fahara today">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <input type="hidden" {...register('roleName')} value="CUSTOMER" />

        <div>
          <label className="block text-sm font-semibold text-[#2C1810] mb-1.5">Full Name</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6F4E37] group-focus-within:text-[#4A2614] transition-colors z-10">
              <User size={20} strokeWidth={2.2} />
            </div>
            <input
              {...register('name')}
              type="text"
              placeholder="Enter your name"
              className={cn(
                "w-full pl-11 pr-4 py-3 rounded-xl border bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#DDB892] focus:bg-white transition-all shadow-sm font-medium text-[#2C1810] placeholder:text-gray-400",
                errors.name ? "border-red-400 ring-red-400" : "border-gray-200 hover:border-gray-300"
              )}
            />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name.message}</p>}
        </div>

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
          <label className="block text-sm font-semibold text-[#2C1810] mb-1.5">Phone Number</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6F4E37] group-focus-within:text-[#4A2614] transition-colors z-10">
              <Phone size={20} strokeWidth={2.2} />
            </div>
            <input
              {...register('phoneNumber')}
              type="tel"
              placeholder="Enter phone number"
              className={cn(
                "w-full pl-11 pr-4 py-3 rounded-xl border bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#DDB892] focus:bg-white transition-all shadow-sm font-medium text-[#2C1810] placeholder:text-gray-400",
                errors.phoneNumber ? "border-red-400 ring-red-400" : "border-gray-200 hover:border-gray-300"
              )}
            />
          </div>
          {errors.phoneNumber && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.phoneNumber.message}</p>}
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
              placeholder="Create a password"
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

        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-8 bg-gradient-to-r from-[#4A2614] to-[#B06D44] text-white py-4 rounded-full hover:shadow-[0_10px_25px_-5px_rgba(176,109,68,0.4)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center font-extrabold text-[17px] tracking-wide disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none relative group overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          <span className="relative flex items-center justify-center">
            {isPending ? <Loader2 className="animate-spin mr-2" size={22} /> : null}
            {isPending ? 'Creating Account...' : 'Register'}
            {!isPending && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </span>
        </button>

        <p className="text-center text-sm text-gray-600 mt-8">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-[#6F4E37] hover:text-[#A67B5B] transition-colors">
            Login here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
