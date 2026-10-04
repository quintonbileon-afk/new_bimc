import React, { useState } from 'react';
import { EVENT_DETAILS, PROBLEMS_WE_ARE_SOLVING } from '../data/bmicContent';
import { HeaderDots } from './HeaderDots';
import { AlertCircle, TrendingUp, ShieldAlert, Rocket, Building2, ShoppingBag, Radio } from 'lucide-react';

export const StrategicContext: React.FC = () => {
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);

  const getProblemIcon = (id: string) => {
    switch (id) {
      case 'infrastructure':
        return <Radio className="w-5 h-5 text-[#235A82]" />;
      case 'cybersecurity':
        return <ShieldAlert className="w-5 h-5 text-[#D81B60]" />;
      case 'startups':
        return <Rocket className="w-5 h-5 text-[#235A82]" />;
      case 'egovernment':
        return <Building2 className="w-5 h-5 text-[#D81B60]" />;
      case 'ecommerce':
        return <ShoppingBag className="w-5 h-5 text-[#235A82]" />;
      case 'monetisation':
        return <TrendingUp className="w-5 h-5 text-[#D81B60]" />;
      default:
        return <AlertCircle className="w-5 h-5 text-[#235A82]" />;
    }
  };

  return (
    <section id="challenge" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-4">
          <HeaderDots dotSize="sm" />
        </div>

        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs uppercase font-bold tracking-[0.2em] text-[#235A82] mb-2">
            Strategic Context
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance mb-6">
            {EVENT_DETAILS.threeDecadesHeadline}
          </h2>
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
            {EVENT_DETAILS.threeDecadesDescription}
          </p>
        </div>

        {/* Why Now Callout Box styled like document sidebar */}
        <div className="max-w-4xl mx-auto mb-16 bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 bottom-0 w-2 bg-[#D81B60]" />
          <div className="sm:flex sm:items-start sm:gap-6 pl-2">
            <div className="shrink-0 mb-3 sm:mb-0">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-white bg-[#D81B60] px-3 py-1.5 rounded inline-block">
                Why Now
              </span>
            </div>
            <div>
              <p className="text-slate-800 text-base sm:text-lg leading-relaxed font-medium">
                {EVENT_DETAILS.whyNow}
              </p>
            </div>
          </div>
        </div>

        {/* The Problem We Are Solving - 6 Core Challenges */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              THE PROBLEM WE ARE SOLVING
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Six critical bottlenecks constraining Botswana's digital economy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROBLEMS_WE_ARE_SOLVING.map((prob, index) => {
              const isSelected = selectedProblem === prob.id;
              return (
                <div
                  key={prob.id}
                  onClick={() => setSelectedProblem(isSelected ? null : prob.id)}
                  className={`bg-white rounded-xl p-6 border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#235A82] ring-2 ring-[#235A82]/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                        {getProblemIcon(prob.id)}
                      </div>
                      <span className="font-mono text-xs font-semibold text-slate-400">
                        0{index + 1}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                      {prob.title}
                    </h4>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {prob.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Addressed in BMIC Agenda</span>
                    <span className="text-[#235A82] font-semibold">Priority Focus</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
