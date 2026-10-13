import React from 'react';
import { X, BookOpen, Clock } from 'lucide-react';
import { CONGRESS_INSIGHTS } from '../data/bmicContent';

interface ArticleModalProps {
  articleTitle: string | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ articleTitle, onClose }) => {
  if (!articleTitle) return null;

  const article = CONGRESS_INSIGHTS.find((a) => a.title === articleTitle) || CONGRESS_INSIGHTS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1428]/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[#0E1C38] text-white rounded-[12px] shadow-2xl border border-white/10 overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#0A1428] px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2 text-xs text-[#2F6DB5] font-semibold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>{article.tag}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-5 text-[#B8C2D6] text-sm leading-relaxed">
          <div>
            <div className="text-xs text-slate-400 mb-2 flex items-center gap-2">
              <span>{article.date}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#2F6DB5]" />
                {article.readTime}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight mb-4">
              {article.title}
            </h3>
          </div>

          <p className="text-base text-white font-medium leading-relaxed">
            {article.excerpt}
          </p>

          <div className="p-4 rounded-[12px] bg-[#0A1428] border border-white/10 text-xs text-[#B8C2D6] space-y-2">
            <div className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Key Congress Principle:
            </div>
            <p className="italic">
              "One national digital conversation — moving from policy and strategy to implementation, investment, and measurable outcomes."
            </p>
          </div>

          <p>
            Botswana has entered an unprecedented era of telecommunications infrastructure maturity. The Botswana Mobile &amp; Internet Congress (BMIC 2026) convenes public policymakers, private telecom operators, regional venture capital funds, and ecosystem builders into a unified action agenda.
          </p>

          <p>
            Key topics explored in this briefing will be debated during the strategic sessions at the Royal Aria Conference Centre on Friday, 30 October 2026, culminating in the adoption of the official BMIC 2026 Congress Communique.
          </p>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-[#0A1428] hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
            >
              Close Briefing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
