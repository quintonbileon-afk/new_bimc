import React, { useState } from 'react';
import { AGENDA_SESSIONS, EVENT_DETAILS } from '../data/bmicContent';
import { NAV_ROUTES } from '../config/routes';
import {
  ArrowLeft,
  Calendar,
  Search,
  ChevronDown,
  MapPin,
  Clock,
  Sparkles,
  Ticket,
  Building,
  CheckCircle2,
  Users,
  Share2,
} from 'lucide-react';

interface ProgrammePageProps {
  onNavigateHome: (targetAnchor?: string) => void;
  onOpenRegister: (tier?: string) => void;
  onOpenFreePass: () => void;
  onDownloadIcs: () => void;
  onSelectNavTab?: (tab: 'delegates' | 'exhibition' | 'partnerships') => void;
}

export const ProgrammePage: React.FC<ProgrammePageProps> = ({
  onNavigateHome,
  onOpenRegister,
  onOpenFreePass,
  onDownloadIcs,
  onSelectNavTab,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'morning' | 'afternoon'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSessions, setExpandedSessions] = useState<Record<string, boolean>>({});
  const [copiedShare, setCopiedShare] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedSessions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 3000);
    }
  };

  const filteredSessions = AGENDA_SESSIONS.filter((session) => {
    const matchesSearch =
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.time.includes(searchQuery) ||
      session.tag.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeTab === 'morning' && session.period !== 'morning') return false;
    if (activeTab === 'afternoon' && session.period !== 'afternoon') return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-[#0b1630] text-[#b6c2dc] flex flex-col font-sans selection:bg-[#d81b60] selection:text-white">


      {/* 2. Page Hero Banner */}
      <section className="relative pt-8 pb-10 lg:pt-10 lg:pb-12 bg-radial-[900px_420px_at_20%_0] from-[#5aa9e6]/10 to-transparent border-b border-[#26365a]">
        <div className="bmic-wrap wrap">

          <div className="max-w-4xl">
            {/* Pill */}
            <div className="bmic-pill pill mb-5">
              30 OCTOBER 2026 &nbsp;·&nbsp; ROYAL ARIA CONFERENCE CENTRE, GABORONE
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08] mb-5 font-sans">
              CONGRESS <span className="text-[#d81b60]">PROGRAMME</span> &amp; TIMELINE
            </h1>





            {/* Hero Quick Action Strip */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">


              <button
                onClick={onOpenFreePass}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#d81b60] to-[#c2185b] hover:from-[#f0467f] hover:to-[#d81b60] transition-all cursor-pointer shadow-sm"
              >
                <Ticket className="w-4 h-4 text-white" />
                <span>Get Free Exhibition Pass</span>
              </button>

              <button
                onClick={() => onOpenRegister()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
              >
                <span>Register Delegate Pass &rarr;</span>
              </button>


            </div>
          </div>
        </div>
      </section>

      {/* Filter & Search Controls */}
      <section className="py-6 bg-[#0b1630]">
        <div className="bmic-wrap wrap">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            {/* Period Segment Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-[#d81b60] text-white shadow-sm'
                    : 'bg-[#101f3f] text-[#b6c2dc] hover:text-white border border-[#26365a]'
                }`}
              >
                All Sessions ({AGENDA_SESSIONS.length})
              </button>
              <button
                onClick={() => setActiveTab('morning')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'morning'
                    ? 'bg-[#d81b60] text-white shadow-sm'
                    : 'bg-[#101f3f] text-[#b6c2dc] hover:text-white border border-[#26365a]'
                }`}
              >
                Morning Plenary (08:00 - 12:30)
              </button>
              <button
                onClick={() => setActiveTab('afternoon')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'afternoon'
                    ? 'bg-[#d81b60] text-white shadow-sm'
                    : 'bg-[#101f3f] text-[#b6c2dc] hover:text-white border border-[#26365a]'
                }`}
              >
                Afternoon Growth (13:30 - 18:30)
              </button>
            </div>

            {/* Instant Search Bar */}
            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 text-[#b6c2dc] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search agenda by topic or time..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-[#101f3f] border border-[#26365a] rounded-full text-white placeholder-[#b6c2dc]/70 focus:outline-none focus:border-[#5aa9e6] transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Detailed Interactive Agenda Timeline */}
      <section className="flex-1 pb-16">
        <div className="bmic-wrap wrap">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-16 bg-[#101f3f] rounded-2xl border border-[#26365a] p-8">
              <Calendar className="w-10 h-10 text-[#5aa9e6] mx-auto mb-3 opacity-60" />
              <h3 className="text-lg font-bold text-white mb-1">No sessions match your filter</h3>
              <p className="text-sm text-[#b6c2dc] mb-4">Try clearing your search query or choosing another track.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveTab('all');
                }}
                className="px-4 py-2 bg-[#d81b60] text-white rounded-full text-xs font-semibold cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredSessions.map((session) => {
                const isExpanded = !!expandedSessions[session.id];
                const isBreak = session.category === 'break' || session.category === 'networking';

                return (
                  <div
                    key={session.id}
                    className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                      isBreak
                        ? 'bg-[#0e1a38]/80 border-[#26365a]/80'
                        : isExpanded
                        ? 'bg-[#12244a] border-[#5aa9e6]/50 shadow-md'
                        : 'bg-[#101f3f] border-[#26365a] hover:border-[#5aa9e6]/30'
                    }`}
                  >
                    <div
                      onClick={() => toggleExpand(session.id)}
                      className="py-2.5 px-3.5 sm:py-3 sm:px-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4"
                    >
                      {/* Left: Time & Location */}
                      <div className="sm:w-36 shrink-0 flex sm:flex-col items-center sm:items-start justify-between">
                        <span className="font-mono text-xs sm:text-sm font-bold text-white tabular-nums tracking-tight">
                          {session.time}
                        </span>
                        <div className="inline-flex items-center gap-1 text-[11px] text-[#5aa9e6] font-medium font-mono sm:mt-0.5">
                          <MapPin className="w-2.5 h-2.5 shrink-0" />
                          <span className="truncate">
                            {session.category === 'break' || session.category === 'networking'
                              ? 'Networking Foyer'
                              : session.period === 'morning'
                              ? 'Plenary Hall'
                              : 'Executive Chamber'}
                          </span>
                        </div>
                      </div>

                      {/* Middle: Title, Tag & Description */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-snug">
                            {session.title}
                          </h3>
                          <span
                            className={`font-mono text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-full ${
                              session.category === 'keynote'
                                ? 'bg-[#d81b60]/20 text-[#f0467f] border border-[#d81b60]/40'
                                : session.category === 'panel'
                                ? 'bg-[#5aa9e6]/20 text-[#5aa9e6] border border-[#5aa9e6]/40'
                                : 'bg-white/10 text-white/80'
                            }`}
                          >
                            {session.tag}
                          </span>
                        </div>

                        <p className="text-xs text-[#b6c2dc] mt-0.5 leading-relaxed">
                          {session.description}
                        </p>
                      </div>

                      {/* Right: Expand Indicator */}
                      <div className="shrink-0 flex items-center justify-end sm:w-6">
                        <span
                          className={`p-1 rounded-full bg-white/[0.04] text-[#b6c2dc] hover:text-white transition-transform duration-200 ${
                            isExpanded ? 'rotate-180 text-[#5aa9e6] bg-[#5aa9e6]/10' : ''
                          }`}
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>

                    {/* Expanded Content Details */}
                    {isExpanded && (
                      <div className="px-3.5 sm:px-4 pb-3.5 pt-2 border-t border-[#26365a] bg-black/20 text-xs text-[#b6c2dc] space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="p-3 rounded-lg bg-[#0b1630] border border-[#26365a]">
                            <h4 className="text-[11px] font-bold text-white uppercase tracking-wider font-mono mb-1 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              Strategic Deliverable
                            </h4>
                            <p className="text-xs text-[#b6c2dc] leading-relaxed">
                              Outputs will feed directly into the BMIC 2026 National ICT Accord and Ministerial Policy Whitepaper.
                            </p>
                          </div>

                          <div className="p-3 rounded-lg bg-[#0b1630] border border-[#26365a]">
                            <h4 className="text-[11px] font-bold text-white uppercase tracking-wider font-mono mb-1 flex items-center gap-1.5">
                              <Users className="w-3 h-3 text-[#5aa9e6]" />
                              Target Stakeholders
                            </h4>
                            <p className="text-xs text-[#b6c2dc] leading-relaxed">
                              Policy executives, telecommunication leaders, venture capital partners, and enterprise builders.
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                          <div className="flex items-center gap-1.5 text-xs text-[#b6c2dc]">
                            <Clock className="w-3 h-3 text-[#5aa9e6]" />
                            <span>Duration: 45 - 60 minutes · Q&amp;A included</span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDownloadIcs();
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white bg-[#5aa9e6]/20 border border-[#5aa9e6]/40 hover:bg-[#5aa9e6]/30 transition-colors cursor-pointer"
                          >
                            <Calendar className="w-3 h-3 text-[#5aa9e6]" />
                            <span>Add Session to Calendar</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 6. Bottom Conversion / Return CTA Banner */}
      <section className="py-10 bg-gradient-to-b from-[#101f3f] to-[#0b1630] border-t border-[#26365a]">
        <div className="bmic-wrap wrap text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-[#d81b60]/10 border border-[#d81b60]/30 text-[#f0467f] text-xs font-bold font-mono">
            SECURE YOUR CONGRESS ACCESS
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3 font-sans">
            Ready to Attend BMIC 2026?
          </h2>
          <p className="text-sm sm:text-base text-[#b6c2dc] leading-relaxed mb-8">
            Choose between claiming a Complimentary Exhibition Floor Pass or securing an Executive Delegate Pass
            with full access to all 15 sessions, luncheons, and private deal chambers.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenFreePass}
              className="px-6 py-3 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#d81b60] to-[#c2185b] hover:from-[#f0467f] hover:to-[#d81b60] transition-all cursor-pointer shadow-lg"
            >
              Get Free Exhibition Pass &rarr;
            </button>

            <button
              onClick={() => onOpenRegister()}
              className="px-6 py-3 rounded-full text-sm font-bold text-white bg-[#101f3f] border border-[#5aa9e6] hover:bg-[#162a56] transition-all cursor-pointer shadow-md"
            >
              Register Delegate Pass
            </button>

            <button
              onClick={() => onNavigateHome()}
              className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full text-sm font-semibold text-[#b6c2dc] hover:text-white bg-transparent border border-[#26365a] hover:border-white/30 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Main Page</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
