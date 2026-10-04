import React from 'react';
import { EVENT_DETAILS, PARTNERSHIP_TIERS, STAKEHOLDER_PROFILES } from '../data/bmicContent';
import { HeaderDots } from './HeaderDots';
import { Award, Layers, Store, Radio, Mic, Presentation, UserCheck, ArrowRight } from 'lucide-react';

interface PartnerWithUsProps {
  onOpenEnquiry: (tier?: string) => void;
}

export const PartnerWithUs: React.FC<PartnerWithUsProps> = ({ onOpenEnquiry }) => {
  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Headline Partner':
        return <Award className="w-5 h-5 text-[#235A82]" />;
      case 'Track Sponsor':
        return <Layers className="w-5 h-5 text-[#D81B60]" />;
      case 'Exhibitor':
        return <Store className="w-5 h-5 text-[#235A82]" />;
      case 'Media / Community Partner':
        return <Radio className="w-5 h-5 text-[#D81B60]" />;
      default:
        return <Award className="w-5 h-5 text-[#235A82]" />;
    }
  };

  const getProfileIcon = (title: string) => {
    switch (title) {
      case 'Speakers':
        return <Mic className="w-5 h-5 text-[#235A82]" />;
      case 'Exhibitors & Startups':
        return <Presentation className="w-5 h-5 text-[#D81B60]" />;
      case 'Attendees':
        return <UserCheck className="w-5 h-5 text-[#235A82]" />;
      default:
        return <UserCheck className="w-5 h-5 text-[#235A82]" />;
    }
  };

  return (
    <section id="partners" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-4">
          <HeaderDots dotSize="sm" />
        </div>

        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-xs uppercase font-bold tracking-[0.2em] text-[#235A82] mb-2">
            Collaboration &amp; Sponsorship
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            PARTNER WITH US
          </h2>
          <p className="text-base text-slate-700 leading-relaxed font-normal">
            {EVENT_DETAILS.partnerIntro}
          </p>
        </div>

        {/* Partnership Tiers Table & Cards */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="text-left mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              Partnership Tiers &amp; Commercial Opportunities
            </h3>
            <p className="text-xs text-slate-500">
              Select a tier to submit an expression of interest to the organising team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PARTNERSHIP_TIERS.map((tier) => (
              <div
                key={tier.tier}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:border-[#235A82] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                        {getTierIcon(tier.tier)}
                      </div>
                      <h4 className="text-lg font-bold text-slate-900">
                        {tier.tier}
                      </h4>
                    </div>

                    <span
                      className={`text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded border ${
                        tier.availability === 'By invitation'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : tier.availability === 'Limited'
                          ? 'bg-pink-50 text-[#D81B60] border-pink-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {tier.availability}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
                    What's Included:
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed mb-6 font-normal">
                    {tier.included}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Enquiries via Continental Media Group
                  </span>
                  <button
                    onClick={() => onOpenEnquiry(tier.tier)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#235A82] hover:text-[#163B57] group"
                  >
                    <span>Enquire for Tier</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stakeholder Participation Categories (Speakers, Exhibitors & Startups, Attendees) */}
        <div className="max-w-5xl mx-auto pt-6 border-t border-slate-200">
          <div className="text-center mb-8">
            <h3 className="text-lg font-bold text-slate-900">
              Ways to Participate
            </h3>
            <p className="text-xs text-slate-500">
              Participation profiles for individuals, organizations, and innovative startups
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STAKEHOLDER_PROFILES.map((profile: { title: string; description: string }) => (
              <div
                key={profile.title}
                className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 inline-block mb-3">
                    {getProfileIcon(profile.title)}
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-2">
                    {profile.title}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {profile.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => onOpenEnquiry(profile.title)}
                    className="text-xs font-bold text-[#235A82] hover:underline"
                  >
                    Register interest as {profile.title} &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
