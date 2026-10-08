import React, { useState, useEffect } from 'react';
import { BmicLogo } from './BmicLogo';
import { Menu, X, Calendar, ArrowRight, Phone, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenRegister: (tier?: string) => void;
  onDownloadIcs: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenRegister, onDownloadIcs }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Theme', href: '#about' },
    { label: 'Attendees', href: '#speakers' },
    { label: 'Programme', href: '#agenda' },
    { label: 'Deliverables', href: '#deliverables' },
    { label: 'Partners', href: '#partners' },
    { label: 'Venue', href: '#venue' },
    { label: 'Rate Card', href: '#passes' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'py-2.5 bg-[#07101F]/80 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/40'
            : 'py-5 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Zone 1: Logo */}
            <a
              href="#"
              className="flex items-center group outline-none focus-visible:ring-2 focus-visible:ring-[#2F6296] rounded-xl transition-transform hover:scale-[1.02]"
              aria-label="BMIC 2026 Home"
            >
              <BmicLogo size="sm" theme="dark" />
            </a>

            {/* Zone 2: Navigation Links (Desktop) */}
            <nav className="hidden lg:flex items-center gap-7 px-5 py-2 rounded-full glass-panel-dark border border-white/5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-xs font-medium text-slate-300 hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-[#2F6296] after:to-[#D61356] after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Zone 3: Actions */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={onDownloadIcs}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded-xl border border-white/10 transition-colors"
                title="Add BMIC 2026 to Calendar"
              >
                <Calendar className="w-3.5 h-3.5 text-[#D61356]" />
                <span className="whitespace-nowrap">Save Date</span>
              </button>

              <button
                onClick={() => onOpenRegister()}
                className="relative group overflow-hidden px-4.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#2F6296] via-[#853C77] to-[#D61356] shadow-lg shadow-[#D61356]/20 hover:shadow-[#D61356]/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <span>Register Now</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => onOpenRegister()}
                className="sm:hidden px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#2F6296] to-[#D61356] rounded-lg"
              >
                Register
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-300 hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6296]"
                aria-label="Toggle Mobile Navigation"
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-Screen Animated Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#07101F]/95 backdrop-blur-2xl flex flex-col justify-between pt-24 pb-8 px-6 lg:hidden animate-fade-in">
          <div className="flex flex-col space-y-4">
            <div className="text-xs uppercase tracking-[0.2em] font-mono text-slate-400 mb-2">
              Navigation
            </div>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xl font-bold text-slate-100 hover:text-[#D61356] transition-colors py-1 flex items-center justify-between border-b border-white/5"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </a>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRegister();
              }}
              className="w-full py-3.5 px-4 text-sm font-bold text-white bg-gradient-to-r from-[#2F6296] to-[#D61356] rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#D61356]/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Register for BMIC 2026</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onDownloadIcs();
              }}
              className="w-full py-3 px-4 text-xs font-semibold text-slate-300 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#D61356]" />
              <span>Add to Calendar (30 Oct 2026)</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-2">
              <Phone className="w-3.5 h-3.5 text-[#2F6296]" />
              <span>Enquiries: +267 71 843 386</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
