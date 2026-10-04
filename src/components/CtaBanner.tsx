import React from 'react';
import { EVENT_DETAILS } from '../data/bmicContent';
import { HeaderDots } from './HeaderDots';
import { BmicLogo } from './BmicLogo';
import { Sparkles, ArrowRight, Calendar, MapPin } from 'lucide-react';

interface CtaBannerProps {
  onOpenRegister: () => void;
  onDownloadIcs: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onOpenRegister, onDownloadIcs }) => {
  return (
    <section className="relative py-28 bg-[#07101F] text-white overflow-hidden border-b border-white/10">
      {/* Background dot matrix & glow */}
      <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none" aria-hidden="true" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-[#2F6296]/30 via-[#853C77]/20 to-[#D61356]/30 rounded-full blur-[140px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="flex justify-center mb-6">
          <HeaderDots dotSize="md" theme="dark" fading={true} />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-mono font-bold text-pink-300 uppercase tracking-widest mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#D61356]" />
          <span>Gaborone, Botswana · 30 October 2026</span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
          ONE DAY. ONE NATIONAL DIGITAL CONVERSATION.{' '}
          <span className="gradient-text font-black">ONE ACTION AGENDA.</span>
        </h2>

        <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed mb-10">
          Be in the room where Botswana's digital future moves from strategic dialogue to financed implementation.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onOpenRegister}
            className="px-8 py-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#2F6296] via-[#853C77] to-[#D61356] shadow-xl shadow-[#D61356]/30 hover:shadow-[#D61356]/50 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <span>Register as Delegate</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onDownloadIcs}
            className="px-7 py-4 rounded-xl text-sm font-semibold text-slate-200 glass-panel-dark border border-white/15 hover:border-white/30 hover:bg-white/[0.08] transition-all flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-[#D61356]" />
            <span>Save Date to Calendar (.ics)</span>
          </button>
        </div>
      </div>
    </section>
  );
};
