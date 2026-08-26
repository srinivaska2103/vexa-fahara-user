'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarCheck, CreditCard, Coffee, Sparkles, User, Wrench, 
  Mail, PhoneCall, MessageCircle, Clock, Send, Paperclip, X, 
  CheckCircle2, AlertCircle, ChevronDown, Copy, Check, HelpCircle, ArrowRight, Loader2
} from 'lucide-react';
import CustomerNavbar from '@/app/components/layout/CustomerNavbar';
import Footer from '@/app/components/home/Footer';
import ModernSelect from '@/app/components/common/ModernSelect';
import { supportService } from '@/services/support.service';
import toast from 'react-hot-toast';

const categoryOptions = [
  { value: 'Booking Issue', label: 'Booking Issue', icon: CalendarCheck },
  { value: 'Payment Issue', label: 'Payment Issue', icon: CreditCard },
  { value: 'Refund Issue', label: 'Refund Issue', icon: HelpCircle },
  { value: 'Cafe Issue', label: 'Cafe Issue', icon: Coffee },
  { value: 'Event Service Issue', label: 'Event Service Support', icon: Sparkles },
  { value: 'Account Issue', label: 'Account Issue', icon: User },
  { value: 'Technical Issue', label: 'Technical Issue', icon: Wrench },
  { value: 'Other', label: 'Other', icon: MessageCircle },
];

const supportCards = [
  { id: 'Booking Issue', icon: CalendarCheck, title: 'Booking Support', desc: 'Help with bookings, cancellations, and rescheduling.' },
  { id: 'Payment Issue', icon: CreditCard, title: 'Payment Support', desc: 'Payment failures, refunds, and transaction issues.' },
  { id: 'Cafe Issue', icon: Coffee, title: 'Cafe Support', desc: 'Questions or issues related to host cafes and venues.' },
  { id: 'Event Service Issue', icon: Sparkles, title: 'Event Service Support', desc: 'Help with decor, photography, catering, and partners.' },
  { id: 'Account Issue', icon: User, title: 'Account Support', desc: 'Profile, login, security, and account preferences.' },
  { id: 'Technical Issue', icon: Wrench, title: 'Technical Support', desc: 'Report technical glitches or unexpected app errors.' },
];

const faqPreviewList = [
  { id: '1', question: 'How do I cancel a booking?', answer: 'Navigate to My Bookings, select your active booking, and click "Cancel Booking". Cancellations made >9 hours before slot start are eligible for refunds.' },
  { id: '2', question: 'How long does a refund take?', answer: 'Approved refunds are automatically returned to your original payment method via Cashfree within 3 to 5 business days.' },
  { id: '3', question: 'Can I reschedule my booking?', answer: 'Rescheduling depends on venue slot availability. Contact customer support at least 9 hours prior to your scheduled time.' },
  { id: '4', question: 'How do I contact a cafe?', answer: 'Host phone numbers, full address, and directions are provided on your confirmed booking receipt.' },
  { id: '5', question: 'How do I add an event service?', answer: 'Select optional decor, catering, or photography packages during the checkout step of your cafe reservation.' },
  { id: '6', question: 'How do I report a problem?', answer: 'Submit the support form below with your booking ID or email support directly at support@fahara.com.' },
];

export default function ContactPage() {
  const formRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    bookingId: '',
    category: 'Booking Issue',
    subject: '',
    message: '',
  });

  const [attachment, setAttachment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [expandedFaqId, setExpandedFaqId] = useState(null);
  const [copiedLabel, setCopiedLabel] = useState('');

  const handleSupportCardClick = (categoryName) => {
    setFormData((prev) => ({ ...prev, category: categoryName }));
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Attachment size must be under 5MB.', {
          style: { borderRadius: '12px', background: '#2C1810', color: '#fff' }
        });
        return;
      }
      setAttachment({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        file
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!formData.email.trim()) errors.email = 'Email Address is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email address';
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.message.trim()) errors.message = 'Message is required';
    else if (formData.message.trim().length < 10) errors.message = 'Message must be at least 10 characters';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await supportService.submitSupportTicket(formData);
      if (result?.success) {
        setSubmittedTicket(result.data);
        toast.success('Support request submitted successfully!', {
          style: { borderRadius: '12px', background: '#2C1810', color: '#fff' }
        });
      }
    } catch (err) {
      toast.error('Failed to submit support request. Please try again.', {
        style: { borderRadius: '12px', background: '#2C1810', color: '#fff' }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyContact = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedLabel(label);
    toast.success(`Copied ${label} to clipboard!`, {
      style: { borderRadius: '12px', background: '#2C1810', color: '#fff' }
    });
    setTimeout(() => setCopiedLabel(''), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] font-sans antialiased text-[#2C1810] selection:bg-[#6F4E37] selection:text-white flex flex-col justify-between">
      <div>
        {/* Sticky Customer Header Navbar */}
        <CustomerNavbar showSearch={true} showViewToggles={false} />

        {/* ==================== 1. HERO SECTION ==================== */}
        <section className="bg-linear-to-b from-[#4A2C11] via-[#6F4E37] to-[#5C3D28] text-white py-16 sm:py-20 lg:py-24 text-center relative overflow-hidden">
          {/* Ambient Glowing Glass Accents */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#DDB892]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#2C1810]/40 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center">
            <motion.span 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#DDB892] text-xs font-black uppercase tracking-wider backdrop-blur-md mb-6 border border-white/20 shadow-md"
            >
              <Sparkles size={14} className="text-amber-300 animate-pulse" />
              <span>Fahara Customer Support & Help Center</span>
            </motion.span>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4 leading-tight"
            >
              Need Help? We’re Here for You.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xs sm:text-base lg:text-lg text-[#FFF8F0]/90 max-w-2xl font-medium leading-relaxed"
            >
              Whether you have a booking question, payment query, or need help with an event arrangement, select a topic below to get instant support.
            </motion.p>
          </div>
        </section>

        {/* ==================== 2. SUPPORT OPTIONS GRID ==================== */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-[#6F4E37]">Instant Assistance</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#2C1810] mt-1">Select a Support Topic</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportCards.map((card) => {
              const Icon = card.icon;
              const isSelected = formData.category === card.id;
              return (
                <motion.div
                  key={card.id}
                  whileHover={{ y: -5 }}
                  onClick={() => handleSupportCardClick(card.id)}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    isSelected 
                      ? 'bg-[#6F4E37] text-white border-[#4A2C11] shadow-xl scale-[1.02]' 
                      : 'bg-white text-[#2C1810] border-stone-200/80 hover:border-[#DDB892] shadow-2xs'
                  }`}
                >
                  <div className="space-y-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${
                      isSelected ? 'bg-white/10 text-amber-300' : 'bg-[#FFF8F0] text-[#6F4E37] border border-[#DDB892]/60'
                    }`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="font-black text-lg">{card.title}</h3>
                    <p className={`text-xs font-medium leading-relaxed ${isSelected ? 'text-white/80' : 'text-stone-500'}`}>
                      {card.desc}
                    </p>
                  </div>

                  <div className="flex items-center text-xs font-black gap-1 pt-2">
                    <span>Get Help</span>
                    <ArrowRight size={14} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ==================== 3. CONTACT FORM & TICKET CONFIRMATION UX ==================== */}
        <section ref={formRef} className="py-16 bg-[#F5EBE0] border-y border-[#DDB892]/40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {submittedTicket ? (
              /* Ticket Submitted UX Confirmation Screen */
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 sm:p-12 rounded-3xl border border-stone-200/80 shadow-xl text-center space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Request Received
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-[#2C1810]">Your support request has been submitted.</h2>
                  <p className="text-xs sm:text-sm font-medium text-stone-500 max-w-lg mx-auto">
                    Our team will review your inquiry and contact you via email within 2 to 4 hours.
                  </p>
                </div>

                {/* Ticket Details Summary Card */}
                <div className="bg-[#FFF8F0] p-6 rounded-2xl border border-[#DDB892]/60 max-w-md mx-auto text-left space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-[#DDB892]/40">
                    <span className="text-xs font-bold text-stone-500">Ticket ID</span>
                    <span className="text-sm font-black text-[#6F4E37]">{submittedTicket.ticketId}</span>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-[#DDB892]/40">
                    <span className="text-xs font-bold text-stone-500">Category</span>
                    <span className="text-xs font-black text-[#2C1810]">{submittedTicket.category}</span>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-[#DDB892]/40">
                    <span className="text-xs font-bold text-stone-500">Status</span>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white px-2.5 py-0.5 rounded-full">
                      {submittedTicket.status || 'Open'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-stone-500">Submitted On</span>
                    <span className="text-xs font-medium text-stone-700">
                      {new Date(submittedTicket.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <button
                    onClick={() => {
                      setSubmittedTicket(null);
                      setFormData({ fullName: '', email: '', phone: '', bookingId: '', category: 'Booking Issue', subject: '', message: '' });
                      setAttachment(null);
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-[#6F4E37] text-white rounded-xl text-xs font-black hover:bg-[#4A2C11] transition-all cursor-pointer"
                  >
                    Submit Another Ticket
                  </button>
                  <Link
                    href="/customer/bookings"
                    className="w-full sm:w-auto px-6 py-3 bg-stone-100 text-stone-800 rounded-xl text-xs font-black hover:bg-stone-200 transition-all"
                  >
                    View My Bookings
                  </Link>
                </div>
              </motion.div>
            ) : (
              /* Support Form */
              <div className="bg-white p-6 sm:p-10 rounded-3xl border border-stone-200/80 shadow-xl space-y-6">
                <div className="border-b border-stone-100 pb-4">
                  <span className="text-xs font-black uppercase tracking-widest text-[#6F4E37]">Support Ticket</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#2C1810]">Submit a Support Request</h2>
                  <p className="text-xs text-stone-500 font-bold mt-1">Fill in the details below and our team will get back to you promptly.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="text-xs font-black text-[#2C1810] block mb-1">Full Name *</label>
                      <input 
                        type="text" 
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. John Doe"
                        className={`w-full px-4 py-2.5 bg-stone-50 border rounded-xl text-xs font-bold outline-none transition-all ${
                          formErrors.fullName ? 'border-rose-500 bg-rose-50' : 'border-stone-200 focus:border-[#6F4E37] focus:bg-white'
                        }`}
                      />
                      {formErrors.fullName && <p className="text-[10px] text-rose-500 font-bold mt-1">{formErrors.fullName}</p>}
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="text-xs font-black text-[#2C1810] block mb-1">Email Address *</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. john@example.com"
                        className={`w-full px-4 py-2.5 bg-stone-50 border rounded-xl text-xs font-bold outline-none transition-all ${
                          formErrors.email ? 'border-rose-500 bg-rose-50' : 'border-stone-200 focus:border-[#6F4E37] focus:bg-white'
                        }`}
                      />
                      {formErrors.email && <p className="text-[10px] text-rose-500 font-bold mt-1">{formErrors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone Number */}
                    <div>
                      <label className="text-xs font-black text-[#2C1810] block mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold outline-none focus:border-[#6F4E37] focus:bg-white transition-all"
                      />
                    </div>

                    {/* Booking ID (Optional) */}
                    <div>
                      <label className="text-xs font-black text-[#2C1810] block mb-1">Booking ID (Optional)</label>
                      <input 
                        type="text" 
                        value={formData.bookingId}
                        onChange={(e) => setFormData({ ...formData, bookingId: e.target.value })}
                        placeholder="e.g. BK-98412"
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold outline-none focus:border-[#6F4E37] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Support Category Dropdown */}
                  <div>
                    <label className="text-xs font-black text-[#2C1810] block mb-1">Support Category *</label>
                    <ModernSelect
                      value={formData.category}
                      onChange={(val) => setFormData({ ...formData, category: val })}
                      options={categoryOptions}
                      placeholder="Select Support Category"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="text-xs font-black text-[#2C1810] block mb-1">Subject *</label>
                    <input 
                      type="text" 
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Brief summary of your issue"
                      className={`w-full px-4 py-2.5 bg-stone-50 border rounded-xl text-xs font-bold outline-none transition-all ${
                        formErrors.subject ? 'border-rose-500 bg-rose-50' : 'border-stone-200 focus:border-[#6F4E37] focus:bg-white'
                      }`}
                    />
                    {formErrors.subject && <p className="text-[10px] text-rose-500 font-bold mt-1">{formErrors.subject}</p>}
                  </div>

                  {/* Message Textarea */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-black text-[#2C1810]">Detailed Message *</label>
                      <span className="text-[10px] font-bold text-stone-400">
                        {formData.message.length} / 1000 chars
                      </span>
                    </div>
                    <textarea 
                      rows={5}
                      maxLength={1000}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your question or issue in detail..."
                      className={`w-full px-4 py-3 bg-stone-50 border rounded-xl text-xs font-medium outline-none transition-all ${
                        formErrors.message ? 'border-rose-500 bg-rose-50' : 'border-stone-200 focus:border-[#6F4E37] focus:bg-white'
                      }`}
                    />
                    {formErrors.message && <p className="text-[10px] text-rose-500 font-bold mt-1">{formErrors.message}</p>}
                  </div>

                  {/* Attachment Input */}
                  <div>
                    <label className="text-xs font-black text-[#2C1810] block mb-1">Attachment (Optional, max 5MB)</label>
                    {attachment ? (
                      <div className="flex items-center justify-between p-3 bg-[#FFF8F0] border border-[#DDB892]/60 rounded-xl text-xs font-bold text-[#6F4E37]">
                        <div className="flex items-center gap-2 truncate">
                          <Paperclip size={14} />
                          <span className="truncate">{attachment.name}</span>
                          <span className="text-[10px] text-stone-400 font-normal">({attachment.size})</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => setAttachment(null)}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center gap-2 px-4 py-3 bg-stone-50 border border-dashed border-stone-300 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer">
                        <Paperclip size={14} className="text-[#6F4E37]" />
                        <span>Upload screenshot or receipt</span>
                        <input type="file" onChange={handleFileChange} className="hidden" accept="image/*,.pdf" />
                      </label>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#6F4E37] text-white rounded-2xl font-black text-xs sm:text-sm hover:bg-[#4A2C11] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Submitting Ticket...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Submit Support Request</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

          </div>
        </section>

        {/* ==================== 4. CONTACT INFORMATION SECTION ==================== */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-[#6F4E37]">Direct Reach</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#2C1810] mt-1">Official Contact Channels</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Email Support */}
            <motion.div 
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="bg-white p-6 rounded-3xl border border-stone-200/80 hover:border-[#DDB892] shadow-sm hover:shadow-xl space-y-4 flex flex-col justify-between transition-all group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF8F0] border border-[#DDB892]/60 text-[#6F4E37] flex items-center justify-center group-hover:bg-[#6F4E37] group-hover:text-white transition-colors">
                  <Mail size={22} />
                </div>
                <h3 className="font-black text-lg text-[#2C1810]">Email Support</h3>
                <p className="text-xs font-bold text-stone-800 truncate select-all" title="vexatech.connect@gmail.com">
                  vexatech.connect@gmail.com
                </p>
                <p className="text-[11px] font-medium text-stone-400">Response time: Within 4 hours</p>
              </div>
              <button 
                onClick={() => copyContact('vexatech.connect@gmail.com', 'Email Address')}
                className="w-full py-2.5 bg-[#FFF8F0] border border-[#DDB892]/60 text-[#6F4E37] rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 hover:bg-[#6F4E37] hover:text-white transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                {copiedLabel === 'Email Address' ? <Check size={15} /> : <Copy size={15} />}
                <span>{copiedLabel === 'Email Address' ? 'Copied to Clipboard!' : 'Copy Email'}</span>
              </button>
            </motion.div>

            {/* Phone Support */}
            <motion.div 
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="bg-white p-6 rounded-3xl border border-stone-200/80 hover:border-[#DDB892] shadow-sm hover:shadow-xl space-y-4 flex flex-col justify-between transition-all group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF8F0] border border-[#DDB892]/60 text-[#6F4E37] flex items-center justify-center group-hover:bg-[#6F4E37] group-hover:text-white transition-colors">
                  <PhoneCall size={22} />
                </div>
                <h3 className="font-black text-lg text-[#2C1810]">Phone Support</h3>
                <p className="text-xs font-bold text-stone-800 select-all">+91 89460-29205</p>
                <p className="text-[11px] font-medium text-stone-400">Toll-free customer care line</p>
              </div>
              <button 
                onClick={() => copyContact('+91 89460-29205', 'Phone Number')}
                className="w-full py-2.5 bg-[#FFF8F0] border border-[#DDB892]/60 text-[#6F4E37] rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 hover:bg-[#6F4E37] hover:text-white transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                {copiedLabel === 'Phone Number' ? <Check size={15} /> : <Copy size={15} />}
                <span>{copiedLabel === 'Phone Number' ? 'Copied to Clipboard!' : 'Copy Phone'}</span>
              </button>
            </motion.div>

            {/* WhatsApp Support */}
            <motion.div 
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="bg-white p-6 rounded-3xl border border-stone-200/80 hover:border-emerald-300 shadow-sm hover:shadow-xl space-y-4 flex flex-col justify-between transition-all group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <MessageCircle size={22} />
                </div>
                <h3 className="font-black text-lg text-[#2C1810]">WhatsApp Support</h3>
                <p className="text-xs font-bold text-stone-800 select-all">+91 89460-29205</p>
                <p className="text-[11px] font-medium text-stone-400">Instant chat & booking queries</p>
              </div>
              <a 
                href="https://wa.me/918946029205" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-emerald-600 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 hover:bg-emerald-700 transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <MessageCircle size={15} />
                <span>Chat on WhatsApp</span>
              </a>
            </motion.div>

            {/* Support Hours */}
            <motion.div 
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="bg-white p-6 rounded-3xl border border-stone-200/80 hover:border-[#DDB892] shadow-sm hover:shadow-xl space-y-4 flex flex-col justify-between transition-all group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF8F0] border border-[#DDB892]/60 text-[#6F4E37] flex items-center justify-center group-hover:bg-[#6F4E37] group-hover:text-white transition-colors">
                  <Clock size={22} />
                </div>
                <h3 className="font-black text-lg text-[#2C1810]">Support Hours</h3>
                <p className="text-xs font-bold text-stone-800">Mon - Sun: 9:00 AM - 9:00 PM IST</p>
                <p className="text-[11px] font-medium text-stone-400">24/7 automated ticket queue</p>
              </div>
              <div className="p-2.5 bg-emerald-50 border border-emerald-200/60 rounded-2xl text-center text-[10px] font-black text-emerald-700 uppercase tracking-wider flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Support Agents Online</span>
              </div>
            </motion.div>

          </div>
        </section>

        {/* ==================== 5. FAQ PREVIEW SECTION ==================== */}
        <section className="py-16 bg-[#FFF8F0] border-t border-stone-200/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#6F4E37]">Quick Solutions</span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#2C1810]">Frequently Asked Questions</h2>
              </div>

              <Link 
                href="/faq"
                className="text-xs font-black text-[#6F4E37] hover:underline flex items-center gap-1"
              >
                <span>View All FAQs</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="space-y-3">
              {faqPreviewList.map((faq) => {
                const isOpen = expandedFaqId === faq.id;
                return (
                  <div key={faq.id} className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-2xs">
                    <button
                      onClick={() => setExpandedFaqId(isOpen ? null : faq.id)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 font-black text-xs sm:text-sm text-[#2C1810] hover:text-[#6F4E37] transition-colors cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown size={16} className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#6F4E37]' : 'text-stone-400'}`} />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-0 text-xs font-medium text-stone-600 leading-relaxed border-t border-stone-100">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </div>

      <Footer />
    </div>
  );
}
