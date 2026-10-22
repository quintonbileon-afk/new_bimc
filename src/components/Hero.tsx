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
    <section
      className="hero bmic-hero relative overflow-hidden pt-[60px]"
      style={{ height: '850.26px', paddingTop: '60px' }}
    >
      <div className="wrap bmic-wrap">
        <div className="hero-grid">
          {/* Left Column */}
          <div>
            <div className="bmic-pill mb-4">30 OCTOBER 2026 &middot; GABORONE, BOTSWANA</div>
            <h1 className="m-0">
              Botswana Mobile &amp; Internet <em>Congress</em> 2026
            </h1>
             <p className="tag bmic-tag mt-4 mb-2">
              Transforming Botswana into the Digital Valley of SADC.
            </p>
            <div className="cta bmic-cta flex items-center gap-4 flex-wrap mb-6">
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
                Get Free Pass to Exhibition Floor &rarr;
              </button>
            </div>
            <div className="text-left">
              <CountdownTimer targetDate={EVENT_DETAILS.isoDate} />
            </div>
          </div>

          {/* Right Column: Two Entry Cards */}
          <div className="cards bmic-cards">
            {/* Card 1: Attend (Navy gradient) */}
            <div className="card bmic-card hot relative overflow-hidden group">
              <div className="absolute inset-0 bmic-dot-texture-hot pointer-events-none" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2>Attend</h2>
                    <span className="w-8 h-8 rounded-full bg-white/[0.14] flex items-center justify-center text-white text-sm font-bold">
                      &rarr;
                    </span>
                  </div>
                  <ul className="bmic-card-rows">
                    <li>
                      <a
                        href="#attendees"
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById('attendees');
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
                  className="w-full py-3.5 px-6 rounded-full border-[1.5px] border-white/40 bg-white/[0.12] text-white font-bold text-base hover:bg-white/[0.2] transition-colors cursor-pointer flex items-center justify-center gap-2 mt-1"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenRegister();
                  }}
                >
                  Register Now &rarr;
                </button>
              </div>
            </div>

            {/* Card 2: Exhibit/Sponsor (Maroon gradient) */}
            <div className="card bmic-card card-exhibit relative overflow-hidden group">
              <div className="absolute inset-0 bmic-dot-texture pointer-events-none" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2>Exhibit/Sponsor</h2>
                    <span className="w-8 h-8 rounded-full bg-white/[0.14] flex items-center justify-center text-white text-sm font-bold">
                      &rarr;
                    </span>
                  </div>
                  <ul className="bmic-card-rows">
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
                  className="w-full py-3.5 px-6 rounded-full border border-white/20 bg-transparent text-white font-bold text-base hover:border-[#5aa9e6] hover:text-[#5aa9e6] transition-colors cursor-pointer flex items-center justify-center gap-2 mt-1"
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
