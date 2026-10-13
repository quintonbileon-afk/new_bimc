import React from 'react';

export const ThemeSection: React.FC = () => {
  const pillars = [
    {
      numeral: '01',
      title: 'Infrastructure to Conversion',
      description: 'Moving three decades of national telecommunications and fibre investment into measurable commercial SME output.',
    },
    {
      numeral: '02',
      title: 'Regional Digital Anchor',
      description: 'Benchmarking regulatory agility, data infrastructure, and cross-border connectivity to anchor the SADC corridor.',
    },
    {
      numeral: '03',
      title: 'Commercial Scalability',
      description: 'Unlocking seed capital, operational cybersecurity trust, local payment rails, and enterprise tech adoption.',
    },
  ];

  return (
    <section id="theme" className="py-20 lg:py-28 bg-[#F7F8FA] text-[#0A1428] border-b border-slate-200">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* Section Tag */}
        <div className="mb-6">
          <span className="text-xs uppercase font-semibold tracking-[0.14em] text-[#2F6DB5]">
            Congress Theme &amp; Thesis
          </span>
        </div>

        {/* Two-Column Editorial Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 pb-16 border-b border-slate-200">
          <div className="lg:col-span-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A1428] tracking-[-0.03em] leading-[1.1]">
              From policy and infrastructure to execution.
            </h2>
          </div>

          <div className="lg:col-span-6 space-y-4 text-base text-[#4A5568] leading-relaxed">
            <p>
              Botswana has committed three decades to laying foundational telecommunications backbone, enacting progressive digital legislation, and establishing national technology hubs.
            </p>
            <p>
              Yet persistent hurdles remain: elevated connectivity costs, nascent cybersecurity response mechanisms, a shallow seed investment pipeline, and limited monetisation rails for digital merchants and creators.
            </p>
            <p className="text-[#0A1428] font-medium">
              BMIC 2026 deliberately brings regulators, sovereign ministries, mobile network operators, venture investors, and technology founders into one focused room to transition strategy into financed, measurable action.
            </p>
          </div>
        </div>

        {/* 3 Pillars in Clean Row with Large Numerals (No Heavy Bordered Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 pt-16">
          {pillars.map((pillar) => (
            <div key={pillar.numeral} className="flex flex-col">
              <span className="text-3xl lg:text-4xl font-extrabold text-[#D81B60] font-['Plus_Jakarta_Sans',sans-serif] tracking-tight mb-3">
                {pillar.numeral}
              </span>
              <h3 className="text-lg font-bold text-[#0A1428] tracking-tight mb-2">
                {pillar.title}
              </h3>
              <p className="text-sm text-[#4A5568] leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
