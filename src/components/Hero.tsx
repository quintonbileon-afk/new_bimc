import React from 'react';
import { EVENT_DETAILS } from '../data/bmicContent';
import { CountdownTimer } from './CountdownTimer';
import { NAV_ROUTES } from '../config/routes';

interface HeroProps {
  onOpenRegister: () => void;
  onOpenFreePass?: () => void;
  onDownloadIcs?: () => void;
  onSelectNavTab?: (tab: 'delegates' | 'exhibition' | 'partnerships') => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenRegister, onOpenFreePass, onSelectNavTab }) => {
  return (
    <section className="hero bmic-hero relative overflow-hidden">
      <div className="wrap bmic-wrap">
        <div className="hero-grid">
          {/* Left Column */}
          <div>
            <h1>
              Botswana Mobile &amp; Internet <em>Congress</em> 2026
            </h1>
            <p className="tag bmic-tag">
              Transforming Botswana into the Digital Valley of SADC.
            </p>
            <p className="sum bmic-sum">
              Moving Botswana from policy and infrastructure to commercial execution and regional scale.
            </p>
            <div className="cta bmic-cta">
              <a
                className="btn bmic-btn cursor-pointer"
                href={NAV_ROUTES.register}
                onClick={(e) => {
                  e.preventDefault();
                  onOpenRegister();
                }}
              >
                Register Now &rarr;
              </a>
              <button
                type="button"
                className="link bmic-link cursor-pointer bg-transparent border-0 text-left"
                onClick={(e) => {
                  e.preventDefault();
                  if (onOpenFreePass) {
                    onOpenFreePass();
                  } else {
                    const el = document.getElementById('tickets') || document.getElementById('passes');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Get Free Exhibition Pass &rarr;
              </button>
            </div>
            <div className="bmic-pill mt-6">30 OCTOBER 2026 &middot; GABORONE, BOTSWANA</div>
            <div className="mt-4 pt-4 border-t border-[#26365a]/60">
              <CountdownTimer targetDate={EVENT_DETAILS.isoDate} />
            </div>
          </div>

          {/* Right Column: Two Entry Cards */}
          <div className="cards bmic-cards">
            {/* Card 1: Attend (Hot gradient) */}
            <div className="card bmic-card hot relative overflow-hidden group">
              <div className="absolute inset-0 bmic-dot-texture-hot pointer-events-none" />
              <div className="absolute right-4 top-4 text-7xl sm:text-8xl font-black font-mono select-none pointer-events-none text-white/[0.04] tracking-tighter">
                01
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-white/15 text-white border border-white/20">
                      Attend
                    </span>
                    <span className="text-[11px] sm:text-xs text-[#b6c2dc] font-mono tracking-wide">
                      Attendees, Venue &amp; Tickets
                    </span>
                  </div>
                  <h2>Attend</h2>
                  <ul className="bmic-card-rows mt-4">
                    <li>
                      <a
                        href="#attendees"
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectNavTab?.('delegates');
                          const el = document.getElementById('attendees') || document.getElementById('passes');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        <span>Attendees</span>
                        <span className="bmic-row-arrow">&rarr;</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#venue"
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById('venue') || document.getElementById('venue-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        <span>Venue</span>
                        <span className="bmic-row-arrow">&rarr;</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href={NAV_ROUTES.tickets}
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectNavTab?.('delegates');
                          const el = document.getElementById('tickets') || document.getElementById('passes');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        <span>Tickets</span>
                        <span className="bmic-row-arrow">&rarr;</span>
                      </a>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  className="w-full py-3.5 px-6 rounded-full bg-white text-[#d81b60] font-bold text-base hover:bg-slate-100 transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2 mt-4"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenRegister();
                  }}
                >
                  Register Now &rarr;
                </button>
              </div>
            </div>

            {/* Card 2: Exhibit/Sponsor */}
            <div className="card bmic-card card-exhibit relative overflow-hidden group">
              <div className="absolute inset-0 bmic-dot-texture pointer-events-none" />
              <div className="absolute right-4 top-4 text-7xl sm:text-8xl font-black font-mono select-none pointer-events-none text-white/[0.04] tracking-tighter">
                02
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#d81b60]/25 text-[#ff6b9a] border border-[#d81b60]/40">
                      Exhibit / Sponsor
                    </span>
                    <span className="text-[11px] sm:text-xs text-[#b6c2dc] font-mono tracking-wide">
                      Exhibitions &amp; Sponsorship
                    </span>
                  </div>
                  <h2>Exhibit/Sponsor</h2>
                  <ul className="bmic-card-rows mt-4">
                    <li>
                      <a
                        href={NAV_ROUTES.exhibitions}
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectNavTab?.('exhibition');
                          const el = document.getElementById('exhibitions') || document.getElementById('passes');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        <span>Exhibitions</span>
                        <span className="bmic-row-arrow">&rarr;</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href={NAV_ROUTES.sponsorship}
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectNavTab?.('partnerships');
                          const el = document.getElementById('sponsorship') || document.getElementById('partners');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        <span>Sponsorship</span>
                        <span className="bmic-row-arrow">&rarr;</span>
                      </a>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  className="w-full py-3.5 px-6 rounded-full border border-[#26365a] bg-transparent text-white font-bold text-base hover:border-[#5aa9e6] hover:text-[#5aa9e6] transition-colors cursor-pointer flex items-center justify-center gap-2 mt-4"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectNavTab?.('exhibition');
                    const el = document.getElementById('exhibitions') || document.getElementById('passes');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Exhibitions &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
