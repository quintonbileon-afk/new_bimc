import React from 'react';
import {
  ArrowRight,
  Landmark,
  ShieldCheck,
  Radio,
  Network,
  Banknote,
  Rocket,
  Code2,
  Video,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  LucideIcon,
} from 'lucide-react';

interface StakeholderGroup {
  name: string;
  category: string;
  description: string;
  icon: LucideIcon;
  badge: string;
}

export const Speakers: React.FC = () => {
  const decisionMakers: StakeholderGroup[] = [
    {
      name: 'Government Ministries & Departments',
      category: 'Sovereign Policy',
      description: 'Communications, Digital Economy, Trade, Finance & Regional Integration',
      icon: Landmark,
      badge: 'Policy & Direction',
    },
    {
      name: 'Regulators & Policy Authorities',
      category: 'Regulatory Framework',
      description: 'BOCRA, Competition Authority, Data Protection Office & Standards',
      icon: ShieldCheck,
      badge: 'Compliance & Spectrum',
    },
    {
      name: 'Mobile Network Operators (MNOs)',
      category: 'Telecom Leadership',
      description: 'Mascom, BTC, Orange & regional connectivity infrastructure leaders',
      icon: Radio,
      badge: '5G, 4G & Fibre Backbone',
    },
    {
      name: 'ISPs & Infrastructure Enablers',
      category: 'Core Connectivity',
      description: 'BoFiNet, carrier neutral data centres, subsea/satellite links',
      icon: Network,
      badge: 'Universal Access',
    },
    {
      name: 'Financial Institutions & DFIs',
      category: 'Institutional Capital',
      description: 'Commercial banks, BDC, CEDA, regional development finance bodies',
      icon: Banknote,
      badge: 'Project & Debt Capital',
    },
  ];

  const builders: StakeholderGroup[] = [
    {
      name: 'Startups & Tech Founders',
      category: 'Venture Creation',
      description: 'Fintech, healthtech, agritech, logistics & local SaaS innovators',
      icon: Rocket,
      badge: 'Seed & Series Stage',
    },
    {
      name: 'Software Developers & Engineers',
      category: 'Technical Architecture',
      description: 'System architects, AI practitioners, cloud, fullstack & API builders',
      icon: Code2,
      badge: 'Implementation',
    },
    {
      name: 'Digital Content Creators & Media',
      category: 'Creator Economy',
      description: 'Streaming talent, digital publishers, podcast networks & influencers',
      icon: Video,
      badge: 'Monetisation & Rails',
    },
    {
      name: 'Innovation Hubs & Accelerators',
      category: 'Ecosystem Cultivation',
      description: 'BIH, university tech labs, incubator programmes & developer circles',
      icon: Sparkles,
      badge: 'Pipeline Growth',
    },
    {
      name: 'Venture Investors & Angel Syndicates',
      category: 'Risk Capital',
      description: 'Pan-African VC funds, angel syndicates, private equity & LP investors',
      icon: TrendingUp,
      badge: 'Equity Investment',
    },
  ];

  return (
    <section id="speakers" className="py-[72px] lg:py-[120px] bg-[#0A1428] text-white border-b border-white/[0.08] relative">
      <div id="attendees" className="absolute -top-24" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 mb-4 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2F6DB5]" />
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#B8C2D6]">
              02 / Delegation
            </p>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-[-0.03em] leading-[1.12] mb-4 font-display">
            WHO WILL BE IN THE ROOM
          </h2>
          <p className="text-base sm:text-lg text-[#B8C2D6] leading-relaxed font-normal">
            Uniting institutional leadership with ecosystem innovators driving Botswana's digital economy forward.
          </p>
        </div>

        {/* 2-Column Editorial Structure with Refined Interactive Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mb-16">
          {/* Column 1: Institutional Leadership */}
          <div className="rounded-2xl p-5 sm:p-6 bg-[#0D1C3C]/60 border border-white/[0.08] backdrop-blur-sm flex flex-col justify-between relative overflow-hidden group">
            {/* Ambient subtle glow */}
            <div className="absolute top-0 right-0 w-56 h-56 bg-[#2F6DB5]/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-[#2F6DB5] tabular-nums">
                    01
                  </span>
                  <div>
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-300 block">
                      Institutional Leadership
                    </span>
                    <span className="text-[11px] text-white/40">Sovereign &amp; Telecom Core</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[9px] font-mono text-[#B8C2D6]">
                  5 Pillars
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mb-1.5 font-display">
                Decision-Makers &amp; Regulators
              </h3>

              <p className="text-xs sm:text-sm text-[#B8C2D6] leading-relaxed mb-4 font-normal">
                Government ministries, regulators, telecom operators, ISPs, financial institutions, and policy leaders shaping regulation and sovereign investment.
              </p>

              {/* Redesigned List of Represented Institutions with Better Spacing */}
              <div>
                <div className="flex items-center justify-between mb-2 px-1">
                  <p className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                    Represented Institutions
                  </p>
                  <span className="font-mono text-[9px] text-[#2F6DB5] font-medium">Policy &amp; Capital</span>
                </div>

                <div className="space-y-1.5">
                  {decisionMakers.map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={item.name}
                        className="group/item relative overflow-hidden px-3 py-2.5 rounded-xl bg-[#0A1428]/80 hover:bg-[#112140] border border-white/[0.06] hover:border-[#2F6DB5]/60 hover:shadow-[0_6px_20px_-6px_rgba(47,109,181,0.35)] transition-all duration-200 flex items-center gap-3 cursor-default hover:-translate-y-0.5 hover:translate-x-0.5"
                      >
                        {/* Illuminating left edge accent bar */}
                        <div className="absolute left-0 top-1.5 bottom-1.5 w-[2.5px] rounded-r bg-[#2F6DB5] opacity-0 group-hover/item:opacity-100 transition-opacity" />

                        <div className="w-7 h-7 rounded-lg bg-[#2F6DB5]/15 border border-[#2F6DB5]/30 flex items-center justify-center shrink-0 text-[#60A5FA] group-hover/item:bg-[#2F6DB5] group-hover/item:text-white group-hover/item:scale-105 group-hover/item:shadow-[0_0_12px_rgba(47,109,181,0.5)] transition-all">
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-xs sm:text-[13px] font-semibold text-white tracking-tight truncate group-hover/item:text-white transition-colors">
                              {item.name}
                            </h4>
                            <span className="font-mono text-[9px] text-slate-400 group-hover/item:text-[#60A5FA] shrink-0 font-medium transition-colors">
                              0{idx + 1}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#B8C2D6]/80 leading-normal line-clamp-1 mt-0.5 group-hover/item:text-slate-200 transition-colors">
                            {item.description}
                          </p>
                        </div>

                        {/* Sliding arrow indicator */}
                        <ArrowRight className="w-3.5 h-3.5 text-[#60A5FA] opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[10px] text-[#B8C2D6] truncate mr-2">
                Mandate: Spectrum allocation, policy harmonization &amp; infrastructure
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2F6DB5] shrink-0" />
            </div>
          </div>

          {/* Column 2: Ecosystem Builders */}
          <div className="rounded-2xl p-5 sm:p-6 bg-[#0D1C3C]/60 border border-white/[0.08] backdrop-blur-sm flex flex-col justify-between relative overflow-hidden group">
            {/* Ambient subtle glow */}
            <div className="absolute top-0 right-0 w-56 h-56 bg-[#D81B60]/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-[#D81B60] tabular-nums">
                    02
                  </span>
                  <div>
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-300 block">
                      Ecosystem Builders
                    </span>
                    <span className="text-[11px] text-white/40">Commercial Execution &amp; Scale</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[9px] font-mono text-[#B8C2D6]">
                  5 Segments
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mb-1.5 font-display">
                Builders, Founders &amp; Creators
              </h3>

              <p className="text-xs sm:text-sm text-[#B8C2D6] leading-relaxed mb-4 font-normal">
                Early-stage founders, software engineers, content creators, accelerators, researchers, and venture investors driving scalable technology products and digital commerce.
              </p>

              {/* Redesigned List of Participating Groups with Better Spacing */}
              <div>
                <div className="flex items-center justify-between mb-2 px-1">
                  <p className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                    Participating Groups
                  </p>
                  <span className="font-mono text-[9px] text-[#D81B60] font-medium">Innovation &amp; Scale</span>
                </div>

                <div className="space-y-1.5">
                  {builders.map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={item.name}
                        className="group/item relative overflow-hidden px-3 py-2.5 rounded-xl bg-[#0A1428]/80 hover:bg-[#1E1128] border border-white/[0.06] hover:border-[#D81B60]/60 hover:shadow-[0_6px_20px_-6px_rgba(216,27,96,0.35)] transition-all duration-200 flex items-center gap-3 cursor-default hover:-translate-y-0.5 hover:translate-x-0.5"
                      >
                        {/* Illuminating left edge accent bar */}
                        <div className="absolute left-0 top-1.5 bottom-1.5 w-[2.5px] rounded-r bg-[#D81B60] opacity-0 group-hover/item:opacity-100 transition-opacity" />

                        <div className="w-7 h-7 rounded-lg bg-[#D81B60]/15 border border-[#D81B60]/30 flex items-center justify-center shrink-0 text-[#F472B6] group-hover/item:bg-[#D81B60] group-hover/item:text-white group-hover/item:scale-105 group-hover/item:shadow-[0_0_12px_rgba(216,27,96,0.5)] transition-all">
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-xs sm:text-[13px] font-semibold text-white tracking-tight truncate group-hover/item:text-white transition-colors">
                              {item.name}
                            </h4>
                            <span className="font-mono text-[9px] text-slate-400 group-hover/item:text-[#F472B6] shrink-0 font-medium transition-colors">
                              0{idx + 1}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#B8C2D6]/80 leading-normal line-clamp-1 mt-0.5 group-hover/item:text-slate-200 transition-colors">
                            {item.description}
                          </p>
                        </div>

                        {/* Sliding arrow indicator */}
                        <ArrowRight className="w-3.5 h-3.5 text-[#F472B6] opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[10px] text-[#B8C2D6] truncate mr-2">
                Mandate: Commercialization, product development &amp; tech venture creation
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#D81B60] shrink-0" />
            </div>
          </div>
        </div>

        {/* Thin 1px Divider Strip with Action */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#B8C2D6]">
            Structured bilateral convening connecting sovereign policymakers, commercial operators, and technology builders under one roof.
          </p>
          <a
            href="#passes"
            className="group text-xs font-semibold text-white hover:text-[#B8C2D6] inline-flex items-center gap-1.5 transition-colors py-2"
          >
            <span>View Delegate Passes</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};
