'use client';

import { useState } from 'react';
import LegalSupportLayout from '@/app/components/layout/LegalSupportLayout';
import { 
  RefreshCw, Clock, AlertTriangle, CheckCircle2, XCircle, 
  HelpCircle, ArrowRight, ShieldCheck, CreditCard, Mail
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function CancellationPolicyPage() {
  return (
    <LegalSupportLayout breadcrumbs={['Cancellation Policy']}>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF8F0] border border-[#DDB892]/60 text-[#6F4E37] text-xs font-black">
            <RefreshCw size={14} />
            <span>Policy Guidelines</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#2C1810]">Cancellation & Refund Policy</h1>
          
          <p className="text-xs font-bold text-stone-500 flex items-center gap-2">
            <Clock size={14} className="text-[#6F4E37]" />
            <span>Last Updated: August 14, 2026</span>
          </p>

          <p className="text-sm font-medium text-stone-600 leading-relaxed pt-2">
            Fahara ensures clear, fair, and transparent cancellation terms for customers, cafe hosts, and event managers.
          </p>
        </div>

        {/* Highlighted Policy Summary Card */}
        <div className="bg-gradient-to-br from-[#FFF8F0] via-[#F5EBE0] to-[#E6D5C3] p-6 sm:p-8 rounded-3xl border border-[#DDB892]/60 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-[#6F4E37] font-black text-sm uppercase tracking-wider">
            <ShieldCheck size={18} />
            <span>Policy Summary at a Glance</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white shadow-2xs space-y-1">
              <div className="flex items-center gap-2 text-emerald-700 font-black text-sm">
                <CheckCircle2 size={16} />
                <span>&gt; 9 Hours Before Slot</span>
              </div>
              <p className="text-xs text-stone-700 font-medium">Eligible for full refund of Cafe & Event charges minus gateway processing charges.</p>
            </div>

            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white shadow-2xs space-y-1">
              <div className="flex items-center gap-2 text-rose-700 font-black text-sm">
                <XCircle size={16} />
                <span>&lt; 9 Hours Before Slot</span>
              </div>
              <p className="text-xs text-stone-700 font-medium">Non-refundable due to venue reservation and perishable prep costs.</p>
            </div>
          </div>
        </div>

        {/* Visual Cancellation Timeline */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
          <h2 className="text-xl font-black text-[#2C1810] text-center sm:text-left">Cancellation Timeline</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
            
            {/* Step 1 */}
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 text-center flex flex-col items-center justify-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#6F4E37] text-white flex items-center justify-center font-black text-sm">
                01
              </div>
              <h3 className="font-black text-sm text-[#2C1810]">Booking Completed</h3>
              <p className="text-xs text-stone-500 font-medium">Slot reserved instantly at cafe venue.</p>
            </div>

            {/* Step 2 */}
            <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-200 text-center flex flex-col items-center justify-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                02
              </div>
              <h3 className="font-black text-sm text-emerald-950">&gt; 9 Hours Window</h3>
              <p className="text-xs text-emerald-800 font-medium">Full refund minus payment gateway fee.</p>
            </div>

            {/* Step 3 */}
            <div className="bg-rose-50/80 p-5 rounded-2xl border border-rose-200 text-center flex flex-col items-center justify-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center font-black text-sm">
                03
              </div>
              <h3 className="font-black text-sm text-rose-950">&lt; 9 Hours Window</h3>
              <p className="text-xs text-rose-800 font-medium">Slot locked; non-refundable.</p>
            </div>

          </div>
        </div>

        {/* Detailed Rules List */}
        <div className="space-y-6">
          
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
            <h3 className="text-lg font-black text-[#2C1810]">1. Customer Initiated Cancellation</h3>
            <p className="text-sm font-medium text-stone-600 leading-relaxed">
              Customers can initiate cancellations directly through the <strong>My Bookings</strong> dashboard. Cancellations requested more than 9 hours prior to the start time will automatically initiate a refund.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
            <h3 className="text-lg font-black text-[#2C1810]">2. Cafe Host or Partner Cancellation</h3>
            <p className="text-sm font-medium text-stone-600 leading-relaxed">
              In the rare event that a cafe owner or event manager cancels a confirmed booking, the customer receives a <strong>100% full refund</strong> (including platform fees) and a complimentary booking credit.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
            <h3 className="text-lg font-black text-[#2C1810]">3. No-Show Policy</h3>
            <p className="text-sm font-medium text-stone-600 leading-relaxed">
              If a customer fails to arrive at the venue within 30 minutes of the reserved start time without prior notice, the booking is marked as a "No-Show" and no refund will be issued.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
            <h3 className="text-lg font-black text-[#2C1810]">4. Refund Timeline & Processing</h3>
            <p className="text-sm font-medium text-stone-600 leading-relaxed">
              Approved refunds are processed via our payment partner Cashfree back to your original payment method (UPI, Debit/Credit Card, Net Banking) within <strong>3 to 5 business days</strong>.
            </p>
          </div>

        </div>

        {/* Contact Support CTA */}
        <div className="bg-[#FFF8F0] p-6 sm:p-8 rounded-3xl border border-[#DDB892]/60 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-base text-[#2C1810]">Need assistance with a cancellation?</h3>
            <p className="text-xs font-bold text-stone-500 mt-0.5">Our support team is available 24/7 to resolve booking disputes.</p>
          </div>

          <a href="mailto:vexatech.connect@gmail.com" className="px-5 py-2.5 bg-[#6F4E37] text-white rounded-xl text-xs font-black hover:bg-[#4A2C11] transition-all shrink-0">
            Contact Support
          </a>
        </div>

      </div>
    </LegalSupportLayout>
  );
}
