import React from 'react';
import { EVENT_DETAILS } from '../data/bmicContent';
import { MapPin, Calendar, Clock, Plane, Users, Phone, ExternalLink, CalendarPlus } from 'lucide-react';

interface VenueTravelProps {
  onDownloadIcs: () => void;
}

export const VenueTravel: React.FC<VenueTravelProps> = ({ onDownloadIcs }) => {
  return (
    <section id="venue" className="py-12 lg:py-16 bg-[#0A1428] text-white border-b border-white/[0.08] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-[#2F6DB5]/[0.06] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-xl mb-8">
          <div className="inline-flex items-center gap-2 mb-2 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2F6DB5]" />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#B8C2D6]">
              06 / Host Destination &amp; Schedule
            </p>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
            LOCATION &amp; EVENT DETAILS
          </h2>
          <p className="text-xs sm:text-sm text-[#B8C2D6] leading-relaxed mt-1">
            Core venue coordinates and official scheduling details for delegates and stakeholders.
          </p>
        </div>

        {/* 2-Column Streamlined Cards: Location & Event Details Only */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-stretch">
          {/* Card 1: The Location */}
          <div className="group rounded-2xl p-6 sm:p-7 bg-[#0D1C3C]/60 hover:bg-[#12244C]/80 border border-white/[0.08] hover:border-[#2F6DB5]/50 transition-all duration-200 flex flex-col justify-between shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#2F6DB5]/15 border border-[#2F6DB5]/30 flex items-center justify-center text-[#60A5FA]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-xs font-bold text-white tracking-wider">
                    01 / VENUE LOCATION
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">
                  Greater Gaborone
                </span>
              </div>

              {/* Main Venue Name & Address */}
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-1 font-display">
                {EVENT_DETAILS.venue}
              </h3>
              <p className="text-xs sm:text-sm text-[#B8C2D6] mb-5">
                Tlokweng / Greater Gaborone Corridor, Botswana
              </p>

              {/* Structured Location Essentials */}
              <div className="space-y-3 bg-white/[0.02] p-3.5 rounded-xl border border-white/[0.05]">
                <div className="flex items-start gap-2.5 text-xs">
                  <Plane className="w-3.5 h-3.5 text-[#60A5FA] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-white font-medium block">Airport Distance</span>
                    <span className="text-[#B8C2D6]">25 minutes from Sir Seretse Khama International Airport (GBE)</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-xs pt-2.5 border-t border-white/[0.04]">
                  <MapPin className="w-3.5 h-3.5 text-[#60A5FA] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-white font-medium block">City Transit</span>
                    <span className="text-[#B8C2D6]">Direct highway access from Gaborone CBD &amp; major executive hotels</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="pt-5 mt-5 border-t border-white/[0.06] flex items-center justify-between">
              <span className="font-mono text-[10px] text-slate-400">
                GPS: -24.6672, 25.9614
              </span>
              <a
                href="https://maps.google.com/?q=Royal+Aria+Conference+Centre+Gaborone+Botswana"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-[#2F6DB5] text-white hover:text-white border border-white/[0.1] hover:border-[#2F6DB5] text-xs font-semibold transition-all cursor-pointer"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 2: The Event Details */}
          <div className="group rounded-2xl p-6 sm:p-7 bg-[#0D1C3C]/60 hover:bg-[#12244C]/80 border border-white/[0.08] hover:border-[#D13B84]/50 transition-all duration-200 flex flex-col justify-between shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#D13B84]/15 border border-[#D13B84]/30 flex items-center justify-center text-[#F472B6]">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-xs font-bold text-white tracking-wider">
                    02 / EVENT DETAILS
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#F472B6] uppercase tracking-wider px-2 py-0.5 rounded bg-[#D13B84]/10 border border-[#D13B84]/20 font-semibold">
                  Confirmed Date
                </span>
              </div>

              {/* Date & Hours */}
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-1 font-display">
                {EVENT_DETAILS.date}
              </h3>
              <p className="text-xs sm:text-sm text-[#B8C2D6] mb-5">
                07:30 – 18:30 CAT · Full-Day Plenary &amp; Exhibition
              </p>

              {/* Structured Schedule Essentials */}
              <div className="space-y-3 bg-white/[0.02] p-3.5 rounded-xl border border-white/[0.05]">
                <div className="flex items-start gap-2.5 text-xs">
                  <Users className="w-3.5 h-3.5 text-[#F472B6] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-white font-medium block">Delegation Capacity</span>
                    <span className="text-[#B8C2D6]">{EVENT_DETAILS.expectedDelegates} (Ministers, Operators, Investors &amp; Founders)</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-xs pt-2.5 border-t border-white/[0.04]">
                  <Phone className="w-3.5 h-3.5 text-[#F472B6] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-white font-medium block">Direct Secretariat</span>
                    <span className="text-[#B8C2D6]">Tel: +267 {EVENT_DETAILS.enquiriesPhone} · {EVENT_DETAILS.secretariatEmail}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="pt-5 mt-5 border-t border-white/[0.06] flex items-center justify-between">
              <span className="font-mono text-[10px] text-slate-400">
                Format: In-Person Summit
              </span>
              <button
                onClick={onDownloadIcs}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-[#D13B84] text-white hover:text-white border border-white/[0.1] hover:border-[#D13B84] text-xs font-semibold transition-all cursor-pointer"
              >
                <span>Save to Calendar (.ics)</span>
                <CalendarPlus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
