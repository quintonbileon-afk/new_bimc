import React from 'react';
import { HeaderDots } from './HeaderDots';
import { EVENT_DETAILS } from '../data/bmicContent';
import {
  Radio,
  Coins,
  ShieldCheck,
  Rocket,
  Landmark,
  Building2,
  Mail,
  Phone,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface SponsorsMarqueeProps {
  onOpenRegister: (tier?: string) => void;
}

export const SponsorsMarquee: React.FC<SponsorsMarqueeProps> = ({ onOpenRegister }) => {
  // Broad stakeholder sectors instead of mock company names
  const partnerDomains = [
    {
      title: 'Telecommunications & Infrastructure',
      subtitle: 'MNOs, ISPs, Fibre Backbone & Satellite Operators',
      icon: Radio,
      accent: 'border-[#82B4EE]/30 text-[#82B4EE]',
    },
    {
      title: 'Banking & Development Finance',
      subtitle: 'Commercial Banks, Mobile Money, FinTech & DFIs',
      icon: Coins,
      accent: 'border-[#FF2A7A]/30 text-[#FF2A7A]',
    },
    {
      title: 'Cloud & Cybersecurity Architecture',
      subtitle: 'Data Centres, Sovereign Cloud & Critical Infrastructure',
      icon: ShieldCheck,
      accent: 'border-[#82B4EE]/30 text-[#82B4EE]',
    },
    {
      title: 'Venture Capital & Innovation Hubs',
      subtitle: 'Seed Funds, Incubators & Angel Syndicates',
      icon: Rocket,
      accent: 'border-[#FF2A7A]/30 text-[#FF2A7A]',
    },
    {
      title: 'Public Policy & Regulatory Leadership',
      subtitle: 'Government Ministries, Authorities & Regional Alliances',
      icon: Landmark,
      accent: 'border-[#82B4EE]/30 text-[#82B4EE]',
    },
    {
      title: 'Enterprise Digital Platforms',
      subtitle: 'E-Commerce Solutions, SaaS Providers & Digital Media',
      icon: Building2,
      accent: 'border-[#FF2A7A]/30 text-[#FF2A7A]',
    },
  ];

  return (
    <section id="partners" className="py-24 bg-[#0B1B33] text-white border-b border-white/10 relative overflow-hidden">
      {/* Background ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#2F6296]/15 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-center mb-6">
          <HeaderDots dotSize="sm" theme="dark" />
        </div>

        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs uppercase font-mono font-bold tracking-[0.2em] text-[#82B4EE] mb-2">
            Ecosystem Alignment
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Partnership &amp; Exhibition Sectors
          </h2>
          <p className="text-base text-slate-300 mt-4 leading-relaxed font-normal">
            Convening institutional leaders, pan-African venture investors, telecom infrastructure operators, financial institutions and technology innovators.
          </p>
        </div>

        {/* Strategic Sectors Grid (Categories instead of mock companies) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-14">
          {partnerDomains.map((domain, idx) => {
            const Icon = domain.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl glass-panel-dark border border-white/10 hover:border-white/20 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-white/[0.04] border ${domain.accent}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
                      Sector 0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#82B4EE] transition-colors">
                    {domain.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {domain.subtitle}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#82B4EE]" />
                  <span>Invited Partnership Category</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Official Secretariat Onboarding Announcement Card */}
        <div className="max-w-4xl mx-auto rounded-3xl glass-panel-dark border border-white/10 p-8 sm:p-10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2F6296] via-[#FF2A7A] to-[#82B4EE]" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-mono font-semibold text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-[#FF2A7A]" />
                <span>Secretariat Notice</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Interested in Sponsoring or Exhibiting?
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed font-normal">
                Official corporate sponsors, exhibitors, and institutional partners are currently being onboarded by the Congress Secretariat. Organizations seeking track naming rights, premium exhibition booths, or executive roundtables are invited to connect directly.
              </p>

              <div className="text-xs text-slate-400 pt-1">
                Organised by <span className="text-white font-semibold">{EVENT_DETAILS.organiser}</span> · Empowered by <span className="text-white font-semibold">{EVENT_DETAILS.empoweredBy}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => onOpenRegister('Headline Sponsor')}
                className="px-6 py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#2F6296] to-[#FF2A7A] hover:brightness-110 shadow-lg shadow-[#FF2A7A]/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Inquire for Partnership</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`mailto:${EVENT_DETAILS.secretariatEmail}?subject=BMIC%202026%20Partnership%20Inquiry`}
                className="px-6 py-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white glass-panel-dark border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <Mail className="w-3.5 h-3.5 text-[#82B4EE]" />
                <span>{EVENT_DETAILS.secretariatEmail}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
