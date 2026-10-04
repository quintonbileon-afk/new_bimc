import React from 'react';
import { WHO_IS_IN_THE_ROOM } from '../data/bmicContent';
import { HeaderDots } from './HeaderDots';
import { Briefcase, Code2, CheckCircle2 } from 'lucide-react';

export const WhoIsInTheRoom: React.FC = () => {
  return (
    <section id="stakeholders" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-4">
          <HeaderDots dotSize="sm" />
        </div>

        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-xs uppercase font-bold tracking-[0.2em] text-[#D81B60] mb-2">
            Ecosystem Participation
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            WHO WILL BE IN THE ROOM
          </h2>
          <p className="text-base text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
            Bringing national leadership and technical executors together under one roof to agree practical actions and recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Group 1: Decision-Makers */}
          <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-[#235A82] text-white">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Decision-Makers
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Policy, Governance &amp; Capital
                  </p>
                </div>
              </div>

              <ul className="space-y-3">
                {WHO_IS_IN_THE_ROOM[0].stakeholders.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#235A82] shrink-0 mt-0.5" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200 text-xs text-slate-500">
              Aligning regulatory clarity, investment commitments &amp; infrastructure rollout.
            </div>
          </div>

          {/* Group 2: Builders */}
          <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-[#D81B60] text-white">
                  <Code2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Builders
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Engineering, Creators &amp; Commercialization
                  </p>
                </div>
              </div>

              <ul className="space-y-3">
                {WHO_IS_IN_THE_ROOM[1].stakeholders.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#D81B60] shrink-0 mt-0.5" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200 text-xs text-slate-500">
              Building scalable ventures, digital content platforms &amp; frontier software.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
