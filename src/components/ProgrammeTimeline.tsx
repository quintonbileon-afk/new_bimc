import React, { useState } from 'react';
import { ChevronDown, Clock, Users, ArrowUpRight } from 'lucide-react';

interface SessionItem {
  id: string;
  time: string;
  title: string;
  tag: 'Policy' | 'Implementation' | 'Plenary' | 'Break';
  period: 'morning' | 'afternoon';
  description: string;
  speakers: string[];
}

export const ProgrammeTimeline: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>('session-keynote');
  const [activeFilter, setActiveFilter] = useState<'all' | 'morning' | 'afternoon'>('all');

  const sessions: SessionItem[] = [
    // Morning: Policy & National Direction
    {
      id: 'session-open',
      time: '08:30 - 09:00',
      title: 'Official Opening Ceremony & Ministerial Address',
      tag: 'Policy',
      period: 'morning',
      description: 'Opening remarks by event convenors, dignitary protocols, and official policy address on the state of national communications.',
      speakers: ['Government Dignitaries', 'Continental Media Group Executive Leadership'],
    },
    {
      id: 'session-keynote',
      time: '09:00 - 09:30',
      title: 'Keynote: Transforming Botswana into the Digital Valley of SADC',
      tag: 'Policy',
      period: 'morning',
      description: 'A strategic framework for converting sovereign infrastructure into regional competitiveness, foreign direct tech investment, and skilled employment.',
      speakers: ['International Technology Economists', 'Pan-African Infrastructure Leaders'],
    },
    {
      id: 'session-econ',
      time: '09:30 - 10:30',
      title: "Botswana's Digital Economy: From Infrastructure to Impact",
      tag: 'Policy',
      period: 'morning',
      description: 'High-level panel on telecommunications regulation, end-user affordability, subsea/terrestrial backhaul, and digital public infrastructure.',
      speakers: ['Regulators', 'Mobile Network Operator CEOs', 'Treasury & ICT Ministries'],
    },
    {
      id: 'session-cyber',
      time: '11:00 - 11:45',
      title: 'Cybersecurity & Digital Trust: Securing Sovereign Critical Assets',
      tag: 'Policy',
      period: 'morning',
      description: 'Operationalizing incident response teams (CIRT), public-private defense intelligence, data sovereignty, and institutional digital trust frameworks.',
      speakers: ['National Cyber Defense Heads', 'Enterprise CISOs', 'Banking Sector Risk Executives'],
    },
    {
      id: 'session-ai',
      time: '11:45 - 12:30',
      title: 'Artificial Intelligence: From Conversation to Implementation',
      tag: 'Policy',
      period: 'morning',
      description: 'Pragmatic deployment models for artificial intelligence across civic governance, mining automation, healthcare diagnostics, and education.',
      speakers: ['AI Research Faculty', 'Enterprise Cloud Providers', 'Technology Founders'],
    },

    // Midday Break
    {
      id: 'session-lunch',
      time: '12:30 - 13:30',
      title: 'Executive Luncheon & Technology Exhibition Showcase',
      tag: 'Break',
      period: 'afternoon',
      description: 'Curated networking luncheon and structured walkthrough of the technology exhibition booths and startup pavilions.',
      speakers: ['All Congress Delegates & Exhibitors'],
    },

    // Afternoon: Implementation & Commercial Growth
    {
      id: 'session-connectivity',
      time: '13:30 - 14:15',
      title: 'Connecting Every Motswana: Fibre, 5G & Satellite Broadband',
      tag: 'Implementation',
      period: 'afternoon',
      description: 'Commercial strategies for closing the last-mile digital divide, deploying Low-Earth-Orbit (LEO) satellite links, and lowering mobile data tariffs.',
      speakers: ['Infrastructure Operators', 'Internet Service Providers', 'Universal Service Fund Trustees'],
    },
    {
      id: 'session-startups',
      time: '14:15 - 15:00',
      title: "Building Botswana's ICT Startup Pipeline & Venture Capital Access",
      tag: 'Implementation',
      period: 'afternoon',
      description: 'Direct dialogue with regional venture capitalists, DFIs, and accelerators to address early-stage seed funding gaps and cross-border commercial scale.',
      speakers: ['Venture Capital Partners', 'Early-Stage Founders', 'Innovation Hub Directors'],
    },
    {
      id: 'session-ecommerce',
      time: '15:30 - 16:15',
      title: 'Getting Paid: Digital Content Monetisation & E-Commerce Rails',
      tag: 'Implementation',
      period: 'afternoon',
      description: 'Unlocking direct mobile money carrier billing, low-friction SME payment checkouts, digital royalties, and domestic logistics fulfillment.',
      speakers: ['Fintech Executives', 'Digital Content Creators', 'Commercial Bank Product Leads'],
    },
    {
      id: 'session-communique',
      time: '16:15 - 17:15',
      title: 'BMIC Action Plenary & Adoption of the 2026 Communique',
      tag: 'Implementation',
      period: 'afternoon',
      description: 'Formal synthesis of multi-stakeholder commitments and adoption of time-bound policy recommendations presented to government leadership.',
      speakers: ['Delegation Session Chairs', 'Secretariat Drafting Committee'],
    },
  ];

  const filtered = sessions.filter((s) => {
    if (activeFilter === 'morning') return s.period === 'morning';
    if (activeFilter === 'afternoon') return s.period === 'afternoon';
    return true;
  });

  const toggleAccordion = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="programme" className="py-20 lg:py-28 bg-[#0A1428] text-white border-b border-white/10">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/10">
          <div>
            <div className="mb-4">
              <span className="text-xs uppercase font-semibold tracking-[0.14em] text-[#D81B60]">
                Friday, 30 October 2026
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-[-0.03em] leading-[1.12]">
              Congress Programme
            </h2>
            <p className="text-base text-[#B8C2D6] mt-3 max-w-xl font-normal">
              One day uniting high-level sovereign direction with technical and commercial execution.
            </p>
          </div>

          {/* Segment Filter */}
          <div className="inline-flex p-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeFilter === 'all'
                  ? 'bg-white text-[#0A1428] font-semibold'
                  : 'text-[#B8C2D6] hover:text-white'
              }`}
            >
              All (8 Sessions)
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('morning')}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeFilter === 'morning'
                  ? 'bg-white text-[#0A1428] font-semibold'
                  : 'text-[#B8C2D6] hover:text-white'
              }`}
            >
              Morning (Policy)
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('afternoon')}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeFilter === 'afternoon'
                  ? 'bg-white text-[#0A1428] font-semibold'
                  : 'text-[#B8C2D6] hover:text-white'
              }`}
            >
              Afternoon (Implementation)
            </button>
          </div>
        </div>

        {/* Vertical Timeline Layout with Accordion */}
        <div className="divide-y divide-white/10 border-b border-white/10">
          {filtered.map((item) => {
            const isExpanded = expandedId === item.id;
            const isPolicy = item.tag === 'Policy';
            const isImplementation = item.tag === 'Implementation';

            return (
              <div
                key={item.id}
                className="py-6 sm:py-8 transition-colors hover:bg-white/[0.02]"
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleAccordion(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleAccordion(item.id);
                    }
                  }}
                  className="cursor-pointer grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start select-none"
                  aria-expanded={isExpanded}
                >
                  {/* Left: Time (Mono, Crisp) */}
                  <div className="md:col-span-3 flex items-center justify-between md:justify-start gap-3">
                    <span className="font-mono text-sm sm:text-base font-semibold text-white tracking-tight">
                      {item.time}
                    </span>
                    <span className="text-[11px] font-mono text-[#B8C2D6]/60 md:hidden">
                      CAT (UTC+2)
                    </span>
                  </div>

                  {/* Center: Title & Tag */}
                  <div className="md:col-span-8 flex flex-col items-start gap-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          isPolicy
                            ? 'bg-[#2F6DB5]/20 text-sky-200 border-[#2F6DB5]/40'
                            : isImplementation
                            ? 'bg-[#D81B60]/20 text-pink-200 border-[#D81B60]/40'
                            : 'bg-white/10 text-[#B8C2D6] border-white/15'
                        }`}
                      >
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      {item.title}
                    </h3>

                    {/* Collapsed speaker preview */}
                    {!isExpanded && (
                      <p className="text-xs text-[#B8C2D6] line-clamp-1">
                        {item.speakers.join(' · ')}
                      </p>
                    )}
                  </div>

                  {/* Right: Expand Indicator */}
                  <div className="md:col-span-1 flex justify-end items-center pt-1">
                    <span
                      className={`w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-[#B8C2D6] transition-transform duration-200 ${
                        isExpanded ? 'rotate-180 text-white bg-white/10' : ''
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {/* Accordion Content */}
                {isExpanded && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 pt-6 mt-4 border-t border-white/5 animate-fade-in text-sm">
                    <div className="md:col-span-3" />
                    <div className="md:col-span-8 space-y-4">
                      <p className="text-sm text-[#B8C2D6] leading-relaxed">
                        {item.description}
                      </p>

                      <div>
                        <div className="text-xs uppercase font-mono font-semibold tracking-wider text-slate-400 mb-2">
                          Participating Faculty &amp; Panellists:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.speakers.map((spk, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white"
                            >
                              {spk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
