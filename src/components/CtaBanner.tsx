import React from 'react';
import { ArrowRight } from 'lucide-react';
import { NAV_ROUTES } from '../config/routes';

interface CtaBannerProps {
  onOpenRegister: () => void;
  onDownloadIcs: () => void;
  onNavigateProgramme?: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onOpenRegister, onNavigateProgramme }) => {
  return (
    <section className="py-10 lg:py-14 bg-[#F7F8FA] text-[#0A1428] border-b border-slate-200/80">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-4 px-2.5 py-1 rounded-full bg-slate-200/50 border border-slate-300/50">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2F6DB5]" />
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#2F6DB5] font-semibold">
            08 / National Convening · 30 October 2026
          </p>
        </div>

        {/* Solid Headline */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#0A1428] tracking-[-0.03em] leading-[1.12] max-w-4xl mx-auto mb-6">
          ONE DAY. ONE NATIONAL DIGITAL CONVERSATION. ONE ACTION AGENDA.
        </h2>

      

        {/* One clear action per screen: ONE primary button + plain text link */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          <button
            onClick={onOpenRegister}
            className="group btn-cta-magenta px-8 py-3.5 rounded-full text-sm font-semibold text-white flex items-center gap-2.5 cursor-pointer"
          >
            <span>Register Now</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          <a
            href={NAV_ROUTES.programme}
            onClick={(e) => {
              e.preventDefault();
              if (onNavigateProgramme) {
                onNavigateProgramme();
              } else {
                window.location.href = '/programme';
              }
            }}
            className="group text-sm font-semibold text-[#0A1428] hover:text-[#2F6DB5] transition-colors inline-flex items-center gap-1.5 py-2 px-3 rounded-full hover:bg-slate-200/40 cursor-pointer"
          >
            <span>View Programme</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};
