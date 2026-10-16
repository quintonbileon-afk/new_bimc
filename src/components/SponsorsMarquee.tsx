import React, { useState, useEffect } from 'react';
import { EVENT_DETAILS } from '../data/bmicContent';
import {
  ArrowRight,
  Mail,
  Radio,
  Banknote,
  ShieldCheck,
  Rocket,
  Landmark,
  Layers,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Sparkles,
  LucideIcon,
} from 'lucide-react';

interface SponsorsMarqueeProps {
  onOpenRegister: (tier?: string) => void;
}

interface PartnerSector {
  id: number;
  title: string;
  subtitle: string;
  tag: string;
  icon: LucideIcon;
  footprint: string;
  format: string;
  targetAudience: string;
  entitlements: string[];
}

const PARTNER_SECTORS: PartnerSector[] = [
  {
    id: 1,
    title: 'Telecommunications & Infrastructure',
    subtitle: 'MNOs, ISPs, Fibre Backbone & Satellite Operators driving sovereign connectivity.',
    tag: 'Core Connectivity',
    icon: Radio,
    footprint: 'Major Tech Pavilion Stand (36m²)',
    format: 'Keynote & Infrastructure Track',
    targetAudience: 'Telco C-Suite, BOCRA, Ministry',
    entitlements: [
      '6 VIP Executive All-Access Passes & Ministerial Networking Lounge access',
      'Plenary keynote address & inclusion in official National Broadband Accord',
      'Prime corner exhibition footprint with dedicated power, AV & gigabit fiber',
    ],
  },
  {
    id: 2,
    title: 'Banking & Development Finance',
    subtitle: 'Commercial Banks, Mobile Money, FinTech & DFIs financing national digital scale.',
    tag: 'Capital & Payment Rails',
    icon: Banknote,
    footprint: 'FinTech Demo Zone (24m²)',
    format: 'Bilateral Dealmaking Room',
    targetAudience: 'Institutional LPs, VCs, CFOs',
    entitlements: [
      'Dedicated private Deal Room suite for scheduled B2B bilateral accords',
      'Lead sponsor of the Sovereign FinTech & Mobile Money Showcase track',
      '4 Corporate Delegate Passes + Branding on Congress Official Communique',
    ],
  },
  {
    id: 3,
    title: 'Cloud & Cybersecurity Architecture',
    subtitle: 'Data Centres, Sovereign Cloud & Critical Infrastructure protecting digital assets.',
    tag: 'Sovereignty & Defense',
    icon: ShieldCheck,
    footprint: 'Security Showcase Stand (18m²)',
    format: 'Closed-Door Defense Briefing',
    targetAudience: 'CISOs, CIOs, Enterprise IT',
    entitlements: [
      'Host of Closed-Door Sovereign Cyber Trust Roundtable with BOCRA & Defense',
      'Technical workshop slot in the Developer & Security Architecture Track',
      '4 All-Access Passes with access to VIP Speaker Dinner',
    ],
  },
  {
    id: 4,
    title: 'Venture Capital & Innovation Hubs',
    subtitle: 'Seed Funds, Incubators & Angel Syndicates accelerating tech startups.',
    tag: 'Startup Dealflow',
    icon: Rocket,
    footprint: 'Innovation Alley Lounge (Turnkey)',
    format: 'Curated Pitching Showcase',
    targetAudience: 'Seed Founders, Angels, DFIs',
    entitlements: [
      'Official Investor Partner status with curated access to 15 vetted startups',
      'Jury seat on the BMIC 2026 Startup Innovation Showcase pitch finals',
      '3 Investor Passes with direct messaging access in Congress Mobile App',
    ],
  },
  {
    id: 5,
    title: 'Public Policy & Regulatory Leadership',
    subtitle: 'Government Ministries, Authorities & Regional Alliances setting standards.',
    tag: 'Policy Harmonization',
    icon: Landmark,
    footprint: 'Sovereign Delegation Suite',
    format: 'Regulatory Roundtable',
    targetAudience: 'Ministers, Regulators, SADC',
    entitlements: [
      'Permanent co-chair status on the National Communique drafting committee',
      'VIP bilateral liaison officer dedicated to international delegation reception',
      'Full institutional branding on all press releases and opening ceremony backdrops',
    ],
  },
  {
    id: 6,
    title: 'Enterprise Digital Platforms',
    subtitle: 'E-Commerce Solutions, SaaS Providers & Digital Media scaling commercial apps.',
    tag: 'Commerce & Scale',
    icon: Layers,
    footprint: 'Enterprise Solutions Stand (12m²)',
    format: 'Commercial Product Workshop',
    targetAudience: 'Merchants, SMEs, Developers',
    entitlements: [
      'Interactive product demonstration masterclass slot in the Expo Amphitheatre',
      'Direct carrier billing & payment integration showcase promotion',
      '3 Corporate Passes + Lead capture scanner for exhibition delegates',
    ],
  },
];

export const SponsorsMarquee: React.FC<SponsorsMarqueeProps> = ({ onOpenRegister }) => {
  const [activeSectorIndex, setActiveSectorIndex] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const total = PARTNER_SECTORS.length;

  const handlePrev = () => {
    setActiveSectorIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setActiveSectorIndex((prev) => (prev + 1) % total);
  };

  // Touch Swipe Handlers for Mobile (swipes instead of arrows)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const deltaY = e.changedTouches[0].clientY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 35) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setTouchStartX(null);
    setTouchStartY(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [total]);

  return (
    <section id="partners" className="py-10 lg:py-14 bg-[#F7F8FA] text-[#0A1428] border-b border-slate-200/80">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Refined Spacing and Deck Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 px-2.5 py-1 rounded-full bg-slate-200/60 border border-slate-300/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F6DB5]" />
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#2F6DB5] font-semibold">
                04 / Ecosystem Alignment
              </p>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A1428] tracking-tight font-display">
              PARTNERSHIP &amp; EXHIBITION SECTORS
            </h2>
          </div>

          {/* Navigation Controls (Swipes indicator on mobile, Arrows on desktop) */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 shadow-xs">
              <span className="font-mono text-xs font-bold text-[#2F6DB5] tabular-nums">
                0{activeSectorIndex + 1}
              </span>
              <span className="font-mono text-xs text-slate-400">/</span>
              <span className="font-mono text-xs text-slate-500 tabular-nums">
                0{total}
              </span>
            </div>

            {/* Mobile Swipe Gesture Badge (Replaces arrows on mobile) */}
            <div className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200/80 border border-slate-300 text-[11px] font-mono text-[#2F6DB5] font-semibold select-none">
              <span className="animate-pulse">←</span>
              <span>Swipe cards</span>
              <span className="animate-pulse">→</span>
            </div>

            {/* Desktop Navigation Arrows (Hidden on Mobile) */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                aria-label="Previous sector"
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:border-[#2F6DB5] flex items-center justify-center text-slate-600 hover:text-[#0A1428] transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next sector"
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:border-[#2F6DB5] flex items-center justify-center text-slate-600 hover:text-[#0A1428] transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Cascading & Stacked Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
          {/* Left Column: Cascading Sector Navigation Strip (5 cols) */}
          <div className="lg:col-span-5 space-y-2">
            <div className="flex items-center justify-between mb-1 px-1">
              <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 font-semibold">
                Participating Sectors
              </span>
              <span className="font-mono text-[9px] text-[#2F6DB5] font-medium">Click to Inspect</span>
            </div>

            {PARTNER_SECTORS.map((sector, idx) => {
              const isActive = idx === activeSectorIndex;
              const IconComp = sector.icon;

              return (
                <div
                  key={sector.id}
                  onClick={() => {
                    setActiveSectorIndex(idx);
                    setIsExpanded(false);
                  }}
                  className={`px-3.5 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 cursor-pointer select-none border ${
                    isActive
                      ? 'bg-white border-[#2F6DB5]/40 shadow-[0_4px_16px_rgba(47,109,181,0.12)] translate-x-1.5'
                      : 'bg-white/60 hover:bg-white border-slate-200/70 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[#2F6DB5] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-xs sm:text-[13px] font-semibold tracking-tight truncate ${
                          isActive ? 'text-[#0A1428]' : 'text-slate-700'
                        }`}
                      >
                        {sector.title}
                      </h4>
                      <span
                        className={`font-mono text-[9px] shrink-0 font-bold ${
                          isActive ? 'text-[#2F6DB5]' : 'text-slate-400'
                        }`}
                      >
                        0{idx + 1}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {sector.tag}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: 3D Cascading & Stacked Card Stage with Touch Swipe on Mobile */}
          <div className="lg:col-span-7 relative flex items-center justify-center py-4">
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className={`relative w-full max-w-[540px] select-none transition-all duration-300 ease-out ${
                isExpanded
                  ? 'h-[520px] sm:h-[480px]'
                  : 'h-[370px] sm:h-[340px]'
              }`}
            >
              {PARTNER_SECTORS.map((sector, idx) => {
                const IconComp = sector.icon;
                const diff = (idx - activeSectorIndex + total) % total;
                const isVisible = diff <= 2 || diff === total - 1;

                if (!isVisible) return null;

                const isFront = diff === 0;
                const isBehind1 = diff === 1;
                const isBehind2 = diff === 2;

                let transform = '';
                let zIndex = 10;
                let opacity = 1;
                let scale = 'scale(1)';

                if (isFront) {
                  transform = 'translate3d(0px, 0px, 0px) rotate(0deg)';
                  zIndex = 30;
                  opacity = 1;
                  scale = 'scale(1)';
                } else if (isBehind1) {
                  transform = 'translate3d(14px, -14px, -20px) rotate(1.5deg)';
                  zIndex = 20;
                  opacity = 0.88;
                  scale = 'scale(0.97)';
                } else if (isBehind2) {
                  transform = 'translate3d(26px, -26px, -40px) rotate(3deg)';
                  zIndex = 10;
                  opacity = 0.7;
                  scale = 'scale(0.94)';
                } else {
                  // just exited
                  transform = 'translate3d(-20px, 16px, 10px) rotate(-2deg)';
                  zIndex = 5;
                  opacity = 0;
                  scale = 'scale(0.92)';
                }

                return (
                  <div
                    key={sector.id}
                    onClick={() => {
                      if (!isFront) {
                        setActiveSectorIndex(idx);
                        setIsExpanded(false);
                      } else {
                        setIsExpanded((prev) => !prev);
                      }
                    }}
                    style={{
                      transform: `${transform} ${scale}`,
                      zIndex,
                      opacity,
                      transition: 'transform 450ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms ease, box-shadow 300ms ease',
                    }}
                    className={`absolute inset-0 rounded-2xl p-6 sm:p-7 flex flex-col justify-between cursor-pointer select-none ${
                      isFront
                        ? 'bg-white border-2 border-[#2F6DB5]/30 shadow-[0_20px_50px_rgba(10,20,40,0.12)] pointer-events-auto'
                        : 'bg-[#F0F3F8] border border-slate-300/80 shadow-md hover:border-slate-400 pointer-events-auto'
                    }`}
                  >
                    {/* Card Top Row */}
                    <div>
                      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                              isFront
                                ? 'bg-[#2F6DB5] text-white shadow-xs'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-[#0A1428] tracking-wider">
                              0{sector.id}
                            </span>
                            <span className="text-slate-400 text-xs">/</span>
                            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                              SECTOR PILLAR
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#2F6DB5]/10 text-[#2F6DB5] text-[10px] font-semibold font-mono tracking-wider">
                            <CheckCircle2 className="w-3 h-3 text-[#2F6DB5]" />
                            {sector.tag}
                          </span>

                          {/* Expand/Collapse Toggle on front card */}
                          {isFront && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsExpanded((prev) => !prev);
                              }}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-slate-100 hover:bg-slate-200 text-[#0A1428] border border-slate-200 transition-colors"
                              title={isExpanded ? 'Collapse card' : 'Expand card'}
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="w-3 h-3 text-[#2F6DB5]" />
                                  <span>Collapse</span>
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-3 h-3 text-[#2F6DB5]" />
                                  <span>Expand</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-[#0A1428] tracking-tight leading-snug mb-1 font-display">
                        {sector.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed font-normal">
                        {sector.subtitle}
                      </p>
                    </div>

                    {/* EXPANDED VIEW: Complete Partner Entitlements */}
                    {isFront && isExpanded ? (
                      <div className="my-2 py-2.5 px-3 rounded-xl bg-slate-50 border border-[#2F6DB5]/20 animate-fadeIn">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-[#2F6DB5] font-semibold flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#2F6DB5]" />
                            Sector Exhibition Entitlements &amp; Privileges
                          </span>
                          <span className="font-mono text-[9px] text-slate-500 font-bold">
                            {sector.footprint}
                          </span>
                        </div>
                        <ul className="space-y-1.5">
                          {sector.entitlements.map((item, eIdx) => (
                            <li key={eIdx} className="flex items-start gap-2 text-xs text-[#0A1428]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#2F6DB5] shrink-0 mt-0.5" />
                              <span className="leading-snug">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      /* Specifications Grid (Standard Compact View) */
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200/70 text-xs my-2">
                        <div>
                          <span className="block font-mono text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                            Exhibition Footprint
                          </span>
                          <span className="text-xs font-semibold text-[#0A1428] truncate block mt-0.5">
                            {sector.footprint}
                          </span>
                        </div>
                        <div>
                          <span className="block font-mono text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                            Congress Track
                          </span>
                          <span className="text-xs font-semibold text-[#0A1428] truncate block mt-0.5">
                            {sector.format}
                          </span>
                        </div>
                        <div>
                          <span className="block font-mono text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                            Key Delegation
                          </span>
                          <span className="text-xs font-semibold text-[#0A1428] truncate block mt-0.5">
                            {sector.targetAudience}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Card Bottom: Interactive Footer */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="font-mono text-[10px] text-slate-400">
                        {isFront
                          ? isExpanded
                            ? 'Tap card to collapse'
                            : 'Tap card to expand details'
                          : `SECTOR 0${sector.id} OF 0${total}`}
                      </span>

                      {isFront ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenRegister(`Sector Sponsor: ${sector.title}`);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2F6DB5] hover:text-[#1D4ED8] transition-colors cursor-pointer px-2.5 py-1 rounded-lg bg-[#2F6DB5]/10 hover:bg-[#2F6DB5]/15"
                        >
                          <span>Inquire for This Track</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          Click to bring to front →
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Secretariat Notice with Streamlined Layout & Whitespace */}
        <div className="border-t border-slate-200/80 pt-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="max-w-2xl space-y-2">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#2F6DB5]">
                Secretariat Notice
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-[#0A1428] tracking-tight">
                Corporate Sponsorship &amp; Exhibition Enquiries
              </h3>
              <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                Organizations seeking track naming rights, exhibition stands, or bilateral roundtables are invited to connect directly with the Congress Secretariat.
              </p>
              <div className="text-[11px] text-slate-500 pt-1">
                Organised by <strong className="text-[#0A1428]">{EVENT_DETAILS.organiser}</strong> · Empowered by <strong className="text-[#0A1428]">{EVENT_DETAILS.empoweredBy}</strong>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => onOpenRegister('Headline Sponsor')}
                className="group btn-cta-magenta px-6 py-3 rounded-full text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Inquire for Partnership</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <a
                href={`mailto:${EVENT_DETAILS.secretariatEmail}?subject=BMIC%202026%20Partnership%20Inquiry`}
                className="px-5 py-3 rounded-full text-xs font-semibold text-[#0A1428] bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
              >
                <Mail className="w-3.5 h-3.5 text-[#2F6DB5]" />
                <span>{EVENT_DETAILS.secretariatEmail}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
