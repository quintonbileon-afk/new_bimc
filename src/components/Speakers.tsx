import React, { useState, useRef } from 'react';
import { SPEAKERS_LIST } from '../data/bmicContent';
import { HeaderDots } from './HeaderDots';
import { Mic, ArrowRight, ChevronLeft, ChevronRight, UserCheck, Shield } from 'lucide-react';

export const Speakers: React.FC = () => {
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section id="speakers" className="py-24 bg-[#0B1B33] text-white border-b border-white/10 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/2 left-0 w-96 h-96 bg-[#2F6296]/20 rounded-full blur-[120px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 right-0 w-96 h-96 bg-[#D61356]/15 rounded-full blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-center mb-6">
          <HeaderDots dotSize="sm" theme="dark" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-2xl">
            <p className="text-xs uppercase font-mono font-bold tracking-[0.2em] text-[#D61356] mb-2">
              Leadership &amp; Faculty
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Congress Speakers &amp; Panel Chairs
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-3">
              Convening national policy makers, telecommunication leaders, startup founders, and international technologists with implementation-focused contributions.
            </p>
          </div>

          {/* Navigation Controls for carousel */}
          <div className="flex items-center gap-2 mt-6 md:mt-0">
            <button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-xl glass-panel-dark border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all"
              aria-label="Previous Speakers"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-xl glass-panel-dark border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all"
              aria-label="Next Speakers"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel / Grid of Speakers */}
        <div
          ref={scrollRef}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto pb-6 md:pb-0 scrollbar-none snap-x snap-mandatory"
        >
          {SPEAKERS_LIST.map((speaker) => {
            const isHovered = activeSpeaker === speaker.id;

            return (
              <div
                key={speaker.id}
                onMouseEnter={() => setActiveSpeaker(speaker.id)}
                onMouseLeave={() => setActiveSpeaker(null)}
                className="min-w-[280px] sm:min-w-[320px] md:min-w-0 snap-start rounded-2xl glass-panel-dark border border-white/10 overflow-hidden relative group hover:border-[#D61356]/50 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Visual Avatar / Identity Carrier with Gradient Ring & Dot Matrix */}
                <div className="p-6 pb-2">
                  <div className="relative w-24 h-24 mx-auto rounded-full p-[2px] bg-gradient-to-tr from-[#2F6296] via-transparent to-[#D61356] group-hover:from-[#D61356] group-hover:to-[#2F6296] transition-all duration-500 mb-4 shadow-lg">
                    <div
                      className={`w-full h-full rounded-full bg-gradient-to-br ${speaker.avatarGradient} flex items-center justify-center relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-300`}
                    >
                      {/* Decorative signal dots inside avatar */}
                      <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" />
                      <Mic className="w-8 h-8 text-white/90 relative z-10" />
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-pink-100 transition-colors">
                      {speaker.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#D61356] mt-0.5">
                      {speaker.role}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      {speaker.organization}
                    </p>
                  </div>
                </div>

                {/* Session Focus & Slide-up Bio */}
                <div className="p-6 pt-3 relative">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-3">
                    <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold mb-1">
                      Session Topic:
                    </div>
                    <div className="text-xs font-semibold text-slate-200 leading-snug line-clamp-2">
                      {speaker.topic}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {speaker.bio}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-slate-300">
                      <UserCheck className="w-3.5 h-3.5 text-[#2F6296]" />
                      Official Delegation
                    </span>
                    <span className="font-mono text-[#D61356]">BMIC Faculty</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
