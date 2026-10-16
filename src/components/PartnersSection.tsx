import React from 'react';
import { Landmark, Radio, Coins, ShieldCheck, Newspaper, Globe, ArrowUpRight } from 'lucide-react';

interface PartnersSectionProps {
  onOpenRegister: (tier?: string) => void;
}

export const PartnersSection: React.FC<PartnersSectionProps> = ({ onOpenRegister }) => {
  const hostConvenors = [
    {
      role: 'Convening Authority',
      name: 'Ministry of Communications & Digital Technologies',
      region: 'Republic of Botswana',
    },
    {
      role: 'Congress Secretariat & Producer',
      name: 'Continental Media Group',
      region: 'Southern Africa',
    },
  ];

  const strategicPartners = [
    { category: 'Telecommunications', title: 'Tier-1 Mobile Network Operators', note: 'Infrastructure & Spectrum' },
    { category: 'Connectivity', title: 'National Terrestrial Fibre & Satellite', note: 'Backbone & Last-Mile' },
    { category: 'Capital & Finance', title: 'Sovereign Wealth & Pan-African DFIs', note: 'Ecosystem Venture Funds' },
  ];

  const supportingPartners = [
    { category: 'Cybersecurity', title: 'Sovereign Cloud & Defence Infrastructure', note: 'Digital Trust Architecture' },
    { category: 'Ecosystem', title: 'Botswana Innovation Hub & Research Institutes', note: 'R&D and Founder Talent' },
    { category: 'Banking & Rails', title: 'Commercial Banks & FinTech Consortiums', note: 'Domestic Payment Rails' },
  ];

  const mediaPartners = [
    { category: 'Broadcasting', title: 'National Television & Digital Broadcast', note: 'Official Live Coverage' },
    { category: 'Regional Press', title: 'Pan-African Tech & Economic Review', note: 'Policy & Investor Editorial' },
    { category: 'Digital Wire', title: 'SADC ICT Wire & Regional Telemetry', note: 'Communique Syndicate' },
  ];

  return (
    <section id="partners" className="py-20 lg:py-28 bg-[#FFFFFF] text-[#0A1428] border-b border-slate-200">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">

        {/* Tier 1: Host & Convenors */}
        <div className="mb-14">
          <div className="text-xs uppercase font-semibold tracking-[0.12em] text-[#4A5568] mb-6">
            Host &amp; Convening Secretariat
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hostConvenors.map((host) => (
              <div
                key={host.name}
                className="p-8 rounded-[12px] bg-[#F7F8FA] border border-slate-200/80 transition-all duration-200 hover:border-[#2F6DB5]/40 hover:bg-white hover:shadow-sm group"
              >
                <span className="text-[11px] uppercase font-semibold tracking-wider text-[#D81B60] block mb-2">
                  {host.role}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[#0A1428] tracking-tight group-hover:text-[#2F6DB5] transition-colors">
                  {host.name}
                </h3>
                <p className="text-xs text-[#4A5568] mt-2 font-medium">
                  {host.region}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 2: Strategic Partners */}
        <div className="mb-14">
          <div className="text-xs uppercase font-semibold tracking-[0.12em] text-[#4A5568] mb-6">
            Strategic Partners
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {strategicPartners.map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-[12px] bg-[#F7F8FA] border border-slate-200/80 transition-all duration-200 hover:border-[#2F6DB5]/40 hover:bg-white hover:shadow-sm group"
              >
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-[#2F6DB5] group-hover:border-[#2F6DB5]/30 transition-colors mb-4">
                  <Radio className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <span className="text-[11px] uppercase font-semibold tracking-wider text-[#4A5568] block mb-1">
                  {item.category}
                </span>
                <h3 className="text-base font-bold text-[#0A1428] tracking-tight mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-[#4A5568]">
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 3: Supporting Partners */}
        <div className="mb-14">
          <div className="text-xs uppercase font-semibold tracking-[0.12em] text-[#4A5568] mb-6">
            Supporting Industry Partners
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportingPartners.map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-[12px] bg-[#F7F8FA] border border-slate-200/80 transition-all duration-200 hover:border-[#2F6DB5]/40 hover:bg-white hover:shadow-sm group"
              >
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-[#2F6DB5] group-hover:border-[#2F6DB5]/30 transition-colors mb-4">
                  <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <span className="text-[11px] uppercase font-semibold tracking-wider text-[#4A5568] block mb-1">
                  {item.category}
                </span>
                <h3 className="text-base font-bold text-[#0A1428] tracking-tight mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-[#4A5568]">
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 4: Media Partners */}
        <div>
          <div className="text-xs uppercase font-semibold tracking-[0.12em] text-[#4A5568] mb-6">
            Media &amp; Communications Partners
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mediaPartners.map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-[12px] bg-[#F7F8FA] border border-slate-200/80 transition-all duration-200 hover:border-[#2F6DB5]/40 hover:bg-white hover:shadow-sm group"
              >
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-[#2F6DB5] group-hover:border-[#2F6DB5]/30 transition-colors mb-4">
                  <Newspaper className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <span className="text-[11px] uppercase font-semibold tracking-wider text-[#4A5568] block mb-1">
                  {item.category}
                </span>
                <h3 className="text-base font-bold text-[#0A1428] tracking-tight mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-[#4A5568]">
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
