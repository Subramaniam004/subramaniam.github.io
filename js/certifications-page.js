/**
 * ── Certifications Page Controller ──────────────────
 * Renders the full certification grid with search & filter.
 * Depends on: data/certifications.js, js/components.js
 */

(function () {
  'use strict';

  let activeFilter = 'all';
  let searchQuery = '';

  const controlsEl = document.getElementById('cert-controls');
  const gridEl = document.getElementById('cert-grid');
  const emptyEl = document.getElementById('cert-empty');

  /* ── Render grid from filtered list ─────────────── */
  function renderGrid(filtered) {
    gridEl.innerHTML = '';

    let hasAny = false;

    CERT_CATEGORIES.forEach(cat => {
      if (cat.id === 'all') return;

      const catCerts = filtered
        .filter(c => c.category === cat.id)
        .sort((a, b) => a.title.localeCompare(b.title));
      if (catCerts.length) {
        hasAny = true;
        const heading = document.createElement('h3');
        heading.className = 'cert-section-heading fade-item';
        heading.textContent = cat.label;
        gridEl.appendChild(heading);
        catCerts.forEach(cert => gridEl.appendChild(createCertCard(cert)));
      }
    });

    emptyEl.style.display = hasAny ? 'none' : 'block';
  }

  /* ── Apply search + filter ──────────────────────── */
  function applyFilters() {
    const q = searchQuery.toLowerCase().trim();
    let filtered = certifications;

    if (activeFilter !== 'all') {
      filtered = filtered.filter(c => c.category === activeFilter);
    }

    if (q) {
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.issuer.toLowerCase().includes(q) ||
        (c.skills && c.skills.some(s => s.toLowerCase().includes(q)))
      );
    }

    renderGrid(filtered);
  }

  /* ── Search handler ─────────────────────────────── */
  function onSearch(value) {
    searchQuery = value;
    applyFilters();
  }

  /* ── Filter handler ─────────────────────────────── */
  function onFilterChange(catId) {
    activeFilter = catId;
    applyFilters();
    // Update chip active state
    const chips = controlsEl.querySelectorAll('.cert-filter-chip');
    chips.forEach(chip => {
      const isActive = chip.dataset.catId === catId;
      chip.classList.toggle('active', isActive);
      chip.setAttribute('aria-pressed', isActive);
    });
  }

  /* ── Build controls (search bar + filter chips) ─── */
  function buildControls() {
    controlsEl.innerHTML = '';

    // Search bar
    const searchContainer = createSearchBar('Search certifications...');
    const input = searchContainer.querySelector('.cert-search-input');
    input.addEventListener('input', (e) => onSearch(e.target.value));
    controlsEl.appendChild(searchContainer);

    // Filter chips – map cat id to chip for active toggle
    const filterContainer = createFilterChips(CERT_CATEGORIES, activeFilter, onFilterChange);
    // Store category id on each button for easier toggling
    const chips = filterContainer.querySelectorAll('.cert-filter-chip');
    chips.forEach((chip, index) => {
      chip.dataset.catId = CERT_CATEGORIES[index].id;
    });
    controlsEl.appendChild(filterContainer);
  }

  /* ── Fade-in observer for .fade-item elements ────── */
  function observeFadeItems() {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    // Observe existing fade items
    document.querySelectorAll('.fade-item').forEach(el => observer.observe(el));
    // Watch for new fade items added to the grid
    if (gridEl) {
      const mo = new MutationObserver(() => {
        gridEl.querySelectorAll('.fade-item:not(.is-visible)').forEach(el => {
          if (!el.classList.contains('is-visible')) {
            observer.observe(el);
          }
        });
      });
      mo.observe(gridEl, { childList: true, subtree: true });
    }
  }

  /* ── Init ────────────────────────────────────────── */
  function init() {
    if (!gridEl || !controlsEl) return;
    buildControls();
    applyFilters();
    observeFadeItems();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
