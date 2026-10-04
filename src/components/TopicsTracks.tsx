import React from 'react';
import { TRACK_TOPICS } from '../data/bmicContent';
import { HeaderDots } from './HeaderDots';
import { Wifi, Cpu, ShieldCheck, Rocket, Coins, Building2, ArrowUpRight } from 'lucide-react';

export const TopicsTracks: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Wifi':
        return <Wifi className="w-6 h-6 text-[#2F6296]" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-[#D61356]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-[#2F6296]" />;
      case 'Rocket':
        return <Rocket className="w-6 h-6 text-[#D61356]" />;
      case 'Coins':
        return <Coins className="w-6 h-6 text-[#2F6296]" />;
      case 'Building2':
        return <Building2 className="w-6 h-6 text-[#D61356]" />;
      default:
        return <Wifi className="w-6 h-6 text-[#2F6296]" />;
    }
  };

  return (
    <section id="tracks" className="py-24 bg-[#F6F8FC] text-slate-900 border-b border-slate-200 relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-grid-light opacity-30 pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-center mb-6">
          <HeaderDots dotSize="sm" theme="light" />
        </div>

        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs uppercase font-mono font-bold tracking-[0.2em] text-[#2F6296] mb-2">
            Thematic Focus
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Congress Tracks &amp; Bento Taxonomy
          </h2>
          <p className="text-base text-slate-600 mt-4 leading-relaxed">
            Deliberately structured to connect technical infrastructure with commercial monetization and continental venture capital.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-6 max-w-6xl mx-auto">
          {TRACK_TOPICS.map((track) => (
            <div
              key={track.id}
              className={`${track.colSpan} p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 relative group overflow-hidden flex flex-col justify-between hover:border-[#2F6296]/60`}
            >
              {/* Subtle hover gradient glow */}
              <div className="absolute -right-16 -top-16 w-36 h-36 bg-gradient-to-br from-[#2F6296]/10 to-[#D61356]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-slate-100 transition-colors">
                    {getIcon(track.iconName)}
                  </div>
                  <span className="p-2 rounded-full text-slate-400 group-hover:text-slate-900 transition-colors">
                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>

                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#D61356] mb-1">
                  {track.subtitle}
                </div>

                <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-3">
                  {track.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {track.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Featured in BMIC 2026 Programme</span>
                <span className="font-semibold text-[#2F6296]">Track Blueprint</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
