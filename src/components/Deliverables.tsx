import React, { useState, useEffect } from 'react';
import { CONGRESS_DELIVERABLES } from '../data/bmicContent';
import {
  FileText,
  Coins,
  ShieldCheck,
  ShoppingCart,
  Handshake,
  Compass,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  CheckCircle2,
  Layers,
  Sparkles,
} from 'lucide-react';

interface DeliverableDetail {
  badge: string;
  shortLabel: string;
  leadStakeholder: string;
  executionVehicle: string;
  adoptionTarget: string;
  statusColor: string;
  mandateCode: string;
  expandedPoints: string[];
}

const DELIVERABLE_DETAILS: Record<number, DeliverableDetail> = {
  1: {
    badge: 'POLICY ACCORD',
    shortLabel: 'Communique',
    leadStakeholder: 'Govt Ministries, BOCRA & Operators',
    executionVehicle: 'Gazetted Policy Accord',
    adoptionTarget: '100-Day Executive Mandate',
    statusColor: '#60A5FA',
    mandateCode: 'BMIC-POL-2026-01',
    expandedPoints: [
      'Formal executive submission delivered to the Office of the President within 10 days post-summit.',
      'Tripartite consensus on lowering rural broadband spectrum barrier costs and licensing friction.',
      'Permanent multi-stakeholder advisory council established to track 100-day execution milestones.',
    ],
  },
  2: {
    badge: 'CAPITAL PIPELINE',
    shortLabel: 'Funding Agenda',
    leadStakeholder: 'Regional VCs, Angel Syndicates & DFIs',
    executionVehicle: 'Seed & Growth Facility',
    adoptionTarget: 'Q3 2026 Deal Allocation',
    statusColor: '#D13B84',
    mandateCode: 'BMIC-CAP-2026-02',
    expandedPoints: [
      'BWP 50M Seed & Growth Syndicate co-investment facility anchored by regional DFIs and local funds.',
      'Regulatory sandbox greenlight enabling domestic pension allocations into high-growth tech ventures.',
      'Structured deal room matching 15 curated Botswana startups with international cross-border capital.',
    ],
  },
  3: {
    badge: 'SECURITY MANDATE',
    shortLabel: 'Cyber Trust',
    leadStakeholder: 'National Cyber Command & Telecoms',
    executionVehicle: 'Critical Defense Mandate',
    adoptionTarget: 'Standardized Sector Audit',
    statusColor: '#34D399',
    mandateCode: 'BMIC-SEC-2026-03',
    expandedPoints: [
      'National Cyber Command security baseline adopted for all public and enterprise cloud infrastructure.',
      'Standardized Zero-Trust compliance protocol for mobile payment rails and Open Banking APIs.',
      'Cross-border sovereign threat intelligence sharing pact operationalized with SADC CERT nodes.',
    ],
  },
  4: {
    badge: 'COMMERCE RAILS',
    shortLabel: 'E-Commerce',
    leadStakeholder: 'Digital Creators, SMEs & Mobile Money',
    executionVehicle: 'Carrier Billing & Merchant APIs',
    adoptionTarget: 'Immediate Pilot Activation',
    statusColor: '#FBBF24',
    mandateCode: 'BMIC-COM-2026-04',
    expandedPoints: [
      'Unified interoperable QR payment standard bridging Orange Money, MyZaka, and commercial banks.',
      'Direct Carrier Billing (DCB) SDK launched enabling digital creators to monetize content locally.',
      'Accelerated digital trade customs clearing corridor implemented with BURS for tech exporters.',
    ],
  },
  5: {
    badge: 'STRATEGIC ALLIANCE',
    shortLabel: 'Partnerships',
    leadStakeholder: 'Regulators, MNOs & FinTech Founders',
    executionVehicle: 'Tripartite Bilateral Accords',
    adoptionTarget: 'Biannual Milestone Reviews',
    statusColor: '#818CF8',
    mandateCode: 'BMIC-ALN-2026-05',
    expandedPoints: [
      '20+ closed-door executive bilateral accords formalized in private deal rooms during the congress.',
      'Joint infrastructure-sharing agreement signed between major telecom network operators.',
      'Biannual public-private oversight review scheduled to audit commercial milestones and jobs created.',
    ],
  },
  6: {
    badge: 'REGIONAL CORRIDOR',
    shortLabel: 'SADC Roadmap',
    leadStakeholder: 'SADC Delegations & Trade Ministries',
    executionVehicle: 'Digital Valley Corridor Accord',
    adoptionTarget: '2026–2030 Infrastructure Plan',
    statusColor: '#38BDF8',
    mandateCode: 'BMIC-REG-2026-06',
    expandedPoints: [
      'Terrestrial fiber routing accord positioning Botswana as the central low-latency transit corridor.',
      'Harmonized cross-border digital data sovereignty protocols ratified with neighboring states.',
      'Gaborone established as the regional cloud compute and disaster-recovery hub for Southern Africa.',
    ],
  },
};

export const Deliverables: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const total = CONGRESS_DELIVERABLES.length;
  const icons = [FileText, Coins, ShieldCheck, ShoppingCart, Handshake, Compass];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
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

    // Detect horizontal swipe if deltaX is dominant and exceeds 35px
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
    <section id="deliverables" className="py-12 lg:py-16 bg-[#0A1428] text-white border-b border-white/[0.08] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#2F6DB5]/[0.08] rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with Title and Sleek Deck Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F6DB5]" />
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#B8C2D6]">
                04 / Actionable Outcomes
              </p>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
              WHAT THE CONGRESS WILL DELIVER
            </h2>
            <p className="text-xs sm:text-sm text-[#B8C2D6] max-w-md font-normal leading-relaxed mt-1">
              Six concrete mandates transitioning Botswana from high-level deliberations into funded national execution.
            </p>
          </div>

          {/* Deck Controls (Swipes indicator on Mobile, Arrows on Desktop) */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
              <span className="font-mono text-xs font-bold text-[#60A5FA] tabular-nums">
                0{activeIndex + 1}
              </span>
              <span className="font-mono text-xs text-slate-500">/</span>
              <span className="font-mono text-xs text-slate-400 tabular-nums">
                0{total}
              </span>
            </div>

            {/* Mobile swipe gesture prompt (replaces arrows on mobile) */}
            <div className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-slate-300 select-none">
              <span className="text-[#60A5FA] animate-pulse">←</span>
              <span>Swipe</span>
              <span className="text-[#60A5FA] animate-pulse">→</span>
            </div>

            {/* Desktop Chevron Navigation Controls (Hidden on Mobile) */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                aria-label="Previous deliverable"
                className="w-8 h-8 rounded-xl bg-[#0D1C3C]/80 border border-white/[0.08] hover:border-[#2F6DB5] flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95 cursor-pointer shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next deliverable"
                className="w-8 h-8 rounded-xl bg-[#0D1C3C]/80 border border-white/[0.08] hover:border-[#2F6DB5] flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95 cursor-pointer shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sleek Stacked Card Deck Stage with Touch Swipe on Mobile */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className={`relative w-full max-w-3xl mx-auto my-2 select-none transition-all duration-300 ease-out ${
            isExpanded
              ? 'h-[500px] sm:h-[460px] md:h-[430px]'
              : 'h-[390px] sm:h-[350px] md:h-[320px]'
          }`}
        >
          {CONGRESS_DELIVERABLES.map((item, idx) => {
            const Icon = icons[idx % icons.length];
            const detail = DELIVERABLE_DETAILS[item.id] || {
              badge: 'DELIVERABLE',
              shortLabel: item.title,
              leadStakeholder: 'Public & Private Sector',
              executionVehicle: 'Operational Framework',
              adoptionTarget: '2026 Milestones',
              statusColor: '#60A5FA',
              mandateCode: `BMIC-DEL-2026-0${item.id}`,
              expandedPoints: [
                'Binding executive agreement signed by public and private stakeholders.',
                'Dedicated working group assigned to manage technical deliverables.',
                'Immediate 90-day progress report released to summit delegates.',
              ],
            };

            // Calculate offset relative to active card
            const diff = (idx - activeIndex + total) % total;
            const isFront = diff === 0;

            // Geometry offsets for sleek layered stack
            let transform = '';
            let zIndex = 30;
            let opacity = 1;
            let pointerEvents: 'auto' | 'none' = 'auto';

            if (diff === 0) {
              transform = 'translate3d(0px, 0px, 0px) scale(1) rotate(0deg)';
              zIndex = 30;
              opacity = 1;
            } else if (diff === 1) {
              transform = 'translate3d(14px, -12px, -10px) scale(0.97) rotate(1.2deg)';
              zIndex = 25;
              opacity = 0.85;
            } else if (diff === 2) {
              transform = 'translate3d(26px, -24px, -20px) scale(0.94) rotate(2.4deg)';
              zIndex = 20;
              opacity = 0.65;
            } else if (diff === 3) {
              transform = 'translate3d(36px, -34px, -30px) scale(0.91) rotate(3.5deg)';
              zIndex = 15;
              opacity = 0.4;
            } else if (diff === 4) {
              transform = 'translate3d(44px, -42px, -40px) scale(0.88) rotate(4.2deg)';
              zIndex = 10;
              opacity = 0.2;
            } else {
              // diff === 5 (just exited behind)
              transform = 'translate3d(-20px, 14px, 10px) scale(0.93) rotate(-2deg)';
              zIndex = 5;
              opacity = 0;
              pointerEvents = 'none';
            }

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (!isFront) {
                    setActiveIndex(idx);
                    setIsExpanded(false);
                  } else {
                    setIsExpanded((prev) => !prev);
                  }
                }}
                style={{
                  transform,
                  zIndex,
                  opacity,
                  pointerEvents,
                  transition: 'transform 420ms cubic-bezier(0.16, 1, 0.3, 1), opacity 380ms ease, box-shadow 350ms ease, border-color 300ms ease, height 300ms ease',
                }}
                className={`absolute inset-0 rounded-2xl p-5 sm:p-6 md:p-7 flex flex-col justify-between cursor-pointer ${
                  isFront
                    ? 'bg-[#0D1C3C] border-2 border-[#2F6DB5]/70 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),0_0_35px_rgba(47,109,181,0.25)] ring-1 ring-white/[0.08]'
                    : 'bg-[#09152E]/95 border border-white/[0.1] hover:border-white/[0.22] shadow-[0_15px_35px_rgba(0,0,0,0.35)]'
                }`}
              >
                {/* Card Top: Identity, Icon, Code & Badge */}
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3 pb-2.5 border-b border-white/[0.07]">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          isFront
                            ? 'bg-[#183266] text-[#60A5FA] border border-[#2F6DB5]/50'
                            : 'bg-white/[0.04] text-slate-400 border border-white/[0.08]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-white tracking-wider">
                          0{item.id}
                        </span>
                        <span className="text-slate-500 text-xs">/</span>
                        <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                          DELIVERABLE
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider font-semibold border"
                        style={{
                          backgroundColor: `${detail.statusColor}15`,
                          borderColor: `${detail.statusColor}35`,
                          color: detail.statusColor,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: detail.statusColor }}
                        />
                        {detail.badge}
                      </span>

                      {/* Expand / Collapse Indicator Button on Front Card */}
                      {isFront && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded((prev) => !prev);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 border border-white/[0.1] transition-colors"
                          title={isExpanded ? 'Collapse card' : 'Expand card'}
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-3 h-3 text-[#60A5FA]" />
                              <span>Collapse</span>
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-3 h-3 text-[#60A5FA]" />
                              <span>Expand</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight leading-snug mb-1.5 font-display">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                {/* EXPANDED VIEW: Detailed Action Mandates (Visible when card expands) */}
                {isFront && isExpanded ? (
                  <div className="my-2.5 py-2.5 px-3 rounded-xl bg-white/[0.03] border border-[#2F6DB5]/30 animate-fadeIn">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#60A5FA] font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#60A5FA]" />
                        Strategic Mandate Directives ({detail.mandateCode})
                      </span>
                      <span className="font-mono text-[9px] text-slate-400">
                        {detail.adoptionTarget}
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {detail.expandedPoints.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2 text-xs text-slate-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  /* Standard Compact Grid (Visible when not expanded) */
                  <div className="mt-3 pt-3 border-t border-white/[0.07] grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 bg-white/[0.02] p-2 rounded-xl border border-white/[0.04]">
                    <div>
                      <span className="block font-mono text-[9px] uppercase tracking-wider text-slate-400">
                        Lead Stakeholders
                      </span>
                      <span className="text-xs font-medium text-slate-200 truncate block mt-0.5">
                        {detail.leadStakeholder}
                      </span>
                    </div>
                    <div>
                      <span className="block font-mono text-[9px] uppercase tracking-wider text-slate-400">
                        Execution Vehicle
                      </span>
                      <span className="text-xs font-medium text-slate-200 truncate block mt-0.5">
                        {detail.executionVehicle}
                      </span>
                    </div>
                    <div>
                      <span className="block font-mono text-[9px] uppercase tracking-wider text-slate-400">
                        Adoption Target
                      </span>
                      <span className="text-xs font-medium text-slate-200 truncate block mt-0.5">
                        {detail.adoptionTarget}
                      </span>
                    </div>
                  </div>
                )}

                {/* Card Bottom: Interactive Hint & Mobile Tap Helper */}
                <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    {isFront ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[11px] text-slate-300 font-medium">
                          {isExpanded ? 'Tap card to collapse' : 'Tap card to expand details'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Layers className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-[11px] text-slate-400">
                          Click to bring to front
                        </span>
                      </>
                    )}
                  </div>

                  <span className="font-mono text-[10px] text-slate-500">
                    OUTPUT 0{item.id} OF 0{total}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sleek Deliverables Quick-Select Pill Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {CONGRESS_DELIVERABLES.map((item, idx) => {
            const detail = DELIVERABLE_DETAILS[item.id];
            const isActive = idx === activeIndex;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveIndex(idx);
                  setIsExpanded(false);
                }}
                className={`px-3 py-1.5 rounded-xl font-mono text-[11px] transition-all flex items-center gap-2 cursor-pointer border ${
                  isActive
                    ? 'bg-[#12244C] border-[#2F6DB5] text-white shadow-[0_0_15px_rgba(47,109,181,0.3)]'
                    : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.06] hover:border-white/[0.12]'
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full transition-transform"
                  style={{
                    backgroundColor: isActive ? detail.statusColor : '#64748B',
                    transform: isActive ? 'scale(1.3)' : 'scale(1)',
                  }}
                />
                <span className="font-bold text-slate-300">0{item.id}</span>
                <span className="hidden sm:inline font-sans font-medium text-xs">
                  {detail.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
