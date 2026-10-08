import React, { useState } from 'react';
import { BmicLogo } from './BmicLogo';
import { HeaderDots } from './HeaderDots';
import { EVENT_DETAILS } from '../data/bmicContent';
import { Phone, Globe, MapPin, Calendar, ArrowUp, Send, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#07101F] text-slate-400 border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Column 1: Brand & Logo */}
          <div className="lg:col-span-4 space-y-4">
            <BmicLogo theme="dark" size="md" />
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm mt-4">
              Botswana’s flagship technology &amp; communications congress. Moving from strategy to implementation, investment and measurable outcomes.
            </p>
            <div className="text-xs font-mono text-slate-400">
              ONE DAY. ONE NATIONAL DIGITAL CONVERSATION. ONE ACTION AGENDA.
            </div>
            <div className="pt-2 text-xs text-slate-300 space-y-1">
              <div>Organised by: <span className="text-white font-semibold">{EVENT_DETAILS.organiser}</span></div>
              <div>Empowered by: <span className="text-white font-semibold">{EVENT_DETAILS.empoweredBy}</span></div>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-white font-bold">
              Congress
            </div>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  Theme &amp; Thesis
                </a>
              </li>
              <li>
                <a href="#speakers" className="hover:text-white transition-colors">
                  Who Will Be In The Room
                </a>
              </li>
              <li>
                <a href="#agenda" className="hover:text-white transition-colors">
                  Programme Schedule
                </a>
              </li>
              <li>
                <a href="#deliverables" className="hover:text-white transition-colors">
                  Deliverables &amp; Outcomes
                </a>
              </li>
              <li>
                <a href="#passes" className="hover:text-white transition-colors">
                  Corporate Rate Card
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Logistics & Secretariat */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-white font-bold">
              Secretariat Info
            </div>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-[#D61356] shrink-0" />
                <span>Friday, 30 October 2026</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D61356] shrink-0 mt-0.5" />
                <span>Royal Aria Conference Centre, Gaborone</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#2F6296] shrink-0" />
                <a href="tel:+26773953199" className="font-mono hover:text-white transition-colors">
                  {EVENT_DETAILS.enquiriesPhone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-[#2F6296] shrink-0" />
                <a href={`mailto:${EVENT_DETAILS.contactEmail}`} className="font-mono hover:text-white transition-colors">
                  {EVENT_DETAILS.contactEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter Signup */}
          <div className="lg:col-span-3 space-y-4">
            <div className="text-xs font-mono uppercase tracking-widest text-white font-bold">
              Communique Dispatch
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Subscribe to receive the post-congress BMIC 2026 Communique and investor briefs.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Subscribed for Communique updates.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter official email..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#D61356]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-gradient-to-r from-[#2F6296] to-[#D61356] text-white rounded-lg text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center"
                    aria-label="Subscribe"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  No marketing spam. Only official policy &amp; delegate notices.
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; 2026 Botswana Mobile &amp; Internet Congress (BMIC). Organised by Continental Media Group. All rights reserved.
          </div>
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors py-1 px-3 rounded-lg hover:bg-white/5"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
