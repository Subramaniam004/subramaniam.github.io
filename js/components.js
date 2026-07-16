/**
 * ── Reusable UI Components ─────────────────────────
 * All components reuse existing design tokens and classes.
 */

/* ── Utility functions ───────────────────────────── */
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  if (dateStr.length === 4) return dateStr;
  const [year, month] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ── Certificate Card ────────────────────────────── */
function createCertCard(cert) {
  const card = document.createElement('article');
  card.className = 'cert-card fade-item';
  card.setAttribute('aria-label', cert.title);

  const pdfUrl = cert.pdf || cert.certificate || '';
  const verifyUrl = cert.verifyUrl || cert.verify || '';

  let descriptionHtml = '';
  if (cert.description) {
    descriptionHtml = `<p class="cert-description">${escapeHtml(cert.description)}</p>`;
  }

  let verifyButtonHtml = '';
  if (verifyUrl) {
    verifyButtonHtml = `<a href="${escapeHtml(verifyUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary cert-btn" aria-label="Verify ${escapeHtml(cert.title)}">Verify</a>`;
  }

  const viewButtonHtml = pdfUrl
    ? `<a href="${escapeHtml(pdfUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary cert-btn" aria-label="View certificate for ${escapeHtml(cert.title)}">View Certificate</a>`
    : '';

  // Embed the PDF or Image directly in the card if available
  let pdfPreviewHtml = '';
  if (pdfUrl) {
    const isImage = pdfUrl.toLowerCase().endsWith('.png') || pdfUrl.toLowerCase().endsWith('.jpg') || pdfUrl.toLowerCase().endsWith('.jpeg');
    if (isImage) {
      pdfPreviewHtml = `
        <div class="cert-pdf-preview">
          <img src="${escapeHtml(pdfUrl)}" alt="${escapeHtml(cert.title)}" style="width: 100%; height: 220px; object-fit: cover; display: block;" />
        </div>`;
    } else {
      pdfPreviewHtml = `
        <div class="cert-pdf-preview">
          <object data="${escapeHtml(pdfUrl)}#page=1&toolbar=0&navpanes=0&scrollbar=0" type="application/pdf" width="100%" height="220px">
            <p>Unable to display PDF. <a href="${escapeHtml(pdfUrl)}" target="_blank" rel="noopener noreferrer">Click here to view</a>.</p>
          </object>
        </div>`;
    }
  }

  card.innerHTML = `
    <div class="cert-card-header">
      <div class="cert-card-meta">
        <h3 class="cert-title">${escapeHtml(cert.title)}</h3>
        <span class="cert-issuer">${escapeHtml(cert.issuer)}</span>
        <span class="cert-date">${formatDate(cert.issueDate || cert.issued || '')}</span>
      </div>
    </div>
    ${pdfPreviewHtml}
    ${descriptionHtml}
    <div class="cert-actions">
      ${viewButtonHtml}
      ${verifyButtonHtml}
    </div>
  `;

  card.addEventListener('click', () => {
    if (typeof openCertModal === 'function') openCertModal(cert);
  });

  card.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', (event) => event.stopPropagation());
  });

  return card;
}

/* ── Achievement Card ────────────────────────────── */
function createAchievementCard(achievement) {
  const card = document.createElement('article');
  card.className = 'skill-card fade-item';
  card.setAttribute('aria-label', achievement.title);

  card.innerHTML = `
    <div style="font-size: 2rem; margin-bottom: 0.75rem;">${achievement.icon}</div>
    <h3 style="margin: 0 0 0.5rem;">${escapeHtml(achievement.title)}</h3>
    <p style="color: var(--text-secondary); line-height: 1.7; margin: 0;">${escapeHtml(achievement.description)}</p>
    ${achievement.date ? `<p style="color: var(--text-muted); font-size: 0.85rem; margin: 0.5rem 0 0;">${escapeHtml(achievement.date)}</p>` : ''}
  `;

  return card;
}

/* ── Profile Card ────────────────────────────────── */
function createProfileCard(profile) {
  const card = document.createElement('article');
  card.className = 'skill-card fade-item';
  card.setAttribute('aria-label', profile.platform);

  card.innerHTML = `
    <div style="font-size: 2rem; margin-bottom: 0.5rem;">${profile.icon}</div>
    <h3 style="margin: 0 0 0.25rem;">${escapeHtml(profile.platform)}</h3>
    <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0 0 0.75rem;">@${escapeHtml(profile.username)}</p>
    <p style="color: var(--text-secondary); line-height: 1.7; margin: 0 0 1rem; flex: 1; font-size: 0.95rem;">${escapeHtml(profile.description)}</p>
    <a href="${escapeHtml(profile.url)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="align-self: flex-start; padding: 0.7rem 1.2rem; font-size: 0.88rem;" aria-label="Visit ${escapeHtml(profile.platform)} profile">
      Visit Profile
    </a>
  `;

  return card;
}

/* ── Certificate Modal ───────────────────────────── */
function openCertModal(cert) {
  const existing = document.querySelector('.cert-modal-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'cert-modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', cert.title);

  const logo = cert.logo || cert.thumbnail || 'images/certifications/generic-cert.svg';
  const pdfUrl = cert.pdf || cert.certificate || '';
  const verifyUrl = cert.verifyUrl || cert.verify || '';

  let skillsHtml = '';
  if (cert.skills && cert.skills.length > 0) {
    skillsHtml = '<div class="project-tags" style="margin-top: 0.5rem;">';
    cert.skills.forEach(s => {
      skillsHtml += `<span>${escapeHtml(s)}</span>`;
    });
    skillsHtml += '</div>';
  }

  let buttonsHtml = '';
  if (pdfUrl) {
    buttonsHtml += `<a href="${escapeHtml(pdfUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: 0.7rem 1.2rem; font-size: 0.88rem;">View Certificate</a> `;
  }
  if (verifyUrl) {
    buttonsHtml += `<a href="${escapeHtml(verifyUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding: 0.7rem 1.2rem; font-size: 0.88rem;">Verify</a>`;
  }

  overlay.innerHTML = `
    <div class="cert-modal" role="document">
      <button class="cert-modal-close" aria-label="Close modal">&times;</button>
      <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap;">
        <div style="width: 92px; height: 92px; border-radius: 22px; overflow: hidden; border: 1px solid var(--card-border); background: var(--surface-soft); flex-shrink: 0;">
          <img src="${escapeHtml(logo)}" alt="${escapeHtml(cert.title)} thumbnail" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
        </div>
        <div style="min-width: 0;">
          <h2 style="margin: 0 0 0.3rem;">${escapeHtml(cert.title)}</h2>
          <p style="color: var(--accent); font-size: 1rem; margin: 0 0 0.2rem;">${escapeHtml(cert.issuer)}</p>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0;">${formatDate(cert.issueDate || cert.issued || '')}</p>
        </div>
      </div>
      ${cert.description ? `<p style="color: var(--text-secondary); line-height: 1.8; margin: 0 0 1rem;">${escapeHtml(cert.description)}</p>` : ''}
      ${cert.credentialId ? `<p style="color: var(--text-muted); font-size: 0.9rem; margin: 0 0 0.5rem;"><strong style="color: var(--text-secondary);">Credential ID:</strong> ${escapeHtml(cert.credentialId)}</p>` : ''}
      ${skillsHtml}
      <div style="display: flex; flex-wrap: wrap; gap: 0.7rem; margin-top: 1.5rem;">${buttonsHtml}</div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Animate in
  requestAnimationFrame(() => overlay.classList.add('active'));

  // Close handlers
  const closeBtn = overlay.querySelector('.cert-modal-close');
  closeBtn.addEventListener('click', () => closeCertModal(overlay));
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeCertModal(overlay);
  });
  document.addEventListener('keydown', modalKeyHandler);
  overlay._keyHandler = modalKeyHandler;

  function modalKeyHandler(e) {
    if (e.key === 'Escape') closeCertModal(overlay);
  }
}

function closeCertModal(overlay) {
  overlay.classList.remove('active');
  if (overlay._keyHandler) {
    document.removeEventListener('keydown', overlay._keyHandler);
  }
  setTimeout(() => overlay.remove(), 300);
}

/* ── Search Bar ──────────────────────────────────── */
function createSearchBar(placeholder = 'Search certifications...') {
  const container = document.createElement('div');
  container.className = 'cert-search-container fade-item';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'cert-search-input';
  input.placeholder = placeholder;
  input.setAttribute('aria-label', placeholder);
  input.id = 'cert-search-input';

  container.appendChild(input);
  return container;
}

/* ── Filter Chips ────────────────────────────────── */
function createFilterChips(categories, activeId, onChange) {
  const container = document.createElement('div');
  container.className = 'cert-filter-container fade-item';
  container.setAttribute('role', 'group');
  container.setAttribute('aria-label', 'Filter by category');

  categories.forEach(cat => {
    const chip = document.createElement('button');
    chip.className = `cert-filter-chip${cat.id === activeId ? ' active' : ''}`;
    chip.textContent = cat.label;
    chip.setAttribute('aria-pressed', cat.id === activeId);
    chip.addEventListener('click', () => onChange(cat.id));
    container.appendChild(chip);
  });

  return container;
}