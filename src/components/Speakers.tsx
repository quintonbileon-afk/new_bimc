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

        {/* 2-Column Editorial Structure with Premium Glassmorphism Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Column 1: Institutional Leadership */}
          <div className="relative rounded-3xl p-8 sm:p-10 bg-[#0D1C3C]/70 backdrop-blur-xl border border-transparent bg-gradient-to-br from-[#2F6DB5]/40 via-white/[0.08] to-cyan-500/10 shadow-[0_20px_50px_rgba(47,109,181,0.2)] flex flex-col justify-between overflow-hidden group transition-all duration-300 hover:shadow-[0_25px_60px_rgba(47,109,181,0.35)] hover:-translate-y-1">
            {/* Soft radial glow background */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#2F6DB5]/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-[#2F6DB5]/30 transition-all duration-500" />
            
            {/* Oversized Watermark Number */}
            <div className="absolute right-4 top-2 text-[100px] sm:text-[120px] font-black font-mono leading-none bg-gradient-to-b from-[#2F6DB5]/25 via-[#2F6DB5]/10 to-transparent bg-clip-text text-transparent select-none pointer-events-none">
              01
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="px-3.5 py-1.5 rounded-full bg-[#2F6DB5]/20 border border-[#2F6DB5]/40 backdrop-blur-md">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#60A5FA] font-bold">
                    Institutional Leadership
                  </span>
                </div>
                <span className="font-mono text-xs text-slate-400">Sovereign &amp; Telecom Core</span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4 font-display leading-[1.1]">
                Decision-Makers <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">&amp; Regulators</span>
              </h3>

              <p className="text-base sm:text-lg text-slate-200 leading-relaxed mb-8 font-normal">
                Government ministries, regulators, telecom operators, ISPs, financial institutions, and policy leaders shaping regulation and sovereign investment.
              </p>

              <div>
                <div className="flex items-center justify-between mb-4 px-1">
                  <p className="font-mono text-xs uppercase tracking-wider text-blue-300 font-semibold">
                    Represented Institutions
                  </p>
                  <span className="font-mono text-xs text-blue-400 font-bold">Policy &amp; Capital</span>
                </div>

                <div className="space-y-3">
                  {decisionMakers.map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={item.name}
                        className="group/item relative overflow-hidden p-4 rounded-2xl bg-[#0A1428]/90 hover:bg-[#112347] border border-white/10 hover:border-blue-400/60 shadow-sm hover:shadow-[0_8px_30px_rgba(47,109,181,0.4)] transition-all duration-300 flex items-center gap-4 cursor-default -translate-y-0 hover:-translate-y-1"
                      >
                        {/* Glowing left accent line */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-cyan-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />

                        {/* 48px Glowing Icon Badge */}
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2F6DB5]/30 to-blue-600/20 border border-[#2F6DB5]/50 flex items-center justify-center shrink-0 text-blue-300 group-hover/item:bg-blue-600 group-hover/item:text-white group-hover/item:scale-110 group-hover/item:shadow-[0_0_20px_rgba(47,109,181,0.6)] transition-all duration-300">
                          <IconComponent className="w-6 h-6" strokeWidth={1.75} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-bold text-white tracking-tight truncate group-hover/item:text-blue-200 transition-colors mb-1">
                            {item.name}
                          </h4>
                          <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed font-normal">
                            {item.description}
                          </p>
                        </div>

                        <ArrowRight className="w-4 h-4 text-blue-400 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300 shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

     
          </div>

          {/* Column 2: Ecosystem Builders */}
          <div className="relative rounded-3xl p-8 sm:p-10 bg-[#0D1C3C]/70 backdrop-blur-xl border border-transparent bg-gradient-to-br from-[#D81B60]/40 via-white/[0.08] to-orange-500/10 shadow-[0_20px_50px_rgba(216,27,96,0.2)] flex flex-col justify-between overflow-hidden group transition-all duration-300 hover:shadow-[0_25px_60px_rgba(216,27,96,0.35)] hover:-translate-y-1">
            {/* Soft radial glow background */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#D81B60]/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-[#D81B60]/30 transition-all duration-500" />
            
            {/* Oversized Watermark Number */}
            <div className="absolute right-4 top-2 text-[100px] sm:text-[120px] font-black font-mono leading-none bg-gradient-to-b from-[#D81B60]/25 via-[#D81B60]/10 to-transparent bg-clip-text text-transparent select-none pointer-events-none">
              02
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="px-3.5 py-1.5 rounded-full bg-[#D81B60]/20 border border-[#D81B60]/40 backdrop-blur-md">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#F472B6] font-bold">
                    Ecosystem Builders
                  </span>
                </div>
                <span className="font-mono text-xs text-slate-400">Commercial Execution &amp; Scale</span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4 font-display leading-[1.1]">
                Builders, Founders <span className="bg-gradient-to-r from-pink-400 to-orange-300 bg-clip-text text-transparent">&amp; Creators</span>
              </h3>

              <p className="text-base sm:text-lg text-slate-200 leading-relaxed mb-8 font-normal">
                Early-stage founders, software engineers, content creators, accelerators, researchers, and venture investors driving scalable technology products and digital commerce.
              </p>

              <div>
                <div className="flex items-center justify-between mb-4 px-1">
                  <p className="font-mono text-xs uppercase tracking-wider text-pink-300 font-semibold">
                    Participating Groups
                  </p>
                  <span className="font-mono text-xs text-pink-400 font-bold">Innovation &amp; Scale</span>
                </div>

                <div className="space-y-3">
                  {builders.map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={item.name}
                        className="group/item relative overflow-hidden p-4 rounded-2xl bg-[#0A1428]/90 hover:bg-[#251229] border border-white/10 hover:border-pink-400/60 shadow-sm hover:shadow-[0_8px_30px_rgba(216,27,96,0.4)] transition-all duration-300 flex items-center gap-4 cursor-default -translate-y-0 hover:-translate-y-1"
                      >
                        {/* Glowing left accent line */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500 to-orange-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />

                        {/* 48px Glowing Icon Badge */}
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D81B60]/30 to-pink-600/20 border border-[#D81B60]/50 flex items-center justify-center shrink-0 text-pink-300 group-hover/item:bg-pink-600 group-hover/item:text-white group-hover/item:scale-110 group-hover/item:shadow-[0_0_20px_rgba(216,27,96,0.6)] transition-all duration-300">
                          <IconComponent className="w-6 h-6" strokeWidth={1.75} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-bold text-white tracking-tight truncate group-hover/item:text-pink-200 transition-colors mb-1">
                            {item.name}
                          </h4>
                          <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed font-normal">
                            {item.description}
                          </p>
                        </div>

                        <ArrowRight className="w-4 h-4 text-pink-400 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300 shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </div>
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
