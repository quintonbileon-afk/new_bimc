import React from 'react';
import { EVENT_DETAILS } from '../data/bmicContent';
import { CountdownTimer } from './CountdownTimer';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onOpenRegister: () => void;
  onDownloadIcs?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenRegister }) => {
  return (
    <section className="relative bg-[#0A1428] text-white pt-36 pb-0 overflow-hidden bg-dot-grid">
      {/* Subtle navy depth glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[520px] bg-[#2F6DB5]/10 rounded-full blur-[160px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center pb-20">
        {/* Eyebrow Line (Mono for tiny label) */}
        <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2F6DB5]" />
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#B8C2D6]">
            30 OCTOBER 2026 · GABORONE, BOTSWANA
          </p>
        </div>

        {/* Larger H1: Single solid color + one accent word, tight tracking */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-bold text-white tracking-[-0.03em] leading-[1.04] mb-7 max-w-5xl mx-auto">
          BOTSWANA MOBILE &amp;<br className="hidden sm:inline" /> INTERNET <span className="text-[#D81B60]">CONGRESS</span> 2026
        </h1>

        {/* Tagline */}
        <p className="text-lg sm:text-2xl font-medium text-white max-w-2xl mx-auto mb-3 tracking-tight">
          Transforming Botswana into the Digital Valley of SADC.
        </p>

        {/* Sub-line (hidden on mobile, concise without repeated stats) */}
        <p className="hidden sm:block text-sm text-[#B8C2D6] max-w-xl mx-auto mb-10 leading-relaxed font-normal">
          {EVENT_DETAILS.coreMotto}
        </p>

        {/* Primary CTA button + plain text link with nudging arrow */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
          <button
            onClick={onOpenRegister}
            className="group btn-cta-magenta px-8 py-3.5 rounded-full text-sm font-semibold text-white flex items-center gap-2.5 cursor-pointer"
          >
            <span>Register Now</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          <a
            href="#agenda"
            className="group text-sm font-semibold text-white hover:text-[#B8C2D6] transition-colors inline-flex items-center gap-1.5 py-2 px-3 rounded-full hover:bg-white/[0.04]"
          >
            <span>View Programme</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
          </a>
        </div>

        {/* Countdown Timer inside upper container */}
        <div className="mt-6">
          <CountdownTimer targetDate={EVENT_DETAILS.isoDate} />
        </div>
      </div>
    </section>
  );
};
