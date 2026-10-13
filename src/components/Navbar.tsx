import React, { useState, useEffect } from 'react';
import { BmicLogo } from './BmicLogo';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenRegister: (tier?: string) => void;
  onDownloadIcs?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenRegister }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  // Max 5 links
  const navLinks = [
    { label: 'Theme', href: '#about' },
    { label: 'Programme', href: '#agenda' },
    { label: 'Attendees', href: '#speakers' },
    { label: 'Venue', href: '#venue' },
    { label: 'Rate Card', href: '#passes' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'py-3.5 bg-[#0A1428]/90 backdrop-blur-md border-b border-white/[0.08] shadow-lg'
            : 'py-5 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              href="#"
              className="flex items-center outline-none focus-visible:ring-2 focus-visible:ring-[#2F6DB5] rounded-lg"
              aria-label="BMIC 2026 Home"
            >
              <BmicLogo size="sm" theme="dark" />
            </a>

            {/* Desktop Navigation Links (Max 5) */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-xs font-medium text-[#B8C2D6] hover:text-white transition-colors py-1"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* One Magenta CTA Button */}
            <div className="hidden md:flex items-center">
              <button
                onClick={() => onOpenRegister()}
                className="btn-cta-magenta px-5 py-2.5 rounded-full text-xs font-semibold text-white cursor-pointer"
              >
                Register
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-3 md:hidden">
              <button
                onClick={() => onOpenRegister()}
                className="btn-cta-magenta px-4 py-2 text-xs font-semibold text-white rounded-full"
              >
                Register
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#B8C2D6] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6DB5] rounded-lg"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0A1428] flex flex-col justify-between pt-24 pb-8 px-6 md:hidden animate-fade-in">
          <div className="flex flex-col space-y-4">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-2 font-medium">
              Navigation
            </div>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-semibold text-white hover:text-[#D81B60] transition-colors py-2 border-b border-white/5"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRegister();
              }}
              className="w-full py-3.5 px-4 text-sm font-semibold text-white bg-[#D81B60] rounded-full text-center"
            >
              Register for BMIC 2026
            </button>
          </div>
        </div>
      )}
    </>
  );
};
