import React from 'react';
import { Landmark, Radio, Coins, Building2, Cpu, Globe2 } from 'lucide-react';

export const AttendeesSection: React.FC = () => {
  const categories = [
    {
      title: 'Regulators',
      description: 'Communications authorities, data protection commissioners, and sector policy leaders.',
      icon: Landmark,
    },
    {
      title: 'Operators',
      description: 'Mobile network operators, ISPs, national fibre custodians, and satellite providers.',
      icon: Radio,
    },
    {
      title: 'Investors',
      description: 'Pan-African venture capital funds, DFIs, angel syndicates, and commercial banks.',
      icon: Coins,
    },
    {
      title: 'Government',
      description: 'Ministries of communications, digital technologies, trade, and economic development.',
      icon: Building2,
    },
    {
      title: 'Tech Companies',
      description: 'Early-stage startups, software engineering firms, cybersecurity providers, and founders.',
      icon: Cpu,
    },
    {
      title: 'Development Partners',
      description: 'SADC regional alliances, universities, innovation hubs, and tech practitioners.',
      icon: Globe2,
    },
  ];

  return (
    <section id="attendees" className="py-20 lg:py-28 bg-[#FFFFFF] text-[#0A1428] border-b border-slate-200">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <div className="mb-4">
            <span className="text-xs uppercase font-semibold tracking-[0.14em] text-[#2F6DB5]">
              National Delegation
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A1428] tracking-[-0.03em] leading-[1.12]">
            Who Will Be in the Room
          </h2>
          <p className="text-base sm:text-lg text-[#4A5568] mt-4 font-normal leading-relaxed">
            250+ senior delegates representing institutional governance, investment capital, and ground-level digital engineering.
          </p>
        </div>

        {/* 6 Categories in a Clean Grid with Dividers (No Heavy Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 border-y border-slate-200">
          {categories.slice(0, 3).map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="py-8 md:py-10 md:px-8 first:pl-0 last:pr-0 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#F7F8FA] border border-slate-200 flex items-center justify-center text-[#2F6DB5] mb-5">
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-[#0A1428] tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#4A5568] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 border-b border-slate-200">
          {categories.slice(3, 6).map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="py-8 md:py-10 md:px-8 first:pl-0 last:pr-0 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#F7F8FA] border border-slate-200 flex items-center justify-center text-[#2F6DB5] mb-5">
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-[#0A1428] tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#4A5568] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
