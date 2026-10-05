import React, { useState } from 'react';
import { EVENT_DETAILS, PROBLEMS_WE_ARE_SOLVING } from '../data/bmicContent';
import { HeaderDots } from './HeaderDots';
import { Radio, ShieldAlert, Rocket, Building2, ShoppingBag, TrendingUp, ArrowRight, Zap, Target } from 'lucide-react';

export const AboutTheme: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const getProblemIcon = (id: string) => {
    switch (id) {
      case 'infrastructure':
        return <Radio className="w-5 h-5 text-[#2F6296]" />;
      case 'cybersecurity':
        return <ShieldAlert className="w-5 h-5 text-[#D61356]" />;
      case 'startups':
        return <Rocket className="w-5 h-5 text-[#2F6296]" />;
      case 'egovernment':
        return <Building2 className="w-5 h-5 text-[#D61356]" />;
      case 'ecommerce':
        return <ShoppingBag className="w-5 h-5 text-[#2F6296]" />;
      case 'monetisation':
        return <TrendingUp className="w-5 h-5 text-[#D61356]" />;
      default:
        return <Zap className="w-5 h-5 text-[#2F6296]" />;
    }
  };

  return (
    <section id="about" className="py-24 bg-[#F6F8FC] text-slate-900 border-b border-slate-200 relative overflow-hidden">
      {/* Background dot grid for light section */}
      <div className="absolute inset-0 bg-dot-grid-light opacity-40 pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-center mb-6">
          <HeaderDots dotSize="sm" theme="light" />
        </div>

        {/* Strategic Thesis */}
        <div className="max-w-4xl mx-auto mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2F6296]/10 text-xs font-bold text-[#2F6296] uppercase tracking-wider">
            <Target className="w-3.5 h-3.5" />
            <span>National Strategic Context</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            THREE DECADES OF INVESTMENT.{' '}
            <span className="text-[#D61356]">ONE MISSING CONVERSION.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
            {EVENT_DETAILS.threeDecadesDescription}
          </p>

          {/* Why Now Highlight Box */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-2 bg-gradient-to-b from-[#2F6296] to-[#D61356]" />
            <div className="pl-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#D61356] bg-pink-50 px-2 py-0.5 rounded border border-pink-200 inline-block mb-2">
                Why Now
              </span>
              <p className="text-slate-800 text-sm sm:text-base font-medium leading-relaxed">
                {EVENT_DETAILS.whyNow}
              </p>
            </div>
          </div>
        </div>

        {/* The Problem We Are Solving */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              THE PROBLEM WE ARE SOLVING
            </h3>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Six critical bottlenecks constraining Botswana's digital economy from realizing its full potential
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROBLEMS_WE_ARE_SOLVING.map((prob, idx) => (
              <div
                key={prob.id}
                onMouseEnter={() => setActiveTab(idx)}
                className={`p-6 rounded-2xl bg-white border transition-all duration-300 flex flex-col justify-between ${
                  activeTab === idx
                    ? 'border-[#2F6296] shadow-xl ring-2 ring-[#2F6296]/10 translate-y-[-2px]'
                    : 'border-slate-200/90 shadow-sm hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      {getProblemIcon(prob.id)}
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-400">
                      CHALLENGE 0{idx + 1}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    {prob.title}
                  </h4>

                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {prob.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Strategic Focus</span>
                  <span className="text-[#2F6296] font-bold">Priority Agenda</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
