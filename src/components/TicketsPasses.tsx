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
} from 'lucide-react';

interface TicketsPassesProps {
  onSelectPass: (passName: string) => void;
}

export const TicketsPasses: React.FC<TicketsPassesProps> = ({ onSelectPass }) => {
  const [activeTab, setActiveTab] = useState<'delegates' | 'partnerships' | 'exhibition' | 'rate-card-table'>('delegates');
  const [passFilter, setPassFilter] = useState<'all' | 'individual' | 'team'>('all');
  const [expandedPassId, setExpandedPassId] = useState<string | null>(null);

  // Sorted and enriched delegate passes for creative credential display
  const passes = [
    // Free
    {
      ...DELEGATE_PASS_TIERS.find((p) => p.price === 'Free') || DELEGATE_PASS_TIERS[4],
      code: 'EXPO-01',
      category: 'Exhibition Floor',
      color: 'slate',
      type: 'individual',
      accentGlow: 'from-slate-400/10 to-transparent',
    },
    // Subsidized Student / Dev
    {
      ...DELEGATE_PASS_TIERS.find((p) => p.id === 'student-developer') || DELEGATE_PASS_TIERS[3],
      code: 'DEV-02',
      category: 'Builders & Talent',
      color: 'emerald',
      type: 'individual',
      accentGlow: 'from-emerald-500/10 to-transparent',
    },
    // Standard
    {
      ...DELEGATE_PASS_TIERS.find((p) => p.id === 'standard-delegate') || DELEGATE_PASS_TIERS[0],
      code: 'STD-03',
      category: 'Single Delegate',
      color: 'blue',
      type: 'individual',
      accentGlow: 'from-blue-500/10 to-transparent',
    },
    // Corporate Delegate (Featured Flagship)
    {
      ...DELEGATE_PASS_TIERS.find((p) => p.id === 'corporate-delegate') || DELEGATE_PASS_TIERS[1],
      code: 'CORP-04',
      category: 'Corporate Executive',
      color: 'magenta',
      type: 'individual',
      isPopular: true,
      accentGlow: 'from-[#D13B84]/15 via-[#2F6DB5]/15 to-transparent',
    },
    // Team Package
    {
      ...DELEGATE_PASS_TIERS.find((p) => p.id === 'corporate-pack') || DELEGATE_PASS_TIERS[2],
      code: 'TEAM-05',
      category: 'Enterprise 3-Pack',
      color: 'indigo',
      type: 'team',
      accentGlow: 'from-indigo-500/15 to-transparent',
    },
  ];

  const filteredPasses = passes.filter((p) => {
    if (passFilter === 'individual') return p.type === 'individual';
    if (passFilter === 'team') return p.type === 'team';
    return true;
  });

  return (
    <section id="passes" className="py-12 lg:py-16 bg-[#F7F8FA] text-[#0A1428] border-b border-slate-200/90 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2F6DB5]/[0.05] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 px-2.5 py-1 rounded-full bg-slate-200/60 border border-slate-300/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F6DB5]" />
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#2F6DB5] font-semibold">
                07 / Corporate Rate Card
              </p>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A1428] tracking-tight font-display">
              PASSES &amp; CORPORATE RATE CARD
            </h2>
            <p className="text-xs sm:text-sm text-[#4A5568] max-w-xl font-normal leading-relaxed mt-1">
              Official delegate credentials, strategic bilateral tracks, and corporate exhibition stands for BMIC 2026.
            </p>
          </div>

          {/* Interactive Navigation Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-2xl shadow-xs self-start sm:self-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('delegates')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'delegates'
                  ? 'bg-[#0A1428] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0A1428] hover:bg-slate-50'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Delegate Passes (5)</span>
            </button>

            <button
              onClick={() => setActiveTab('partnerships')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'partnerships'
                  ? 'bg-[#0A1428] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0A1428] hover:bg-slate-50'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Partnerships</span>
            </button>

            <button
              onClick={() => setActiveTab('exhibition')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'exhibition'
                  ? 'bg-[#0A1428] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0A1428] hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Exhibition</span>
            </button>

            <button
              onClick={() => setActiveTab('rate-card-table')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'rate-card-table'
                  ? 'bg-[#0A1428] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0A1428] hover:bg-slate-50'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Rate Sheet</span>
            </button>
          </div>
        </div>

        {/* TAB 1: CREATIVE SMART-PASS CREDENTIAL MATRIX */}
        {activeTab === 'delegates' && (
          <div>
            {/* Creative Filter Bar */}
            <div className="flex items-center justify-between gap-4 mb-6 pb-3 border-b border-slate-200/80">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                  Credential Filter:
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPassFilter('all')}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all cursor-pointer ${
                      passFilter === 'all'
                        ? 'bg-[#2F6DB5] text-white font-bold'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    All Tiers (5)
                  </button>
                  <button
                    onClick={() => setPassFilter('individual')}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all cursor-pointer ${
                      passFilter === 'individual'
                        ? 'bg-[#2F6DB5] text-white font-bold'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Individual (4)
                  </button>
                  <button
                    onClick={() => setPassFilter('team')}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all cursor-pointer ${
                      passFilter === 'team'
                        ? 'bg-[#2F6DB5] text-white font-bold'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Team Pack (1)
                  </button>
                </div>
              </div>

              <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                <Wifi className="w-3 h-3 text-[#2F6DB5] rotate-90" />
                NFC-Enabled Physical Credential Included
              </span>
            </div>

            {/* Smart Badge Tiers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5 items-stretch mb-12">
              {filteredPasses.map((pass) => {
                const isPopular = pass.isPopular;
                const isFree = pass.price === 'Free';

                return (
                  <div
                    key={pass.id}
                    className={`group relative rounded-2xl flex flex-col justify-between transition-all duration-300 cursor-default select-none overflow-hidden ${
                      isPopular
                        ? 'bg-gradient-to-b from-white via-white to-blue-50/40 border-2 border-[#2F6DB5] shadow-[0_16px_40px_-10px_rgba(47,109,181,0.22)] xl:-translate-y-2.5 z-20'
                        : 'bg-white border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-lg hover:-translate-y-1.5 z-10'
                    }`}
                  >
                    {/* Top Lanyard Slot Graphic (Creative Physical Badge Detail) */}
                    <div className="pt-3.5 pb-1 px-4 flex items-center justify-between border-b border-slate-100/80 bg-slate-50/60">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Wifi className="w-3 h-3 rotate-90 text-[#2F6DB5]" />
                        <span className="font-mono text-[9px] font-bold tracking-wider text-slate-500">
                          {pass.code}
                        </span>
                      </div>

                      {/* Lanyard Clip Punch Hole */}
                      <div className="w-10 h-1 rounded-full bg-slate-300/80 group-hover:bg-[#2F6DB5]/40 transition-colors" />

                      <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider">
                        2026
                      </span>
                    </div>

                    {/* Badge Content */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Eyebrow & Badges */}
                        <div className="flex items-center justify-between gap-1 mb-2.5">
                          <span className="font-mono text-[10px] uppercase tracking-wider font-semibold text-[#2F6DB5]">
                            {pass.category}
                          </span>
                          {pass.badge && (
                            <span
                              className={`text-[9.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                isPopular
                                  ? 'bg-[#D13B84] text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {pass.badge}
                            </span>
                          )}
                        </div>

                        {/* Pass Name */}
                        <h3 className="text-base font-bold text-[#0A1428] tracking-tight leading-snug mb-1 font-display">
                          {pass.name}
                        </h3>

                        <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">
                          {pass.description}
                        </p>

                        {/* Price Frame */}
                        <div className="py-3 px-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 mb-4">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl sm:text-3xl font-extrabold text-[#0A1428] tracking-tight tabular-nums font-display">
                              {pass.price}
                            </span>
                            {!isFree && (
                              <span className="font-mono text-[10px] font-semibold text-slate-500">
                                BWP
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                            {pass.priceNote}
                          </p>
                        </div>

                        {/* Inclusions List */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-[9.5px] uppercase tracking-wider text-slate-400 font-semibold block">
                              Privileges
                            </span>
                            {pass.features.length > 3 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedPassId(expandedPassId === pass.id ? null : pass.id);
                                }}
                                className="text-[10px] font-mono text-[#2F6DB5] hover:text-[#1D4ED8] flex items-center gap-0.5 cursor-pointer py-0.5 px-1.5 rounded bg-blue-50/70 border border-blue-100"
                              >
                                <span>{expandedPassId === pass.id ? 'Collapse' : 'Expand all'}</span>
                                {expandedPassId === pass.id ? (
                                  <ChevronUp className="w-2.5 h-2.5" />
                                ) : (
                                  <ChevronDown className="w-2.5 h-2.5" />
                                )}
                              </button>
                            )}
                          </div>
                          <div className="space-y-2">
                            {(expandedPassId === pass.id ? pass.features : pass.features.slice(0, 4)).map((feat, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 leading-snug">
                                <Check className="w-3.5 h-3.5 text-[#2F6DB5] shrink-0 mt-0.5" />
                                <span className={expandedPassId === pass.id ? '' : 'line-clamp-2'}>{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Card Bottom: Interactive Button & Authentic Credential Barcode */}
                      <div className="pt-3 border-t border-slate-100 space-y-3">
                        <button
                          onClick={() => onSelectPass(pass.name)}
                          className={`group/btn w-full py-2.5 px-3.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            isPopular
                              ? 'btn-cta-magenta text-white shadow-sm'
                              : isFree
                              ? 'bg-slate-100 hover:bg-[#0A1428] text-slate-700 hover:text-white border border-slate-200 hover:border-[#0A1428]'
                              : 'bg-[#0A1428] hover:bg-[#15274d] text-white shadow-xs'
                          }`}
                        >
                          <span>{isFree ? 'Claim Free Pass' : 'Select Pass'}</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                        </button>

                        {/* Discrete Delegate Authentication Barcode (Creative Authentic Touch) */}
                        <div className="flex items-center justify-between text-slate-400 font-mono text-[8.5px] pt-1">
                          <span className="tracking-[2.5px] opacity-70">|||| | ||||| || |</span>
                          <span className="opacity-80">BMIC-2026</span>
                        </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mb-12">
            {CORPORATE_RATE_CARD.strategicPartnership.map((partner) => {
              const isHeadline = partner.id === 'headline-sponsor';

              return (
                <div
                  key={partner.id}
                  className={`rounded-2xl p-6 sm:p-7 bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-[#2F6DB5]/60 transition-all ${
                    isHeadline ? 'md:col-span-2 border-2 border-[#2F6DB5]/40 bg-gradient-to-b from-white to-blue-50/20' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#2F6DB5]">
                        Strategic Partnership Accord
                      </span>
                      {partner.badge && (
                        <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-[#0A1428] border border-slate-200">
                          {partner.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-[#0A1428] mb-2 tracking-tight font-display">
                      {partner.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#4A5568] mb-6 leading-relaxed max-w-2xl">
                      {partner.description}
                    </p>

                    {/* Price Frame */}
                    <div className="py-4 px-5 rounded-xl bg-slate-50 border border-slate-200/80 mb-6 flex items-baseline gap-2.5">
                      <div className="text-3xl sm:text-4xl font-extrabold text-[#0A1428] tabular-nums font-display">
                        {partner.price}
                      </div>
                      <span className="font-mono text-xs text-slate-500 font-semibold">Botswana Pula</span>
                    </div>

                    <div className="space-y-2.5 mb-8">
                      <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                        Entitlements &amp; Rights
                      </div>
                      <div className={`grid ${isHeadline ? 'sm:grid-cols-2' : 'grid-cols-1'} gap-2.5`}>
                        {partner.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                            <Check className="w-3.5 h-3.5 text-[#2F6DB5] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <span className="font-mono text-[11px] text-slate-400">
                      Subject to bilateral agreement &amp; category exclusivity
                    </span>
                    <button
                      onClick={() => onSelectPass(partner.title)}
                      className="group btn-cta-magenta px-6 py-3 rounded-full text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <span>Inquire for {partner.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: EXHIBITION STAND */}
        {activeTab === 'exhibition' && (
          <div className="max-w-3xl mx-auto mb-12 rounded-2xl p-7 bg-white border border-slate-200 shadow-sm">
            {CORPORATE_RATE_CARD.exhibition.map((exhibit) => (
              <div key={exhibit.id} className="space-y-8">
                <div className="flex flex-col md:flex-row items-start md:items-baseline justify-between gap-4 pb-6 border-b border-slate-200">
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#2F6DB5] block mb-1">
                      Exhibition Presence
                    </span>
                    <h3 className="text-2xl font-bold text-[#0A1428] tracking-tight font-display">
                      {exhibit.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4A5568] mt-1 max-w-xl leading-relaxed">
                      {exhibit.description}
                    </p>
                  </div>

                  <div className="text-left md:text-right shrink-0">
                    <div className="text-3xl sm:text-4xl font-extrabold text-[#0A1428] tabular-nums font-display">
                      {exhibit.price}
                    </div>
                    <div className="text-xs text-[#2F6DB5] font-semibold mt-0.5">
                      Includes 2 Delegate Passes
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    Exhibition Stand Entitlements
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {exhibit.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                        <Check className="w-3.5 h-3.5 text-[#2F6DB5] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <span className="font-mono text-[11px] text-slate-400">
                    Stands allocated upon receipt of official registration form.
                  </span>
                  <button
                    onClick={() => onSelectPass(exhibit.title)}
                    className="group btn-cta-magenta px-7 py-3 rounded-full text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer shadow-sm"
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
          <div className="rounded-2xl p-6 sm:p-7 bg-white border border-slate-200 shadow-sm mb-12 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-slate-200">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#2F6DB5]">
                  Official Rate Card Schedule
                </span>
                <h3 className="text-xl font-bold text-[#0A1428] tracking-tight mt-0.5 font-display">
                  BOTSWANA MOBILE &amp; INTERNET CONGRESS 2026
                </h3>
              </div>
              <div className="font-mono text-xs text-slate-500">
                30 October 2026 · Royal Aria · 250+ Delegates
              </div>
            </div>

            {/* Delegate Access */}
            <div>
              <h4 className="font-mono text-xs uppercase font-bold tracking-wider text-[#2F6DB5] mb-3">
                Delegate Access
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase font-mono text-[10px]">
                      <th className="py-2.5 pr-4">Category</th>
                      <th className="py-2.5 px-4">Description</th>
                      <th className="py-2.5 pl-4 text-right">Price</th>
                      <th className="py-2.5 pl-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {CORPORATE_RATE_CARD.delegateAccess.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 pr-4 font-semibold text-[#0A1428] whitespace-nowrap">
                          {item.title}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {item.description}
                        </td>
                        <td className="py-3.5 pl-4 text-right font-bold text-[#0A1428] whitespace-nowrap tabular-nums">
                          {item.price}
                        </td>
                        <td className="py-3.5 pl-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => onSelectPass(item.title)}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-[#0A1428] hover:text-white border border-slate-200 transition-colors cursor-pointer"
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
              <h4 className="font-mono text-xs uppercase font-bold tracking-wider text-[#2F6DB5] mb-3">
                Strategic Partnerships
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <tbody className="divide-y divide-slate-100">
                    {CORPORATE_RATE_CARD.strategicPartnership.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 pr-4 font-semibold text-[#0A1428] whitespace-nowrap">
                          {item.title}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {item.description}
                        </td>
                        <td className="py-3.5 pl-4 text-right font-bold text-[#0A1428] whitespace-nowrap tabular-nums">
                          {item.price}
                        </td>
                        <td className="py-3.5 pl-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => onSelectPass(item.title)}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#0A1428] text-white hover:bg-[#1b2b4e] transition-colors cursor-pointer"
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
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
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
