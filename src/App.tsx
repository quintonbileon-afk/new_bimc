/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutTheme } from './components/AboutTheme';
import { Speakers } from './components/Speakers';
import { TopicsTracks } from './components/TopicsTracks';
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
import { generateIcsFile } from './utils/calendar';
import { Check } from 'lucide-react';

export default function App() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedPass, setSelectedPass] = useState<string | undefined>(undefined);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [calendarToast, setCalendarToast] = useState(false);

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
    <div className="min-h-screen bg-[#07101F] text-slate-100 flex flex-col font-sans selection:bg-[#D61356] selection:text-white">
      {/* 1. Sticky Glass Navbar */}
      <Navbar
        onOpenRegister={handleOpenRegister}
        onDownloadIcs={handleDownloadIcs}
      />

      <main className="flex-1">
        {/* 2. Dark Immersive Hero with Particle Network, Countdown & Stats */}
        <Hero
          onOpenRegister={() => handleOpenRegister()}
          onDownloadIcs={handleDownloadIcs}
        />

        {/* 3. About / Theme Section (Split Layout with Dot-Matrix Visual & 6 Challenges) */}
        <AboutTheme />

        {/* 4. Speakers & Panel Chairs (Modern Cards with Grayscale-to-Color & Carousel) */}
        <Speakers />

        {/* 5. Topics / Tracks (Bento Grid of Cards with Hover Glow) */}
        <TopicsTracks />

        {/* 6. Programme / Agenda (Tabbed Timeline with Color-Coded Pills & Expand/Collapse) */}
        <FullAgenda
          onDownloadIcs={handleDownloadIcs}
        />

        {/* 7. Deliverables & Measurable Outcomes */}
        <Deliverables />

        {/* 8. Sponsors & Partners (Tiered Logo Wall with Infinite Marquee) */}
        <SponsorsMarquee
          onOpenRegister={handleOpenRegister}
        />

        {/* 9. Venue & Travel Guide (Royal Aria Conference Centre) */}
        <VenueTravel
          onDownloadIcs={handleDownloadIcs}
        />

        {/* 10. Tickets & Registration Passes (3 Elevated Cards with Popular Badge) */}
        <TicketsPasses
          onSelectPass={handleOpenRegister}
        />

        {/* 11. News & Insights (Editorial-style Article Cards) */}
        <NewsInsights
          onOpenArticle={(title) => setSelectedArticle(title)}
        />

        {/* 12. Final Full-Width CTA Banner */}
        <CtaBanner
          onOpenRegister={() => handleOpenRegister()}
          onDownloadIcs={handleDownloadIcs}
        />
      </main>

      {/* 13. Rich Footer with Newsletter & Secretariat Details */}
      <Footer />

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

      {/* Floating Toast Notification when Calendar file is downloaded */}
      {calendarToast && (
        <div className="fixed bottom-6 right-6 z-50 glass-panel-dark border border-white/20 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in text-xs font-semibold">
          <div className="p-1.5 rounded-full bg-emerald-500 text-white">
            <Check className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-bold text-white">BMIC 2026 Added to Calendar</div>
            <div className="text-slate-400 text-[11px] font-normal">
              Friday, 30 October 2026 · Royal Aria Conference Centre
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
