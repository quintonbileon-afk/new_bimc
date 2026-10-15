import React, { useState, useEffect, useRef } from 'react';
import { BmicLogo } from './BmicLogo';
import { NAV_ROUTES } from '../config/routes';

interface NavbarProps {
  onOpenRegister: (tier?: string) => void;
  onDownloadIcs?: () => void;
  onSelectNavTab?: (tab: 'delegates' | 'exhibition' | 'partnerships' | 'rate-card-table') => void;
  currentPage?: 'home' | 'programme';
  onNavigateHome?: (targetAnchor?: string) => void;
  onNavigateProgramme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenRegister,
  onSelectNavTab,
  currentPage = 'home',
  onNavigateHome,
  onNavigateProgramme,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [attendOpen, setAttendOpen] = useState(false);
  const [ticketsOpen, setTicketsOpen] = useState(false);
  const [sponsorOpen, setSponsorOpen] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const attendRef = useRef<HTMLLIElement>(null);
  const ticketsRef = useRef<HTMLLIElement>(null);
  const sponsorRef = useRef<HTMLLIElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (attendRef.current && !attendRef.current.contains(target)) {
        setAttendOpen(false);
        setTicketsOpen(false);
      }
      if (sponsorRef.current && !sponsorRef.current.contains(target)) {
        setSponsorOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close dropdowns on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAttendOpen(false);
        setTicketsOpen(false);
        setSponsorOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll on mobile when menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();

    setMobileOpen(false);
    setAttendOpen(false);
    setTicketsOpen(false);
    setSponsorOpen(false);

    // If programme link is clicked
    if (href === NAV_ROUTES.programme) {
      if (onNavigateProgramme) {
        onNavigateProgramme();
      } else {
        window.location.href = '/programme';
      }
      return;
    }

    // If currently on programme page, navigate back to home with the target anchor
    if (currentPage === 'programme' && onNavigateHome) {
      if (href === NAV_ROUTES.tickets && onSelectNavTab) {
        onSelectNavTab('delegates');
      } else if (href === NAV_ROUTES.exhibitions && onSelectNavTab) {
        onSelectNavTab('exhibition');
      } else if (href === NAV_ROUTES.sponsorship && onSelectNavTab) {
        onSelectNavTab('partnerships');
      }
      onNavigateHome(href);
      return;
    }

    // On home page: activate tab if ticket/exhibition/sponsor
    if (href === NAV_ROUTES.tickets && onSelectNavTab) {
      onSelectNavTab('delegates');
    } else if (href === NAV_ROUTES.exhibitions && onSelectNavTab) {
      onSelectNavTab('exhibition');
    } else if (href === NAV_ROUTES.sponsorship && onSelectNavTab) {
      onSelectNavTab('partnerships');
    }

    const targetId = href.replace('#', '');
    const el =
      document.getElementById(targetId) ||
      (href === NAV_ROUTES.tickets || href === NAV_ROUTES.exhibitions || href === NAV_ROUTES.sponsorship
        ? document.getElementById('passes')
        : null);

    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      try {
        window.history.pushState(null, '', href);
      } catch {
        window.location.hash = href;
      }
    }
  };

  return (
    <header className="bmic-bar bar">
      <div className="bmic-wrap wrap">
        {/* Logo */}
        <a
          className="logo flex items-center cursor-pointer"
          href="/"
          aria-label="Botswana Mobile &amp; Internet Congress"
          onClick={(e) => {
            e.preventDefault();
            if (onNavigateHome) {
              onNavigateHome();
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          <BmicLogo size="sm" />
        </a>

        {/* Navigation */}
        <nav
          id="nav"
          ref={navRef}
          className={`bmic-nav ${mobileOpen ? 'open' : ''}`}
          aria-label="Main"
        >
          <ul className="bmic-menu menu">
            <li>
              <a href={NAV_ROUTES.theme} onClick={(e) => handleLinkClick(e, NAV_ROUTES.theme)}>
                Theme
              </a>
            </li>
            <li>
              <a
                href={NAV_ROUTES.programme}
                className={currentPage === 'programme' ? 'text-[#f0467f] font-bold' : ''}
                onClick={(e) => handleLinkClick(e, NAV_ROUTES.programme)}
              >
                Programme
              </a>
            </li>

            {/* Attend Dropdown */}
            <li
              ref={attendRef}
              className={`has-sub ${attendOpen ? 'open' : ''}`}
            >
              <button
                type="button"
                aria-expanded={attendOpen}
                aria-haspopup="true"
                onClick={(e) => {
                  e.stopPropagation();
                  setAttendOpen(!attendOpen);
                  setSponsorOpen(false);
                }}
              >
                Attend <span className="bmic-caret caret" aria-hidden="true" />
              </button>
              <ul className="bmic-sub sub">
                <li>
                  <a href={NAV_ROUTES.attendees} onClick={(e) => handleLinkClick(e, NAV_ROUTES.attendees)}>
                    Attendees
                  </a>
                </li>
                <li>
                  <a href={NAV_ROUTES.venue} onClick={(e) => handleLinkClick(e, NAV_ROUTES.venue)}>
                    Venue
                  </a>
                </li>

                {/* Sub2: Tickets flyout */}
                <li
                  ref={ticketsRef}
                  className={`sub2 bmic-sub2 ${ticketsOpen ? 'open' : ''}`}
                >
                  <button
                    type="button"
                    aria-expanded={ticketsOpen}
                    aria-haspopup="true"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTicketsOpen(!ticketsOpen);
                    }}
                  >
                    Tickets
                  </button>
                  <ul className="bmic-sub sub">
                    <li>
                      <a href={NAV_ROUTES.tickets} onClick={(e) => handleLinkClick(e, NAV_ROUTES.tickets)}>
                        Tickets
                      </a>
                    </li>
                    <li>
                      <a
                        href={NAV_ROUTES.register}
                        onClick={(e) => {
                          e.preventDefault();
                          setMobileOpen(false);
                          setAttendOpen(false);
                          setTicketsOpen(false);
                          setSponsorOpen(false);
                          onOpenRegister();
                        }}
                      >
                        Register
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>

            {/* Exhibit/Sponsor Dropdown */}
            <li
              ref={sponsorRef}
              className={`has-sub ${sponsorOpen ? 'open' : ''}`}
            >
              <button
                type="button"
                aria-expanded={sponsorOpen}
                aria-haspopup="true"
                onClick={(e) => {
                  e.stopPropagation();
                  setSponsorOpen(!sponsorOpen);
                  setAttendOpen(false);
                  setTicketsOpen(false);
                }}
              >
                Exhibit/Sponsor <span className="bmic-caret caret" aria-hidden="true" />
              </button>
              <ul className="bmic-sub sub">
                <li>
                  <a href={NAV_ROUTES.exhibitions} onClick={(e) => handleLinkClick(e, NAV_ROUTES.exhibitions)}>
                    Exhibitions
                  </a>
                </li>
                <li>
                  <a href={NAV_ROUTES.sponsorship} onClick={(e) => handleLinkClick(e, NAV_ROUTES.sponsorship)}>
                    Sponsorship
                  </a>
                </li>
              </ul>
            </li>

            {/* Mobile-only Back to Main Page when on Programme */}
            {currentPage === 'programme' && (
              <li className="lg:hidden mt-2 pt-2 border-t border-[#26365a]">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onNavigateHome?.();
                  }}
                  className="w-full text-left font-bold text-[#5aa9e6] flex items-center gap-2 py-3 px-1"
                >
                  &larr; Back to Main Page
                </button>
              </li>
            )}
          </ul>
        </nav>

        {/* Right CTA Button (Hidden on Mobile) */}
        <a
          className="bmic-btn btn sm"
          href={NAV_ROUTES.register}
          onClick={(e) => {
            e.preventDefault();
            onOpenRegister();
          }}
        >
          Register
        </a>

        {/* Mobile Hamburger Button */}
        <button
          className="bmic-burger burger"
          id="burger"
          type="button"
          aria-label="Menu"
          aria-expanded={mobileOpen}
          aria-controls="nav"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
};
