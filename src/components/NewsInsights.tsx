import React from 'react';
import { CONGRESS_INSIGHTS } from '../data/bmicContent';
import { ArrowRight, Clock } from 'lucide-react';

interface NewsInsightsProps {
  onOpenArticle: (title: string) => void;
}

export const NewsInsights: React.FC<NewsInsightsProps> = ({ onOpenArticle }) => {
  return (
    <section id="insights" className="py-[72px] lg:py-[120px] bg-[#0A1428] text-white border-b border-white/[0.08]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2F6DB5]" />
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#B8C2D6]">
              08 / Policy &amp; Research Briefings
            </p>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-[-0.03em] leading-[1.12] mb-4">
            CONGRESS INSIGHTS &amp; BRIEFINGS
          </h2>
          <p className="text-base sm:text-lg text-[#B8C2D6] leading-relaxed font-normal">
            Analytical frameworks and executive whitepapers shaping the BMIC 2026 national dialogue.
          </p>
        </div>

        {/* Editorial Articles with Whitespace and 1px Dividers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-12">
          {CONGRESS_INSIGHTS.map((item) => (
            <article
              key={item.id}
              onClick={() => onOpenArticle(item.title)}
              className="border-t border-white/[0.08] pt-6 flex flex-col justify-between group cursor-pointer transition-colors hover:border-[#2F6DB5]"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#B8C2D6] mb-4">
                  <span className="font-mono font-semibold text-[#2F6DB5] uppercase tracking-wider text-[11px]">
                    {item.tag}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-[#2F6DB5]" />
                    <span>{item.readTime}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-[#B8C2D6] transition-colors leading-snug mb-3 tracking-tight">
                  {item.title}
                </h3>

                <p className="text-sm text-[#B8C2D6] leading-relaxed font-normal">
                  {item.excerpt}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-slate-400">
                  {item.date}
                </span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-white group-hover:translate-x-1 transition-transform duration-200">
                  <span>Read Briefing</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
