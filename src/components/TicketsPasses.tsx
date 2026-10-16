import React, { useState, useEffect } from 'react';
import { DELEGATE_PASS_TIERS, CORPORATE_RATE_CARD, EVENT_DETAILS } from '../data/bmicContent';
import {
  Check,
  ArrowRight,
  Wifi,
  Sparkles,
  Award,
  Zap,
  Building2,
  Table,
  ChevronDown,
  ChevronUp,
  Ticket,
  CheckCircle2,
  Crown
} from 'lucide-react';

export type PassesTabType = 'delegates' | 'exhibition' | 'partnerships' | 'rate-card-table';

interface TicketsPassesProps {
  activeTab?: PassesTabType;
  onTabChange?: (tab: PassesTabType) => void;
  onOpenDelegatePass: (passName: string) => void;
  onOpenExhibitionStand: (standTitle: string) => void;
  onOpenSponsorship: (packageName: string) => void;
  onOpenFreePass: () => void;
  onSelectPass?: (passName: string) => void;
}

export const TicketsPasses: React.FC<TicketsPassesProps> = ({
  activeTab: activeTabProp,
  onTabChange,
  onOpenDelegatePass,
  onOpenExhibitionStand,
  onOpenSponsorship,
  onOpenFreePass,
  onSelectPass,
}) => {
  const [internalTab, setInternalTab] = useState<PassesTabType>('delegates');
  const [expandedPassId, setExpandedPassId] = useState<string | null>(null);

  const currentTab = activeTabProp !== undefined ? activeTabProp : internalTab;

  const setActiveTab = (tab: PassesTabType) => {
    setInternalTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  // Sync with URL hashes (#tickets, #exhibitions, #sponsorship, #rate-card, #passes)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#tickets' || hash === '#passes') {
        setActiveTab('delegates');
      } else if (hash === '#exhibitions' || hash === '#exhibition' || hash === '#stands') {
        setActiveTab('exhibition');
      } else if (hash === '#sponsorship' || hash === '#sponsorships' || hash === '#partnerships') {
        setActiveTab('partnerships');
      } else if (hash === '#rate-card' || hash === '#rates') {
        setActiveTab('rate-card-table');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Fallback handlers
  const handleDelegateSelect = (name: string) => {
    if (onOpenDelegatePass) onOpenDelegatePass(name);
    else if (onSelectPass) onSelectPass(name);
  };

  const handleExhibitionSelect = (name: string) => {
    if (onOpenExhibitionStand) onOpenExhibitionStand(name);
    else if (onSelectPass) onSelectPass(name);
  };

  const handleSponsorshipSelect = (name: string) => {
    if (onOpenSponsorship) onOpenSponsorship(name);
    else if (onSelectPass) onSelectPass(name);
  };

  // 4 Paid Delegate Pass Tiers strictly aligned with light section palette
  const paidPasses = [
    {
      ...DELEGATE_PASS_TIERS.find((p) => p.id === 'student-developer') || DELEGATE_PASS_TIERS[3],
      code: 'DEV-01',
      category: 'Builders & Tech Talent',
      badge: undefined,
    },
    {
      ...DELEGATE_PASS_TIERS.find((p) => p.id === 'standard-delegate') || DELEGATE_PASS_TIERS[0],
      code: 'STD-02',
      category: 'Professional Access',
      badge: undefined,
    },
    {
      ...DELEGATE_PASS_TIERS.find((p) => p.id === 'corporate-delegate') || DELEGATE_PASS_TIERS[1],
      code: 'CORP-03',
      category: 'Executive Pass',
      badge: 'Most Popular',
      isPopular: true,
    },
    {
      ...DELEGATE_PASS_TIERS.find((p) => p.id === 'corporate-pack') || DELEGATE_PASS_TIERS[2],
      code: 'TEAM-04',
      category: 'Enterprise 3-Pack',
      badge: undefined,
    },
  ];

  return (
    <section
      id="passes"
      className="py-12 sm:py-16 lg:py-24 bg-[#F7F8FA] text-[#0A1428] border-b border-slate-200/80 relative overflow-hidden"
    >
      {/* Scroll Anchors for Navbar direct jumps */}
      <div id="tickets" className="relative -top-28 pointer-events-none" />
      <div id="exhibitions" className="relative -top-28 pointer-events-none" />
      <div id="sponsorship" className="relative -top-28 pointer-events-none" />
      <div id="rate-card" className="relative -top-28 pointer-events-none" />

      {/* Subtle ambient lighting for light theme */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#2F6DB5]/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#D81B60]/[0.03] rounded-full blur-[140px] pointer-events-none" />

      {/* TARGET CONTAINER (section#passes > div:nth-of-type(3)) */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Child 1: Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1.5 rounded-full bg-slate-200/60 border border-slate-300/60">
              <span className="w-2 h-2 rounded-full bg-[#2F6DB5]" />
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#2F6DB5] font-semibold">
                06 / Registration &amp; Participation Tracks
              </p>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A1428] tracking-tight font-display">
              CONGRESS PASSES &amp; PACKAGES
            </h2>
          
          </div>
        </div>

        {/* Child 2: PROMINENT FREE EXHIBITION PASS (OUTSIDE ALL PACKAGES & TABS)
            Styled as high-contrast prominent card in the light theme */}
        <div className="mb-12 relative group/free">
          {/* Subtle outer blue/magenta glow highlight */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2F6DB5]/30 via-[#D81B60]/20 to-[#2F6DB5]/30 rounded-3xl blur-sm opacity-50 group-hover/free:opacity-80 transition duration-500" />

          <div className="relative bg-white rounded-3xl p-6 sm:p-8 lg:p-10 text-[#0A1428] shadow-xl border-2 border-[#2F6DB5]/30 hover:border-[#2F6DB5] overflow-hidden transition-all duration-300">
            {/* Background texture & radial glow */}
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#2F6DB5]/[0.06] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute left-1/3 -bottom-20 w-72 h-72 bg-[#D81B60]/[0.04] rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              {/* Left Column: Details & Highlights */}
              <div className="flex-1 space-y-3">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-[#2F6DB5]/10 text-[#2F6DB5] border border-[#2F6DB5]/20">
                    Complimentary Exhibition Access
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-display text-[#0A1428]">
                    Free Exhibition Floor Pass
                  </h3>
                  <p className="text-sm sm:text-base text-[#4A5568] mt-2 max-w-3xl leading-relaxed">
                    Explore  exhibits, witness live startup demonstrations, and connect across the main networking floor at the Royal Aria Conference Centre at no cost.
                  </p>
                </div>

                <p className="text-[11px] text-[#4A5568]/80">
                  * Note: Plenary auditorium seating, catered executive lunch, and sovereign ministerial roundtables require a paid Delegate Pass below.
                </p>
              </div>

              {/* Right Column: Pricing & Prominent Magenta CTA */}
              <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-5 pt-6 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                <div className="text-left lg:text-right">
                  <div className="font-mono text-[11px] text-[#2F6DB5] font-bold uppercase tracking-wider">
                    Registration Fee
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-[#0A1428] font-display tracking-tight">
                    BWP 0
                  </div>
                  <div className="text-xs text-[#4A5568] mt-0.5">
                    Free / 100% Complimentary
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onOpenFreePass}
                  className="w-full sm:w-auto btn-cta-magenta px-8 py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_8px_25px_rgba(216,27,96,0.35)] hover:scale-[1.02] transition-transform"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Claim Free Exhibition Pass</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Child 3: SEPARATE TRACKS TAB NAVIGATION BLOCK
            (TARGET PARENT: div:nth-of-type(3)) */}
        <div className="flex flex-col gap-5 mb-8">
          {/* Child 1: Heading Block (div:nth-of-type(1)) */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#2F6DB5] font-bold block mb-1">
                Select Participation Stream
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0A1428] font-display">
                Dedicated Registration Pathways
              </h3>
            </div>
           
          </div>

          {/* Child 2: THE TARGET ELEMENT (div:nth-of-type(3) > div:nth-of-type(2))
              Ultra-prominent, full-width 4-track switcher with high-contrast light theme */}
          <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 p-2 sm:p-2.5 bg-white border-2 border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-lg">
            {/* 1. Delegate Passes */}
            <button
              type="button"
              onClick={() => setActiveTab('delegates')}
              className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 text-left relative overflow-hidden group ${
                currentTab === 'delegates'
                  ? 'bg-[#2F6DB5] text-white border-2 border-[#2F6DB5] shadow-[0_8px_20px_rgba(47,109,181,0.35)] scale-[1.01]'
                  : 'bg-slate-50 hover:bg-slate-100 text-[#4A5568] hover:text-[#0A1428] border border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  currentTab === 'delegates' ? 'bg-white/20 text-white shadow-sm' : 'bg-white text-[#2F6DB5] border border-slate-200 shadow-xs'
                }`}>
                  <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className={`text-[10px] sm:text-[11px] font-mono uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                  currentTab === 'delegates' ? 'bg-white/20 text-white' : 'bg-[#2F6DB5]/10 text-[#2F6DB5] border border-[#2F6DB5]/20'
                }`}>
                  4 Tiers
                </span>
              </div>
              <div>
                <div className={`text-sm sm:text-base font-extrabold font-display tracking-tight flex items-center gap-1.5 ${
                  currentTab === 'delegates' ? 'text-white' : 'text-[#0A1428]'
                }`}>
                  <span>Tickets &amp; Passes</span>
                  {currentTab === 'delegates' && (
                    <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white]" />
                  )}
                </div>
                <p className={`text-[11px] mt-0.5 truncate ${
                  currentTab === 'delegates' ? 'text-white/80' : 'text-slate-500'
                }`}>
                  Delegate access &amp; 3-pack
                </p>
              </div>
            </button>

            {/* 2. Exhibition Stands */}
            <button
              type="button"
              onClick={() => setActiveTab('exhibition')}
              className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 text-left relative overflow-hidden group ${
                currentTab === 'exhibition'
                  ? 'bg-[#2F6DB5] text-white border-2 border-[#2F6DB5] shadow-[0_8px_20px_rgba(47,109,181,0.35)] scale-[1.01]'
                  : 'bg-slate-50 hover:bg-slate-100 text-[#4A5568] hover:text-[#0A1428] border border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  currentTab === 'exhibition' ? 'bg-white/20 text-white shadow-sm' : 'bg-white text-[#2F6DB5] border border-slate-200 shadow-xs'
                }`}>
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className={`text-[10px] sm:text-[11px] font-mono uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                  currentTab === 'exhibition' ? 'bg-white/20 text-white' : 'bg-[#2F6DB5]/10 text-[#2F6DB5] border border-[#2F6DB5]/20'
                }`}>
                  Expo Floor
                </span>
              </div>
              <div>
                <div className={`text-sm sm:text-base font-extrabold font-display tracking-tight flex items-center gap-1.5 ${
                  currentTab === 'exhibition' ? 'text-white' : 'text-[#0A1428]'
                }`}>
                  <span>Exhibitions</span>
                  {currentTab === 'exhibition' && (
                    <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white]" />
                  )}
                </div>
                <p className={`text-[11px] mt-0.5 truncate ${
                  currentTab === 'exhibition' ? 'text-white/80' : 'text-slate-500'
                }`}>
                  3x3m Stands &amp; 2 Passes
                </p>
              </div>
            </button>

            {/* 3. Sponsorship Accords */}
            <button
              type="button"
              onClick={() => setActiveTab('partnerships')}
              className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 text-left relative overflow-hidden group ${
                currentTab === 'partnerships'
                  ? 'bg-[#2F6DB5] text-white border-2 border-[#2F6DB5] shadow-[0_8px_20px_rgba(47,109,181,0.35)] scale-[1.01]'
                  : 'bg-slate-50 hover:bg-slate-100 text-[#4A5568] hover:text-[#0A1428] border border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  currentTab === 'partnerships' ? 'bg-white/20 text-white shadow-sm' : 'bg-white text-[#2F6DB5] border border-slate-200 shadow-xs'
                }`}>
                  <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className={`text-[10px] sm:text-[11px] font-mono uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                  currentTab === 'partnerships' ? 'bg-white/20 text-white' : 'bg-[#2F6DB5]/10 text-[#2F6DB5] border border-[#2F6DB5]/20'
                }`}>
                  Strategic
                </span>
              </div>
              <div>
                <div className={`text-sm sm:text-base font-extrabold font-display tracking-tight flex items-center gap-1.5 ${
                  currentTab === 'partnerships' ? 'text-white' : 'text-[#0A1428]'
                }`}>
                  <span>Sponsorship</span>
                  {currentTab === 'partnerships' && (
                    <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white]" />
                  )}
                </div>
                <p className={`text-[11px] mt-0.5 truncate ${
                  currentTab === 'partnerships' ? 'text-white/80' : 'text-slate-500'
                }`}>
                  Headline &amp; Track Accords
                </p>
              </div>
            </button>

            {/* 4. Rate Schedule */}
            <button
              type="button"
              onClick={() => setActiveTab('rate-card-table')}
              className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 text-left relative overflow-hidden group ${
                currentTab === 'rate-card-table'
                  ? 'bg-[#2F6DB5] text-white border-2 border-[#2F6DB5] shadow-[0_8px_20px_rgba(47,109,181,0.35)] scale-[1.01]'
                  : 'bg-slate-50 hover:bg-slate-100 text-[#4A5568] hover:text-[#0A1428] border border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  currentTab === 'rate-card-table' ? 'bg-white/20 text-white shadow-sm' : 'bg-white text-[#2F6DB5] border border-slate-200 shadow-xs'
                }`}>
                  <Table className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className={`text-[10px] sm:text-[11px] font-mono uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                  currentTab === 'rate-card-table' ? 'bg-white/20 text-white' : 'bg-[#2F6DB5]/10 text-[#2F6DB5] border border-[#2F6DB5]/20'
                }`}>
                  Matrix
                </span>
              </div>
              <div>
                <div className={`text-sm sm:text-base font-extrabold font-display tracking-tight flex items-center gap-1.5 ${
                  currentTab === 'rate-card-table' ? 'text-white' : 'text-[#0A1428]'
                }`}>
                  <span>Rate Schedule</span>
                  {currentTab === 'rate-card-table' && (
                    <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white]" />
                  )}
                </div>
                <p className={`text-[11px] mt-0.5 truncate ${
                  currentTab === 'rate-card-table' ? 'text-white/80' : 'text-slate-500'
                }`}>
                  Official pricing matrix
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* =========================================================================
            TAB 1: DELEGATE PASSES (4-CARD GRID)
            ========================================================================= */}
        {currentTab === 'delegates' && (
          <div className="space-y-6">

            {/* 4-CARD DELEGATE PASSES GRID - Styled in crisp light theme */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-6">
              {paidPasses.map((pass) => {
                const isPopular = pass.isPopular;

                return (
                  <div
                    key={pass.id}
                    className={`group relative rounded-3xl flex flex-col justify-between transition-all duration-300 cursor-default select-none overflow-hidden ${
                      isPopular
                        ? 'bg-white border-2 border-[#D81B60] shadow-[0_20px_50px_-10px_rgba(216,27,96,0.22)] xl:-translate-y-2.5 z-20'
                        : 'bg-white border border-slate-200 hover:border-[#2F6DB5] text-[#0A1428] shadow-sm hover:shadow-xl hover:-translate-y-1.5 z-10'
                    }`}
                  >
                    {/* Top Lanyard Detail & Pass Code Bar */}
                    <div className={`pt-4 pb-2.5 px-5 flex items-center justify-between border-b ${
                      isPopular ? 'border-pink-100 bg-[#D81B60]/[0.04]' : 'border-slate-100 bg-slate-50/80'
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <Wifi className="w-3.5 h-3.5 rotate-90 text-[#2F6DB5]" />
                        <span className="font-mono text-[10.5px] font-bold tracking-wider text-[#4A5568]">
                          {pass.code}
                        </span>
                      </div>

                      {/* Lanyard punch hole aesthetic */}
                      <div className={`w-12 h-1.5 rounded-full transition-colors ${
                        isPopular ? 'bg-[#D81B60]/30 group-hover:bg-[#D81B60]' : 'bg-slate-200 group-hover:bg-[#2F6DB5]'
                      }`} />
                    </div>

                    {/* Badge Main Body */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Category & Badge */}
                        <div className="flex items-center justify-between gap-1.5 mb-3.5">
                          <span className="font-mono text-[10.5px] uppercase tracking-wider font-bold text-[#2F6DB5] bg-[#2F6DB5]/10 px-2.5 py-1 rounded-md border border-[#2F6DB5]/20">
                            {pass.category}
                          </span>
                          {pass.badge ? (
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#D81B60] text-white shadow-xs flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>{pass.badge}</span>
                            </span>
                          ) : (
                            <span className="font-mono text-[10px] font-medium text-slate-400">
                              {pass.priceNote?.split('·')[0]?.trim() || 'Access Tier'}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h4 className="text-xl font-bold tracking-tight leading-snug mb-2 font-display text-[#0A1428]">
                          {pass.name}
                        </h4>

                        <p className="text-xs leading-relaxed mb-5 line-clamp-2 text-[#4A5568]">
                          {pass.description}
                        </p>

                        {/* Price Frame */}
                        <div className={`py-4 px-4.5 rounded-2xl border mb-6 transition-colors ${
                          isPopular
                            ? 'bg-gradient-to-br from-pink-50/70 via-white to-rose-50/40 border-[#D81B60]/30'
                            : 'bg-gradient-to-b from-slate-50 to-slate-100/50 border-slate-200/90'
                        }`}>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums font-display text-[#0A1428]">
                              {pass.price}
                            </span>
                            <span className="font-mono text-xs font-semibold text-[#2F6DB5]">
                              BWP
                            </span>
                          </div>
                          <p className="text-[11px] mt-1 font-medium text-slate-500">
                            {pass.priceNote}
                          </p>
                        </div>

                        {/* Privileges Inclusions */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-mono text-[10px] uppercase tracking-wider font-bold block text-slate-500">
                              Privileges &amp; Access
                            </span>
                            {pass.features.length > 3 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedPassId(expandedPassId === pass.id ? null : pass.id);
                                }}
                                className="text-[10px] font-mono flex items-center gap-1 cursor-pointer py-0.5 px-2 rounded-lg border text-[#2F6DB5] bg-blue-50 border-blue-200 hover:bg-blue-100 transition-colors"
                              >
                                <span>{expandedPassId === pass.id ? 'Less' : 'All'}</span>
                                {expandedPassId === pass.id ? (
                                  <ChevronUp className="w-3 h-3" />
                                ) : (
                                  <ChevronDown className="w-3 h-3" />
                                )}
                              </button>
                            )}
                          </div>

                          <div className="space-y-2.5">
                            {(expandedPassId === pass.id ? pass.features : pass.features.slice(0, 4)).map((feat, idx) => (
                              <div key={idx} className="flex items-start gap-2.5 text-xs leading-snug text-[#4A5568]">
                                <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                                  isPopular ? 'text-[#D81B60]' : 'text-[#2F6DB5]'
                                }`} />
                                <span className={expandedPassId === pass.id ? '' : 'line-clamp-2'}>
                                  {feat}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Card Button */}
                      <div className="pt-4 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => handleDelegateSelect(pass.name)}
                          className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                            isPopular
                              ? 'btn-cta-magenta text-white shadow-[0_4px_16px_rgba(216,27,96,0.35)] hover:scale-[1.01]'
                              : 'bg-[#2F6DB5] hover:bg-[#255892] text-white shadow-xs'
                          }`}
                        >
                          <span>Register as Delegate</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: EXHIBITION STANDS
            ========================================================================= */}
        {currentTab === 'exhibition' && (
          <div className="max-w-4xl mx-auto mb-12 rounded-3xl p-8 sm:p-10 bg-white border border-slate-200 shadow-lg text-[#0A1428] space-y-8">
            {CORPORATE_RATE_CARD.exhibition.map((exhibit) => (
              <div key={exhibit.id} className="space-y-8">
                <div className="flex flex-col md:flex-row items-start md:items-baseline justify-between gap-6 pb-6 border-b border-slate-100">
                  <div>
                    <span className="font-mono text-[11px] uppercase font-bold tracking-wider text-[#2F6DB5] block mb-1">
                      Commercial Exhibition Floor
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#0A1428] tracking-tight font-display">
                      {exhibit.title}
                    </h3>
                    <p className="text-sm text-[#4A5568] mt-2 max-w-xl leading-relaxed">
                      {exhibit.description}
                    </p>
                  </div>

                  <div className="text-left md:text-right shrink-0 bg-[#2F6DB5]/10 p-4.5 rounded-2xl border border-[#2F6DB5]/20">
                    <div className="text-3xl sm:text-4xl font-black text-[#0A1428] tabular-nums font-display">
                      {exhibit.price}
                    </div>
                    <div className="text-xs text-[#2F6DB5] font-bold mt-1">
                      Includes 2 Full Delegate Passes
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                    Official Stand Specifications &amp; Entitlements:
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {exhibit.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#4A5568] bg-[#F7F8FA] p-3.5 rounded-xl border border-slate-200">
                        <Check className="w-4 h-4 text-[#2F6DB5] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <span className="font-mono text-xs text-slate-500">
                    Stands allocated on receipt of registration. Electrical &amp; fascia customisation included.
                  </span>
                  <button
                    type="button"
                    onClick={() => handleExhibitionSelect(exhibit.title)}
                    className="group bg-[#2F6DB5] hover:bg-[#255892] px-8 py-4 rounded-full text-xs font-bold text-white flex items-center justify-center gap-2.5 cursor-pointer shadow-md transition-all w-full sm:w-auto"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Reserve Exhibition Stand (Dedicated Form)</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =========================================================================
            TAB 3: SPONSORSHIPS
            ========================================================================= */}
        {currentTab === 'partnerships' && (
          <div className="space-y-8 mb-12">
            {/* Header intro */}
            <div className="bg-white rounded-3xl p-8 text-[#0A1428] shadow-md border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-[#2F6DB5]/10 border border-[#2F6DB5]/20">
                  <Crown className="w-3.5 h-3.5 text-[#2F6DB5]" />
                  <span className="font-mono text-[11px] uppercase tracking-wider font-bold text-[#2F6DB5]">
                    Sovereign Accords &amp; Track Leadership
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight font-display text-[#0A1428]">
                  Corporate Sponsorship &amp; Track Partnerships
                </h3>
                <p className="text-sm text-[#4A5568] mt-2 max-w-2xl leading-relaxed">
                  Position your enterprise alongside Government Ministries, regulators, and tier-1 operators with tailored speaking, branding, and ministerial bilateral roundtables.
                </p>
              </div>
              <div className="shrink-0 font-mono text-xs text-[#4A5568] bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200">
                <span className="text-[#0A1428] font-bold block mb-0.5">Category Exclusivity</span>
                <span>Protected industry accords</span>
              </div>
            </div>

            {/* Grid of Accord Packages */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              {CORPORATE_RATE_CARD.strategicPartnership.map((partner) => {
                const isHeadline = partner.id === 'headline-sponsor';

                return (
                  <div
                    key={partner.id}
                    className={`rounded-3xl flex flex-col justify-between transition-all duration-300 overflow-hidden ${
                      isHeadline
                        ? 'lg:col-span-3 bg-white text-[#0A1428] border-2 border-[#D81B60] shadow-[0_20px_50px_-15px_rgba(216,27,96,0.22)]'
                        : 'bg-white border border-slate-200 text-[#0A1428] shadow-sm hover:shadow-lg hover:border-[#2F6DB5]'
                    }`}
                  >
                    {/* Top strip */}
                    <div className={`h-2.5 w-full ${isHeadline ? 'bg-[#D81B60]' : 'bg-[#2F6DB5]'}`} />

                    <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                          <span className={`font-mono text-[11px] uppercase font-bold tracking-wider ${
                            isHeadline ? 'text-[#D81B60]' : 'text-[#2F6DB5]'
                          }`}>
                            {isHeadline ? 'Premier Congress Accord' : 'Thematic Track Leadership'}
                          </span>
                          {partner.badge && (
                            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                              isHeadline
                                ? 'bg-[#D81B60] text-white shadow-xs'
                                : 'bg-[#2F6DB5]/10 text-[#2F6DB5] border border-[#2F6DB5]/20'
                            }`}>
                              {partner.badge}
                            </span>
                          )}
                        </div>

                        <h4 className="text-xl sm:text-2xl font-bold tracking-tight mb-2 font-display text-[#0A1428]">
                          {partner.title}
                        </h4>

                        <p className="text-xs sm:text-sm leading-relaxed mb-6 text-[#4A5568]">
                          {partner.description}
                        </p>

                        {/* Price Frame */}
                        <div className="py-4 px-5 rounded-2xl border mb-6 flex items-baseline gap-2 bg-slate-50 border-slate-200">
                          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums font-display text-[#0A1428]">
                            {partner.price}
                          </span>
                          <span className="font-mono text-xs font-semibold text-[#2F6DB5]">
                            BWP
                          </span>
                        </div>

                        {/* Features */}
                        <div className="mb-6">
                          <div className={`font-mono text-[10.5px] uppercase tracking-wider font-bold mb-3 ${
                            isHeadline ? 'text-[#D81B60]' : 'text-slate-500'
                          }`}>
                            Entitlements &amp; Rights
                          </div>
                          <div className={`grid ${isHeadline ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-2.5`}>
                            {partner.features.map((feat, idx) => (
                              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm leading-snug text-[#4A5568]">
                                <Check className={`w-4 h-4 shrink-0 mt-0.5 ${
                                  isHeadline ? 'text-[#D81B60]' : 'text-[#2F6DB5]'
                                }`} />
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Button */}
                      <div className="pt-6 border-t border-slate-100 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleSponsorshipSelect(partner.title)}
                          className={`w-full sm:w-auto py-3.5 px-8 rounded-full text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all ${
                            isHeadline
                              ? 'btn-cta-magenta text-white shadow-[0_8px_25px_rgba(216,27,96,0.35)]'
                              : 'bg-[#2F6DB5] hover:bg-[#255892] text-white'
                          }`}
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Inquire for {partner.title}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: RATE SHEET OVERVIEW
            ========================================================================= */}
        {currentTab === 'rate-card-table' && (
          <div className="rounded-3xl p-7 sm:p-9 bg-white border border-slate-200 shadow-md mb-12 space-y-8 text-[#0A1428]">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-5 border-b border-slate-200">
              <div>
                <span className="font-mono text-[11px] uppercase font-bold tracking-wider text-[#2F6DB5]">
                  Official Master Rate Card Schedule
                </span>
                <h3 className="text-xl font-bold text-[#0A1428] tracking-tight mt-1 font-display">
                  BOTSWANA MOBILE &amp; INTERNET CONGRESS 2026
                </h3>
              </div>
              <div className="font-mono text-xs text-slate-500">
                30 October 2026 · Royal Aria · 250+ Senior Leaders
              </div>
            </div>

            {/* Delegate Access */}
            <div>
              <h4 className="font-mono text-xs uppercase font-bold tracking-wider text-[#2F6DB5] mb-4">
                Delegate Access Passes
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase font-mono text-[10.5px]">
                      <th className="py-3 pr-4">Category</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 pl-4 text-right">Price</th>
                      <th className="py-3 pl-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {CORPORATE_RATE_CARD.delegateAccess.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 pr-4 font-semibold text-[#0A1428] whitespace-nowrap">
                          {item.title}
                        </td>
                        <td className="py-4 px-4 text-[#4A5568]">
                          {item.description}
                        </td>
                        <td className="py-4 pl-4 text-right font-bold text-[#0A1428] whitespace-nowrap tabular-nums font-display">
                          {item.price}
                        </td>
                        <td className="py-4 pl-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => {
                              if (item.price === 'Free') onOpenFreePass();
                              else handleDelegateSelect(item.title);
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              item.price === 'Free'
                                ? 'btn-cta-magenta text-white shadow-xs'
                                : 'bg-slate-100 hover:bg-[#2F6DB5] text-[#0A1428] hover:text-white border border-slate-200'
                            }`}
                          >
                            {item.price === 'Free' ? 'Claim Free' : 'Register'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Strategic Partnerships Table */}
            <div className="border-t border-slate-200 pt-6">
              <h4 className="font-mono text-xs uppercase font-bold tracking-wider text-[#2F6DB5] mb-4">
                Strategic Partnerships &amp; Track Accords
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <tbody className="divide-y divide-slate-100">
                    {CORPORATE_RATE_CARD.strategicPartnership.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 pr-4 font-semibold text-[#0A1428] whitespace-nowrap">
                          {item.title}
                        </td>
                        <td className="py-4 px-4 text-[#4A5568]">
                          {item.description}
                        </td>
                        <td className="py-4 pl-4 text-right font-bold text-[#0A1428] whitespace-nowrap tabular-nums font-display">
                          {item.price}
                        </td>
                        <td className="py-4 pl-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleSponsorshipSelect(item.title)}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#2F6DB5] hover:bg-[#255892] text-white transition-colors cursor-pointer"
                          >
                            Inquire Accord
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

   
      </div>
    </section>
  );
};
