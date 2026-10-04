import React from 'react';
import { EVENT_DETAILS } from '../data/bmicContent';
import { HeaderDots } from './HeaderDots';
import { Compass, Zap } from 'lucide-react';

export const ProgrammeFramework: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-4">
          <HeaderDots dotSize="sm" />
        </div>

        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-xs uppercase font-bold tracking-[0.2em] text-[#D81B60] mb-2">
            Programme Architecture
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance mb-5">
            {EVENT_DETAILS.programmeStructureHeadline}
          </h2>
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
            {EVENT_DETAILS.programmeStructureDescription}
          </p>
        </div>

        {/* Two Pillars directly mirrored from Document Page 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Pillar 1: Morning */}
          <div className="bg-white rounded-2xl border-2 border-[#235A82] overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="bg-[#235A82] px-6 py-4 text-white">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-sky-200 mb-1">
                <Compass className="w-4 h-4" />
                <span>08:30 - 12:30</span>
              </div>
              <h3 className="text-xl font-bold tracking-tight">
                MORNING - NATIONAL DIRECTION
              </h3>
            </div>
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <p className="text-slate-700 text-base leading-relaxed mb-6 font-medium">
                {EVENT_DETAILS.morningDirectionSummary}
              </p>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Focus: Policy, Strategy &amp; National Alignment</span>
                <span className="text-[#235A82] font-semibold">Morning Plenary</span>
              </div>
            </div>
          </div>

          {/* Pillar 2: Afternoon */}
          <div className="bg-white rounded-2xl border-2 border-[#D81B60] overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="bg-[#D81B60] px-6 py-4 text-white">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-pink-200 mb-1">
                <Zap className="w-4 h-4" />
                <span>13:30 - 18:30</span>
              </div>
              <h3 className="text-xl font-bold tracking-tight">
                AFTERNOON - IMPLEMENTATION &amp; GROWTH
              </h3>
            </div>
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <p className="text-slate-700 text-base leading-relaxed mb-6 font-medium">
                {EVENT_DETAILS.afternoonGrowthSummary}
              </p>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Focus: Venture, Infrastructure, Content &amp; Action</span>
                <span className="text-[#D81B60] font-semibold">Implementation Tracks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
