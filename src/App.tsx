/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutTheme } from './components/AboutTheme';
import { Speakers } from './components/Speakers';
import { Deliverables } from './components/Deliverables';
import { SponsorsMarquee } from './components/SponsorsMarquee';
import { VenueTravel } from './components/VenueTravel';
import { TicketsPasses, PassesTabType } from './components/TicketsPasses';
import { CtaBanner } from './components/CtaBanner';
import { Footer } from './components/Footer';
import { FreePassModal } from './components/FreePassModal';
import { DelegateRegistrationModal } from './components/DelegateRegistrationModal';
import { ExhibitionBookingModal } from './components/ExhibitionBookingModal';
import { SponsorshipInquiryModal } from './components/SponsorshipInquiryModal';
import { ArticleModal } from './components/ArticleModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { ProgrammePage } from './components/ProgrammePage';
import { generateIcsFile } from './utils/calendar';
import { Check } from 'lucide-react';

export default function App() {
  // Separate modal states for each distinct registration pathway
  const [isFreePassOpen, setIsFreePassOpen] = useState(false);
  const [isDelegateOpen, setIsDelegateOpen] = useState(false);
  const [delegateTier, setDelegateTier] = useState<string | undefined>(undefined);

  const [isExhibitionOpen, setIsExhibitionOpen] = useState(false);
  const [exhibitionStand, setExhibitionStand] = useState<string | undefined>(undefined);

  const [isSponsorshipOpen, setIsSponsorshipOpen] = useState(false);
  const [sponsorshipPackage, setSponsorshipPackage] = useState<string | undefined>(undefined);

  // Active track selection within the Passes & Packages section
  const [activePassesTab, setActivePassesTab] = useState<PassesTabType>('delegates');

  const [currentPage, setCurrentPage] = useState<'home' | 'programme'>(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path.includes('programme') || hash.includes('programme')) {
      return 'programme';
    }
    return 'home';
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('programme') || hash.includes('programme')) {
        setCurrentPage('programme');
      } else {
        setCurrentPage('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const handleNavigateProgramme = () => {
    setCurrentPage('programme');
    try {
      window.history.pushState(null, '', '/programme');
    } catch {
      window.location.hash = '#/programme';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = (targetAnchor?: string) => {
    setCurrentPage('home');
    try {
      window.history.pushState(null, '', targetAnchor || '/');
    } catch {
      window.location.hash = targetAnchor || '#';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (targetAnchor) {
      setTimeout(() => {
        const id = targetAnchor.replace('#', '');
        const el = document.getElementById(id) || document.getElementById('passes');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [calendarToast, setCalendarToast] = useState(false);

  // Check URL hash (#admin) or query parameter (?admin=1) for silent entry
  useEffect(() => {
    const checkAdminTrigger = () => {
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      if (hash === '#admin' || params.get('admin') === 'true' || params.get('admin') === '1') {
        setIsAdminOpen(true);
      }
    };
    checkAdminTrigger();
    window.addEventListener('hashchange', checkAdminTrigger);
    return () => window.removeEventListener('hashchange', checkAdminTrigger);
  }, []);

  // Silent keyboard shortcut: Ctrl+Shift+A or Cmd+Shift+A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Dedicated opening handlers
  const handleOpenFreePass = () => {
    setIsFreePassOpen(true);
  };

  const handleOpenDelegate = (tier?: string) => {
    setDelegateTier(tier);
    setIsDelegateOpen(true);
  };

  const handleOpenExhibition = (stand?: string) => {
    setExhibitionStand(stand);
    setIsExhibitionOpen(true);
  };

  const handleOpenSponsorship = (pkg?: string) => {
    setSponsorshipPackage(pkg);
    setIsSponsorshipOpen(true);
  };

  // Smart dispatcher for generic buttons (Navbar, Hero, CTA banners)
  const handleSmartRegister = (tierOrPass?: string) => {
    if (!tierOrPass) {
      handleOpenDelegate();
      return;
    }
    const lower = tierOrPass.toLowerCase();
    if (lower.includes('free') || lower.includes('expo floor')) {
      handleOpenFreePass();
    } else if (lower.includes('exhibit') || lower.includes('stand') || lower.includes('booth')) {
      handleOpenExhibition(tierOrPass);
    } else if (
      lower.includes('sponsor') ||
      lower.includes('headline') ||
      lower.includes('track') ||
      lower.includes('accord') ||
      lower.includes('partner')
    ) {
      handleOpenSponsorship(tierOrPass);
    } else {
      handleOpenDelegate(tierOrPass);
    }
  };

  const handleDownloadIcs = () => {
    generateIcsFile();
    setCalendarToast(true);
    setTimeout(() => {
      setCalendarToast(false);
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-[#0A1428] text-[#B8C2D6] flex flex-col font-sans selection:bg-[#D81B60] selection:text-white">
      {/* 1. Sticky Glass Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigateProgramme={handleNavigateProgramme}
        onNavigateHome={handleNavigateHome}
        onOpenRegister={handleSmartRegister}
        onDownloadIcs={handleDownloadIcs}
        onSelectNavTab={(tab) => {
          setActivePassesTab(tab);
          const targetId =
            tab === 'delegates'
              ? 'tickets'
              : tab === 'exhibition'
              ? 'exhibitions'
              : tab === 'partnerships'
              ? 'sponsorship'
              : 'rate-card';
          const el = document.getElementById(targetId) || document.getElementById('passes');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {currentPage === 'programme' ? (
        <ProgrammePage
          onNavigateHome={handleNavigateHome}
          onOpenRegister={handleSmartRegister}
          onOpenFreePass={handleOpenFreePass}
          onDownloadIcs={handleDownloadIcs}
          onSelectNavTab={(tab) => {
            setActivePassesTab(tab);
            handleNavigateHome(
              tab === 'delegates' ? '#tickets' : tab === 'exhibition' ? '#exhibitions' : '#sponsorship'
            );
          }}
        />
      ) : (

      <main className="flex-1">
        {/* 2. Dark Immersive Hero with Subtle Radial Glow & Slim Countdown */}
        <Hero
          onOpenRegister={() => handleSmartRegister()}
          onOpenFreePass={handleOpenFreePass}
          onDownloadIcs={handleDownloadIcs}
          onNavigateProgramme={handleNavigateProgramme}
        />

        {/* 3. About / Theme Section (Light Section with 1px Dividers) */}
        <AboutTheme />

        {/* 4. Delegation & Attendees (Dark Section) */}
        <Speakers />

        {/* 5. Sponsors & Partner Domains (Light Section) */}
        <SponsorsMarquee
          onOpenRegister={handleSmartRegister}
        />

        {/* 6. Deliverables & Measurable Outcomes (Dark Section) */}
        <Deliverables />

        {/* 7. Tickets & Corporate Rate Card (Light Section) */}
        <TicketsPasses
          activeTab={activePassesTab}
          onTabChange={setActivePassesTab}
          onOpenFreePass={handleOpenFreePass}
          onOpenDelegatePass={handleOpenDelegate}
          onOpenExhibitionStand={handleOpenExhibition}
          onOpenSponsorship={handleOpenSponsorship}
          onSelectPass={handleSmartRegister}
        />

        {/* 8. Venue & Travel Destination (Dark Section) */}
        <VenueTravel
          onDownloadIcs={handleDownloadIcs}
        />

        {/* 9. Final Action Banner (Light Section with 1 Magenta CTA) */}
        <CtaBanner
          onOpenRegister={() => handleSmartRegister()}
          onDownloadIcs={handleDownloadIcs}
          onNavigateProgramme={handleNavigateProgramme}
        />
      </main>
      )}

      {/* 12. Institutional Footer with Discrete Admin Trigger */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* =========================================================================
          SEPARATE DEDICATED MODALS (NOT A SINGLE MONOLITHIC FORM)
          ========================================================================= */}
      
      {/* 1. Dedicated Attend Exhibition for Free Modal (Instant Confirmation & Ticket) */}
      <FreePassModal
        isOpen={isFreePassOpen}
        onClose={() => setIsFreePassOpen(false)}
      />

      {/* 2. Dedicated Delegate Registration Modal (4 Delegate Tiers + Team 3-Pack) */}
      <DelegateRegistrationModal
        isOpen={isDelegateOpen}
        onClose={() => {
          setIsDelegateOpen(false);
          setDelegateTier(undefined);
        }}
        initialTier={delegateTier}
      />

      {/* 3. Dedicated Exhibition Stand Booking Modal (3m x 3m Shell Scheme + 2 Badges) */}
      <ExhibitionBookingModal
        isOpen={isExhibitionOpen}
        onClose={() => {
          setIsExhibitionOpen(false);
          setExhibitionStand(undefined);
        }}
        initialStand={exhibitionStand}
      />

      {/* 4. Dedicated Sponsorship & Track Accords Inquiry Modal */}
      <SponsorshipInquiryModal
        isOpen={isSponsorshipOpen}
        onClose={() => {
          setIsSponsorshipOpen(false);
          setSponsorshipPackage(undefined);
        }}
        initialPackage={sponsorshipPackage}
      />

      {/* Article Detail Modal */}
      <ArticleModal
        articleTitle={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      {/* Secretariat Administration Console */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* Floating Toast Notification when Calendar file is downloaded */}
      {calendarToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0E1C38] border border-white/10 text-white px-5 py-3.5 rounded-[12px] shadow-2xl flex items-center gap-3 text-xs font-semibold">
          <div className="p-1.5 rounded-full bg-emerald-500 text-white">
            <Check className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-bold text-white">BMIC 2026 Added to Calendar</div>
            <div className="text-[#B8C2D6] text-[11px] font-normal">
              Friday, 30 October 2026 · Royal Aria Conference Centre
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
