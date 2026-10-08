import React, { useState } from 'react';
import { DELEGATE_PASS_TIERS, CORPORATE_RATE_CARD, EVENT_DETAILS } from '../data/bmicContent';
import { HeaderDots } from './HeaderDots';
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
  Store,
  FileSpreadsheet,
  Download,
  Users,
  Building,
  Radio,
  FileText,
  Mail,
  Phone
} from 'lucide-react';

interface TicketsPassesProps {
  onSelectPass: (passName: string) => void;
}

export const TicketsPasses: React.FC<TicketsPassesProps> = ({ onSelectPass }) => {
  const [activeTab, setActiveTab] = useState<'delegates' | 'partnerships' | 'exhibition' | 'rate-card-table'>('delegates');

  return (
    <section id="passes" className="py-24 bg-[#07101F] text-white border-b border-white/10 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-[#2F6296]/15 rounded-full blur-[170px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/4 right-10 w-[450px] h-[450px] bg-[#D61356]/15 rounded-full blur-[150px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-center mb-6">
          <HeaderDots dotSize="sm" theme="dark" />
        </div>

        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs font-mono font-semibold text-[#82B4EE] uppercase tracking-wider mb-3">
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#FF2A7A]" />
            <span>Official Corporate Rate Card</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase">
            Passes &amp; Corporate Rate Card
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed font-normal">
            A focused executive and industry platform. Direct access to government, regulators, telecom operators, financial institutions, investors, technology leaders, innovators and digital talent.
          </p>

          {/* Quick Stats Badges from Rate Card */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6">
            <span className="px-3 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono font-bold text-slate-200">
              30 OCTOBER 2026
            </span>
            <span className="text-slate-600 hidden sm:inline">·</span>
            <span className="px-3 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono font-bold text-slate-200">
              ROYAL ARIA CONFERENCE CENTRE, GABORONE
            </span>
            <span className="text-slate-600 hidden sm:inline">·</span>
            <span className="px-3 py-1 rounded-xl bg-[#D61356]/20 border border-[#D61356]/40 text-xs font-mono font-bold text-pink-300">
              250+ HIGH-PROFILE DELEGATES
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-2xl glass-panel-dark border border-white/10 max-w-full overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('delegates')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'delegates'
                  ? 'bg-gradient-to-r from-[#2F6296] to-[#D61356] text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Delegate Access (4 Tiers)</span>
            </button>

            <button
              onClick={() => setActiveTab('partnerships')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'partnerships'
                  ? 'bg-gradient-to-r from-[#2F6296] to-[#D61356] text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Strategic Partnership</span>
            </button>

            <button
              onClick={() => setActiveTab('exhibition')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'exhibition'
                  ? 'bg-gradient-to-r from-[#2F6296] to-[#D61356] text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Exhibition Stand</span>
            </button>

            <button
              onClick={() => setActiveTab('rate-card-table')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'rate-card-table'
                  ? 'bg-gradient-to-r from-[#2F6296] to-[#D61356] text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Full Rate Sheet Table</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Delegate Access (4 Cards) */}
        {activeTab === 'delegates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch animate-fade-in">
            {DELEGATE_PASS_TIERS.map((pass) => {
              const isPopular = pass.isPopular;

              return (
                <div
                  key={pass.id}
                  className={`relative rounded-3xl transition-all duration-300 flex flex-col justify-between ${
                    isPopular
                      ? 'glass-panel-dark border-2 border-[#D61356] shadow-2xl shadow-[#D61356]/20 scale-100 lg:-translate-y-2 z-10'
                      : 'glass-panel-dark border border-white/10 hover:border-white/20'
                  } p-6 sm:p-7`}
                >
                  {/* Badge */}
                  {pass.badge && (
                    <div
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-white shadow-md flex items-center gap-1 whitespace-nowrap ${
                        isPopular ? 'bg-gradient-to-r from-[#2F6296] to-[#D61356]' : 'bg-white/20 border border-white/20'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{pass.badge}</span>
                    </div>
                  )}

                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-widest text-[#82B4EE] mb-2 font-bold">
                      Delegate Access
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                      {pass.name}
                    </h3>

                    <p className="text-xs text-slate-400 mb-6 leading-relaxed font-normal min-h-[36px]">
                      {pass.description}
                    </p>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-6">
                      <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
                        {pass.price}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 font-mono">
                        {pass.priceNote}
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-2.5 mb-8">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                        Inclusions:
                      </div>
                      {pass.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <Check className="w-3.5 h-3.5 text-[#D61356] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => onSelectPass(pass.name)}
                      className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        isPopular
                          ? 'bg-gradient-to-r from-[#2F6296] via-[#853C77] to-[#D61356] text-white shadow-lg hover:shadow-[#D61356]/40 hover:scale-[1.02]'
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                      }`}
                    >
                      <span>Select {pass.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Strategic Partnership */}
        {activeTab === 'partnerships' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto items-stretch animate-fade-in">
            {CORPORATE_RATE_CARD.strategicPartnership.map((partner) => {
              const isHeadline = partner.id === 'headline-sponsor';

              return (
                <div
                  key={partner.id}
                  className={`rounded-3xl glass-panel-dark border transition-all duration-300 p-8 flex flex-col justify-between relative overflow-hidden ${
                    isHeadline
                      ? 'border-[#82B4EE]/50 ring-2 ring-[#82B4EE]/20 shadow-2xl md:col-span-2'
                      : 'border-white/10 hover:border-white/25'
                  }`}
                >
                  {isHeadline && (
                    <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#2F6296]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-mono uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[#82B4EE]">
                        Strategic Partnership
                      </span>
                      {partner.badge && (
                        <span className="text-xs font-mono font-bold text-pink-300 bg-[#D61356]/20 px-2.5 py-0.5 rounded-lg border border-[#D61356]/30">
                          {partner.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                      {partner.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed font-normal">
                      {partner.description}
                    </p>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-6 flex items-baseline gap-3">
                      <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                        {partner.price}
                      </div>
                      <span className="text-xs font-mono text-slate-400">Botswana Pula</span>
                    </div>

                    <div className="space-y-2 mb-8">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                        Sponsorship Entitlements:
                      </div>
                      <div className={`grid ${isHeadline ? 'sm:grid-cols-2' : 'grid-cols-1'} gap-2`}>
                        {partner.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                            <Check className="w-3.5 h-3.5 text-[#82B4EE] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-xs text-slate-400 font-mono">
                      Subject to availability &amp; bilateral agreement
                    </span>
                    <button
                      onClick={() => onSelectPass(partner.title)}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#2F6296] to-[#D61356] hover:brightness-110 shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <span>Inquire for {partner.title}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Exhibition Stand */}
        {activeTab === 'exhibition' && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            {CORPORATE_RATE_CARD.exhibition.map((exhibit) => (
              <div
                key={exhibit.id}
                className="rounded-3xl glass-panel-dark border border-white/15 p-8 sm:p-12 relative overflow-hidden shadow-2xl"
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2F6296] via-[#FF2A7A] to-[#82B4EE]" />

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8 pb-8 border-b border-white/10">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-mono font-semibold text-[#82B4EE] uppercase tracking-wider mb-3">
                      <Store className="w-3.5 h-3.5 text-[#FF2A7A]" />
                      <span>Exhibition Package</span>
                    </div>
                    <h3 className="text-3xl font-extrabold text-white tracking-tight">
                      {exhibit.title}
                    </h3>
                    <p className="text-sm text-slate-300 mt-2 max-w-xl leading-relaxed font-normal">
                      {exhibit.description}
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 text-center shrink-0 w-full sm:w-auto">
                    <div className="text-4xl font-extrabold text-white font-mono">
                      {exhibit.price}
                    </div>
                    <div className="text-xs font-mono text-slate-400 mt-1">
                      Includes 2 Delegate Passes
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    Exhibition Package Entitlements:
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {exhibit.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                        <Check className="w-4 h-4 text-[#82B4EE] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-400">
                    Floor layout allocated based on reservation confirmation order.
                  </div>
                  <button
                    onClick={() => onSelectPass(exhibit.title)}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#2F6296] to-[#D61356] hover:brightness-110 shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span>Reserve Exhibition Stand</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Full Rate Sheet Table (Matches the PDF document directly) */}
        {activeTab === 'rate-card-table' && (
          <div className="max-w-5xl mx-auto rounded-3xl glass-panel-dark border border-white/15 overflow-hidden shadow-2xl animate-fade-in">
            {/* Header Banner matching PDF */}
            <div className="p-6 sm:p-8 border-b border-white/10 bg-white/[0.02]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono font-bold tracking-widest text-[#82B4EE] uppercase">
                    BMIC 2026 · CORPORATE RATE CARD
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                    BOTSWANA MOBILE &amp; INTERNET CONGRESS 2026
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    Transforming Botswana into the Digital Valley of SADC
                  </p>
                </div>

                <div className="text-left sm:text-right font-mono text-xs text-slate-300 shrink-0">
                  <div className="font-bold text-white">30 OCTOBER 2026</div>
                  <div>ROYAL ARIA | GABORONE</div>
                  <div className="text-pink-400 font-bold">250+ DELEGATES</div>
                </div>
              </div>
            </div>

            {/* Section 1: DELEGATE ACCESS */}
            <div className="p-6 border-b border-white/10">
              <div className="text-xs font-mono uppercase font-bold tracking-widest text-[#82B4EE] mb-4">
                DELEGATE ACCESS
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px] uppercase">
                      <th className="py-2.5 pr-4">Tier / Category</th>
                      <th className="py-2.5 px-4">Description &amp; Inclusions</th>
                      <th className="py-2.5 pl-4 text-right">Price</th>
                      <th className="py-2.5 pl-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {CORPORATE_RATE_CARD.delegateAccess.map((item) => (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 pr-4 font-bold text-white whitespace-nowrap">
                          {item.title}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          {item.description}
                        </td>
                        <td className="py-3.5 pl-4 text-right font-mono font-bold text-white whitespace-nowrap text-base">
                          {item.price}
                        </td>
                        <td className="py-3.5 pl-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => onSelectPass(item.title)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
                          >
                            Book
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 2: STRATEGIC PARTNERSHIP */}
            <div className="p-6 border-b border-white/10">
              <div className="text-xs font-mono uppercase font-bold tracking-widest text-[#FF2A7A] mb-4">
                STRATEGIC PARTNERSHIP
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px] uppercase">
                      <th className="py-2.5 pr-4">Sponsorship Opportunity</th>
                      <th className="py-2.5 px-4">Entitlements &amp; Visibility</th>
                      <th className="py-2.5 pl-4 text-right">Price</th>
                      <th className="py-2.5 pl-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {CORPORATE_RATE_CARD.strategicPartnership.map((item) => (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 pr-4 font-bold text-white whitespace-nowrap">
                          {item.title}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 text-xs">
                          {item.description}
                        </td>
                        <td className="py-3.5 pl-4 text-right font-mono font-bold text-white whitespace-nowrap text-base">
                          {item.price}
                        </td>
                        <td className="py-3.5 pl-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => onSelectPass(item.title)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#2F6296] to-[#D61356] text-white hover:brightness-110 transition-all"
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

            {/* Section 3: EXHIBITION */}
            <div className="p-6 border-b border-white/10">
              <div className="text-xs font-mono uppercase font-bold tracking-widest text-[#82B4EE] mb-4">
                EXHIBITION
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px] uppercase">
                      <th className="py-2.5 pr-4">Package</th>
                      <th className="py-2.5 px-4">Inclusions</th>
                      <th className="py-2.5 pl-4 text-right">Price</th>
                      <th className="py-2.5 pl-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {CORPORATE_RATE_CARD.exhibition.map((item) => (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 pr-4 font-bold text-white whitespace-nowrap">
                          {item.title}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          {item.description}
                        </td>
                        <td className="py-3.5 pl-4 text-right font-mono font-bold text-white whitespace-nowrap text-base">
                          {item.price}
                        </td>
                        <td className="py-3.5 pl-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => onSelectPass(item.title)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
                          >
                            Reserve
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Key Audience Chips from bottom of PDF */}
            <div className="p-6 bg-white/[0.02] border-b border-white/10">
              <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-semibold mb-3">
                Key Convened Sectors:
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {CORPORATE_RATE_CARD.keySectors.map((sector, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-slate-200 font-mono"
                  >
                    {sector}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Credits & Contact strip */}
            <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
              <div className="space-y-1 text-center md:text-left">
                <div className="text-slate-300">
                  <span className="font-semibold text-white">PARTNER WITH BMIC 2026: </span>
                  <span>{CORPORATE_RATE_CARD.organiser}</span>
                  <span className="mx-2">·</span>
                  <a href={`mailto:${CORPORATE_RATE_CARD.contactEmail}`} className="text-[#82B4EE] hover:underline">
                    {CORPORATE_RATE_CARD.contactEmail}
                  </a>
                  <span className="mx-2">·</span>
                  <a href={`tel:${CORPORATE_RATE_CARD.phone}`} className="text-[#82B4EE] hover:underline font-mono">
                    {CORPORATE_RATE_CARD.phone}
                  </a>
                </div>
                <div className="text-[11px] text-slate-400">
                  Organised by <strong className="text-white">{CORPORATE_RATE_CARD.organiser}</strong> · Empowered by <strong className="text-white">{CORPORATE_RATE_CARD.empoweredBy}</strong>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 text-center md:text-right max-w-sm">
                {CORPORATE_RATE_CARD.disclaimer}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Contact / Inquiries Callout */}
        <div className="mt-14 max-w-4xl mx-auto rounded-2xl glass-panel-dark border border-white/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="text-xs font-mono uppercase tracking-wider text-[#82B4EE] font-bold">
              Organised by {CORPORATE_RATE_CARD.organiser} · Empowered by {CORPORATE_RATE_CARD.empoweredBy}
            </div>
            <div className="text-sm font-bold text-white mt-0.5">
              Have specific institutional delegation or sponsorship requirements?
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Direct line: <span className="font-mono text-white font-semibold">{CORPORATE_RATE_CARD.phone}</span> · Email: <span className="text-white font-semibold">{CORPORATE_RATE_CARD.contactEmail}</span>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <a
              href={`mailto:${CORPORATE_RATE_CARD.contactEmail}?subject=BMIC%202026%20Rate%20Card%20Inquiry`}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold glass-panel-dark border border-white/20 hover:border-white/40 text-white transition-all flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-[#82B4EE]" />
              <span>Email Secretariat</span>
            </a>
            <button
              onClick={() => onSelectPass('Corporate Delegate')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#2F6296] to-[#D61356] hover:brightness-110 text-white shadow-lg transition-all"
            >
              Book Passes
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
