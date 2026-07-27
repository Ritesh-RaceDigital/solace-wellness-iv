/* ══════════════════════════════════════════════════════════════════════
   Solace Wellness IV - global site chrome (header + footer)
   Single source of truth for every page's markup + behavior. To change
   nav links, the logo, contact info, or button copy, edit ONLY this file
   (and site-chrome.css for styling) - every page picks it up automatically,
   at every viewport width (mobile, tablet, desktop).

   Usage on any page:
     <link rel="stylesheet" href="./solace/site-chrome.css">
     <script src="./solace/site-chrome.js"></script>
     ...
     <solace-header current="home"></solace-header>
     ...page content...
     <solace-footer></solace-footer>

   Attribute on <solace-header>:
     current - the page currently being viewed: "home" | "about" (add new
               keys to PAGES below as new pages are added). Its own nav
               item (if any) is left out of that page's nav.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  // Add an entry here for every page on the site.
  const PAGES = {
    home: 'Solace Wellness IV.dc.html',
    about: 'Solace Wellness IV - About Us.dc.html',
    wellnessIvTherapy: 'Solace Wellness IV - Wellness IV Therapy.dc.html',
  };

  const PHONE_DISPLAY = '(702) 526-6763';
  const PHONE_HREF = 'tel:+17025266763';

  // Categories/subcategories shown in the "Treatments" nav dropdown. Most of
  // these are a navigational menu only - no dedicated page exists yet, so
  // they render as plain labels, not links. "Wellness IV Therapy" is the
  // exception: it has its own page (PAGES.wellnessIvTherapy), so its
  // category name renders as a real link (see `href` below and how
  // treatmentDropdownHtml() uses it).
  const TREATMENT_MENU = [
    { name: 'Energy Therapy', items: ['MetaboFusion IV', 'Energy Boost IV', 'Brain Fog IV', 'Fatigue Recovery IV'] },
    { name: 'Beauty Therapy', items: ['Flawless Fusion', 'Glutathione Therapy', 'Beauty Drip', 'Skin Brightening IV'] },
    { name: 'NAD+ Therapy', items: ['NAD+ 250mg', 'NAD+ 500mg', 'Cellular Repair', 'Healthy Aging'] },
    { name: 'Vitamin Injections', items: ['Vitamin B12', 'Glutathione', 'Vitamin D3'] },
    { name: 'Wellness IV Therapy', href: PAGES.wellnessIvTherapy, items: ['Myers Miracle Drip', 'Solace RevitaDrip', 'Wellness Hydration IV', 'Vitamin IV Therapy'] },
    { name: 'Recovery IV Therapy', items: ['Morning After Martini', 'JetSet Revival IV', 'Flawless Fusion', 'Athletic Recovery IV'] },
    { name: 'Immune Therapy', items: ['ImmunoShield IV', 'Vitamin C IV', 'Immune Boost Therapy', 'Seasonal Wellness IV'] },
  ];

  // Add/remove/reorder nav items here - every page using <solace-header>
  // picks up the change automatically. The current page's own item is
  // left out of its own nav.
  const NAV_ITEMS = [
    { key: 'treatments', label: 'Treatments', type: 'dropdown', menu: TREATMENT_MENU },
    { key: 'about', label: 'About', type: 'page' },
    { key: 'process', label: 'How It Works', type: 'hash', hash: '#process' },
    { key: 'reviews', label: 'Reviews', type: 'hash', hash: '#reviews' },
    { key: 'contact', label: 'Contact', type: 'hash', hash: '#book' },
  ];

  function hrefFor(item, current) {
    if (item.type === 'page') return PAGES[item.key] || '#';
    return current === 'home' ? item.hash : PAGES.home + item.hash;
  }

  function bookHref(current) {
    return current === 'home' ? '#book' : PAGES.home + '#book';
  }

  function escapeAttr(str) {
    return String(str).replace(/"/g, '&quot;');
  }

  function treatmentDropdownHtml(item) {
    const cols = item.menu.map((cat) => `
      <div class="gh-drop-col">
        ${cat.href
          ? `<h4><a href="${escapeAttr(cat.href)}" class="gh-drop-cat-link">${cat.name}</a></h4>`
          : `<h4>${cat.name}</h4>`}
        <ul class="gh-drop-list">${cat.items.map((i) => `<li>${i}</li>`).join('')}</ul>
      </div>
    `).join('');
    return `
      <div class="gh-nav-drop">
        <button type="button" class="gh-nav-drop-toggle" aria-expanded="false" aria-haspopup="true">
          ${item.label}
          <svg class="gh-caret" viewBox="0 0 10 6" width="10" height="6" aria-hidden="true">
            <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <div class="gh-nav-drop-panel">${cols}</div>
      </div>
    `;
  }

  function phoneIconSvg() {
    return '<svg class="gh-ic" viewBox="0 0 16 16" fill="currentColor" width="16" height="16" aria-hidden="true">'
      + '<path d="M4.4 1.6 6.7 2 7.4 4.7 5.9 6.2c.6 1.4 1.7 2.5 3.1 3.1l1.5-1.5 2.7.7.4 2.3c0 .9-.7 1.6-1.6 1.6C6.9 12.4 3.6 9.1 3.6 4.6c0-.9.7-1.6 1.6-1.6z" /></svg>';
  }

  // Host apps here (the Figma-exported dc-runtime/React tree) own and
  // periodically re-render the light DOM. Injecting markup via light-DOM
  // innerHTML fights that owner's reconciler (it expects the element it
  // created to stay empty) and crashes with DOM NotFoundError. Rendering
  // into a shadow root keeps our markup invisible to that reconciler.
  class SolaceHeader extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
      const current = this.getAttribute('current') || 'home';
      const book = bookHref(current);

      // Every page shows the full nav, unfiltered - a single global header
      // must look identical everywhere, including which links it lists.
      // This same markup string is stamped into both the desktop nav and
      // the mobile slide-down menu below, so the dropdown widget below
      // must work in both contexts (see the two .gh-nav-drop-toggle
      // listeners wired up after the shadow DOM is populated).
      const navLinks = NAV_ITEMS.map((item) => {
        if (item.type === 'dropdown') return treatmentDropdownHtml(item);
        return `<a href="${escapeAttr(hrefFor(item, current))}"${item.key === current ? ' aria-current="page"' : ''}>${item.label}</a>`;
      }).join('');

      this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="./solace/site-chrome.css">
        <div class="gh-announce">Licensed &amp; Mobile Throughout Las Vegas &middot; Open 24 Hrs &middot; Same-Day Appointments Available</div>
        <header class="gh-header">
          <div class="gh-nav-wrap">
            <a class="gh-logo-link" href="${escapeAttr(current === 'home' ? '#' : PAGES.home)}" aria-label="Solace Wellness IV - Home">
              <img class="gh-logo" src="./solace/assets/header-logo.png" alt="Solace Wellness IV">
            </a>
            <nav class="gh-nav-desktop">${navLinks}</nav>
            <div class="gh-nav-actions">
              <a href="${PHONE_HREF}" class="gh-nav-phone">${phoneIconSvg()}<span class="gh-nav-phone-text">${PHONE_DISPLAY}</span></a>
              <a href="${escapeAttr(book)}" class="gh-btn gh-btn-solid">Book Now</a>
            </div>
            <button class="gh-hamburger" type="button" aria-expanded="false" aria-label="Menu">
              <span></span><span></span><span></span>
            </button>
          </div>
          <nav class="gh-menu">
            ${navLinks}
            <a href="${PHONE_HREF}" class="gh-menu-phone">&#128222; ${PHONE_DISPLAY}</a>
            <a href="${escapeAttr(book)}" class="gh-menu-book">Book Now</a>
          </nav>
        </header>
      `;

      const menuBtn = this.shadowRoot.querySelector('.gh-hamburger');
      const menu = this.shadowRoot.querySelector('.gh-menu');

      // "Treatments" appears twice - once in the desktop nav, once inside
      // the mobile slide-down menu - since both reuse the same navLinks
      // string. Each occurrence gets its own independent open/close state.
      const dropToggles = this.shadowRoot.querySelectorAll('.gh-nav-drop-toggle');
      const closeAllDrops = () => {
        dropToggles.forEach((btn) => {
          btn.setAttribute('aria-expanded', 'false');
          btn.nextElementSibling.classList.remove('open');
        });
      };
      dropToggles.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const wasOpen = btn.getAttribute('aria-expanded') === 'true';
          closeAllDrops();
          if (!wasOpen) {
            btn.setAttribute('aria-expanded', 'true');
            btn.nextElementSibling.classList.add('open');
          }
        });
      });
      // Most dropdown panel content is plain text, no links - a click
      // anywhere outside a toggle (including inside an open panel) closes
      // it. The one real link (Wellness IV Therapy) still navigates fine:
      // this handler doesn't preventDefault, it only resets toggle state.
      document.addEventListener('click', closeAllDrops);
      this.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAllDrops(); });

      const closeMenu = () => {
        menu.classList.remove('open');
        menuBtn.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        closeAllDrops();
      };
      menuBtn.addEventListener('click', () => {
        const open = menu.classList.toggle('open');
        menuBtn.classList.toggle('open', open);
        menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (!open) closeAllDrops();
      });
      menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
    }
  }

  class SolaceFooter extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
      this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="./solace/site-chrome.css">
        <footer class="gf-footer">
          <div class="gf-subscribe">
            <h2>Subscribe</h2>
            <form class="gf-subscribe-form">
              <input type="email" required placeholder="Enter your email" aria-label="Email address">
              <button type="submit">Subscribe</button>
            </form>
          </div>
          <img class="gf-logo" src="./solace/assets/footer-logo.png" alt="Solace Wellness IV">
          <nav class="gf-links">
            <a href="${escapeAttr(PAGES.home)}">Home</a>
            <a href="${escapeAttr(PAGES.about)}">About Us</a>
            <a href="${escapeAttr(PAGES.wellnessIvTherapy)}">Wellness IV Therapy</a>
            <a href="${escapeAttr(PAGES.home)}#treatments">Treatments</a>
            <a href="${escapeAttr(PAGES.home)}#book">Contact</a>
          </nav>
          <p class="gf-footer-url">solaceWELLNESSiv.com</p>
          <p class="gf-copyright">Copyright &copy; 2026 Solace Wellness IV &mdash; All Rights Reserved</p>
        </footer>
      `;

      const form = this.shadowRoot.querySelector('.gf-subscribe-form');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input');
        input.value = '';
        input.placeholder = 'Thanks for subscribing!';
      });
    }
  }

  if (!customElements.get('solace-header')) customElements.define('solace-header', SolaceHeader);
  if (!customElements.get('solace-footer')) customElements.define('solace-footer', SolaceFooter);
})();
