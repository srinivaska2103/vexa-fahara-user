'use client';

import { useState, useEffect } from 'react';
import LegalSupportLayout from '@/app/components/layout/LegalSupportLayout';
import { ShieldCheck, Clock, Lock, CheckCircle2, ChevronDown, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const sections = [
  { id: 'introduction', title: '1. Introduction' },
  { id: 'info-collect', title: '2. Information We Collect' },
  { id: 'info-use', title: '3. How We Use Information' },
  { id: 'info-share', title: '4. How We Share Information' },
  { id: 'cookies', title: '5. Cookies & Tracking Technologies' },
  { id: 'security', title: '6. Data Security' },
  { id: 'retention', title: '7. Data Retention' },
  { id: 'user-rights', title: '8. Your User Rights' },
  { id: 'children', title: '9. Children\'s Privacy' },
  { id: 'third-party', title: '10. Third-Party Services' },
  { id: 'updates', title: '11. Policy Updates' },
  { id: 'contact', title: '12. Contact Us' },
];

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState('introduction');

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <LegalSupportLayout breadcrumbs={['Privacy Policy']}>
      {/* Mobile Quick Section Navigation */}
      <div className="xl:hidden bg-white p-3 rounded-2xl border border-stone-200/80 shadow-xs mb-6">
        <label htmlFor="mobile-toc" className="block text-[11px] font-black uppercase text-stone-400 mb-1 px-1">
          Jump to section
        </label>
        <select
          id="mobile-toc"
          value={activeSection}
          onChange={(e) => scrollToSection(e.target.value)}
          suppressHydrationWarning
          className="w-full bg-[#FFF8F0] border border-[#DDB892]/60 text-[#2C1810] font-bold text-xs rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#6F4E37]"
        >
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Main Content Area */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* Header Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFF8F0] rounded-bl-full -z-0 opacity-60 pointer-events-none" />
            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF8F0] border border-[#DDB892]/60 text-[#6F4E37] text-xs font-black">
                <ShieldCheck size={14} />
                <span>Legal Document</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-[#2C1810] tracking-tight">Privacy Policy</h1>
              
              <p className="text-xs font-bold text-stone-500 flex items-center gap-2">
                <Clock size={14} className="text-[#6F4E37]" />
                <span>Last Updated: August 14, 2026</span>
              </p>

              <p className="text-sm font-medium text-stone-600 leading-relaxed pt-2">
                At Fahara – Cafe & Event Booking, we take your personal privacy seriously. This Privacy Policy describes how we collect, use, store, and safeguard your personal information when you use our platform, website, and mobile services.
              </p>
            </div>
          </div>

          {/* Section 1: Introduction */}
          <section id="introduction" className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-3 scroll-mt-28 transition-all hover:border-[#DDB892]/60">
            <h2 className="text-xl font-black text-[#2C1810]">1. Introduction</h2>
            <p className="text-sm font-medium text-stone-600 leading-relaxed">
              Fahara ("we", "us", or "our") operates a digital marketplace facilitating cafe slot reservations and event service arrangements. By accessing or using our application, you agree to the collection and handling of your data in accordance with this policy.
            </p>
          </section>

          {/* Section 2: Information We Collect */}
          <section id="info-collect" className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4 scroll-mt-28 transition-all hover:border-[#DDB892]/60">
            <h2 className="text-xl font-black text-[#2C1810]">2. Information We Collect</h2>
            <p className="text-sm font-medium text-stone-600 leading-relaxed">
              We collect information to provide seamless booking and personalized customer experiences. This includes:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#DDB892]/40 hover:shadow-xs transition-shadow">
                <h3 className="font-black text-sm text-[#2C1810] mb-1">Account Information</h3>
                <p className="text-xs text-stone-600">Full name, email address, phone number, and account credentials.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#DDB892]/40 hover:shadow-xs transition-shadow">
                <h3 className="font-black text-sm text-[#2C1810] mb-1">Booking Information</h3>
                <p className="text-xs text-stone-600">Selected cafe, booking date, time slots, guest count, and special requests.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#DDB892]/40 hover:shadow-xs transition-shadow">
                <h3 className="font-black text-sm text-[#2C1810] mb-1">Payment Information</h3>
                <p className="text-xs text-stone-600">Transaction amounts, payment status, and Cashfree gateway reference IDs.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#DDB892]/40 hover:shadow-xs transition-shadow">
                <h3 className="font-black text-sm text-[#2C1810] mb-1">Location & Device Data</h3>
                <p className="text-xs text-stone-600">IP address, device model, browser type, and location data for nearby cafes.</p>
              </div>
            </div>
          </section>

          {/* Section 3: How We Use Information */}
          <section id="info-use" className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-3 scroll-mt-28 transition-all hover:border-[#DDB892]/60">
            <h2 className="text-xl font-black text-[#2C1810]">3. How We Use Information</h2>
            <ul className="space-y-2.5 text-sm font-medium text-stone-600">
              <li className="flex items-start gap-2.5"><CheckCircle2 size={18} className="text-[#6F4E37] shrink-0 mt-0.5" /> <span>Process cafe slot reservations and calculate transparent pricing.</span></li>
              <li className="flex items-start gap-2.5"><CheckCircle2 size={18} className="text-[#6F4E37] shrink-0 mt-0.5" /> <span>Dispatch instant booking confirmation notifications and electronic receipts.</span></li>
              <li className="flex items-start gap-2.5"><CheckCircle2 size={18} className="text-[#6F4E37] shrink-0 mt-0.5" /> <span>Coordinate add-on event arrangements with venue hosts and event partners.</span></li>
              <li className="flex items-start gap-2.5"><CheckCircle2 size={18} className="text-[#6F4E37] shrink-0 mt-0.5" /> <span>Prevent fraud, secure transactions, and comply with statutory requirements.</span></li>
            </ul>
          </section>

          {/* Section 4: How We Share Information */}
          <section id="info-share" className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-3 scroll-mt-28 transition-all hover:border-[#DDB892]/60">
            <h2 className="text-xl font-black text-[#2C1810]">4. How We Share Information</h2>
            <p className="text-sm font-medium text-stone-600 leading-relaxed">
              We do not sell your personal data. We share necessary details strictly with:
            </p>
            <div className="space-y-2 text-xs font-bold text-stone-700 bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <p>• <strong>Payment Service Providers:</strong> Cashfree Payments processes financial transactions securely under PCI-DSS compliance.</p>
              <p>• <strong>Cafe Owners & Event Partners:</strong> Name, booking date, time slot, and guest count are shared to prepare your venue setup.</p>
            </div>
          </section>

          {/* Section 5: Cookies & Tracking */}
          <section id="cookies" className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-3 scroll-mt-28 transition-all hover:border-[#DDB892]/60">
            <h2 className="text-xl font-black text-[#2C1810]">5. Cookies & Tracking Technologies</h2>
            <p className="text-sm font-medium text-stone-600 leading-relaxed">
              We use essential cookies and session storage to maintain your login authentication, retain search preferences, and analyze platform performance. You can control cookies through your browser settings.
            </p>
          </section>

          {/* Section 6: Data Security */}
          <section id="security" className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-3 scroll-mt-28 transition-all hover:border-[#DDB892]/60">
            <h2 className="text-xl font-black text-[#2C1810]">6. Data Security</h2>
            <p className="text-sm font-medium text-stone-600 leading-relaxed">
              Fahara employs SSL/TLS encryption for all data in transit. Sensitive payment credentials are processed directly through certified gateways and are never stored on our application servers.
            </p>
          </section>

          {/* Section 7: Data Retention */}
          <section id="retention" className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-3 scroll-mt-28 transition-all hover:border-[#DDB892]/60">
            <h2 className="text-xl font-black text-[#2C1810]">7. Data Retention</h2>
            <p className="text-sm font-medium text-stone-600 leading-relaxed">
              We retain personal data for as long as your account remains active or as required by law to comply with tax and audit regulations.
            </p>
          </section>

          {/* Section 8: Your Rights */}
          <section id="user-rights" className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-3 scroll-mt-28 transition-all hover:border-[#DDB892]/60">
            <h2 className="text-xl font-black text-[#2C1810]">8. Your User Rights</h2>
            <p className="text-sm font-medium text-stone-600 leading-relaxed">
              You have the right to access, update, or request deletion of your account data by contacting customer support.
            </p>
          </section>

          {/* Section 9: Children's Privacy */}
          <section id="children" className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-3 scroll-mt-28 transition-all hover:border-[#DDB892]/60">
            <h2 className="text-xl font-black text-[#2C1810]">9. Children's Privacy</h2>
            <p className="text-sm font-medium text-stone-600 leading-relaxed">
              Fahara is intended for users who are at least 18 years of age. We do not knowingly collect personal data from minors.
            </p>
          </section>

          {/* Section 10: Third-Party Services */}
          <section id="third-party" className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-3 scroll-mt-28 transition-all hover:border-[#DDB892]/60">
            <h2 className="text-xl font-black text-[#2C1810]">10. Third-Party Services</h2>
            <p className="text-sm font-medium text-stone-600 leading-relaxed">
              Our application may contain links to third-party venues or services. We are not responsible for the privacy practices of external sites.
            </p>
          </section>

          {/* Section 11: Policy Updates */}
          <section id="updates" className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-3 scroll-mt-28 transition-all hover:border-[#DDB892]/60">
            <h2 className="text-xl font-black text-[#2C1810]">11. Policy Updates</h2>
            <p className="text-sm font-medium text-stone-600 leading-relaxed">
              We may update this policy periodically. Changes will be posted on this page with an updated revision date.
            </p>
          </section>

          {/* Section 12: Contact Us */}
          <section id="contact" className="bg-[#FFF8F0] p-6 sm:p-8 rounded-3xl border border-[#DDB892]/60 shadow-xs space-y-3 scroll-mt-28">
            <h2 className="text-xl font-black text-[#2C1810]">12. Contact Us</h2>
            <p className="text-xs font-bold text-stone-600">If you have any questions regarding this Privacy Policy, please contact our legal team:</p>
            <div className="flex flex-wrap gap-4 text-xs font-black text-[#6F4E37] pt-2">
              <a href="mailto:vexatech.connect@gmail.com" className="flex items-center gap-1.5 hover:underline">
                <Mail size={14} /> vexatech.connect@gmail.com
              </a>
              <a href="tel:+918946029205" className="flex items-center gap-1.5 hover:underline">
                <Phone size={14} /> +91 89460-29205
              </a>
            </div>
          </section>

        </div>

        {/* Sticky Desktop Table of Contents */}
        <div className="hidden xl:block xl:col-span-4 sticky top-24 space-y-2">
          <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-3 px-2">On This Page</h3>
            <nav className="space-y-1 text-xs font-bold">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  suppressHydrationWarning
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all block truncate ${
                    activeSection === s.id 
                      ? 'bg-[#6F4E37] text-white font-black shadow-xs' 
                      : 'text-stone-600 hover:text-[#6F4E37] hover:bg-[#FFF8F0]'
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

      </div>
    </LegalSupportLayout>
  );
}
