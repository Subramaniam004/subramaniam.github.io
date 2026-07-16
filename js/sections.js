/**
 * ── Sections Rendering ─────────────────────────────
 * Renders all new homepage sections dynamically.
 * Uses existing .fade-item for scroll animations.
 */

/* ── Render Featured Certifications (max 6) ─────────── */
function renderFeaturedCertifications(container) {
  if (!container) return;

  if (!certifications || certifications.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = '';

  // Filter and slice to show only 3 major certs on the homepage
  const majorCerts = certifications
    .filter(cert => cert.category === 'professional')
    .slice(0, 3);

  if (majorCerts.length > 0) {
    const majorGrid = document.createElement('div');
    majorGrid.className = 'cert-grid';
    majorCerts.map(cert => createCertCard(cert)).forEach(card => majorGrid.appendChild(card));
    container.appendChild(majorGrid);
  }

  // Add "View All" button
  const viewAllContainer = document.createElement('div');
  viewAllContainer.className = 'fade-item';
  viewAllContainer.style.marginTop = '3rem';
  viewAllContainer.style.display = 'flex';
  viewAllContainer.style.justifyContent = 'center';

  const viewAllBtn = document.createElement('a');
  viewAllBtn.href = 'certifications.html';
  viewAllBtn.className = 'btn btn-primary';
  viewAllBtn.textContent = 'View All Certifications';
  viewAllBtn.setAttribute('aria-label', 'View all certifications');

  viewAllContainer.appendChild(viewAllBtn);
  container.appendChild(viewAllContainer);
}

/* ── Render Achievements Section ────────────────────── */
function renderAchievements(container) {
  if (!container) return;

  if (!achievements || achievements.length === 0) {
    container.innerHTML = `
      <div class="cert-placeholder fade-item">
        <p>Achievements will appear here once added. Check back soon.</p>
      </div>
    `;
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'skills-grid';

  achievements.forEach(ach => {
    grid.appendChild(createAchievementCard(ach));
  });

  container.innerHTML = '';
  container.appendChild(grid);
}

/* ── Render Profiles Section ────────────────────────── */
function renderProfiles(container) {
  if (!container) return;

  if (!profiles || profiles.length === 0) {
    container.innerHTML = `
      <div class="cert-placeholder fade-item">
        <p>Developer profiles will appear here once added.</p>
      </div>
    `;
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'skills-grid';

  profiles.forEach(profile => {
    grid.appendChild(createProfileCard(profile));
  });

  container.innerHTML = '';
  container.appendChild(grid);
}

/* ── Render Resume Card (inside About section) ─────── */
function renderResumeCard(container) {
  if (!container) return;

  container.innerHTML = `
    <div class="resume-card skill-card fade-item">
      <div style="display: flex; align-items: flex-start; gap: 1.5rem; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 200px;">
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">👨‍💻</div>
          <h3 style="margin: 0 0 0.25rem;">Subramaniam B</h3>
          <p style="color: var(--accent); margin: 0 0 0.5rem;">Cybersecurity Student & Web Developer</p>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0 0 0.25rem;">📍 Belgaum, India</p>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0 0 0.25rem;">🎓 MCA (2025 – Present)</p>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0 0 0.25rem;">📊 CGPA: 9.28 / 10</p>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0 0 1rem;">✅ Available for opportunities</p>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.7rem;">
          <a href="Subramaniam_Bhavimane_Resume_New.pdf" target="_blank" rel="noopener noreferrer" class="btn btn-primary" aria-label="Download Resume">
            📄 Download Resume
          </a>
          <a href="Subramaniam_Bhavimane_Resume_New.pdf" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" aria-label="View Resume">
            👁️ View Resume
          </a>
        </div>
      </div>
    </div>
  `;
}