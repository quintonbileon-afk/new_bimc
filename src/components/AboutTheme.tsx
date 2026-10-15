import React, { useState, useEffect } from 'react';
import { EVENT_DETAILS, PROBLEMS_WE_ARE_SOLVING } from '../data/bmicContent';
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Layers,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface ProblemEnrichment {
  pillarCode: string;
  bottleneck: string;
  solutionMandate: string;
  targetMilestone: string;
}

const PROBLEM_ENRICHMENTS: Record<string, ProblemEnrichment> = {
  infrastructure: {
    pillarCode: 'INF-01',
    bottleneck: 'High backhaul and wholesale transit tariffs leading to prohibitively expensive end-user mobile data bundles.',
    solutionMandate: 'BOCRA regulatory intervention to reduce transit tariffs & mandate infrastructure sharing among MNOs.',
    targetMilestone: '40% reduction in retail gigabyte cost within 12 months.',
  },
  cybersecurity: {
    pillarCode: 'SEC-02',
    bottleneck: 'Fragmented defensive postures across private and public sectors with no unified sovereign CERT coordination.',
    solutionMandate: 'Operationalize National Cyber Security Incident Response standard with mandatory sector reporting.',
    targetMilestone: '100% compliance audit for critical national infrastructure.',
  },
  startups: {
    pillarCode: 'STP-03',
    bottleneck: 'Severe early-stage capital shortage with domestic pension funds blocked from venture asset class participation.',
    solutionMandate: 'Establish the BWP 50M Seed & Growth Syndicate co-investment facility backed by regional DFIs.',
    targetMilestone: 'Fund 15 scalable Botswana tech startups by Q3 2026.',
  },
  egovernment: {
    pillarCode: 'EGOV-04',
    bottleneck: 'Siloed ministerial databases requiring manual citizen in-person verification and fragmented logins.',
    solutionMandate: 'Unified citizen digital identity API layer connected to real-time public service delivery channels.',
    targetMilestone: 'Single-sign-on access to top 20 essential public services.',
  },
  ecommerce: {
    pillarCode: 'ECM-05',
    bottleneck: 'Absence of national interoperable QR code standard and excessive merchant acquiring fees on local card rails.',
    solutionMandate: 'Deploy Bank of Botswana interoperable instant payment rails with zero merchant fees on micro-transfers.',
    targetMilestone: '10,000 active digital SME merchant terminals by 2027.',
  },
  monetisation: {
    pillarCode: 'MNT-06',
    bottleneck: 'Creators forced to rely on foreign payout channels with punitive currency exchange losses and high payout thresholds.',
    solutionMandate: 'Direct carrier billing and local mobile wallet settlement rails integrated into digital content platforms.',
    targetMilestone: 'Instant Pula creator payouts for over 5,000 digital entrepreneurs.',
  },
};

export const AboutTheme: React.FC = () => {
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const total = PROBLEMS_WE_ARE_SOLVING.length;

  const handleNext = () => {
    setActiveCardIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setActiveCardIndex((prev) => (prev - 1 + total) % total);
  };

  // Mobile Touch Swipe Handlers (swipes instead of arrows)
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
    <section id="about" className="py-12 lg:py-20 bg-[#F7F8FA] text-[#0A1428] border-b border-slate-200/80 relative">
      <div id="theme" className="absolute -top-24 pointer-events-none" />
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Strategic Context & Text */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 mb-3 px-2.5 py-1 rounded-full bg-slate-200/60 border border-slate-300/60 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F6DB5]" />
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#2F6DB5] font-semibold">
                01 / Strategic Context &amp; Structural Focus
              </p>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1428] tracking-[-0.03em] leading-[1.1] mb-4 font-display">
              THREE DECADES OF INVESTMENT.<br />
              ONE MISSING CONVERSION.
            </h2>

            <p className="text-sm sm:text-base text-[#4A5568] leading-relaxed font-normal mb-6">
              {EVENT_DETAILS.threeDecadesDescription}
            </p>

            <div className="hidden lg:flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#2F6DB5]/10 flex items-center justify-center text-[#2F6DB5] font-mono font-bold shrink-0">
                06
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0A1428] uppercase font-mono">National Priority Focus</h4>
                <p className="text-xs text-slate-500">Explore each card for bottlenecks and concrete action mandates.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Stacked Deck & Controls */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            {/* Interactive Stack Container */}
            <div className="w-full flex flex-col items-center justify-center py-4">
              <div
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className={`relative w-full max-w-[620px] select-none transition-all duration-300 ease-out ${
                  isExpanded
                    ? 'h-[490px] sm:h-[450px]'
                    : 'h-[360px] sm:h-[320px]'
                }`}
              >
                {PROBLEMS_WE_ARE_SOLVING.map((prob, idx) => {
                  const diff = (idx - activeCardIndex + total) % total;
                  const isVisibleInStack = diff <= 2 || diff === total - 1;

                  if (!isVisibleInStack) return null;

                  const isFront = diff === 0;
                  const isBehind1 = diff === 1;
                  const isBehind2 = diff === 2;

                  const enrichment = PROBLEM_ENRICHMENTS[prob.id] || {
                    pillarCode: `PIL-0${idx + 1}`,
                    bottleneck: 'Institutional delay in cross-sector conversion.',
                    solutionMandate: 'High-level mandate adopted in the Congress Communique.',
                    targetMilestone: 'Immediate milestone review scheduled.',
                  };

                  let transformStyle = '';
                  let zIndex = 10;
                  let opacity = '1';
                  let scale = 'scale(1)';

                  if (isFront) {
                    transformStyle = 'translate3d(0px, 0px, 0px) rotate(0deg)';
                    zIndex = 30;
                    opacity = '1';
                    scale = 'scale(1)';
                  } else if (isBehind1) {
                    transformStyle = 'translate3d(14px, -14px, -20px) rotate(2deg)';
                    zIndex = 20;
                    opacity = '0.9';
                    scale = 'scale(0.97)';
                  } else if (isBehind2) {
                    transformStyle = 'translate3d(26px, -26px, -40px) rotate(4deg)';
                    zIndex = 10;
                    opacity = '0.75';
                    scale = 'scale(0.94)';
                  } else {
                    // Just exited behind
                    transformStyle = 'translate3d(-20px, 16px, 10px) rotate(-3deg)';
                    zIndex = 5;
                    opacity = '0';
                    scale = 'scale(0.92)';
                  }

                  return (
                    <div
                      key={prob.id}
                      onClick={() => {
                        if (!isFront) {
                          setActiveCardIndex(idx);
                          setIsExpanded(false);
                        } else {
                          setIsExpanded((prev) => !prev);
                        }
                      }}
                      style={{
                        transform: `${transformStyle} ${scale}`,
                        zIndex,
                        transition: 'transform 450ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms ease, box-shadow 300ms ease',
                      }}
                      className={`absolute inset-0 rounded-2xl p-6 sm:p-7 flex flex-col justify-between cursor-pointer select-none ${
                        isFront
                          ? 'bg-white border-2 border-[#2F6DB5]/30 shadow-[0_20px_50px_rgba(10,20,40,0.12)]'
                          : 'bg-[#F0F3F8] border border-slate-300/80 shadow-md pointer-events-auto'
                      }`}
                    >
                      {/* Card Top Row */}
                      <div>
                        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100">
                          <div className="flex items-center gap-2.5">
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#2F6DB5]/10 font-mono text-xs font-bold text-[#2F6DB5]">
                              0{idx + 1}
                            </span>
                            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                              National Priority ({enrichment.pillarCode})
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {isFront ? (
                              <>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#2F6DB5]/10 text-[#2F6DB5] text-[10px] font-semibold font-mono">
                                  <Layers className="w-3 h-3" />
                                  Active Priority
                                </span>

                                {/* Expand/Collapse Toggle on front card */}
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
                              </>
                            ) : (
                              <span className="text-slate-400 text-xs font-mono">
                                Click to focus
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Title */}
                        <h4 className="text-lg sm:text-xl font-bold text-[#0A1428] leading-tight tracking-tight mb-2 font-display">
                          {prob.title}
                        </h4>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                          {prob.description}
                        </p>
                      </div>

                      {/* EXPANDED VIEW: Strategic Resolution & Target */}
                      {isFront && isExpanded ? (
                        <div className="my-2 py-2.5 px-3 rounded-xl bg-slate-50 border border-[#2F6DB5]/20 animate-fadeIn space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[9px] uppercase tracking-wider text-[#2F6DB5] font-semibold flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-[#2F6DB5]" />
                              Executive Action Framework
                            </span>
                            <span className="font-mono text-[9px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                              Target: {enrichment.targetMilestone}
                            </span>
                          </div>
                          <div className="text-xs text-slate-700 space-y-1">
                            <p>
                              <strong className="text-[#0A1428]">Current Bottleneck:</strong>{' '}
                              {enrichment.bottleneck}
                            </p>
                            <p>
                              <strong className="text-[#0A1428]">Mandate Solution:</strong>{' '}
                              {enrichment.solutionMandate}
                            </p>
                          </div>
                        </div>
                      ) : (
                        /* Compact Indicator */
                        <div className="my-2 p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#2F6DB5]" />
                            <span className="text-[11px] font-medium text-slate-700">
                              Action Deliverable 0{idx + 1}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-slate-400">
                            {enrichment.pillarCode}
                          </span>
                        </div>
                      )}

                      {/* Card Bottom Meta */}
                      <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between mt-auto">
                        <span className="text-[11px] text-slate-500 font-mono">
                          {isFront
                            ? isExpanded
                              ? 'Tap card to collapse'
                              : 'Tap card to expand details'
                            : `PILLAR 0${idx + 1} OF 0${total}`}
                        </span>

                        <div className="flex items-center gap-1 text-xs font-semibold text-[#2F6DB5]">
                          <span>{isFront ? (isExpanded ? 'Collapse' : 'Explore mandate') : 'Bring to front'}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Interactive Stack Controls & Counter (Positioned directly below the cards) */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-6 sm:mt-7 w-full max-w-[620px]">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-xs font-mono text-slate-600">
                  <span className="text-[#2F6DB5] font-bold">0{activeCardIndex + 1}</span>
                  <span className="text-slate-300">/</span>
                  <span>0{total}</span>
                </div>

                {/* Progress indicator interactive dock */}
                <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-100/95 border border-slate-200/90 shadow-inner backdrop-blur-xs">
                  {PROBLEMS_WE_ARE_SOLVING.map((prob, pIdx) => {
                    const isActive = activeCardIndex === pIdx;
                    const enrichment = PROBLEM_ENRICHMENTS[prob.id];
                    const label = enrichment ? enrichment.pillarCode : `0${pIdx + 1}`;

                    return (
                      <button
                        key={prob.id}
                        onClick={() => {
                          setActiveCardIndex(pIdx);
                          setIsExpanded(false);
                        }}
                        aria-label={`Jump to priority 0${pIdx + 1}: ${prob.title}`}
                        className={`relative group h-7 transition-all duration-300 cursor-pointer flex items-center justify-center ${
                          isActive
                            ? 'px-3 rounded-full bg-gradient-to-r from-[#2F6DB5] to-[#1E4D82] text-white font-mono text-[11px] font-bold shadow-[0_4px_12px_rgba(47,109,181,0.35)] ring-2 ring-[#2F6DB5]/25 gap-1.5'
                            : 'px-2 sm:px-2.5 rounded-full bg-white/70 hover:bg-white text-slate-500 hover:text-[#0A1428] border border-transparent hover:border-slate-200/80 shadow-xs hover:shadow-sm'
                        }`}
                      >
                        {isActive ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                            <span className="tracking-tight">{label}</span>
                          </>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-[#2F6DB5] group-hover:scale-125 transition-all duration-200" />
                        )}

                        {/* Informative Tooltip on Hover */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-[#0A1428] text-white text-[10px] font-medium whitespace-nowrap shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 flex items-center gap-1.5 border border-slate-700/60">
                          <span className="font-mono text-[#2F6DB5] font-bold">0{pIdx + 1}</span>
                          <span className="text-slate-200">{prob.title}</span>
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0A1428] rotate-45 border-r border-b border-slate-700/60" />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Mobile swipe gesture prompt */}
                <div className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-[11px] font-mono text-[#2F6DB5] font-semibold select-none">
                  <span className="animate-pulse">←</span>
                  <span>Swipe cards</span>
                  <span className="animate-pulse">→</span>
                </div>

                {/* Navigation Arrows */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrev}
                    aria-label="Previous priority"
                    className="w-9 h-9 rounded-full bg-white hover:bg-slate-50 active:scale-95 border border-slate-200 shadow-xs flex items-center justify-center text-[#0A1428] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2F6DB5]"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next priority"
                    className="w-9 h-9 rounded-full bg-[#0A1428] hover:bg-[#142446] active:scale-95 text-white shadow-xs flex items-center justify-center transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2F6DB5]"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
