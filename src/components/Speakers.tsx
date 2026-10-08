import React from 'react';
import { HeaderDots } from './HeaderDots';
import {
  Landmark,
  Rocket,
  ShieldCheck,
  Building,
  Radio,
  Cpu,
  Coins,
  GraduationCap,
  Users2,
  Code2,
  Palette,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const Speakers: React.FC = () => {
  const decisionMakerTags = [
    'Government Ministries',
    'Telecommunications Regulators',
    'Mobile Network Operators (MNOs)',
    'Internet Service Providers (ISPs)',
    'Financial Institutions & Banks',
    'Development Finance Institutions (DFIs)',
    'Policy & Legislative Leaders',
    'Sovereign Infrastructure Custodians'
  ];

  const builderTags = [
    'Startups & Tech Founders',
    'Software Developers & Engineers',
    'Digital Content Creators',
    'Innovation Hubs & Incubators',
    'Venture Investors & Angel Syndicates',
    'Universities & Research Academics',
    'Tertiary Technology Students',
    'Industry Technology Practitioners'
  ];

  return (
    <section id="speakers" className="py-24 bg-[#0B1B33] text-white border-b border-white/10 relative overflow-hidden">
      {/* Anchor for attendee links */}
      <div id="attendees" className="absolute -top-24" />

      {/* Background ambient lighting */}
      <div
        className="absolute top-1/3 -left-20 w-96 h-96 bg-[#2F6296]/20 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 -right-20 w-96 h-96 bg-[#FF2A7A]/15 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-center mb-6">
          <HeaderDots dotSize="sm" theme="dark" />
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs uppercase font-mono font-bold tracking-[0.2em] text-[#82B4EE] mb-2">
            Congress Delegation &amp; Attendees
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase">
            WHO WILL BE IN THE ROOM
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed font-normal">
            A high-convening summit uniting the institutional decision-makers who govern sovereign capital and infrastructure with the on-the-ground builders driving digital innovation across Botswana and the SADC region.
          </p>
        </div>

        {/* 2-Column High-Impact Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Card 1: Decision-Makers */}
          <div className="rounded-3xl glass-panel-dark border border-white/10 p-8 sm:p-10 relative overflow-hidden group hover:border-[#82B4EE]/50 transition-all duration-300 flex flex-col justify-between shadow-2xl">
            {/* Top Accent Gradient Border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2F6296] via-[#82B4EE] to-transparent" />
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#82B4EE]/10 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="p-3.5 rounded-2xl bg-[#82B4EE]/10 border border-[#82B4EE]/25 text-[#82B4EE]">
                  <Landmark className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-mono uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-[#82B4EE]/15 text-[#82B4EE] border border-[#82B4EE]/30">
                  Institutional Leadership
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4 flex items-center gap-3">
                <span>Decision-Makers</span>
              </h3>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal mb-8">
                Government ministries, regulators, mobile network operators, ISPs, financial institutions, development finance institutions and policy leaders.
              </p>

              {/* Stakeholder tags */}
              <div className="space-y-3 mb-6">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Key Representations:
                </div>
                <div className="flex flex-wrap gap-2">
                  {decisionMakerTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-slate-200 hover:bg-[#82B4EE]/10 hover:border-[#82B4EE]/30 hover:text-white transition-colors cursor-default"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#82B4EE] shrink-0" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">Policy, Capital &amp; Infrastructure</span>
              <span className="text-[#82B4EE] font-semibold">Institutional Seats</span>
            </div>
          </div>

          {/* Card 2: Builders */}
          <div className="rounded-3xl glass-panel-dark border border-white/10 p-8 sm:p-10 relative overflow-hidden group hover:border-[#FF2A7A]/50 transition-all duration-300 flex flex-col justify-between shadow-2xl">
            {/* Top Accent Gradient Border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF2A7A] via-[#D61356] to-transparent" />
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#FF2A7A]/10 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="p-3.5 rounded-2xl bg-[#FF2A7A]/10 border border-[#FF2A7A]/25 text-[#FF2A7A]">
                  <Rocket className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-mono uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-[#FF2A7A]/15 text-pink-300 border border-[#FF2A7A]/30">
                  Innovation &amp; Execution
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4 flex items-center gap-3">
                <span>Builders</span>
              </h3>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal mb-8">
                Startups, founders, software developers, digital content creators, innovation hubs, investors, universities, students and technology practitioners.
              </p>

              {/* Stakeholder tags */}
              <div className="space-y-3 mb-6">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Key Representations:
                </div>
                <div className="flex flex-wrap gap-2">
                  {builderTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-slate-200 hover:bg-[#FF2A7A]/10 hover:border-[#FF2A7A]/30 hover:text-white transition-colors cursor-default"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#FF2A7A] shrink-0" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">Startups, Engineering &amp; Creation</span>
              <span className="text-[#FF2A7A] font-semibold">Ecosystem Builders</span>
            </div>
          </div>
        </div>

        {/* Bottom Convergence Callout */}
        <div className="mt-12 max-w-4xl mx-auto rounded-2xl glass-panel-dark border border-white/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white shrink-0">
              <Users2 className="w-5 h-5 text-[#82B4EE]" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Direct Dialogue Between Policymakers &amp; Builders</div>
              <div className="text-xs text-slate-400">Breaking silos to accelerate national digital infrastructure and commercial scale.</div>
            </div>
          </div>

          <a
            href="#passes"
            className="inline-flex items-center gap-2 text-xs font-bold text-white bg-gradient-to-r from-[#2F6296] to-[#FF2A7A] px-5 py-2.5 rounded-xl shadow-lg hover:brightness-110 transition-all shrink-0"
          >
            <span>Join the Room</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
