import React from 'react';
import { EVENT_DETAILS } from '../data/bmicContent';
import { HeaderDots } from './HeaderDots';
import { MapPin, Navigation, Car, Plane, Wifi, Building, ExternalLink, Calendar } from 'lucide-react';

interface VenueTravelProps {
  onDownloadIcs: () => void;
}

export const VenueTravel: React.FC<VenueTravelProps> = ({ onDownloadIcs }) => {
  return (
    <section id="venue" className="py-24 bg-[#F6F8FC] text-slate-900 border-b border-slate-200 relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-grid-light opacity-30 pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-center mb-6">
          <HeaderDots dotSize="sm" theme="light" />
        </div>

        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs uppercase font-mono font-bold tracking-[0.2em] text-[#2F6296] mb-2">
            Host Destination &amp; Venue
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Royal Aria Conference Centre
          </h2>
          <p className="text-base text-slate-600 mt-4 leading-relaxed">
            Botswana’s premier modern conference facility located in the greater Gaborone area, designed for world-class technical plenary and exhibition showcases.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-stretch">
          {/* Venue Highlights Card */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-8 border border-slate-200 shadow-md flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2F6296]/10 text-xs font-bold text-[#2F6296] mb-6">
                <Building className="w-3.5 h-3.5" />
                <span>Venue Specification</span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                Gaborone’s Flagship Stage
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                The Royal Aria Conference Centre provides an expansive plenary auditorium, dedicated track breakout chambers, an outdoor innovation courtyard, and an enclosed tech exhibition hall.
              </p>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <Wifi className="w-4 h-4 text-[#2F6296] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Gigabit Mesh Wi-Fi</div>
                    <div className="text-slate-500 mt-0.5">High-density connectivity</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <Car className="w-4 h-4 text-[#D61356] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Dedicated Parking</div>
                    <div className="text-slate-500 mt-0.5">Secured on-site bays</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <Plane className="w-4 h-4 text-[#2F6296] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Airport Access</div>
                    <div className="text-slate-500 mt-0.5">25 mins from SSKI Airport</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <Navigation className="w-4 h-4 text-[#D61356] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Shuttle Drop-off</div>
                    <div className="text-slate-500 mt-0.5">Designated delegate transfers</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <a
                href="https://maps.google.com/?q=Royal+Aria+Conference+Centre+Gaborone+Botswana"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#2F6296] hover:underline"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={onDownloadIcs}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-[#D61356]" />
                <span>Save to Calendar</span>
              </button>
            </div>
          </div>

          {/* Interactive Map Visual Presentation */}
          <div className="lg:col-span-6 rounded-3xl bg-[#0B1B33] text-white p-8 border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden group">
            {/* Map abstraction backdrop */}
            <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#4A83BE]">
                  Coordinates &amp; Location
                </span>
                <span className="px-2.5 py-1 text-[11px] font-mono bg-white/10 rounded-lg text-slate-300">
                  Gaborone, Botswana
                </span>
              </div>

              {/* Pin Graphic */}
              <div className="my-10 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-[#2F6296] to-[#D61356] shadow-2xl shadow-[#D61356]/40 p-1 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-full h-full rounded-full bg-[#07101F] flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-[#F03474]" />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-white tracking-tight">
                  Royal Aria Conference Centre
                </h4>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Greater Gaborone Area · Republic of Botswana
                </p>
              </div>
            </div>

            <div className="relative z-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-300">
                Friday, 30 October 2026 · Gates Open 07:30
              </div>
              <a
                href="https://maps.google.com/?q=Royal+Aria+Conference+Centre+Gaborone+Botswana"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2F6296] to-[#D61356] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Driving Directions</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
