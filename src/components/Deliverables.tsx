import React from 'react';
import { CONGRESS_DELIVERABLES } from '../data/bmicContent';
import { HeaderDots } from './HeaderDots';
import { FileCheck, Coins, ShieldCheck, ShoppingCart, Users2, Map, CheckCircle2 } from 'lucide-react';

export const Deliverables: React.FC = () => {
  const getDeliverableIcon = (id: number) => {
    switch (id) {
      case 1:
        return <FileCheck className="w-5 h-5 text-[#2F6296]" />;
      case 2:
        return <Coins className="w-5 h-5 text-[#D61356]" />;
      case 3:
        return <ShieldCheck className="w-5 h-5 text-[#2F6296]" />;
      case 4:
        return <ShoppingCart className="w-5 h-5 text-[#D61356]" />;
      case 5:
        return <Users2 className="w-5 h-5 text-[#2F6296]" />;
      case 6:
        return <Map className="w-5 h-5 text-[#D61356]" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-[#2F6296]" />;
    }
  };

  return (
    <section id="deliverables" className="py-24 bg-[#F6F8FC] text-slate-900 border-b border-slate-200 relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-grid-light opacity-30 pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-center mb-6">
          <HeaderDots dotSize="sm" theme="light" />
        </div>

        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs uppercase font-mono font-bold tracking-[0.2em] text-[#D61356] mb-2">
            Actionable Outcomes
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            WHAT THE CONGRESS WILL DELIVER
          </h2>
          <p className="text-base text-slate-600 mt-4 leading-relaxed max-w-2xl mx-auto">
            Measurable, high-impact outputs engineered to transition Botswana from national policy to concrete execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {CONGRESS_DELIVERABLES.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-[#2F6296]/50"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 group-hover:scale-105 transition-transform">
                    {getDeliverableIcon(item.id)}
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-400">
                    OUTPUT 0{item.id}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2.5 leading-snug">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Deliverable Target</span>
                <span className="font-semibold text-[#2F6296]">BMIC 2026 Mandate</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
