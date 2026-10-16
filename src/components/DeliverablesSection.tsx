import React from 'react';

export const DeliverablesSection: React.FC = () => {
  const deliverables = [
    {
      number: '01',
      title: 'A Congress Communique',
      description: 'Practical, time-bound policy recommendations presented directly to government and regulatory leadership.',
    },
    {
      number: '02',
      title: 'Technology Funding Agenda',
      description: 'Direct financing channels linking local tech startups with regional venture capital syndicates and DFIs.',
    },
    {
      number: '03',
      title: 'Cybersecurity Action Plan',
      description: 'Operational defense mandates for sovereign critical infrastructure, enterprise data, and national trust.',
    },
    {
      number: '04',
      title: 'Digital Content & Trade Framework',
      description: 'Direct mobile money carrier billing, merchant payment rails, and digital royalties for creators.',
    },
    {
      number: '05',
      title: 'Cross-Sector Bilateral Alliances',
      description: 'Structured commercial partnerships between regulators, telecommunication operators, and technology builders.',
    },
    {
      number: '06',
      title: 'Benchmarked SADC Roadmap',
      description: 'A metric-backed regional roadmap positioning Botswana as the premier Digital Valley of the SADC corridor.',
    },
  ];

  return (
    <section id="deliverables" className="py-20 lg:py-28 bg-[#F7F8FA] text-[#0A1428] border-b border-slate-200">

      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* 2x3 Grid with Large Numerals (Official Outcome Document Feel) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12 pt-4">
          {deliverables.map((item) => (
            <div key={item.number} className="flex flex-col border-t border-slate-200 pt-6">
              <span className="text-3xl lg:text-4xl font-extrabold text-[#D81B60] font-['Plus_Jakarta_Sans',sans-serif] tracking-tight mb-3">
                {item.number}
              </span>
              <h3 className="text-xl font-bold text-[#0A1428] tracking-tight mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-[#4A5568] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
