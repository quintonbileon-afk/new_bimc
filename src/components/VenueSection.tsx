import React from 'react';
import { MapPin, Navigation, Car, Plane, Building, ExternalLink } from 'lucide-react';

export const VenueSection: React.FC = () => {
  return (
    <section id="venue" className="py-20 lg:py-28 bg-[#F7F8FA] text-[#0A1428] border-b border-slate-200">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* Section Tag */}
        <div className="mb-4">
          <span className="text-xs uppercase font-semibold tracking-[0.14em] text-[#2F6DB5]">
            Host Destination
          </span>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Venue Details & Practical Info */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A1428] tracking-[-0.03em] leading-[1.12] mb-3">
                Royal Aria Conference Centre
              </h2>
              <p className="text-sm sm:text-base font-medium text-[#2F6DB5] mb-6 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D81B60] shrink-0" />
                <span>Plot 2329, Tlokweng / Greater Gaborone, Botswana</span>
              </p>

              <p className="text-base text-[#4A5568] leading-relaxed mb-10 max-w-xl">
                Botswana’s premier contemporary convention venue, engineered for high-level ministerial summits, closed-door policy dialogues, and high-density technology exhibitions.
              </p>

              {/* Practical Info List */}
              <div className="space-y-6 border-t border-slate-200 pt-8">
                {/* Airport Travel */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[#2F6DB5] shrink-0 mt-0.5">
                    <Plane className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0A1428] tracking-tight">
                      Sir Seretse Khama International Airport (GBE)
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4A5568] mt-1 leading-relaxed">
                      25 minutes via the A1 dual carriageway. Official BMIC delegate shuttles run between GBE airport, designated partner hotels, and the venue from 06:30 to 19:30.
                    </p>
                  </div>
                </div>

                {/* Parking & Security */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[#2F6DB5] shrink-0 mt-0.5">
                    <Car className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0A1428] tracking-tight">
                      Parking &amp; Sovereign Security Access
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4A5568] mt-1 leading-relaxed">
                      Over 1,200 secure access-controlled vehicle bays. Dedicated VIP protocol motorcade drop-off and accreditation checkpoint at Gate 1.
                    </p>
                  </div>
                </div>

                {/* Hotels */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[#2F6DB5] shrink-0 mt-0.5">
                    <Building className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0A1428] tracking-tight">
                      Recommended Delegate Accommodations
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4A5568] mt-1 leading-relaxed">
                      Preferential corporate rates secured at The Grand Palm Hotel, Peermont Walmont at The Grand Palm, and Protea Hotel Gaborone Masa Square.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Map Embed / Visual Placeholder */}
          <div className="lg:col-span-5">
            <div className="rounded-[12px] overflow-hidden bg-white border border-slate-200 shadow-sm flex flex-col">
              {/* Map Canvas / Visual */}
              <div className="relative h-[320px] sm:h-[380px] bg-[#0A1428] p-6 flex flex-col justify-between overflow-hidden">
                {/* Background Map Graphic Styling */}
                <div
                  className="absolute inset-0 bg-subtle-grid opacity-30 pointer-events-none"
                  aria-hidden="true"
                />
                <div
                  className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#2F6DB5]/20 blur-3xl pointer-events-none"
                  aria-hidden="true"
                />

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-white border border-white/15">
                    Gaborone, Botswana
                  </span>
                  <span className="font-mono text-xs text-[#B8C2D6]">
                    24°40′S 25°55′E
                  </span>
                </div>

                {/* Map Graphic Pin */}
                <div className="relative z-10 my-auto text-center py-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#D81B60] text-white shadow-lg mb-3">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div className="text-lg font-bold text-white tracking-tight">
                    Royal Aria Conference Centre
                  </div>
                  <div className="text-xs text-[#B8C2D6] mt-1">
                    Auditorium A · Exhibition Atrium
                  </div>
                </div>

                {/* Bottom External Map Link */}
                <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#B8C2D6]">
                  <span>High-Capacity Venue</span>
                  <a
                    href="https://maps.google.com/?q=Royal+Aria+Convention+Centre+Gaborone"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-white hover:text-[#D81B60] transition-colors font-medium"
                  >
                    <span>View in Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Bottom Card Summary */}
              <div className="p-6 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-[#4A5568]">
                <div>
                  <span className="font-bold text-[#0A1428] block">Date: Friday, 30 October 2026</span>
                  <span>Doors Open: 07:30 CAT · Sessions: 08:30 CAT</span>
                </div>
                <div className="text-right font-mono text-[11px] text-[#2F6DB5] font-semibold">
                  UTC+02:00
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
