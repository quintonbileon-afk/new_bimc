import React, { useState } from 'react';
import { Check, ArrowRight, ShieldCheck, Sparkles, Building, Layers, Store, Ticket } from 'lucide-react';

interface RateCardSectionProps {
  onOpenRegister: (tierOrPass?: string) => void;
}

export const RateCardSection: React.FC<RateCardSectionProps> = ({ onOpenRegister }) => {
  const [activeTab, setActiveTab] = useState<'sponsorship' | 'delegates'>('sponsorship');

  const packages = [
    {
      id: 'gold-partner',
      name: 'Gold Partner',
      tag: 'Strategic Leadership',
      price: 'Contact Secretariat',
      priceSub: 'Custom institutional pack',
      highlight: false,
      deliverables: [
        'Exclusive plenary keynote or high-level panel co-chair',
        '6 All-Access Executive Delegate credentials',
        '18 sqm Prime Exhibition Pavilion in Main Atrium',
        'Full-page feature in BMIC 2026 Congress Guide & Communique',
        'Direct bilateral facilitation with attending government ministers',
        'Prominent branding across stage backdrops & official press kit',
      ],
      ctaText: 'Request Pack',
    },
    {
      id: 'silver-partner',
      name: 'Silver Partner',
      tag: 'Recommended for Operators',
      price: 'Contact Secretariat',
      priceSub: 'Sector track alignment',
      highlight: true, // middle subtly highlighted per spec
      deliverables: [
        'Strategic panel speaking seat in chosen thematic track',
        '4 All-Access Executive Delegate credentials',
        '9 sqm Fitted Exhibition Stand with power & high-speed link',
        'Half-page feature in the official digital congress brief',
        'Branding across session live-stream and digital collateral',
        'Access to the VIP Speakers & Ministers networking luncheon',
      ],
      ctaText: 'Request Pack',
    },
    {
      id: 'exhibitor-partner',
      name: 'Exhibitor',
      tag: 'Technology & Demos',
      price: 'Contact Secretariat',
      priceSub: 'Standard exhibition stand',
      highlight: false,
      deliverables: [
        '6 sqm Branded Exhibition Booth (table, chairs, power)',
        '2 Exhibitor Passes with full luncheon & session access',
        'Listing in official BMIC 2026 Innovation Directory',
        'Product demonstration slot in the Innovation Courtyard',
        'Company profile included in post-event investor pack',
      ],
      ctaText: 'Request Pack',
    },
  ];

  const delegatePasses = [
    {
      id: 'free-pass',
      name: 'Attend Exhibition for Free',
      price: 'P0',
      priceSub: 'Complimentary Access',
      badge: 'Free Registration',
      description: 'Open access for students, developers, startups and tech enthusiasts to experience the exhibition floor and open showcases.',
      features: [
        'Full access to the Technology Exhibition Floor',
        'Access to Innovation Courtyard and live product demonstrations',
        'Public gallery observation for plenary opening',
        'Digital badge and event floor map',
      ],
      action: 'Register for Free',
    },
    {
      id: 'standard-delegate',
      name: 'Standard Delegate',
      price: 'P1,500',
      priceSub: 'Single Delegate',
      badge: 'Official Delegate',
      description: 'Ideal for professionals, SMEs, analysts, and enterprise practitioners attending all 8 strategic policy and execution sessions.',
      features: [
        'All 8 morning policy and afternoon implementation sessions',
        'Access to plenary hall, exhibition atrium & networking areas',
        'Executive buffet luncheon and tea/coffee masterclasses',
        'Official delegate pack and advance draft of the Communique',
      ],
      action: 'Register Now',
    },
    {
      id: 'corporate-delegate',
      name: 'Corporate Delegate',
      price: 'P2,500',
      priceSub: 'Executive Pass',
      badge: 'Institutional',
      description: 'Designed for senior executives, directors, legal counsel, and state enterprise representatives seeking priority access.',
      features: [
        'All benefits of Standard Delegate pass',
        'Reserved auditorium seating in front 5 executive rows',
        'VIP networking reception and ministerial lounge access',
        'Official post-event Communique synthesis and presentation deck',
      ],
      action: 'Register Now',
    },
    {
      id: 'corporate-pack',
      name: 'Corporate Pack (3 Delegates)',
      price: 'P5,000',
      priceSub: '3 Executive Passes',
      badge: 'Team Package',
      description: 'Includes 3 full delegate credentials with dedicated team seating and reserved company table.',
      features: [
        '3 Full delegate passes with priority session seating',
        'Reserved company table during plenary and luncheons',
        'Company branding in delegate materials',
        'Priority registration and VIP concierge support',
      ],
      action: 'Register Team',
    },
  ];

  return (
    <section id="sponsor" className="py-20 lg:py-28 bg-[#FFFFFF] text-[#0A1428] border-b border-slate-200">
      <div className="max-w-[1250px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-slate-200">
          <div>
            <div className="mb-4">
              <span className="text-xs uppercase font-semibold tracking-[0.14em] text-[#2F6DB5]">
                Participation &amp; Rate Card
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A1428] tracking-[-0.03em] leading-[1.12]">
              Sponsorship &amp; Delegate Access
            </h2>
            <p className="text-base text-[#4A5568] mt-3 max-w-xl font-normal leading-relaxed">
              Transparent institutional packages designed for regional telecom operators, technology enterprises, and registered delegates.
            </p>
          </div>

          {/* Toggle between Sponsorship Packages and Delegate Passes */}
          <div className="inline-flex p-1 rounded-full bg-[#F7F8FA] border border-slate-200 text-xs font-semibold self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('sponsorship')}
              className={`px-5 py-2 rounded-full transition-all duration-200 ${
                activeTab === 'sponsorship'
                  ? 'bg-[#0A1428] text-white shadow-sm'
                  : 'text-[#4A5568] hover:text-[#0A1428]'
              }`}
            >
              Sponsorship Packages (3)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('delegates')}
              className={`px-5 py-2 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === 'delegates'
                  ? 'bg-[#0A1428] text-white shadow-sm'
                  : 'text-[#4A5568] hover:text-[#0A1428]'
              }`}
            >
              <span>Delegate Passes (4)</span>
              <span className="w-2 h-2 rounded-full bg-[#D81B60]" />
            </button>
          </div>
        </div>

        {/* Tab 1: 3 Sponsorship Package Cards (Gold, Silver, Exhibitor) */}
        {activeTab === 'sponsorship' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`rounded-[12px] p-8 flex flex-col justify-between transition-all duration-200 ${
                  pkg.highlight
                    ? 'bg-[#F7F8FA] border-2 border-[#2F6DB5] shadow-lg relative'
                    : 'bg-white border border-slate-200 shadow-sm hover:shadow-md'
                }`}
              >
                {pkg.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#2F6DB5] text-white text-[10px] uppercase font-bold tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                    Most Selected
                  </div>
                )}

                <div>
                  <div className="mb-4">
                    <span className="text-[11px] uppercase font-semibold tracking-wider text-[#D81B60]">
                      {pkg.tag}
                    </span>
                    <h3 className="text-2xl font-bold text-[#0A1428] tracking-tight mt-1">
                      {pkg.name}
                    </h3>
                  </div>

                  <div className="mb-6 pb-6 border-b border-slate-200">
                    <div className="text-2xl font-bold text-[#0A1428] tracking-tight">
                      {pkg.price}
                    </div>
                    <div className="text-xs text-[#4A5568] mt-1">
                      {pkg.priceSub}
                    </div>
                  </div>

                  <div className="text-xs uppercase font-semibold tracking-wider text-[#4A5568] mb-4">
                    Included Benefits:
                  </div>

                  <ul className="space-y-3 mb-8">
                    {pkg.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-[#4A5568] leading-relaxed">
                        <Check className="w-4 h-4 text-[#2F6DB5] shrink-0 mt-0.5" strokeWidth={2} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => onOpenRegister(`${pkg.name} Sponsorship`)}
                    className={`w-full py-3.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                      pkg.highlight
                        ? 'bg-[#D81B60] hover:bg-[#C2185B] text-white shadow-md'
                        : 'bg-[#0A1428] hover:bg-slate-800 text-white'
                    }`}
                  >
                    {pkg.ctaText}
                  </button>
                  <p className="text-[11px] text-center text-[#4A5568] mt-2.5">
                    Official prospectus provided upon request
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Delegate Passes & Attend Exhibition for Free */}
        {activeTab === 'delegates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch pt-4">
            {delegatePasses.map((pass) => (
              <div
                key={pass.id}
                className={`rounded-[12px] p-6 flex flex-col justify-between transition-all duration-200 ${
                  pass.id === 'free-pass' || pass.id === 'corporate-pack'
                    ? 'bg-[#F7F8FA] border-2 border-[#D81B60] shadow-md relative'
                    : 'bg-white border border-slate-200 shadow-sm hover:shadow-md'
                }`}
              >
                {pass.id === 'corporate-pack' && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#D81B60] text-white text-[10px] uppercase font-bold tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                    Team Package (3)
                  </div>
                )}
                {pass.id === 'free-pass' && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#2F6DB5] text-white text-[10px] uppercase font-bold tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                    Complimentary
                  </div>
                )}

                <div>
                  <div className="mb-4">
                    <span className="text-[11px] uppercase font-semibold tracking-wider text-[#2F6DB5]">
                      {pass.badge}
                    </span>
                    <h3 className="text-lg font-bold text-[#0A1428] tracking-tight mt-1">
                      {pass.name}
                    </h3>
                  </div>

                  <div className="mb-5 pb-5 border-b border-slate-200">
                    <div className="text-2xl font-extrabold text-[#0A1428] tracking-tight">
                      {pass.price}
                    </div>
                    <div className="text-xs text-[#4A5568] mt-1">
                      {pass.priceSub}
                    </div>
                  </div>

                  <p className="text-xs text-[#4A5568] leading-relaxed mb-5">
                    {pass.description}
                  </p>

                  <div className="text-xs uppercase font-semibold tracking-wider text-[#4A5568] mb-3">
                    Inclusions:
                  </div>

                  <ul className="space-y-2.5 mb-6">
                    {pass.features.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[#4A5568] leading-relaxed">
                        <Check className="w-3.5 h-3.5 text-[#D81B60] shrink-0 mt-0.5" strokeWidth={2} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => onOpenRegister(pass.name)}
                    className={`w-full py-3 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                      pass.id === 'free-pass' || pass.id === 'corporate-pack'
                        ? 'bg-[#D81B60] hover:bg-[#C2185B] text-white shadow-md'
                        : 'bg-[#0A1428] hover:bg-slate-800 text-white'
                    }`}
                  >
                    {pass.action}
                  </button>
                  <p className="text-[11px] text-center text-[#4A5568] mt-2">
                    Instant registration confirmation
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
