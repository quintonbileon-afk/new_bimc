import React, { useState } from 'react';
import { DELEGATE_PASS_TIERS, CORPORATE_RATE_CARD, EVENT_DETAILS } from '../data/bmicContent';
import {
  Check,
  ArrowRight,
  Wifi,
  Sparkles,
  ShieldCheck,
  Users,
  Award,
  Zap,
  Tag,
  Building2,
  Table,
  ChevronDown,
  ChevronUp,
  Calendar,
  MapPin,
  LucideIcon,
} from 'lucide-react';

interface TicketsPassesProps {
  onSelectPass: (passName: string) => void;
}

export const TicketsPasses: React.FC<TicketsPassesProps> = ({ onSelectPass }) => {
  const [activeTab, setActiveTab] = useState<'delegates' | 'partnerships' | 'exhibition' | 'rate-card-table'>('delegates');
  const [expandedPassId, setExpandedPassId] = useState<string | null>(null);

  // Free pass item
  const freePass = DELEGATE_PASS_TIERS.find((p) => p.price === 'Free') || DELEGATE_PASS_TIERS[4];

  // Paid delegate pass tiers (excluding free)
  const paidPasses = [
    {
      ...DELEGATE_PASS_TIERS.find((p) => p.id === 'student-developer') || DELEGATE_PASS_TIERS[3],
      code: 'DEV-02',
      category: 'Builders & Talent',
      color: 'emerald',
      accentGlow: 'from-emerald-500/20 to-transparent',
    },
    {
      ...DELEGATE_PASS_TIERS.find((p) => p.id === 'standard-delegate') || DELEGATE_PASS_TIERS[0],
      code: 'STD-03',
      category: 'Single Delegate',
      color: 'blue',
      accentGlow: 'from-[#2F6DB5]/25 to-transparent',
    },
    {
      ...DELEGATE_PASS_TIERS.find((p) => p.id === 'corporate-delegate') || DELEGATE_PASS_TIERS[1],
      code: 'CORP-04',
      category: 'Corporate Executive',
      color: 'magenta',
      isPopular: true,
      badge: 'Popular',
      accentGlow: 'from-[#D13B84]/30 via-[#2F6DB5]/30 to-transparent',
    },
    {
      ...DELEGATE_PASS_TIERS.find((p) => p.id === 'corporate-pack') || DELEGATE_PASS_TIERS[2],
      code: 'TEAM-05',
      category: 'Enterprise 3-Pack',
      color: 'indigo',
      accentGlow: 'from-indigo-500/25 to-transparent',
    },
  ];

  return (
    <section id="passes" className="py-16 lg:py-24 bg-[#F8FAFC] text-[#0A1428] border-b border-slate-200/80 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#2F6DB5]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#D13B84]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1.5 rounded-full bg-slate-200/60 border border-slate-300/60">
              <span className="w-2 h-2 rounded-full bg-[#2F6DB5]" />
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#2F6DB5] font-semibold">
                07 / Corporate Rate Card &amp; Credentials
              </p>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A1428] tracking-tight font-display">
              PASSES &amp; RATE CARD
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-normal leading-relaxed mt-2">
              Official delegate credentials, strategic bilateral tracks, and corporate exhibition stands for BMIC 2026.
            </p>
          </div>

          {/* Interactive Navigation Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-200/70 backdrop-blur-md border border-slate-300/70 rounded-2xl shadow-sm self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('delegates')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'delegates'
                  ? 'bg-gradient-to-r from-[#2F6DB5] to-[#1D4ED8] text-white shadow-md'
                  : 'text-slate-700 hover:text-[#0A1428] hover:bg-slate-300/50'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Delegate Passes (5)</span>
            </button>

            <button
              onClick={() => setActiveTab('partnerships')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'partnerships'
                  ? 'bg-gradient-to-r from-[#2F6DB5] to-[#1D4ED8] text-white shadow-md'
                  : 'text-slate-700 hover:text-[#0A1428] hover:bg-slate-300/50'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Partnerships</span>
            </button>

            <button
              onClick={() => setActiveTab('exhibition')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'exhibition'
                  ? 'bg-gradient-to-r from-[#2F6DB5] to-[#1D4ED8] text-white shadow-md'
                  : 'text-slate-700 hover:text-[#0A1428] hover:bg-slate-300/50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Exhibition</span>
            </button>

            <button
              onClick={() => setActiveTab('rate-card-table')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'rate-card-table'
                  ? 'bg-gradient-to-r from-[#2F6DB5] to-[#1D4ED8] text-white shadow-md'
                  : 'text-slate-700 hover:text-[#0A1428] hover:bg-slate-300/50'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Rate Sheet</span>
            </button>
          </div>
        </div>

        {/* TAB 1: CREATIVE SMART-PASS CREDENTIAL MATRIX */}
        {activeTab === 'delegates' && (
          <div className="space-y-6">
            {/* Free Pass Strip placed above the other plans */}
            <div className="bg-[#0A1428] rounded-2xl p-6 sm:p-7 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#16224a] border border-blue-500/30 flex items-center justify-center text-[#6aa5ee] shrink-0 shadow-inner">
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10.5px] uppercase tracking-wider font-bold text-[#6aa5ee]">
                      EXPO-01 · Exhibition Floor
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Complimentary
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight font-display text-white">
                    {freePass.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                    {freePass.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/10">
                <div className="text-left md:text-right">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">Free</div>
                  <div className="text-[11px] text-slate-400">Exhibition access only</div>
                </div>
                <button
                  onClick={() => onSelectPass(freePass.name)}
                  className="bg-[#D13B84] hover:bg-[#b82f6f] px-6 py-3 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all shrink-0"
                >
                  <span>Claim Free Pass</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Smart Badge Tiers Grid (4 Paid Tiers) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch mb-12">
              {paidPasses.map((pass) => {
                const isPopular = pass.isPopular;

                return (
                  <div
                    key={pass.id}
                    className={`group relative rounded-2xl flex flex-col justify-between transition-all duration-300 cursor-default select-none overflow-hidden ${
                      isPopular
                        ? 'bg-gradient-to-b from-[#0A1428] via-[#0E1B38] to-[#070D1A] text-white border-2 border-[#D13B84] shadow-[0_20px_50px_-15px_rgba(209,59,132,0.3)] xl:-translate-y-3 z-20'
                        : 'bg-white border border-slate-200/90 text-[#0A1428] hover:border-[#2F6DB5]/60 shadow-md hover:shadow-xl hover:-translate-y-1.5 z-10'
                    }`}
                  >
                    {/* Top Lanyard Slot & Accent Bar */}
                    <div className={`pt-4 pb-2 px-4 flex items-center justify-between border-b ${isPopular ? 'border-white/10 bg-white/[0.03]' : 'border-slate-100 bg-slate-50/80'}`}>
                      <div className={`flex items-center gap-1.5 ${isPopular ? 'text-slate-300' : 'text-slate-600'}`}>
                        <Wifi className="w-3 h-3 rotate-90 text-[#2F6DB5]" />
                        <span className="font-mono text-[10px] font-bold tracking-wider">
                          {pass.code}
                        </span>
                      </div>

                      {/* Lanyard Clip Punch Hole */}
                      <div className={`w-12 h-1.5 rounded-full ${isPopular ? 'bg-white/20' : 'bg-slate-200'} group-hover:bg-[#2F6DB5]/60 transition-colors`} />
                    </div>

                    {/* Badge Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Eyebrow & Badges */}
                        <div className="flex items-center justify-between gap-1 mb-3">
                          <span className={`font-mono text-[10.5px] uppercase tracking-wider font-bold ${isPopular ? 'text-[#60A5FA]' : 'text-[#2F6DB5]'}`}>
                            {pass.category}
                          </span>
                          {pass.badge && (
                            <span
                              className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                isPopular
                                  ? 'bg-[#D13B84] text-white shadow-md'
                                  : 'bg-slate-100 text-slate-800 border border-slate-200'
                              }`}
                            >
                              {pass.badge}
                            </span>
                          )}
                        </div>

                        {/* Pass Name */}
                        <h3 className={`text-lg font-bold tracking-tight leading-snug mb-1.5 font-display ${isPopular ? 'text-white' : 'text-[#0A1428]'}`}>
                          {pass.name}
                        </h3>

                        <p className={`text-xs leading-relaxed mb-4 line-clamp-3 ${isPopular ? 'text-slate-300' : 'text-slate-600'}`}>
                          {pass.description}
                        </p>

                        {/* Price Frame */}
                        <div className={`py-3.5 px-4 rounded-xl border mb-5 ${isPopular ? 'bg-white/[0.04] border-white/10' : 'bg-slate-50 border-slate-200/80'}`}>
                          <div className="flex items-baseline gap-1.5">
                            <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums font-display ${isPopular ? 'text-white' : 'text-[#0A1428]'}`}>
                              {pass.price}
                            </span>
                            <span className={`font-mono text-xs font-semibold ${isPopular ? 'text-[#60A5FA]' : 'text-[#2F6DB5]'}`}>
                              BWP
                            </span>
                          </div>
                          <p className={`text-[11px] mt-0.5 truncate ${isPopular ? 'text-slate-400' : 'text-slate-500'}`}>
                            {pass.priceNote}
                          </p>
                        </div>

                        {/* Inclusions List */}
                        <div className="mb-5">
                          <div className="flex items-center justify-between mb-2.5">
                            <span className={`font-mono text-[10px] uppercase tracking-wider font-semibold block ${isPopular ? 'text-slate-400' : 'text-slate-500'}`}>
                              Privileges
                            </span>
                            {pass.features.length > 3 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedPassId(expandedPassId === pass.id ? null : pass.id);
                                }}
                                className={`text-[10px] font-mono flex items-center gap-1 cursor-pointer py-0.5 px-2 rounded border ${
                                  isPopular
                                    ? 'text-[#60A5FA] bg-blue-500/10 border-blue-500/20 hover:text-white'
                                    : 'text-[#2F6DB5] bg-blue-50 border-blue-200 hover:bg-blue-100'
                                }`}
                              >
                                <span>{expandedPassId === pass.id ? 'Collapse' : 'Expand all'}</span>
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
                              <div key={idx} className={`flex items-start gap-2.5 text-xs leading-snug ${isPopular ? 'text-slate-300' : 'text-slate-700'}`}>
                                <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isPopular ? 'text-[#60A5FA]' : 'text-[#2F6DB5]'}`} />
                                <span className={expandedPassId === pass.id ? '' : 'line-clamp-2'}>{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Card Bottom: Interactive Button */}
                      <div className={`pt-4 border-t ${isPopular ? 'border-white/10' : 'border-slate-100'}`}>
                        <button
                          onClick={() => onSelectPass(pass.name)}
                          className={`group/btn w-full py-3 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                            isPopular
                              ? 'bg-gradient-to-r from-[#D13B84] to-[#2F6DB5] text-white shadow-lg hover:brightness-110'
                              : 'bg-[#2F6DB5] hover:bg-[#1D4ED8] text-white shadow-md'
                          }`}
                        >
                          <span>Select Pass</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: STRATEGIC PARTNERSHIPS */}
        {activeTab === 'partnerships' && (
          <div className="space-y-8 mb-12">
            {/* Partnerships Intro Header */}
            <div className="bg-gradient-to-r from-[#0A1428] via-[#0E1B38] to-[#0A1428] rounded-2xl p-8 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                  <Zap className="w-3.5 h-3.5 text-[#60A5FA]" />
                  <span className="font-mono text-[11px] uppercase tracking-wider font-bold text-[#60A5FA]">
                    Executive Sponsorship &amp; Track Accords
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight font-display text-white">
                  Strategic Partnership Opportunities
                </h3>
                <p className="text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
                  Position your enterprise at the center of Botswana&apos;s digital economy transformation. Direct engagement with 250+ senior leaders, policymakers, and investors.
                </p>
              </div>
              <div className="shrink-0 font-mono text-xs text-slate-400 bg-white/5 px-4 py-3 rounded-xl border border-white/10">
                <span className="text-white font-bold block mb-0.5">Limited Availability</span>
                <span>Category exclusivity applies</span>
              </div>
            </div>

            {/* Partnerships Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              {CORPORATE_RATE_CARD.strategicPartnership.map((partner) => {
                const isHeadline = partner.id === 'headline-sponsor';

                return (
                  <div
                    key={partner.id}
                    className={`rounded-2xl flex flex-col justify-between transition-all duration-300 overflow-hidden ${
                      isHeadline
                        ? 'lg:col-span-3 bg-gradient-to-br from-[#0A1428] via-[#0E1B38] to-[#070D1A] text-white border-2 border-[#D13B84] shadow-[0_20px_50px_-15px_rgba(209,59,132,0.3)]'
                        : 'bg-white border border-slate-200 text-[#0A1428] shadow-lg hover:shadow-2xl hover:border-[#2F6DB5]/60'
                    }`}
                  >
                    {/* Top Accent Strip */}
                    <div className={`h-2 w-full ${isHeadline ? 'bg-gradient-to-r from-[#D13B84] via-[#2F6DB5] to-[#60A5FA]' : 'bg-[#2F6DB5]'}`} />

                    <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                          <span className={`font-mono text-[11px] uppercase font-bold tracking-wider ${isHeadline ? 'text-[#60A5FA]' : 'text-[#2F6DB5]'}`}>
                            {isHeadline ? 'Exclusive Top-Tier Accord' : 'Official Track Sponsorship'}
                          </span>
                          {partner.badge && (
                            <span className={`text-[10.5px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                              isHeadline
                                ? 'bg-[#D13B84] text-white shadow-md'
                                : 'bg-slate-100 text-slate-800 border border-slate-200'
                            }`}>
                              {partner.badge}
                            </span>
                          )}
                        </div>

                        <h4 className={`text-xl sm:text-2xl font-bold tracking-tight mb-2.5 font-display ${isHeadline ? 'text-white' : 'text-[#0A1428]'}`}>
                          {partner.title}
                        </h4>

                        <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${isHeadline ? 'text-slate-300' : 'text-slate-600'}`}>
                          {partner.description}
                        </p>

                        {/* Price Display */}
                        <div className={`py-4 px-5 rounded-xl border mb-6 flex items-baseline gap-2.5 ${isHeadline ? 'bg-white/[0.04] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                          <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums font-display ${isHeadline ? 'text-white' : 'text-[#0A1428]'}`}>
                            {partner.price}
                          </span>
                          <span className={`font-mono text-xs font-semibold ${isHeadline ? 'text-[#60A5FA]' : 'text-[#2F6DB5]'}`}>
                            BWP
                          </span>
                        </div>

                        {/* Entitlements */}
                        <div className="mb-8">
                          <div className={`font-mono text-[10.5px] uppercase tracking-wider font-semibold mb-3 ${isHeadline ? 'text-slate-400' : 'text-slate-500'}`}>
                            Package Entitlements &amp; Rights
                          </div>
                          <div className={`grid ${isHeadline ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-3`}>
                            {partner.features.map((feat, idx) => (
                              <div key={idx} className={`flex items-start gap-2.5 text-xs sm:text-sm leading-snug ${isHeadline ? 'text-slate-300' : 'text-slate-700'}`}>
                                <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isHeadline ? 'text-[#60A5FA]' : 'text-[#2F6DB5]'}`} />
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Card Action */}
                      <div className={`pt-6 border-t flex justify-end ${isHeadline ? 'border-white/10' : 'border-slate-100'}`}>
                        <button
                          onClick={() => onSelectPass(partner.title)}
                          className={`group py-3 px-8 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all ${
                            isHeadline
                              ? 'bg-gradient-to-r from-[#D13B84] to-[#2F6DB5] text-white hover:brightness-110 w-full sm:w-auto'
                              : 'bg-[#2F6DB5] hover:bg-[#1D4ED8] text-white w-full sm:w-auto'
                          }`}
                        >
                          <span>Inquire for {partner.title}</span>
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

        {/* TAB 3: EXHIBITION STAND */}
        {activeTab === 'exhibition' && (
          <div className="max-w-3xl mx-auto mb-12 rounded-2xl p-8 bg-white border border-slate-200 shadow-xl">
            {CORPORATE_RATE_CARD.exhibition.map((exhibit) => (
              <div key={exhibit.id} className="space-y-8">
                <div className="flex flex-col md:flex-row items-start md:items-baseline justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <span className="font-mono text-[11px] uppercase font-bold tracking-wider text-[#2F6DB5] block mb-1">
                      Exhibition Presence
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#0A1428] tracking-tight font-display">
                      {exhibit.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1.5 max-w-xl leading-relaxed">
                      {exhibit.description}
                    </p>
                  </div>

                  <div className="text-left md:text-right shrink-0">
                    <div className="text-3xl sm:text-4xl font-extrabold text-[#0A1428] tabular-nums font-display">
                      {exhibit.price}
                    </div>
                    <div className="text-xs text-[#2F6DB5] font-semibold mt-1">
                      Includes 2 Delegate Passes
                    </div>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    Exhibition Stand Entitlements
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3.5">
                    {exhibit.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                        <Check className="w-4 h-4 text-[#2F6DB5] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <span className="font-mono text-xs text-slate-500">
                    Stands allocated upon receipt of official registration form.
                  </span>
                  <button
                    onClick={() => onSelectPass(exhibit.title)}
                    className="group bg-gradient-to-r from-[#D13B84] to-[#2F6DB5] px-8 py-3.5 rounded-full text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-110 transition-all"
                  >
                    <span>Reserve Exhibition Stand</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: RATE SHEET TABLE */}
        {activeTab === 'rate-card-table' && (
          <div className="rounded-2xl p-7 sm:p-8 bg-white border border-slate-200 shadow-xl mb-12 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-5 border-b border-slate-200">
              <div>
                <span className="font-mono text-[11px] uppercase font-bold tracking-wider text-[#2F6DB5]">
                  Official Rate Card Schedule
                </span>
                <h3 className="text-xl font-bold text-[#0A1428] tracking-tight mt-1 font-display">
                  BOTSWANA MOBILE &amp; INTERNET CONGRESS 2026
                </h3>
              </div>
              <div className="font-mono text-xs text-slate-500">
                30 October 2026 · Royal Aria · 250+ Delegates
              </div>
            </div>

            {/* Delegate Access */}
            <div>
              <h4 className="font-mono text-xs uppercase font-bold tracking-wider text-[#2F6DB5] mb-4">
                Delegate Access
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
                        <td className="py-4 px-4 text-slate-600">
                          {item.description}
                        </td>
                        <td className="py-4 pl-4 text-right font-bold text-[#0A1428] whitespace-nowrap tabular-nums font-display">
                          {item.price}
                        </td>
                        <td className="py-4 pl-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => onSelectPass(item.title)}
                            className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-[#2F6DB5] text-slate-800 hover:text-white border border-slate-200 transition-colors cursor-pointer"
                          >
                            Select
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Strategic Partnership */}
            <div className="border-t border-slate-200 pt-6">
              <h4 className="font-mono text-xs uppercase font-bold tracking-wider text-[#2F6DB5] mb-4">
                Strategic Partnerships
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <tbody className="divide-y divide-slate-100">
                    {CORPORATE_RATE_CARD.strategicPartnership.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 pr-4 font-semibold text-[#0A1428] whitespace-nowrap">
                          {item.title}
                        </td>
                        <td className="py-4 px-4 text-slate-600">
                          {item.description}
                        </td>
                        <td className="py-4 pl-4 text-right font-bold text-[#0A1428] whitespace-nowrap tabular-nums font-display">
                          {item.price}
                        </td>
                        <td className="py-4 pl-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => onSelectPass(item.title)}
                            className="px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#D13B84] to-[#2F6DB5] text-white hover:brightness-110 transition-colors cursor-pointer"
                          >
                            Inquire
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

        {/* Contact Strip */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div>
            Direct corporate reservations &amp; delegation enquiries: <strong className="text-[#0A1428] font-mono">{EVENT_DETAILS.enquiriesPhone}</strong>
          </div>
          <a
            href={`mailto:${EVENT_DETAILS.contactEmail}?subject=BMIC%202026%20Rate%20Card%20Inquiry`}
            className="font-mono text-xs font-semibold text-[#2F6DB5] hover:underline"
          >
            {EVENT_DETAILS.contactEmail}
          </a>
        </div>
      </div>
    </section>
  );
};
