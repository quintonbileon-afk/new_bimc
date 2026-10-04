import React from 'react';
import { DELEGATE_PASS_TIERS } from '../data/bmicContent';
import { HeaderDots } from './HeaderDots';
import { Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface TicketsPassesProps {
  onSelectPass: (passName: string) => void;
}

export const TicketsPasses: React.FC<TicketsPassesProps> = ({ onSelectPass }) => {
  return (
    <section id="passes" className="py-24 bg-[#07101F] text-white border-b border-white/10 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#2F6296]/10 rounded-full blur-[160px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-center mb-6">
          <HeaderDots dotSize="sm" theme="dark" />
        </div>

        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs uppercase font-mono font-bold tracking-[0.2em] text-[#D61356] mb-2">
            Congress Passes
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Select Your Congress Delegate Pass
          </h2>
          <p className="text-base text-slate-300 mt-4 leading-relaxed">
            Choose the participation pathway aligned with your mission — whether scaling a venture, steering public policy, or driving national telecommunications.
          </p>
        </div>

        {/* 3 Pass Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {DELEGATE_PASS_TIERS.map((pass) => {
            const isPopular = pass.isPopular;

            return (
              <div
                key={pass.id}
                className={`relative rounded-3xl transition-all duration-300 flex flex-col justify-between ${
                  isPopular
                    ? 'glass-panel-dark border-2 border-[#D61356] shadow-2xl shadow-[#D61356]/20 scale-100 lg:-translate-y-3 z-10'
                    : 'glass-panel-dark border border-white/10 hover:border-white/20'
                } p-8`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#2F6296] to-[#D61356] shadow-md flex items-center gap-1.5 whitespace-nowrap">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Most Popular Choice</span>
                  </div>
                )}

                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-[#4A83BE] mb-2 font-bold">
                    Pass Category
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                    {pass.name}
                  </h3>

                  <p className="text-xs text-slate-400 mb-6 leading-relaxed font-normal">
                    {pass.description}
                  </p>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-8">
                    <div className="text-xl font-extrabold text-white font-mono">
                      {pass.price}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {pass.priceNote}
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                      Pass Inclusions:
                    </div>
                    {pass.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-[#D61356] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => onSelectPass(pass.name)}
                    className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      isPopular
                        ? 'bg-gradient-to-r from-[#2F6296] via-[#853C77] to-[#D61356] text-white shadow-lg hover:shadow-[#D61356]/40 hover:scale-[1.02]'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                    }`}
                  >
                    <span>Register for {pass.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
