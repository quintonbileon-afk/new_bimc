import React, { useState } from 'react';
import { BmicLogo } from './BmicLogo';
import { EVENT_DETAILS } from '../data/bmicContent';
import { Phone, Mail, MapPin, Calendar, ArrowUp, Send, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
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
    <footer className="bg-[#0A1428] text-[#B8C2D6] border-t border-white/[0.08] relative">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/[0.08]">
          {/* Column 1: Brand & Logo */}
          <div className="lg:col-span-4 space-y-4">
            <BmicLogo theme="dark" size="sm" />
            <p className="text-xs text-[#B8C2D6] leading-relaxed max-w-sm mt-4 font-normal">
              Botswana’s flagship technology &amp; communications congress. Moving from policy to implementation, investment, and measurable outcomes.
            </p>
            <div className="font-mono text-[11px] text-slate-400">
              30 October 2026 · Royal Aria Conference Centre, Gaborone
            </div>
            <div className="pt-2 text-xs text-[#B8C2D6] space-y-1">
              <div>Organised by: <span className="text-white font-semibold">{EVENT_DETAILS.organiser}</span></div>
              <div>Empowered by: <span className="text-white font-semibold">{EVENT_DETAILS.empoweredBy}</span></div>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <div className="font-mono text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Congress
            </div>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#about" className="text-[#B8C2D6] hover:text-white transition-colors">
                  Theme &amp; Thesis
                </a>
              </li>
              <li>
                <a href="#speakers" className="text-[#B8C2D6] hover:text-white transition-colors">
                  Delegation
                </a>
              </li>
              <li>
                <a href="#agenda" className="text-[#B8C2D6] hover:text-white transition-colors">
                  Programme
                </a>
              </li>
              <li>
                <a href="#deliverables" className="text-[#B8C2D6] hover:text-white transition-colors">
                  Deliverables
                </a>
              </li>
              <li>
                <a href="#passes" className="text-[#B8C2D6] hover:text-white transition-colors">
                  Rate Card &amp; Passes
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Logistics & Secretariat */}
          <div className="lg:col-span-3 space-y-3">
            <div className="font-mono text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Secretariat
            </div>
            <div className="space-y-3 text-xs text-[#B8C2D6]">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-[#2F6DB5] shrink-0" />
                <span className="font-mono text-[11px]">Friday, 30 October 2026</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#2F6DB5] shrink-0 mt-0.5" />
                <span>Royal Aria Conference Centre, Gaborone</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#2F6DB5] shrink-0" />
                <a href="tel:+26773953199" className="font-mono text-[11px] hover:text-white transition-colors">
                  {EVENT_DETAILS.enquiriesPhone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#2F6DB5] shrink-0" />
                <a href={`mailto:${EVENT_DETAILS.contactEmail}`} className="hover:text-white transition-colors">
                  {EVENT_DETAILS.contactEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter Signup */}
          <div className="lg:col-span-3 space-y-4">
            <div className="font-mono text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Communique Dispatch
            </div>
            <p className="text-xs text-[#B8C2D6] leading-relaxed font-normal">
              Subscribe to receive the post-congress BMIC 2026 Communique and executive briefs.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-[12px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Subscribed for Communique notices.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Official email address..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#0E1C38] border border-white/[0.08] rounded-full text-white placeholder-slate-400 focus:outline-none focus:border-[#2F6DB5] transition-colors"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-3.5 btn-cta-magenta text-white rounded-full text-xs font-semibold flex items-center justify-center cursor-pointer"
                    aria-label="Subscribe"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="font-mono text-[10px] text-slate-400">
                  Official policy &amp; delegate communique notifications only.
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#B8C2D6]">
          <div className="flex items-center gap-2">
            <span>&copy; 2026 Botswana Mobile &amp; Internet Congress (BMIC). Organised by Continental Media Group. All rights reserved.</span>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="opacity-20 hover:opacity-100 transition-opacity p-0.5 rounded text-[#B8C2D6] hover:text-white cursor-pointer"
                title="Secretariat Administration (Ctrl+Shift+A)"
                aria-label="Secretariat Console"
              >
                ·
              </button>
            )}
          </div>
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-[#B8C2D6] hover:text-white transition-colors py-1 px-3 rounded-lg cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
