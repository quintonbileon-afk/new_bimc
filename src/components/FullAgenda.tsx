import React, { useState } from 'react';
import { AGENDA_SESSIONS } from '../data/bmicContent';
import { Search, Calendar, ChevronDown, MapPin, Tag } from 'lucide-react';

interface FullAgendaProps {
  onDownloadIcs: () => void;
}

export const FullAgenda: React.FC<FullAgendaProps> = ({ onDownloadIcs }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'morning' | 'afternoon'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSessions, setExpandedSessions] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedSessions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredSessions = AGENDA_SESSIONS.filter((session) => {
    const matchesSearch =
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.time.includes(searchQuery);

    if (!matchesSearch) return false;
    if (activeTab === 'morning') return session.period === 'morning';
    if (activeTab === 'afternoon') return session.period === 'afternoon';
    return true;
  });

  return (
    <section id="agenda" className="py-12 lg:py-16 bg-[#F7F8FA] text-[#0A1428] border-b border-slate-200/80 relative">
      <div id="programme" className="absolute -top-24 pointer-events-none" />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-2.5 px-2.5 py-1 rounded-full bg-slate-200/60 border border-slate-300/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F6DB5]" />
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#2F6DB5] font-semibold">
                03 / Programme Schedule
              </p>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A1428] tracking-tight mb-2 font-display">
              ONE ACTION AGENDA
            </h2>
            <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
              Friday, 30 October 2026 · 15 structured sessions moving from policy deliberations to execution.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={onDownloadIcs}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-[#0A1428] bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-xs cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#2F6DB5]" />
              <span>Add to Calendar (.ics)</span>
            </button>
          </div>
        </div>

        {/* Compact Tab Controls & Filter Strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200/80">
          {/* Editorial Text Tabs with Active Indicator */}
          <div className="flex items-center gap-6 text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-1.5 transition-colors cursor-pointer relative font-medium ${
                activeTab === 'all'
                  ? 'text-[#0A1428] font-bold border-b-2 border-[#2F6DB5]'
                  : 'text-[#4A5568] hover:text-[#0A1428]'
              }`}
            >
              All Sessions ({AGENDA_SESSIONS.length})
            </button>
            <button
              onClick={() => setActiveTab('morning')}
              className={`pb-1.5 transition-colors cursor-pointer relative font-medium ${
                activeTab === 'morning'
                  ? 'text-[#0A1428] font-bold border-b-2 border-[#2F6DB5]'
                  : 'text-[#4A5568] hover:text-[#0A1428]'
              }`}
            >
              Morning Plenary
            </button>
            <button
              onClick={() => setActiveTab('afternoon')}
              className={`pb-1.5 transition-colors cursor-pointer relative font-medium ${
                activeTab === 'afternoon'
                  ? 'text-[#0A1428] font-bold border-b-2 border-[#2F6DB5]'
                  : 'text-[#4A5568] hover:text-[#0A1428]'
              }`}
            >
              Afternoon Growth
            </button>
          </div>

          {/* Minimalist Search Input */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search agenda sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-full text-[#0A1428] placeholder-slate-400 focus:outline-none focus:border-[#2F6DB5] shadow-xs"
            />
          </div>
        </div>

        {/* Dense, High-Efficiency Agenda Timeline */}
        <div className="divide-y divide-slate-200/70 border-b border-slate-200/70 bg-white/40 rounded-xl overflow-hidden border border-slate-200/60">
          {filteredSessions.map((session) => {
            const isExpanded = expandedSessions[session.id];
            const isBreak = session.category === 'break' || session.category === 'networking';

            return (
              <div
                key={session.id}
                onClick={() => toggleExpand(session.id)}
                className={`px-4 sm:px-6 py-3.5 sm:py-4 transition-colors cursor-pointer hover:bg-white ${
                  isBreak ? 'bg-slate-50/60' : 'bg-transparent'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-6">
                  {/* Time Numeral & Location in Mono */}
                  <div className="sm:w-36 shrink-0 flex sm:flex-col items-center sm:items-start justify-between sm:justify-center">
                    <span className="font-mono text-xs sm:text-sm font-semibold text-[#0A1428] tabular-nums tracking-tight">
                      {session.time}
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#2F6DB5] font-medium sm:mt-0.5">
                      <MapPin className="w-2.5 h-2.5 shrink-0 hidden sm:inline" />
                      {session.category === 'break' || session.category === 'networking'
                        ? 'Networking'
                        : session.period === 'morning'
                        ? 'Plenary Hall'
                        : 'Exec Chamber'}
                    </span>
                  </div>

                  {/* Title & Tag in Single Balanced Row */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-semibold text-[#0A1428] tracking-tight leading-snug">
                        {session.title}
                      </h3>
                      <span className="font-mono text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-slate-200/60 text-[#4A5568] shrink-0">
                        {session.tag}
                      </span>
                    </div>

                    <p className="text-xs text-[#4A5568] leading-relaxed line-clamp-1 sm:line-clamp-2 mt-0.5 font-normal">
                      {session.description}
                    </p>

                    {isExpanded && session.strategicTrack && (
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-[#2F6DB5] font-medium font-mono">
                        <Tag className="w-3 h-3" />
                        <span>Track: {session.strategicTrack}</span>
                      </div>
                    )}
                  </div>

                  {/* Expand Chevron Icon */}
                  <div className="shrink-0 flex items-center justify-end sm:w-6">
                    <span
                      className={`text-slate-400 p-1 rounded hover:bg-slate-100 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180 text-[#2F6DB5]' : ''
                      }`}
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </span>
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
