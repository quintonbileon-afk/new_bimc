import React from 'react';
import { EVENT_DETAILS } from '../data/bmicContent';
import { NetworkBackground } from './NetworkBackground';
import { CountdownTimer } from './CountdownTimer';
import { HeaderDots } from './HeaderDots';
import { Calendar, MapPin, ArrowRight, Play, Sparkles } from 'lucide-react';

interface HeroProps {
  onOpenRegister: () => void;
  onDownloadIcs: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenRegister, onDownloadIcs }) => {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between pt-32 pb-16 overflow-hidden bg-[#07101F]">
      {/* Animated canvas network background */}
      <NetworkBackground />

      {/* Grid pattern overlay with edge fade */}
      <div
        className="absolute inset-0 bg-dot-grid opacity-35 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"
        aria-hidden="true"
      />

      {/* Ambient gradient glow orbs */}
      <div
        className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-[#2F6296]/30 rounded-full blur-[140px] pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-[#D61356]/20 rounded-full blur-[140px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full my-auto">
        {/* Top Badges & Signal dots */}
        <div className="flex flex-col items-center justify-center text-center mb-6">
          <div className="flex items-center gap-3 mb-4">
            <HeaderDots dotSize="sm" theme="dark" fading={true} />
          </div>

          {/* Date & Location Chips */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl glass-panel-dark border border-white/10 shadow-lg">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.04] text-xs font-semibold text-slate-200">
              <Calendar className="w-3.5 h-3.5 text-[#4A83BE]" />
              <span>Friday, 30 October 2026</span>
            </div>
            <span className="text-slate-600 hidden sm:inline" aria-hidden="true">·</span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.04] text-xs font-semibold text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-[#F03474]" />
              <span>Royal Aria Conference Centre, Gaborone</span>
            </div>
          </div>
        </div>

        {/* Hero Title */}
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] mb-6">
            BOTSWANA MOBILE &amp; <br className="hidden sm:inline" />
            <span className="gradient-text font-black">INTERNET CONGRESS</span> 2026
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-2xl font-medium text-slate-300 max-w-3xl mx-auto tracking-tight mb-4">
            Transforming Botswana into the <span className="text-white font-semibold">Digital Valley of SADC</span>.
          </p>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8 font-normal">
            {EVENT_DETAILS.coreMotto}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <button
              onClick={() => onOpenRegister()}
              className="relative group overflow-hidden px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#2F6296] via-[#853C77] to-[#D61356] shadow-xl shadow-[#D61356]/25 hover:shadow-[#D61356]/40 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-pink-200" />
              <span>Register Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#agenda"
              className="px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-200 hover:text-white glass-panel-dark border border-white/10 hover:border-white/20 hover:bg-white/[0.08] transition-all flex items-center gap-2 group"
            >
              <div className="w-6 h-6 rounded-full bg-[#2F6296]/30 flex items-center justify-center text-[#4A83BE] group-hover:bg-[#2F6296]/50 transition-colors">
                <Play className="w-3 h-3 fill-current ml-0.5" />
              </div>
              <span>View Programme</span>
            </a>
          </div>

          {/* Live Countdown Timer in Glass Tiles */}
          <div className="flex flex-col items-center justify-center mb-10">
            <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400 mb-2.5 font-semibold">
              Congress Starts In
            </div>
            <CountdownTimer targetDate={EVENT_DETAILS.isoDate} />
          </div>
        </div>

        {/* Floating Stats Strip with Count-up */}
        <div className="max-w-4xl mx-auto pt-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 rounded-2xl glass-panel-dark border border-white/10 shadow-xl">
            {EVENT_DETAILS.heroStats.map((stat, idx) => (
              <div
                key={stat.label}
                className="text-center px-2 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.1] transition-all group"
              >
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight tabular-nums flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className={idx % 2 === 0 ? 'text-[#4A83BE]' : 'text-[#F03474]'}>
                    {stat.value}
                  </span>
                  <span className="text-slate-400 text-lg">{stat.suffix}</span>
                </div>
                <div className="text-xs font-bold text-slate-200 mt-1">
                  {stat.label}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {stat.subtext}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
