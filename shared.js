/* ============================================================
   GLOUCESTER GALLERY — SHARED JS
   ============================================================ */

/* ── Logo SVGs ──────────────────────────────────────────── */
const LOGO_LIGHT = `<svg viewBox="0 0 230 58" fill="none" xmlns="http://www.w3.org/2000/svg" style="height:50px;width:auto">
  <rect x="4" y="14" width="30" height="30" rx="1" transform="rotate(45 19 29)" fill="none" stroke="#b8935a" stroke-width="1.8"/>
  <rect x="9" y="19" width="20" height="20" rx="0.5" transform="rotate(45 19 29)" fill="none" stroke="#b8935a" stroke-width="0.7" stroke-dasharray="2 2"/>
  <text x="52" y="26" font-family="Fraunces,Georgia,serif" font-weight="300" font-size="18" fill="#1a1416" letter-spacing="0.5">Gloucester</text>
  <text x="52" y="44" font-family="Fraunces,Georgia,serif" font-weight="400" font-style="italic" font-size="18" fill="#1a1416" letter-spacing="0.3">Gallery</text>
  <line x1="52" y1="50" x2="218" y2="50" stroke="#b8935a" stroke-width="0.8"/>
  <text x="52" y="57" font-family="Outfit,sans-serif" font-size="6.5" fill="#b8935a" letter-spacing="2.5">COMMERCIAL ROAD · GLOUCESTER</text>
</svg>`;

const LOGO_DARK = `<svg viewBox="0 0 230 58" fill="none" xmlns="http://www.w3.org/2000/svg" style="height:44px;width:auto">
  <rect x="4" y="14" width="30" height="30" rx="1" transform="rotate(45 19 29)" fill="none" stroke="#b8935a" stroke-width="1.8"/>
  <rect x="9" y="19" width="20" height="20" rx="0.5" transform="rotate(45 19 29)" fill="none" stroke="#b8935a" stroke-width="0.7" stroke-dasharray="2 2"/>
  <text x="52" y="26" font-family="Fraunces,Georgia,serif" font-weight="300" font-size="18" fill="#f6f1ec" letter-spacing="0.5">Gloucester</text>
  <text x="52" y="44" font-family="Fraunces,Georgia,serif" font-weight="400" font-style="italic" font-size="18" fill="#f6f1ec" letter-spacing="0.3">Gallery</text>
  <line x1="52" y1="50" x2="218" y2="50" stroke="#b8935a" stroke-width="0.8"/>
  <text x="52" y="57" font-family="Outfit,sans-serif" font-size="6.5" fill="#b8935a" letter-spacing="2.5">COMMERCIAL ROAD · GLOUCESTER</text>
</svg>`;

/* ── Render shared header ───────────────────────────────── */
function renderHeader(activePage) {
  const G = window.GALLERY;
  const b = G.business;
  document.getElementById('promo') && G.promo && G.promo.show
    ? (document.getElementById('promo').style.display = 'block', document.getElementById('promo').textContent = G.promo.text)
    : null;

  let tbLinks = `<a href="tel:${b.phoneLink}">${b.phone}</a>`;
  if (b.facebook) tbLinks = `<a href="${b.facebook}" target="_blank">Facebook</a>` + tbLinks;
  if (b.instagram) tbLinks = `<a href="${b.instagram}" target="_blank">Instagram</a>` + tbLinks;
  const tb = document.getElementById('topbar-address');
  if (tb) tb.textContent = `${b.address1}, ${b.address2}`;
  const tbl = document.getElementById('topbar-links');
  if (tbl) tbl.innerHTML = tbLinks;

  const logoEl = document.getElementById('nav-logo');
  if (logoEl) logoEl.innerHTML = `<a href="index.html">${LOGO_LIGHT}</a>`;

  const navLinks = document.getElementById('nav-links');
  const pages = [
    { href: 'index.html',   label: 'Home',        key: 'home' },
    { href: 'index.html#current', label: 'Current Show', key: 'current' },
    { href: 'gallery.html', label: 'Buy Work',     key: 'gallery' },
    { href: 'index.html#artists', label: 'Artists', key: 'artists' },
    { href: 'index.html#rent',  label: 'Show Here', key: 'rent' },
    { href: 'index.html#hours', label: 'Visit',     key: 'visit' },
  ];
  if (navLinks) {
    navLinks.innerHTML = pages.map(p =>
      `<a href="${p.href}" class="${p.key === activePage ? 'active' : ''}">${p.label}</a>`
    ).join('') +
    `<a href="${b.framingShopUrl}" class="nav-framing" target="_blank">← Framing Shop</a>`;
  }

  const footLogo = document.getElementById('foot-logo');
  if (footLogo) footLogo.innerHTML = LOGO_DARK;

  const footAddr = document.getElementById('foot-address');
  if (footAddr) footAddr.innerHTML = `${b.address1}<br>${b.address2}`;
  const footPhone = document.getElementById('foot-phone');
  if (footPhone) { footPhone.textContent = b.phone; footPhone.href = `tel:${b.phoneLink}`; }
  const footEmail = document.getElementById('foot-email');
  if (footEmail) { footEmail.textContent = b.email; footEmail.href = `mailto:${b.email}`; }
  const footDir = document.getElementById('foot-directions');
  if (footDir) footDir.href = b.mapsUrl;
  const footCopy = document.getElementById('foot-copy');
  if (footCopy) footCopy.textContent = `© ${new Date().getFullYear()} Gloucester Gallery. All Rights Reserved.`;
  const footSocials = document.getElementById('foot-socials');
  if (footSocials) {
    let s = '';
    if (b.facebook) s += `<a href="${b.facebook}" target="_blank">Facebook</a>`;
    if (b.instagram) s += `<a href="${b.instagram}" target="_blank">Instagram</a>`;
    footSocials.innerHTML = s;
  }

  // sticky header
  window.addEventListener('scroll', () => {
    document.getElementById('main-header')?.classList.toggle('scrolled', scrollY > 20);
  });
  // mobile menu
  document.getElementById('menu-btn')?.addEventListener('click', () => {
    document.getElementById('nav-links')?.classList.toggle('open');
  });
  document.getElementById('nav-links')?.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => document.getElementById('nav-links')?.classList.remove('open'))
  );
}

/* ── Reveal on scroll ───────────────────────────────────── */
function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .1 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

/* ── Strip/marquee ──────────────────────────────────────── */
function renderStrip(containerId) {
  const el = document.getElementById(containerId);
  if (!el || !window.GALLERY) return;
  const s = GALLERY.strip.map(x => `<span>${x}</span>`).join('');
  el.innerHTML = s + s;
}
