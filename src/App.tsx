/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutTheme } from './components/AboutTheme';
import { Speakers } from './components/Speakers';
import { FullAgenda } from './components/FullAgenda';
import { Deliverables } from './components/Deliverables';
import { SponsorsMarquee } from './components/SponsorsMarquee';
import { VenueTravel } from './components/VenueTravel';
import { TicketsPasses } from './components/TicketsPasses';
import { NewsInsights } from './components/NewsInsights';
import { CtaBanner } from './components/CtaBanner';
import { Footer } from './components/Footer';
import { RegistrationModal } from './components/RegistrationModal';
import { ArticleModal } from './components/ArticleModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { generateIcsFile } from './utils/calendar';
import { Check } from 'lucide-react';

export default function App() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedPass, setSelectedPass] = useState<string | undefined>(undefined);
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

  const handleOpenRegister = (tierOrPass?: string) => {
    setSelectedPass(tierOrPass);
    setIsRegisterOpen(true);
  };

  const handleCloseRegister = () => {
    setIsRegisterOpen(false);
    setSelectedPass(undefined);
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
        onOpenRegister={handleOpenRegister}
        onDownloadIcs={handleDownloadIcs}
      />

      <main className="flex-1">
        {/* 2. Dark Immersive Hero with Subtle Radial Glow & Slim Countdown */}
        <Hero
          onOpenRegister={() => handleOpenRegister()}
          onDownloadIcs={handleDownloadIcs}
        />

        {/* 3. About / Theme Section (Light Section with 1px Dividers) */}
        <AboutTheme />

        {/* 4. Delegation & Attendees (Dark Section with Large Numerals 01, 02) */}
        <Speakers />

        {/* 5. Programme Schedule (Light Section with 1px Dividers & Clean Tabs) */}
        <FullAgenda
          onDownloadIcs={handleDownloadIcs}
        />

        {/* 6. Deliverables & Measurable Outcomes (Dark Section with Large Numerals 01-06) */}
        <Deliverables />

        {/* 7. Sponsors & Partner Domains (Light Section with Large Numerals 01-06) */}
        <SponsorsMarquee
          onOpenRegister={handleOpenRegister}
        />

        {/* 8. Venue & Travel Destination (Dark Section with 1px Dividers) */}
        <VenueTravel
          onDownloadIcs={handleDownloadIcs}
        />

        {/* 9. Tickets & Corporate Rate Card (Light Section with Large Price Numerals) */}
        <TicketsPasses
          onSelectPass={handleOpenRegister}
        />

        {/* 10. News & Insights (Dark Section with 1px Dividers) */}
        <NewsInsights
          onOpenArticle={(title) => setSelectedArticle(title)}
        />

        {/* 11. Final Action Banner (Light Section with 1 Magenta CTA) */}
        <CtaBanner
          onOpenRegister={() => handleOpenRegister()}
          onDownloadIcs={handleDownloadIcs}
        />
      </main>

      {/* 12. Institutional Footer with Discrete Admin Trigger */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Modals */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={handleCloseRegister}
        initialSelection={selectedPass}
      />

      <ArticleModal
        articleTitle={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      {/* Silent Secretariat Administration Console */}
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
