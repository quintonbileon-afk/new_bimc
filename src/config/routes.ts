/**
 * BMIC 2026 Navigation Routes and Link Targets
 * Centralized configuration object for easily swappable links
 */
export const NAV_ROUTES = {
  home: '/',
  theme: '#theme',
  programme: '/programme',
  attendees: '#attendees',
  venue: '#venue',
  tickets: '#tickets',
  register: '#register',
  exhibitions: '#exhibitions',
  sponsorship: '#sponsorship',
} as const;

export type NavRouteKey = keyof typeof NAV_ROUTES;
