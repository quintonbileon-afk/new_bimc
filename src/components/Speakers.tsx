import React, { useState } from 'react';
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
  X,
  Maximize2,
} from 'lucide-react';

interface StakeholderGroup {
  name: string;
  category: string;
  description: string;
  icon: LucideIcon;
  badge: string;
}

export const Speakers: React.FC = () => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [enlargedSpeaker, setEnlargedSpeaker] = useState<{
    id: string;
    name: string;
    roleBadge: string;
    title: string;
    organization: string;
    imageUrl: string;
  } | null>(null);

  const speakersList = [
    {
      id: 'speaker-1',
      name: 'Hon. David Tshere',
      roleBadge: 'Keynote Speaker',
      title: 'Minister of Communication and Innovation',
      organization: 'Government of Botswana',
      imageUrl: 'https://drive.google.com/thumbnail?id=10hqNJcuEcOj0Q-XNy_NGzJUTffLtvkxZ&sz=w1000',
    },
    {
      id: 'speaker-2',
      name: 'Mr Mothusi Tladi',
      roleBadge: 'Speaker',
      title: 'Digital Transformation Expert',
      organization: 'Chairperson of the ICT Sector Business Botswana',
      imageUrl: 'https://drive.google.com/thumbnail?id=11Z9zwhVVBAZKsP6VEP8MMkduoQrvc8Xn&sz=w1000',
    },
    {
      id: 'speaker-3',
      name: 'Dr Farzam Kamalabadi',
      roleBadge: 'Speaker',
      title: 'Chairman and CEO',
      organization: 'Future Trends Group',
      imageUrl: 'https://drive.google.com/thumbnail?id=1wei47ZGNLmRXieBvBNphXDuKGr0bfDj0&sz=w1000',
    },
  ];

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
        {/* Section Header: Speakers */}
        <div className="max-w-3xl mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2F6DB5]" />
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#B8C2D6]">
              02 / Speakers
            </p>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-[-0.03em] leading-[1.12] mb-4 font-display">
            CONGRESS SPEAKERS
          </h2>
          <p className="text-base sm:text-lg text-[#B8C2D6] leading-relaxed font-normal">
            Distinguished leaders, policymakers, and innovators convening for BMIC 2026.
          </p>
        </div>

        {/* 3 Speakers Responsive Grid (3 columns desktop, 1 column mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-20 lg:mb-24">
          {speakersList.map((speaker) => (
            <div
              key={speaker.id}
              className="group/card rounded-2xl overflow-hidden bg-[#0D1C3C]/60 border border-white/[0.08] hover:border-white/[0.18] backdrop-blur-sm flex flex-col surface-card transition-all duration-300"
            >
              {/* Image container: aspect-square ensures full-width 100% display of square 1000x1000 flyers without any clipping */}
              <div
                className="relative aspect-square w-full overflow-hidden bg-[#070E1E] cursor-pointer group/flyer"
                onClick={() => setEnlargedSpeaker(speaker)}
                title="Click to view flyer in high resolution"
              >
                {imageErrors[speaker.id] ? (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400 text-xs font-mono p-4 text-center">
                    Image failed to load
                  </div>
                ) : (
                  <>
                    <img
                      src={speaker.imageUrl}
                      alt={`${speaker.name} - ${speaker.title}`}
                      className="w-full h-full object-contain block transition-transform duration-300 group-hover/flyer:scale-[1.015]"
                      loading="lazy"
                      onError={() =>
                        setImageErrors((prev) => ({ ...prev, [speaker.id]: true }))
                      }
                    />
                    <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 border border-white/10 text-white/70 opacity-0 group-hover/flyer:opacity-100 transition-opacity backdrop-blur-sm">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </>
                )}
              </div>

              {/* Speaker name and title section copied from flyers */}
              <div className="p-5 sm:p-6 flex flex-col gap-1.5 flex-1 justify-between bg-gradient-to-b from-[#0D1C3C]/80 to-[#0A1428]">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold mb-2.5 bg-white/[0.04] border border-white/[0.08] text-[#2F6DB5]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2F6DB5]" />
                    {speaker.roleBadge}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight font-display">
                    {speaker.name}
                  </h3>
                  <p className="text-sm font-medium text-white/95 mt-1 leading-snug">
                    {speaker.title}
                  </p>
                  <p className="text-xs text-[#B8C2D6] mt-0.5 leading-snug">
                    {speaker.organization}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section Header: Delegation */}
        <div className="max-w-3xl mb-12 lg:mb-16 pt-8 border-t border-white/[0.08]">
          <div className="inline-flex items-center gap-2 mb-4 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2F6DB5]" />
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#B8C2D6]">
              Delegation &amp; Attendees
            </p>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-[-0.03em] leading-[1.12] mb-4 font-display">
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

      {/* High-Resolution Flyer Lightbox Modal */}
      {enlargedSpeaker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-opacity"
          onClick={() => setEnlargedSpeaker(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-[#0D1C3C] border border-white/15 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0A1428]">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-semibold mb-1 bg-white/[0.06] text-[#2F6DB5]">
                  {enlargedSpeaker.roleBadge}
                </div>
                <h4 className="text-white font-bold text-base font-display">
                  {enlargedSpeaker.name}
                </h4>
                <p className="text-xs text-[#B8C2D6]">
                  {enlargedSpeaker.title} {enlargedSpeaker.organization ? `· ${enlargedSpeaker.organization}` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEnlargedSpeaker(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 bg-[#060D1A] flex items-center justify-center">
              <img
                src={enlargedSpeaker.imageUrl}
                alt={enlargedSpeaker.name}
                className="w-full h-auto max-h-[75vh] object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
