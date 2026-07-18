// Main JavaScript for Cybersecurity Portfolio

// UI Elements
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const siteNav = document.getElementById('site-nav');
const navLinks = document.querySelectorAll('.nav-link');
const internalLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
const typingText = document.getElementById('typing-text');
const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');
const terminalBody = document.getElementById('terminal-body');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const backToTopButton = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const sendBtn = document.getElementById('send-btn');
const btnText = document.getElementById('btn-text');
const btnSpinner = document.getElementById('btn-spinner');

// Typing animation roles
const roles = ['Cybersecurity Enthusiast','Web Developer', 'CTF Player', 'Gamer','Linux User',];
let roleIndex = 0, charIndex = 0, deleting = false;

// Terminal Commands
const startupCommands = [
  { command: 'whoami', output: ['Subramaniam Bhavimane'] },
  { command: 'role', output: ['Cybersecurity Aspirant | Web Developer | CTF Player'] },
  { command: 'skills', output: ['Python', 'JavaScript', 'Web Security', 'CTF', 'Linux'] },
  { command: 'education', output: ['Currently pursuing MCA'] },
  { command: 'help', output: ['Available: help, about, skills, projects, education, contact, resume, clear'] }
];

const supportedCommands = {
  help: () => ['Available commands: help, whoami, about, skills, projects, education, contact, resume, neofetch, clear, exit'],
  whoami: () => ['Subramaniam B - MCA Student | Cybersecurity Enthusiast | Web Developer'],
  about: () => ['Cybersecurity student building secure applications and conducting vulnerability research.'],
  skills: () => ['Languages: Python, JavaScript, Java, SQL', 'Security: Web App Security, Network Security, OWASP'],
  projects: () => ['Security Portfolio - Terminal interface', 'Web Security Toolkit - Security utilities', 'CTF Write-ups - Challenge analysis'],
  education: () => ['MCA Cybersecurity (2025-Present)', 'BCA First Class Distinction (2025)'],
  contact: () => ['Email: subramaniambhavimane01@gmail.com', 'Location: Belgaum, India'],
  resume: () => { window.open('Subramaniam_Bhavimane_Resume_New.pdf', '_blank'); return ['Opening resume...']; },
  neofetch: () => [
    '   /\\_/\\     subbu@cyber',
    '  ( o.o )    -----------',
    '   > ^ <     OS: SubOS v1.0.0',
    '             Kernel: WebKit 537.36',
    '             Uptime: ' + Math.floor(performance.now() / 1000) + 's',
    '             Shell: bash (interactive)',
    '             Resolution: ' + window.screen.width + 'x' + window.screen.height,
    '             Terminal: SubTerminal',
    '             CPU: Intel Core i7-13700K',
    '             Memory: 16GB DDR5'
  ],
  clear: () => { terminalOutput.innerHTML = ''; return []; },
  exit: () => ['Goodbye! Feel free to close this tab.']
};

let commandHistory = [], historyIndex = -1, isTypingStartup = true, startupIndex = 0, startupCharIndex = 0, currentStartupLine = null;

// Smooth scroll
function smoothScroll(event) {
  const link = event.currentTarget;
  const href = link.getAttribute('href');
  if (!href || !href.startsWith('#')) return;
  event.preventDefault();
  const targetSection = document.querySelector(href);
  if (targetSection) {
    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    siteNav?.classList.remove('open');
  }
}

function openMobileMenu() { siteNav.classList.toggle('open'); }

// Typing animation
function initTyping() {
  if (!typingText) return;
  function type() {
    const currentRole = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      typingText.textContent = currentRole.slice(0, charIndex);
      if (charIndex === currentRole.length) { deleting = true; setTimeout(type, 1200); return; }
      setTimeout(type, 70);
    } else {
      charIndex--;
      typingText.textContent = currentRole.slice(0, charIndex);
      if (charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; setTimeout(type, 300); return; }
      setTimeout(type, 40);
    }
  }
  type();
}

function escapeHtml(str) { if (!str) return ''; const div = document.createElement('div'); div.textContent = str; return div.innerHTML; }
function formatDate(dateStr) {
  if (!dateStr) return '';
  if (dateStr.length === 4) return dateStr;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const [y,m] = dateStr.split('-');
  return `${months[parseInt(m,10)-1]} ${y}`;
}

// Terminal
function createOutputLine(text, type) {
  const line = document.createElement('div'); line.className = type || 'output-text'; line.textContent = text;
  terminalOutput.appendChild(line); terminalOutput.scrollTop = terminalOutput.scrollHeight;
}
function createCommandLine(command) {
  const line = document.createElement('div');
  line.innerHTML = '<span class="terminal-prompt">❯</span> <span class="output-command">' + escapeHtml(command) + '</span>';
  terminalOutput.appendChild(line); terminalOutput.scrollTop = terminalOutput.scrollHeight;
}
function typeStartup() {
  if (startupIndex >= startupCommands.length) { isTypingStartup = false; terminalInput.focus(); return; }
  const block = startupCommands[startupIndex];
  if (!currentStartupLine) { createCommandLine(''); currentStartupLine = terminalOutput.lastChild.querySelector('.output-command'); }
  startupCharIndex++;
  currentStartupLine.textContent = block.command.slice(0, startupCharIndex);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
  if (startupCharIndex < block.command.length) { setTimeout(typeStartup, 80 + Math.random() * 40); return; }
  startupCharIndex = 0; currentStartupLine = null; startupIndex++;
  setTimeout(() => { block.output.forEach(l => createOutputLine(l)); setTimeout(typeStartup, 600); }, 400);
}
function processCommand(command) {
  const n = command.trim().toLowerCase();
  if (!n) return;
  createCommandLine(n);
  if (n === 'clear') { terminalOutput.innerHTML = ''; return; }
  if (supportedCommands[n]) supportedCommands[n]().forEach(l => createOutputLine(l));
  else { createOutputLine('Command not found.', 'output-warning'); createOutputLine("Type 'help' to see available commands."); }
}
function handleTerminalInput(e) {
  if (isTypingStartup) { e.preventDefault(); return; }
  if (e.key === 'Enter') {
    e.preventDefault();
    const cmd = terminalInput.textContent;
    commandHistory.unshift(cmd); historyIndex = -1;
    processCommand(cmd); terminalInput.textContent = '';
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (commandHistory.length > 0) { historyIndex = Math.min(historyIndex + 1, commandHistory.length - 1); terminalInput.textContent = commandHistory[historyIndex]; placeCaretAtEnd(terminalInput); }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIndex > 0) { historyIndex--; terminalInput.textContent = commandHistory[historyIndex]; }
    else { historyIndex = -1; terminalInput.textContent = ''; }
    placeCaretAtEnd(terminalInput);
  }
}
function placeCaretAtEnd(el) { el.focus(); const r = document.createRange(); r.selectNodeContents(el); r.collapse(false); const s = window.getSelection(); s.removeAllRanges(); s.addRange(r); }
function initTerminal() {
  if (!terminalOutput || !terminalInput) return;
  terminalInput.addEventListener('keydown', handleTerminalInput);
  terminalBody.addEventListener('click', () => terminalInput.focus());
  setTimeout(typeStartup, 600);
}

// Theme
function updateThemeIcon(theme) { themeIcon.textContent = theme === 'light' ? '\u2600\uFE0F' : '\uD83C\uDF19'; }
function setTheme(theme, save) {
  document.documentElement.setAttribute('data-theme', theme);
  if (save !== false) localStorage.setItem('portfolio-theme', theme);
  updateThemeIcon(theme);
}
function initTheme() {
  const saved = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme((saved === 'light' || saved === 'dark') ? saved : (prefersDark ? 'dark' : 'light'), false);
}
function toggleTheme() {
  const active = document.documentElement.getAttribute('data-theme') || 'dark';
  setTheme(active === 'dark' ? 'light' : 'dark');
}

// Form handling with EmailJS
function handleForm(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();
  const honeypot = document.getElementById('honeypot').value;

  document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
  let valid = true;
  if (!name) { document.getElementById('name-error').textContent = 'Name is required'; valid = false; }
  if (!email) { document.getElementById('email-error').textContent = 'Email is required'; valid = false; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { document.getElementById('email-error').textContent = 'Invalid email format'; valid = false; }
  if (!subject) { document.getElementById('subject-error').textContent = 'Subject is required'; valid = false; }
  if (!message) { document.getElementById('message-error').textContent = 'Message is required'; valid = false; }
  if (honeypot) { formSuccess.textContent = 'Message sent successfully.'; formSuccess.style.color = 'var(--success)'; contactForm.reset(); return; }
  if (!valid) return;

  const lastSent = localStorage.getItem('last-sent');
  if (lastSent && Date.now() - parseInt(lastSent) < 60000) {
    formSuccess.textContent = 'Please wait before sending another message.';
    formSuccess.style.color = 'var(--warning)'; return;
  }

  sendBtn.disabled = true;
  btnText.style.display = 'none';
  btnSpinner.style.display = 'inline';
  formSuccess.textContent = '';

  const serviceId = window.EMAILJS_SERVICE_ID || 'default_service';
  const templateId = window.EMAILJS_TEMPLATE_ID || 'default_template';
  const publicKey = window.EMAILJS_PUBLIC_KEY || '';

  if (typeof emailjs !== 'undefined' && publicKey) {
    emailjs.init(publicKey);
    emailjs.send(serviceId, templateId, {
      from_name: name, from_email: email, subject: subject,
      message: message, to_email: 'subramaniambhavimane01@gmail.com'
    }).then(() => {
      formSuccess.textContent = 'Message sent successfully.';
      formSuccess.style.color = 'var(--success)';
      contactForm.reset();
      localStorage.setItem('last-sent', Date.now().toString());
    }).catch(() => {
      formSuccess.textContent = 'Unable to send message. Please try again.';
      formSuccess.style.color = 'var(--error)';
    }).finally(() => {
      sendBtn.disabled = false;
      btnText.style.display = 'inline';
      btnSpinner.style.display = 'none';
    });
  } else {
    window.location.href = 'mailto:subramaniambhavimane01@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
    formSuccess.textContent = 'Message sent successfully.';
    formSuccess.style.color = 'var(--success)';
    contactForm.reset();
    sendBtn.disabled = false;
    btnText.style.display = 'inline';
    btnSpinner.style.display = 'none';
  }
}

// Active nav
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  if (!sections.length) return;
  const fromTop = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop, h = section.offsetHeight, id = section.getAttribute('id');
    if (fromTop >= top && fromTop < top + h) {
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + id));
    }
  });
}

// Section scroll reveal
function initScrollReveal() {
  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  sections.forEach(s => observer.observe(s));
}

// Certifications
function createCertCard(cert) {
  const card = document.createElement('article');
  card.className = 'cert-card fade-item';
  card.setAttribute('aria-label', cert.title);
  const pdfUrl = cert.pdf || '';
  const viewBtn = pdfUrl ? '<a href="' + escapeHtml(pdfUrl) + '" target="_blank" rel="noopener noreferrer" class="btn btn-primary cert-btn">View Certificate</a>' : '';
  const downloadBtn = pdfUrl ? '<a href="' + escapeHtml(pdfUrl) + '" download class="btn btn-secondary cert-btn">Download</a>' : '';
  card.innerHTML = '<div class="cert-thumbnail"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="8" x2="22" y2="8"/><line x1="6" y1="13" x2="10" y2="17"/><line x1="14" y1="13" x2="18" y2="17"/></svg></div><h3 class="cert-title">' + escapeHtml(cert.title) + '</h3><div class="cert-meta"><span class="cert-issuer">' + escapeHtml(cert.issuer) + '</span><span class="cert-category">' + escapeHtml(cert.category || 'Certification') + '</span></div><div class="cert-actions">' + viewBtn + downloadBtn + '</div>';
  return card;
}
function renderFeaturedCertifications(container) {
  const certData = [
    { title: 'Cybersecurity Certification', issuer: 'Simplilearn', issueDate: '2026-07', category: 'Cybersecurity', pdf: 'certificates/SUBRAMANIAM B Cybersecurity Cert.png' },
    { title: 'Data Science Certification', issuer: 'Simplilearn', issueDate: '2026-07', category: 'Data Science', pdf: 'certificates/SUBRAMANIAM B Data Science Cert.png' },
    { title: 'Google IT Automation with Python', issuer: 'Google', issueDate: '2024', category: 'Programming', pdf: 'certificates/google-it-automation-with-python.pdf' },
    { title: 'Google Prompting Essentials', issuer: 'Google', issueDate: '2025', category: 'AI', pdf: 'certificates/google-prompting-essentials.pdf' },
    { title: 'Google AI Essentials', issuer: 'Google', issueDate: '2025', category: 'AI', pdf: 'certificates/google-ai-essentials.pdf' },
    { title: 'Deloitte Cyber Job Simulation', issuer: 'Deloitte', issueDate: '2026-04', category: 'Cybersecurity', pdf: 'certificates/deloitte-cyber-job-simulation.pdf' },
    { title: 'Deloitte Data Analytics Job Simulation', issuer: 'Deloitte', issueDate: '2026-04', category: 'Data Analytics', pdf: 'certificates/deloitte-data-analytics-job-simulation.pdf' },
    { title: 'Electronic Arts Job Simulation', issuer: 'Electronic Arts', issueDate: '2026-04', category: 'Technology', pdf: 'certificates/electronic-arts-job-simulation.pdf' },
    { title: 'Tata IAM Job Simulation', issuer: 'Tata', issueDate: '2026-04', category: 'Technology', pdf: 'certificates/tata-iam-job-simulation.pdf' },
    { title: 'Ethical Hacking', issuer: 'Tutedude', issueDate: '2026-01', category: 'Cybersecurity', pdf: 'certificates/tutedude-ethical-hacking.pdf' },
    { title: 'Screenshot Certificate', issuer: 'Various', issueDate: '2025', category: 'Certification', pdf: 'certificates/Screenshot 2026-07-16 022157.png' }
  ];
  container.innerHTML = '';
  certData.forEach(cert => container.appendChild(createCertCard(cert)));
}

// Achievements
function createAchievementCard(a) {
  const card = document.createElement('article');
  card.className = 'achievement-card fade-item';
  card.innerHTML = '<div class="achievement-badge">' + a.icon + '</div><h3 class="achievement-title">' + escapeHtml(a.title) + '</h3><p class="achievement-desc">' + escapeHtml(a.description) + '</p>';
  return card;
}
function renderAchievements(container) {
  const data = [
    { icon: '\uD83C\uDFC6', title: 'Achievement Coming Soon', description: 'Placeholder for upcoming achievements.' },
    { icon: '\uD83C\uDFC6', title: 'Achievement Coming Soon', description: 'Placeholder for upcoming achievements.' },
    { icon: '\uD83C\uDFC6', title: 'Achievement Coming Soon', description: 'Placeholder for upcoming achievements.' },
    { icon: '\uD83C\uDFC6', title: 'Achievement Coming Soon', description: 'Placeholder for upcoming achievements.' }
  ];
  container.innerHTML = '';
  data.forEach(a => container.appendChild(createAchievementCard(a)));
}

// Wavy hover
function initWavyHoverEffect() {
  const containers = document.querySelectorAll('.wavy-hover-container');
  if (!containers.length) return;
  containers.forEach(container => {
    wrapTextNodes(container);
    const spans = container.querySelectorAll('.wavy-char');
    container.addEventListener('mousemove', (e) => {
      const mx = e.clientX, my = e.clientY;
      spans.forEach(span => {
        const r = span.getBoundingClientRect();
        const cx = r.left + r.width/2, cy = r.top + r.height/2;
        const d = Math.hypot(mx - cx, my - cy), maxD = 120;
        if (d < maxD) {
          const p = (maxD - d) / maxD, ep = Math.sin(p * Math.PI / 2);
          span.style.transform = 'translateY(' + (ep * -18) + 'px) scale(' + (1 + ep * 0.25) + ')';
          span.style.color = 'var(--primary)';
          span.style.textShadow = '0 ' + (ep * 9) + 'px ' + (ep * 18) + 'px rgba(79,195,255,0.4)';
        } else { span.style.transform = ''; span.style.color = ''; span.style.textShadow = ''; }
      });
    });
    container.addEventListener('mouseleave', () => spans.forEach(s => { s.style.transform = ''; s.style.color = ''; s.style.textShadow = ''; }));
  });
}
function wrapTextNodes(element) {
  Array.from(element.childNodes).forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (text.trim() === '') return;
      const frag = document.createDocumentFragment();
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') frag.appendChild(document.createTextNode(' '));
        else { const s = document.createElement('span'); s.className = 'wavy-char'; s.textContent = text[i]; frag.appendChild(s); }
      }
      element.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) wrapTextNodes(node);
  });
}

// Name hover
function initNameHover() {
  const nameEl = document.getElementById('name-hover');
  if (!nameEl) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
  nameEl.querySelectorAll('span').forEach(s => s.classList.add('wavy-char'));
  const glow = document.createElement('span'); glow.className = 'nh-glow'; nameEl.appendChild(glow);
  let mx = 50, my = 50, raf = null, hovering = false;
  function onMove(e) {
    const r = nameEl.getBoundingClientRect();
    mx = Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100));
    my = Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100));
    if (!raf) raf = requestAnimationFrame(function() { if (hovering) { glow.style.setProperty('--glow-x', mx + '%'); glow.style.setProperty('--glow-y', my + '%'); } raf = null; });
  }
  nameEl.addEventListener('pointerenter', function() { hovering = true; nameEl.classList.add('active', 'wave-active'); });
  nameEl.addEventListener('pointerleave', function() { hovering = false; nameEl.classList.remove('active', 'wave-active'); if (raf) { cancelAnimationFrame(raf); raf = null; } });
  nameEl.addEventListener('pointermove', onMove);
}

// Premium Matrix Rain - Hero only
function initMatrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let animId = null, drops = [], columns = 0;
  const fontSize = 15;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789{}[]()<>#$%@0xnmapTCPUDHTTPHTTPSGETPOST443AESRSAJWTsudorootsshscp0101';

  function getMatrixColor(brightness) {
    var b = brightness || 1;
    var isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) return 'rgba(11,114,133,' + (0.15 * b) + ')';
    return 'rgba(79,195,255,' + (0.35 * b) + ')';
  }

  function getFadeColor() {
    var isLight = document.documentElement.getAttribute('data-theme') === 'light';
    return isLight ? 'rgba(255,255,255,0.08)' : 'rgba(8,17,31,0.08)';
  }

  function drawMatrix() {
    ctx.fillStyle = getFadeColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + 'px "JetBrains Mono", monospace';
    for (var i = 0; i < drops.length; i++) {
      var text = chars[Math.floor(Math.random() * chars.length)];
      var brightness = 0.5 + Math.random() * 0.5;
      ctx.fillStyle = getMatrixColor(brightness);
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      if (Math.random() > 0.4) drops[i]++;
    }
    animId = requestAnimationFrame(drawMatrix);
  }

  function startMatrix() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    canvas.style.display = 'block';
    var hero = document.getElementById('hero');
    if (hero) {
      var r = hero.getBoundingClientRect();
      canvas.width = r.width;
      canvas.height = r.height;
      columns = Math.floor(canvas.width / fontSize);
      drops = [];
      for (var i = 0; i < columns; i++) drops.push(Math.random() * 100);
    }
    if (animId) cancelAnimationFrame(animId);
    animId = requestAnimationFrame(drawMatrix);
  }

  var themeObserver = new MutationObserver(startMatrix);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  var resizeTimeout;
  window.addEventListener('resize', function() { clearTimeout(resizeTimeout); resizeTimeout = setTimeout(startMatrix, 150); });

  document.addEventListener('visibilitychange', function() {
    if (document.hidden && animId) { cancelAnimationFrame(animId); animId = null; }
    else if (!document.hidden && !animId) startMatrix();
  });

  startMatrix();
}

// Leaflet Map
function initMap() {
  var mapContainer = document.getElementById('map');
  if (!mapContainer || typeof L === 'undefined') return;
  var map = L.map('map').setView([15.8497, 74.4977], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(map);
  L.marker([15.8497, 74.4977]).addTo(map)
    .bindPopup('<strong>Subramaniam B</strong><br>Belagavi, Karnataka<br><em>Available for internships and opportunities.</em>')
    .openPopup();
}

// Init
function init() {
  if (mobileMenuToggle && siteNav) mobileMenuToggle.addEventListener('click', openMobileMenu);
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  navLinks.forEach(function(l) { l.addEventListener('click', smoothScroll); });
  internalLinks.forEach(function(l) { l.addEventListener('click', smoothScroll); });
  if (contactForm) contactForm.addEventListener('submit', handleForm);
  if (backToTopButton) {
    backToTopButton.addEventListener('click', function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    window.addEventListener('scroll', function() { backToTopButton.classList.toggle('visible', window.scrollY > 400); });
  }

  // Terminal buttons click handler
  const termButtons = document.querySelectorAll('.term-btn');
  termButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        processCommand(cmd);
      }
    });
  });

  // Scroll indicator click handler
  const scrollIndicator = document.getElementById('scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', function() {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Terminal toggle bar click handler
  const toggleBar = document.getElementById('terminal-toggle-bar');
  const wrapper = document.querySelector('.terminal-wrapper');
  if (toggleBar && wrapper) {
    toggleBar.addEventListener('click', () => {
      wrapper.classList.toggle('expanded');
    });
  }

  initTheme();
  initTyping();
  initTerminal();
  initMatrixRain();
  initWavyHoverEffect();
  initNameHover();
  initScrollReveal();
  initMap();
  initCursorGlow();
  initCustomCursor();
  initNetworkMesh();

  var certContainer = document.getElementById('certifications-container');
  if (certContainer) renderFeaturedCertifications(certContainer);
  var achievementsContainer = document.getElementById('achievements-container');
  if (achievementsContainer) renderAchievements(achievementsContainer);

  window.addEventListener('scroll', function() { updateActiveNav(); }, { passive: true });
  window.addEventListener('load', function() { updateActiveNav(); });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

function initCursorGlow() {
  const hero = document.getElementById('hero');
  const glow = document.getElementById('cursor-glow');
  if (!hero || !glow) return;
  if (window.matchMedia('(max-width: 768px)').matches) {
    glow.style.display = 'none';
    return;
  }
  let targetX = 0, targetY = 0, currentX = 0, currentY = 0, isVisible = false;
  hero.addEventListener('mouseenter', () => { glow.style.opacity = '1'; isVisible = true; });
  hero.addEventListener('mouseleave', () => { glow.style.opacity = '0'; isVisible = false; });
  hero.addEventListener('mousemove', (e) => {
    targetX = e.clientX; targetY = e.clientY;
    if (!isVisible) { glow.style.opacity = '1'; isVisible = true; }
  });
  function updateGlow() {
    if (isVisible) {
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;
      glow.style.left = currentX + 'px';
      glow.style.top = currentY + 'px';
    }
    requestAnimationFrame(updateGlow);
  }
  updateGlow();
}

function initCustomCursor() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  if (window.matchMedia('(max-width: 768px)').matches || window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
  
  const ring = document.createElement('div');
  ring.className = 'custom-cursor-ring';
  document.body.appendChild(ring);
  
  const dot = document.createElement('div');
  dot.className = 'custom-cursor-dot';
  document.body.appendChild(dot);
  
  let targetX = 0, targetY = 0;
  let ringX = 0, ringY = 0;
  let dotX = 0, dotY = 0;
  let isVisible = false;
  
  hero.addEventListener('mouseenter', () => {
    ring.style.opacity = '1';
    dot.style.opacity = '1';
    isVisible = true;
  });
  
  hero.addEventListener('mouseleave', () => {
    ring.style.opacity = '0';
    dot.style.opacity = '0';
    isVisible = false;
  });
  
  hero.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    if (!isVisible) {
      ring.style.opacity = '1';
      dot.style.opacity = '1';
      isVisible = true;
    }
  });
  
  function updateCursor() {
    if (isVisible) {
      ringX += (targetX - ringX) * 0.15;
      ringY += (targetY - ringY) * 0.15;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      
      dotX += (targetX - dotX) * 0.4;
      dotY += (targetY - dotY) * 0.4;
      dot.style.left = dotX + 'px';
      dot.style.top = dotY + 'px';
    }
    requestAnimationFrame(updateCursor);
  }
  updateCursor();
}

function initNetworkMesh() {
  const canvas = document.getElementById('network-canvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = canvas.getContext('2d');
  let animId = null, nodes = [], particles = [], sideElements = [];
  const maxNodes = 45;
  const maxParticles = 15;
  const cyberWords = ['0x', 'sudo', 'ssh', 'HTTP', 'HTTPS', 'GET', 'POST', 'TCP', 'UDP', 'JWT', 'AES', 'RSA', 'IPv4', '0101', '[ ]', '{ }', '🔑', '🛡️'];

  function resize() {
    const hero = document.getElementById('hero');
    if (hero) {
      const r = hero.getBoundingClientRect();
      canvas.width = r.width;
      canvas.height = r.height;
    }
  }

  function initElements() {
    nodes = [];
    for (let i = 0; i < maxNodes; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 2 + Math.random() * 2
      });
    }
    particles = [];
    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        text: cyberWords[Math.floor(Math.random() * cyberWords.length)],
        alpha: 0.1 + Math.random() * 0.15,
        scale: 0.8 + Math.random() * 0.4
      });
    }
    sideElements = [];
    for (let i = 0; i < 5; i++) {
      sideElements.push({
        x: 20 + Math.random() * 30,
        y: Math.random() * canvas.height,
        vy: 0.5 + Math.random() * 1,
        chars: ['0', '1', '0', '1', '0', '1'],
        charIndex: 0
      });
    }
    for (let i = 0; i < 5; i++) {
      sideElements.push({
        x: canvas.width - 50 + Math.random() * 30,
        y: Math.random() * canvas.height,
        vy: 0.5 + Math.random() * 1,
        chars: ['0', '1', '0', '1', '0', '1'],
        charIndex: 0
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const colorPrimary = isLight ? 'rgba(59,130,246,0.15)' : 'rgba(79,195,255,0.15)';
    const colorLine = isLight ? 'rgba(59,130,246,0.05)' : 'rgba(79,195,255,0.05)';

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = colorPrimary;
      ctx.fill();

      for (let j = i + 1; j < nodes.length; j++) {
        const n2 = nodes[j];
        const dx = n.x - n2.x;
        const dy = n.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = colorLine;
          ctx.lineWidth = 0.8;
          ctx.stroke();

          if (Math.random() > 0.9995) {
            ctx.beginPath();
            ctx.arc(n.x + dx * 0.5, n.y + dy * 0.5, 3, 0, Math.PI * 2);
            ctx.fillStyle = isLight ? 'rgba(59,130,246,0.4)' : 'rgba(79,195,255,0.4)';
            ctx.fill();
          }
        }
      }
    }

    ctx.font = '11px "JetBrains Mono", monospace';
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.fillStyle = isLight ? `rgba(15,23,42,${p.alpha * 0.6})` : `rgba(79,195,255,${p.alpha})`;
      ctx.fillText(p.text, p.x, p.y);
    }

    ctx.font = '12px "JetBrains Mono", monospace';
    for (let i = 0; i < sideElements.length; i++) {
      const s = sideElements[i];
      s.y += s.vy;
      if (s.y > canvas.height) {
        s.y = -20;
        s.x = i < 5 ? 20 + Math.random() * 30 : canvas.width - 50 + Math.random() * 30;
      }
      if (Math.random() > 0.95) {
        s.charIndex = (s.charIndex + 1) % s.chars.length;
      }
      ctx.fillStyle = isLight ? 'rgba(15,23,42,0.15)' : 'rgba(79,195,255,0.25)';
      ctx.fillText(s.chars[s.charIndex], s.x, s.y);
    }

    animId = requestAnimationFrame(draw);
  }

  function start() {
    resize();
    initElements();
    if (animId) cancelAnimationFrame(animId);
    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
    initElements();
  });

  document.addEventListener('visibilitychange', function() {
    if (document.hidden && animId) { cancelAnimationFrame(animId); animId = null; }
    else if (!document.hidden && !animId) start();
  });

  start();
}

