import React from 'react';
import { PARTNERSHIP_TIERS, MARQUEE_PARTNERS } from '../data/bmicContent';
import { HeaderDots } from './HeaderDots';
import { Award, Layers, Store, Radio, ArrowRight, Sparkles } from 'lucide-react';

interface SponsorsMarqueeProps {
  onOpenRegister: (tier?: string) => void;
}

export const SponsorsMarquee: React.FC<SponsorsMarqueeProps> = ({ onOpenRegister }) => {
  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Headline Partner':
        return <Award className="w-5 h-5 text-[#4A83BE]" />;
      case 'Track Sponsor':
        return <Layers className="w-5 h-5 text-[#F03474]" />;
      case 'Exhibitor':
        return <Store className="w-5 h-5 text-[#4A83BE]" />;
      case 'Media / Community Partner':
        return <Radio className="w-5 h-5 text-[#F03474]" />;
      default:
        return <Award className="w-5 h-5 text-[#4A83BE]" />;
    }
  };

  return (
    <section id="partners" className="py-24 bg-[#0B1B33] text-white border-b border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-center mb-6">
          <HeaderDots dotSize="sm" theme="dark" />
        </div>

        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs uppercase font-mono font-bold tracking-[0.2em] text-[#D61356] mb-2">
            Ecosystem Alignment
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Sponsors, Partners &amp; Convenors
          </h2>
          <p className="text-base text-slate-300 mt-4 leading-relaxed">
            Convening institutional leaders, pan-African venture investors, telecom infrastructure operators, and media innovators.
          </p>
        </div>

        {/* Infinite Marquee of Ecosystem Partners */}
        <div className="relative overflow-hidden py-4 border-y border-white/10 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="animate-marquee gap-8 items-center flex">
            {[...MARQUEE_PARTNERS, ...MARQUEE_PARTNERS].map((partner, idx) => (
              <div
                key={idx}
                className="px-6 py-4 rounded-2xl glass-panel-dark border border-white/10 flex items-center gap-3 shrink-0 grayscale hover:grayscale-0 hover:border-white/30 transition-all duration-300 cursor-default"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#2F6296] to-[#D61356]" />
                <div>
                  <div className="text-sm font-bold text-white tracking-tight">
                    {partner.name}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    {partner.tier} · {partner.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
