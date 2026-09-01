'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import LegalSupportLayout from '@/app/components/layout/LegalSupportLayout';
import { 
  Search, HelpCircle, ChevronDown, PhoneCall, Mail, 
  Copy, Check, Sparkles, AlertCircle, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const faqCategories = [
  { id: 'all', label: 'All Questions' },
  { id: 'bookings', label: 'Bookings' },
  { id: 'payments', label: 'Payments' },
  { id: 'cancellations', label: 'Cancellations & Refunds' },
  { id: 'cafes', label: 'Cafes' },
  { id: 'events', label: 'Event Services' },
  { id: 'account', label: 'Account & Profile' },
  { id: 'technical', label: 'Technical Support' },
];

const faqList = [
  {
    id: '1',
    category: 'bookings',
    question: 'How do I book a cafe?',
    answer: 'Browse cafes on our Discover page, select your preferred date, duration slot, and guest count, optionally add event arrangements, and proceed to secure online checkout.'
  },
  {
    id: '2',
    category: 'events',
    question: 'Can I add an event arrangement to my cafe booking?',
    answer: 'Yes! During checkout, you can select custom decorations, catering platters, live DJ, cakes, and photography arrangements delivered directly at your reserved cafe.'
  },
  {
    id: '3',
    category: 'cancellations',
    question: 'How do I cancel a booking?',
    answer: 'Go to My Bookings, click on your active booking, and select "Cancel Booking". Cancellations made more than 9 hours before slot start time are eligible for a refund.'
  },
  {
    id: '4',
    category: 'cancellations',
    question: 'When will I receive my refund?',
    answer: 'Approved refunds are automatically processed back to your original payment method (UPI, card, net banking) via Cashfree within 3 to 5 business days.'
  },
  {
    id: '5',
    category: 'cancellations',
    question: 'What happens if a cafe cancels my booking?',
    answer: 'If a cafe host cancels your booking, you receive an immediate 100% refund including platform fees, plus a complimentary booking credit.'
  },
  {
    id: '6',
    category: 'bookings',
    question: 'Can I reschedule my booking?',
    answer: 'Rescheduling depends on cafe slot availability. You can request a date or time slot change through customer support at least 9 hours before your original time.'
  },
  {
    id: '7',
    category: 'payments',
    question: 'How are Fahara fees calculated?',
    answer: 'Fahara charges a 3% Platform Fee on the subtotal, a 3% Transaction Fee on subtotal, and 18% GST strictly on the Transaction Fee.'
  },
  {
    id: '8',
    category: 'payments',
    question: 'Is GST included in the final amount?',
    answer: 'Yes, the Grand Total displayed on your booking summary and receipt includes all taxes, platform charges, and GST.'
  },
  {
    id: '9',
    category: 'cafes',
    question: 'How do I contact a cafe?',
    answer: 'Once your booking is confirmed, cafe address details, map directions, and host contact phone numbers are available on your booking receipt.'
  },
  {
    id: '10',
    category: 'events',
    question: 'How do I contact an event service provider?',
    answer: 'Event manager details are attached to your confirmed booking receipt. You can also message event partners via customer support.'
  },
  {
    id: '11',
    category: 'account',
    question: 'How do I update my profile?',
    answer: 'Navigate to Profile > Personal Information to update your full name, phone number, and account preferences.'
  },
  {
    id: '12',
    category: 'account',
    question: 'How do I manage my favorites?',
    answer: 'Click the Heart icon on any cafe or event service card to save it. View all your saved items under the Favorites page.'
  },
  {
    id: '13',
    category: 'technical',
    question: 'How can I report an issue?',
    answer: 'Click "Report an Issue" below or contact support at vexatech.connect@gmail.com with your booking reference ID.'
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [copiedText, setCopiedText] = useState('');

  const filteredFaqs = useMemo(() => {
    return faqList.filter(item => {
      if (activeCategory !== 'all' && item.category !== activeCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesQuestion = item.question.toLowerCase().includes(q);
        const matchesAnswer = item.answer.toLowerCase().includes(q);
        if (!matchesQuestion && !matchesAnswer) return false;
      }
      return true;
    });
  }, [searchQuery, activeCategory]);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    toast.success(`Copied ${label} to clipboard!`, {
      style: { borderRadius: '12px', background: '#2C1810', color: '#fff' }
    });
    setTimeout(() => setCopiedText(''), 2000);
  };

  return (
    <LegalSupportLayout breadcrumbs={['Help & FAQ']}>
      <div className="space-y-8">
        
        {/* Top Hero Section */}
        <div className="bg-gradient-to-r from-[#2C1810] via-[#4A2C11] to-[#6F4E37] text-white p-8 sm:p-12 rounded-3xl text-center space-y-4 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-[#DDB892] text-xs font-black uppercase tracking-wider backdrop-blur-md">
              <Sparkles size={14} className="text-amber-400" />
              <span>Help Center</span>
            </span>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">How can we help you?</h1>

            {/* Real-time Search Input */}
            <div className="pt-2">
              <div className="flex items-center bg-white rounded-2xl px-4 py-3 text-stone-800 shadow-md">
                <Search size={18} className="text-[#6F4E37] mr-3 shrink-0" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions, bookings, payments..."
                  className="w-full text-xs sm:text-sm font-bold bg-transparent outline-none placeholder:text-stone-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {faqCategories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-black shrink-0 transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-[#6F4E37] text-white shadow-md' 
                    : 'bg-white text-stone-700 hover:bg-[#FFF8F0] border border-stone-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center space-y-2">
              <HelpCircle size={36} className="mx-auto text-stone-400" />
              <h3 className="font-black text-[#2C1810]">No matching questions found</h3>
              <p className="text-xs font-bold text-stone-500">Try searching for something else or contact customer support.</p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = expandedId === faq.id;
              return (
                <div 
                  key={faq.id}
                  className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden transition-all shadow-2xs"
                >
                  <button 
                    onClick={() => setExpandedId(isOpen ? null : faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-black text-sm text-[#2C1810] hover:text-[#6F4E37] transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown size={18} className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#6F4E37]' : 'text-stone-400'}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 pt-0 text-xs font-medium text-stone-600 leading-relaxed border-t border-stone-100">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* Still Need Help Section */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-black text-[#2C1810]">Still need help?</h2>
            <p className="text-xs font-bold text-stone-500 mt-1">Our support team is available 24/7 to assist with your bookings and inquiries.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Phone Support */}
            <div className="bg-[#FFF8F0] p-5 rounded-2xl border border-[#DDB892]/60 flex flex-col justify-between space-y-3">
              <div className="flex items-center gap-2 text-[#6F4E37] font-black text-sm">
                <PhoneCall size={18} />
                <span>Call Support</span>
              </div>
              <p className="text-xs font-bold text-stone-800">+91 89460-29205</p>
              <button 
                onClick={() => copyToClipboard('+91 89460-29205', 'Phone Number')}
                className="w-full py-2 bg-white text-[#6F4E37] border border-[#DDB892]/60 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 hover:bg-[#6F4E37] hover:text-white transition-all cursor-pointer"
              >
                {copiedText === 'Phone Number' ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedText === 'Phone Number' ? 'Copied' : 'Copy Phone'}</span>
              </button>
            </div>

            {/* Email Support */}
            <div className="bg-[#FFF8F0] p-5 rounded-2xl border border-[#DDB892]/60 flex flex-col justify-between space-y-3">
              <div className="flex items-center gap-2 text-[#6F4E37] font-black text-sm">
                <Mail size={18} />
                <span>Email Support</span>
              </div>
              <p className="text-xs font-bold text-stone-800 truncate">vexatech.connect@gmail.com</p>
              <button 
                onClick={() => copyToClipboard('vexatech.connect@gmail.com', 'Email Address')}
                className="w-full py-2 bg-white text-[#6F4E37] border border-[#DDB892]/60 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 hover:bg-[#6F4E37] hover:text-white transition-all cursor-pointer"
              >
                {copiedText === 'Email Address' ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedText === 'Email Address' ? 'Copied' : 'Copy Email'}</span>
              </button>
            </div>

            {/* Report Issue */}
            <div className="bg-[#FFF8F0] p-5 rounded-2xl border border-[#DDB892]/60 flex flex-col justify-between space-y-3">
              <div className="flex items-center gap-2 text-[#6F4E37] font-black text-sm">
                <AlertCircle size={18} />
                <span>Report an Issue</span>
              </div>
              <p className="text-xs font-bold text-stone-800">Booking disputes or technical feedback.</p>
              <Link 
                href="/contact"
                className="w-full py-2 bg-[#6F4E37] text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 hover:bg-[#4A2C11] transition-all cursor-pointer"
              >
                <MessageSquare size={14} />
                <span>Submit Ticket</span>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </LegalSupportLayout>
  );
}
