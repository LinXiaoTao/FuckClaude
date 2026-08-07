/**
 * Google Analytics click tracking for outbound promo links.
 *
 * Any element carrying `data-ga-event` (sponsor banners, domestic-model
 * cards, …) reports a GA4 event on click, e.g.:
 *   <a data-ga-event="sponsor_click" data-ga-id="roxy" href="…">
 * fires `sponsor_click` with { link_id, link_url, page_lang }.
 *
 * gtag.js is loaded in BaseLayout's <head>; if it is blocked (ad blocker),
 * clicks simply pass through untracked.
 */

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

function onClick(event: MouseEvent) {
  const el = (event.target as Element | null)?.closest<HTMLElement>('[data-ga-event]');
  if (!el || typeof window.gtag !== 'function') return;

  const name = el.dataset.gaEvent;
  if (!name) return;

  window.gtag('event', name, {
    link_id: el.dataset.gaId ?? '(unknown)',
    link_url: el instanceof HTMLAnchorElement ? el.href : '',
    page_lang: document.documentElement.lang || 'en',
    transport_type: 'beacon',
  });
}

document.addEventListener('click', onClick);

export {};
