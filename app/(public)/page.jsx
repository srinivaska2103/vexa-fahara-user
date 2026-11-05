'use client';

import HomeNavbar from '@/app/components/home/HomeNavbar';
import HomeHero from '@/app/components/home/HomeHero';
import HomeDualChoiceSection from '@/app/components/home/HomeDualChoiceSection';
import HomeWhatIsFahara from '@/app/components/home/HomeWhatIsFahara';
import HomeHowItWorks from '@/app/components/home/HomeHowItWorks';
import HomeWhatCanYouFind from '@/app/components/home/HomeWhatCanYouFind';
import HomeSearchPanel from '@/app/components/home/HomeSearchPanel';
import HomeCategorySection from '@/app/components/home/HomeCategorySection';
import HomePopularPlaces from '@/app/components/home/HomePopularPlaces';
import HomeDealsSection from '@/app/components/home/HomeDealsSection';
import HomeEventDiscovery from '@/app/components/home/HomeEventDiscovery';
import HomeWhyFahara from '@/app/components/home/HomeWhyFahara';
import HomeSubscriptionSection from '@/app/components/home/HomeSubscriptionSection';
import HomeTrustSection from '@/app/components/home/HomeTrustSection';
import HomeFaqSection from '@/app/components/home/HomeFaqSection';
import HomeBecomePartnerForm from '@/app/components/home/HomeBecomePartnerForm';
import HomeFinalCTA from '@/app/components/home/HomeFinalCTA';
import Footer from '@/app/components/home/Footer';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Store, Coffee, Utensils, PartyPopper, CheckCircle2, ArrowRight, ArrowDown, Eye, LayoutDashboard,
  Zap, TrendingUp, UserPlus, ShieldCheck, RotateCcw, ChevronDown, User, Search, Compass, CalendarCheck,
  Sparkles, Camera, Tag, BarChart3
} from 'lucide-react';
import { FAHARA_LINKS, getPartnerSignupUrl } from '@/app/constants/faharaLinks';

export default function HomePage() {
  const [selectedPartnerType, setSelectedPartnerType] = useState('CAFE');
  const [openPartnerFaq, setOpenPartnerFaq] = useState(null);

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#FFF5F5] font-sans antialiased text-[#252525] selection:bg-[#E50914] selection:text-white">
      
      {/* 1. NAVIGATION BAR */}
      <HomeNavbar />

      {/* 2. HERO SECTION */}
      <HomeHero />

      {/* 3. HOW GRAB2GO WORKS (EXACT WORKFLOW STRIP BELOW HERO) */}
      <HomeHowItWorks />

      {/* 4. WHY CHOOSE GRAB2GO (EXACT UI BELOW HOW IT WORKS) */}
      <HomeWhyFahara />

      {/* 5. SUBSCRIPTION PLANS FOR BUSINESS PARTNERS (EXACT ATTACHED UI) */}
      <HomeSubscriptionSection />

      {/* 6. BECOME A Grab2GO PARTNER (WHATSAPP ENQUIRY FORM) */}
      <HomeBecomePartnerForm />

      {/* 7. FINAL CTA BANNER */}
      <HomeFinalCTA />

      {/* 8. DARK-BROWN FOOTER */}
      <Footer />

    </div>
  );
}
