import React, { useState } from 'react';
import { AGENDA_SESSIONS, EVENT_DETAILS } from '../data/bmicContent';
import { HeaderDots } from './HeaderDots';
import { Search, Printer, Calendar, Clock, ChevronDown, ChevronUp, Sparkles, Coffee, Shield, Cpu, Wifi, TrendingUp, Layers, CheckCircle } from 'lucide-react';

interface FullAgendaProps {
  onDownloadIcs: () => void;
}

export const FullAgenda: React.FC<FullAgendaProps> = ({ onDownloadIcs }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'morning' | 'afternoon'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSessions, setExpandedSessions] = useState<Record<string, boolean>>({
    'session-03': true,
    'session-04': true,
    'session-10': true,
  });

  const toggleExpand = (id: string) => {
    setExpandedSessions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'Keynote':
        return 'bg-[#D61356]/20 text-pink-300 border-[#D61356]/40';
      case 'Panel':
        return 'bg-[#2F6296]/20 text-sky-300 border-[#2F6296]/40';
      case 'Implementation':
      case 'E-Commerce':
      case 'Venture & Startups':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Strategic Track':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'Communique':
      case 'Action Session':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-slate-700/30 text-slate-300 border-slate-700/50';
    }
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
    <section id="agenda" className="py-24 bg-[#07101F] text-white border-b border-white/10 relative overflow-hidden">
      {/* Background ambient gradient */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#2F6296]/15 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-center mb-6">
          <HeaderDots dotSize="sm" theme="dark" />
        </div>

        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-xs uppercase font-mono font-bold tracking-[0.2em] text-[#D61356] mb-2">
            Congress Schedule
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            High-Impact Congress Programme
          </h2>
          <div className="text-xs font-mono font-bold text-[#4A83BE] uppercase tracking-wider mt-3">
            FRIDAY, 30 OCTOBER 2026 · ROYAL ARIA CONFERENCE CENTRE, GABORONE
          </div>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl mx-auto leading-relaxed">
            {EVENT_DETAILS.coreMotto}
          </p>
        </div>

        {/* Tab switcher, Search & Controls */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-2 rounded-2xl glass-panel-dark border border-white/10">
            {/* Day / Period Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-white/[0.03] rounded-xl border border-white/5">
              {[
                { id: 'all', label: 'Full Day (All 15 Sessions)' },
                { id: 'morning', label: 'Morning Plenary' },
                { id: 'afternoon', label: 'Afternoon Tracks' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#2F6296] to-[#D61356] text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search and Action */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-56">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter sessions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#2F6296]"
                />
              </div>

              <button
                onClick={() => window.print()}
                className="p-2 rounded-xl bg-white/[0.05] border border-white/10 text-slate-300 hover:text-white transition-colors"
                title="Print Programme"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Timeline Container with Vertical Line */}
        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Connecting Line */}
          <div className="absolute left-[19px] sm:left-[105px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-[#2F6296] via-[#D61356] to-[#2F6296] opacity-30" />

          <div className="space-y-4">
            {filteredSessions.map((session, index) => {
              const isExpanded = !!expandedSessions[session.id];
              const isBreak = session.category === 'break' || session.category === 'networking';

              return (
                <div
                  key={session.id}
                  className={`relative flex items-start gap-4 sm:gap-6 rounded-2xl transition-all duration-200 ${
                    isBreak
                      ? 'bg-white/[0.02] border border-white/5 p-4 sm:p-5'
                      : 'glass-panel-dark border border-white/10 hover:border-white/20 p-5 sm:p-6 shadow-lg'
                  }`}
                >
                  {/* Timeline Node Bullet */}
                  <div className="relative z-10 shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-[#07101F] border-2 border-[#2F6296] flex items-center justify-center shadow-lg shadow-[#2F6296]/30">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#D61356]" />
                    </div>
                  </div>

                  {/* Time Badge (Desktop Column) */}
                  <div className="hidden sm:block shrink-0 w-24 pt-1 font-mono text-xs font-bold text-slate-300 tabular-nums">
                    {session.time}
                  </div>

                  {/* Session Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {/* Mobile Time */}
                      <span className="sm:hidden font-mono text-xs font-bold text-slate-300 mr-2">
                        {session.time}
                      </span>

                      {/* Pill Badge */}
                      <span
                        className={`text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full border ${getTagColor(
                          session.tag
                        )}`}
                      >
                        {session.tag}
                      </span>

                      {session.strategicTrack && (
                        <span className="text-[11px] font-mono text-slate-400">
                          {session.strategicTrack}
                        </span>
                      )}
                    </div>

                    <div className="flex items-start justify-between gap-4 cursor-pointer" onClick={() => toggleExpand(session.id)}>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                        {session.title}
                      </h3>
                      <button
                        className="p-1 text-slate-400 hover:text-white transition-colors"
                        aria-label="Toggle Session Details"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-white/5 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal animate-fade-in">
                        <p>{session.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Agenda Banner sign-off from Page 2 */}
        <div className="max-w-4xl mx-auto mt-16 p-6 rounded-2xl bg-gradient-to-r from-[#2F6296] via-[#102444] to-[#D61356] border border-white/20 text-center shadow-2xl">
          <div className="font-mono text-xs font-bold tracking-widest text-pink-200 uppercase mb-1">
            Congress Action Mandate
          </div>
          <div className="text-base sm:text-xl font-extrabold text-white tracking-wide">
            {EVENT_DETAILS.actionCallout}
          </div>
        </div>
      </div>
    </section>
  );
};
