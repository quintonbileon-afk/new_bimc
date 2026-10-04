import React from 'react';
import { X, BookOpen, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { CONGRESS_INSIGHTS } from '../data/bmicContent';

interface ArticleModalProps {
  articleTitle: string | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ articleTitle, onClose }) => {
  if (!articleTitle) return null;

  const article = CONGRESS_INSIGHTS.find((a) => a.title === articleTitle) || CONGRESS_INSIGHTS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07101F]/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0B1B33] text-white rounded-3xl shadow-2xl border border-white/15 overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#102444] px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono text-[#D61356] font-bold uppercase">
            <BookOpen className="w-4 h-4" />
            <span>{article.tag}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-5 text-slate-300 text-sm leading-relaxed">
          <div>
            <div className="text-xs text-slate-400 mb-2 font-mono flex items-center gap-3">
              <span>{article.date}</span>
              <span>·</span>
              <span>{article.readTime}</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white tracking-tight mb-4">
              {article.title}
            </h3>
          </div>

          <p className="text-base text-slate-200 font-medium leading-relaxed">
            {article.excerpt}
          </p>

          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-slate-300 space-y-2">
            <div className="font-bold text-white font-mono uppercase">Key Congress Principle:</div>
            <p>
              "One national digital conversation — moving from policy and strategy to implementation, investment and measurable outcomes."
            </p>
          </div>

          <p>
            Botswana has entered an unprecedented era of telecommunications infrastructure maturity. The Botswana Mobile &amp; Internet Congress (BMIC 2026) convenes public policymakers, private telecom operators, regional venture capital funds, and grassroots builders into a unified action agenda.
          </p>

          <p>
            Key topics explored in this briefing will be debated during the strategic sessions at the Royal Aria Conference Centre on Friday, 30 October 2026, culminating in the adoption of the official BMIC 2026 Congress Communique.
          </p>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2F6296] to-[#D61356] text-white text-xs font-bold"
            >
              Close Briefing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
