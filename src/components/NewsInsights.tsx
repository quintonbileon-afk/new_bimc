import React from 'react';
import { CONGRESS_INSIGHTS } from '../data/bmicContent';
import { HeaderDots } from './HeaderDots';
import { BookOpen, ArrowRight, Clock, Calendar } from 'lucide-react';

interface NewsInsightsProps {
  onOpenArticle: (title: string) => void;
}

export const NewsInsights: React.FC<NewsInsightsProps> = ({ onOpenArticle }) => {
  return (
    <section className="py-24 bg-[#F6F8FC] text-slate-900 border-b border-slate-200 relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-grid-light opacity-30 pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-center mb-6">
          <HeaderDots dotSize="sm" theme="light" />
        </div>

        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs uppercase font-mono font-bold tracking-[0.2em] text-[#2F6296] mb-2">
            Policy &amp; Research Briefings
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Congress Insights &amp; Briefings
          </h2>
          <p className="text-base text-slate-600 mt-4 leading-relaxed">
            Analytical frameworks and executive whitepapers shaping the BMIC 2026 national dialogue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {CONGRESS_INSIGHTS.map((item) => (
            <article
              key={item.id}
              onClick={() => onOpenArticle(item.title)}
              className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:border-[#2F6296]/50"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  <span className="font-mono font-bold text-[#D61356] uppercase tracking-wider">
                    {item.tag}
                  </span>
                  <div className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.readTime}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#2F6296] transition-colors leading-snug mb-3">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {item.excerpt}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">
                  {item.date}
                </span>
                <span className="inline-flex items-center gap-1 font-bold text-[#2F6296] group-hover:translate-x-0.5 transition-transform">
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
