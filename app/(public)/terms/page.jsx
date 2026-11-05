'use client';

import { useState } from 'react';
import LegalSupportLayout from '@/app/components/layout/LegalSupportLayout';
import { FileText, Clock, Users, Building2, Sparkles, Shield, AlertTriangle, Mail } from 'lucide-react';

const sections = [
  { id: 'intro', title: '1. Introduction & Agreement' },
  { id: 'roles', title: '2. Platform Roles Breakdown' },
  { id: 'bookings', title: '3. Cafe Bookings & Reservations' },
  { id: 'event-services', title: '4. Event Service Arrangements' },
  { id: 'pricing-fees', title: '5. Pricing, Platform Fees & GST' },
  { id: 'payments', title: '6. Payments & Settlement' },
  { id: 'responsibilities', title: '7. User Conduct & Responsibilities' },
  { id: 'cancellation-overview', title: '8. Cancellation & Refunds' },
  { id: 'liability', title: '9. Limitation of Liability' },
  { id: 'disputes', title: '10. Dispute Resolution & Law' },
  { id: 'contact-terms', title: '11. Contact Information' },
];

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState('intro');

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <LegalSupportLayout breadcrumbs={['Terms of Service']}>
      <div className="flex flex-col xl:flex-row gap-8 items-start">
        
        {/* Main Content Area */}
        <div className="flex-1 w-full space-y-8">
          
          {/* Header Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF5F5] border border-[#EF5350]/60 text-[#E50914] text-xs font-black">
              <FileText size={14} />
              <span>User Agreement</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-[#252525]">Terms of Service</h1>
            
            <p className="text-xs font-bold text-stone-500 flex items-center gap-2">
              <Clock size={14} className="text-[#E50914]" />
              <span>Last Updated: August 14, 2026</span>
            </p>

            <p className="text-sm font-medium text-stone-600 leading-relaxed pt-2">
              Welcome to Grab2GO. These Terms of Service govern your access to and use of the Grab2GO platform, website, and services. Please read them carefully before completing any booking.
            </p>
          </div>

          {/* Section 1: Introduction */}
          <section id="intro" className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-3 scroll-mt-24">
            <h2 className="text-xl font-black text-[#252525]">1. Introduction & Agreement</h2>
            <p className="text-sm font-medium text-stone-600 leading-relaxed">
              By creating an account or placing a booking on Grab2GO, you enter into a legally binding agreement to comply with these Terms of Service. If you do not agree, you may not use our services.
            </p>
          </section>

          {/* Section 2: Platform Roles Breakdown */}
          <section id="roles" className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4 scroll-mt-24">
            <h2 className="text-xl font-black text-[#252525]">2. Platform Roles Breakdown</h2>
            <p className="text-sm font-medium text-stone-600 leading-relaxed">
              To ensure legal transparency, the responsibilities of each participant on Grab2GO are defined below:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#EF5350]/40 space-y-1">
                <div className="flex items-center gap-2 font-black text-sm text-[#252525]">
                  <Users size={16} className="text-[#E50914]" />
                  <span>Customer</span>
                </div>
                <p className="text-xs text-stone-600">Individual or entity discovering and reserving cafe slots and purchasing event add-ons.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#EF5350]/40 space-y-1">
                <div className="flex items-center gap-2 font-black text-sm text-[#252525]">
                  <Building2 size={16} className="text-[#E50914]" />
                  <span>Cafe Owner</span>
                </div>
                <p className="text-xs text-stone-600">Venue provider responsible for hosting reserved slots and maintaining venue quality.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#EF5350]/40 space-y-1">
                <div className="flex items-center gap-2 font-black text-sm text-[#252525]">
                  <Sparkles size={16} className="text-[#E50914]" />
                  <span>Event Partner</span>
                </div>
                <p className="text-xs text-stone-600">Third-party service provider delivering decor, photography, catering, and entertainment setups.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#EF5350]/40 space-y-1">
                <div className="flex items-center gap-2 font-black text-sm text-[#252525]">
                  <Shield size={16} className="text-[#E50914]" />
                  <span>Grab2GO Platform</span>
                </div>
                <p className="text-xs text-stone-600">Digital marketplace facilitating search, scheduling, payment processing, and customer support.</p>
              </div>
            </div>
          </section>

          {/* Section 3: Cafe Bookings */}
          <section id="bookings" className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-3 scroll-mt-24">
            <h2 className="text-xl font-black text-[#252525]">3. Cafe Bookings & Reservations</h2>
            <p className="text-sm font-medium text-stone-600 leading-relaxed">
              When a booking is confirmed, the cafe owner agrees to reserve the specified slot exclusively for the customer. Customers must arrive on time and adhere to venue capacity limits.
            </p>
          </section>

          {/* Section 4: Event Services */}
          <section id="event-services" className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-3 scroll-mt-24">
            <h2 className="text-xl font-black text-[#252525]">4. Event Service Arrangements</h2>
            <p className="text-sm font-medium text-stone-600 leading-relaxed">
              Add-on event arrangements selected during checkout are executed by independent event partners. Grab2GO monitors quality control but is not directly liable for partner performance.
            </p>
          </section>

          {/* Section 5: Pricing, Fees & GST */}
          <section id="pricing-fees" className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-3 scroll-mt-24">
            <h2 className="text-xl font-black text-[#252525]">5. Pricing, Platform Fees & GST</h2>
            <p className="text-sm font-medium text-stone-600 leading-relaxed">
              Grab2GO provides full fee transparency on every booking summary:
            </p>
            <div className="bg-[#FFF5F5] p-4 rounded-2xl border border-[#EF5350]/60 text-xs font-bold text-stone-800 space-y-1.5">
              <p>• <strong>Subtotal:</strong> Combined hourly cafe charge and selected event package costs.</p>
              <p>• <strong>Platform Fee:</strong> 3% calculated on the subtotal (`subtotal * 0.03`).</p>
              <p>• <strong>Transaction Fee:</strong> 3% calculated on the subtotal (`subtotal * 0.03`).</p>
              <p>• <strong>GST:</strong> 18% tax calculated strictly on the Transaction Fee (`transactionFee * 0.18`).</p>
            </div>
          </section>

          {/* Section 6: Payments & Settlement */}
          <section id="payments" className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-3 scroll-mt-24">
            <h2 className="text-xl font-black text-[#252525]">6. Payments & Settlement</h2>
            <p className="text-sm font-medium text-stone-600 leading-relaxed">
              All payments must be completed online via Cashfree prior to slot confirmation. Funds are held securely and settled to venue hosts and partners after successful fulfillment.
            </p>
          </section>

          {/* Section 7: User Responsibilities */}
          <section id="responsibilities" className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-3 scroll-mt-24">
            <h2 className="text-xl font-black text-[#252525]">7. User Conduct & Responsibilities</h2>
            <p className="text-sm font-medium text-stone-600 leading-relaxed">
              Users must refrain from causing property damage, submitting fraudulent reviews, or attempting unauthorized platform access.
            </p>
          </section>

          {/* Section 8: Cancellation & Refunds */}
          <section id="cancellation-overview" className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-3 scroll-mt-24">
            <h2 className="text-xl font-black text-[#252525]">8. Cancellation & Refunds Overview</h2>
            <p className="text-sm font-medium text-stone-600 leading-relaxed">
              Cancellations made more than 9 hours prior to slot start are eligible for refunds according to our dedicated <a href="/cancellation" className="text-[#E50914] font-black underline">Cancellation Policy</a>.
            </p>
          </section>

          {/* Section 9: Limitation of Liability */}
          <section id="liability" className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-3 scroll-mt-24">
            <h2 className="text-xl font-black text-[#252525]">9. Limitation of Liability</h2>
            <p className="text-sm font-medium text-stone-600 leading-relaxed">
              Grab2GO provides the marketplace "as-is". To the maximum extent permitted by law, Grab2GO shall not be liable for indirect or consequential damages arising from venue operations.
            </p>
          </section>

          {/* Section 10: Dispute Resolution */}
          <section id="disputes" className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-3 scroll-mt-24">
            <h2 className="text-xl font-black text-[#252525]">10. Dispute Resolution & Governing Law</h2>
            <p className="text-sm font-medium text-stone-600 leading-relaxed">
              These terms are governed by the laws of India. Any disputes shall be subject to exclusive jurisdiction in relevant courts.
            </p>
          </section>

          {/* Section 11: Contact */}
          <section id="contact-terms" className="bg-[#FFF5F5] p-6 sm:p-8 rounded-3xl border border-[#EF5350]/60 shadow-xs space-y-3 scroll-mt-24">
            <h2 className="text-xl font-black text-[#252525]">11. Contact Information</h2>
            <p className="text-xs font-bold text-stone-600">For legal inquiries or terms clarification:</p>
            <p className="text-xs font-black text-[#E50914] flex items-center gap-2">
              <Mail size={14} /> vexatech.connect@gmail.com
            </p>
          </section>

        </div>

        {/* Sticky Desktop Table of Contents */}
        <div className="hidden xl:block w-64 shrink-0 sticky top-24 space-y-2">
          <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-xs">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-3 px-2">On This Page</h3>
            <nav className="space-y-1 text-xs font-bold">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-all block truncate ${
                    activeSection === s.id 
                      ? 'bg-[#FFF5F5] text-[#E50914] font-black border border-[#EF5350]/50' 
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
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
