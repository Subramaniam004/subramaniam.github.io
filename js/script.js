const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const siteNav = document.getElementById('site-nav');
const navLinks = document.querySelectorAll('.nav-link');
const internalLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
const sections = document.querySelectorAll('section[id]');
const typingText = document.getElementById('typing-text');
const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');
const terminalBody = document.getElementById('terminal-body');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const backToTopButton = document.getElementById('back-to-top');
const cursorDot = document.createElement('div');
const cursorRing = document.createElement('div');
const cursorRipple = document.createElement('div');
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer = window.matchMedia('(any-pointer: fine)').matches;
const customCursorEnabled = hasFinePointer;

let cursorTargetX = window.innerWidth / 2;
let cursorTargetY = window.innerHeight / 2;
let cursorDotX = cursorTargetX;
let cursorDotY = cursorTargetY;
let cursorRingX = cursorTargetX;
let cursorRingY = cursorTargetY;
let lastPointerX = cursorTargetX;
let lastPointerY = cursorTargetY;
let lastSplashTime = 0;
let currentHoverState = '';
let heroParticlePool = [];
let cursorSplashPool = [];

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function setCursorState(state) {
  if (!customCursorEnabled) return;
  if (currentHoverState === state) return;

  document.body.classList.remove('cursor-hover', 'cursor-button', 'cursor-link', 'cursor-project', 'cursor-terminal', 'cursor-image', 'cursor-text');
  currentHoverState = state;



  if (state) {
    document.body.classList.add(state);
  }
}

function isInteractiveElement(element) {
  if (!element || element === document.documentElement) return false;
  const selector = 'a, button, input, textarea, select, label, .btn, .nav-link, .mobile-menu-toggle, .project-card, .icon-link, .terminal-body, .terminal-input, .terminal-input-line, .timeline-item, .contact-panel, .form-panel, .hero, img';
  return element.closest(selector) !== null;
}

function mapHoverType(element) {
  if (!element) return '';
  if (element.closest('.terminal-body') || element.closest('.terminal-input-line') || element.classList.contains('terminal-input')) {
    return 'cursor-terminal';
  }
  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.isContentEditable) {
    return 'cursor-text';
  }
  if (element.closest('.project-card')) {
    return 'cursor-project';
  }
  if (element.tagName === 'IMG') {
    return 'cursor-image';
  }
  if (element.closest('.nav-link') || element.closest('.site-nav') || element.closest('.icon-link')) {
    return 'cursor-link';
  }
  if (element.closest('button') || element.closest('.btn') || element.closest('.mobile-menu-toggle')) {
    return 'cursor-button';
  }
  if (element.closest('.hero')) {
    return 'cursor-link';
  }
  return 'cursor-hover';
}

function updateInteractiveState(event) {
  if (!customCursorEnabled) return;
  const target = event.target;
  const interactive = target.closest('a, button, input, textarea, select, label, .btn, .nav-link, .mobile-menu-toggle, .project-card, .icon-link, .terminal-body, .terminal-input, .terminal-input-line, .timeline-item, .contact-panel, .form-panel, .hero, img');
  const state = mapHoverType(interactive);
  setCursorState(state);

  if (interactive && interactive.closest('.project-card')) {
    interactive.closest('.project-card').classList.add('project-hovered');
  }
}

function resetInteractiveState(event) {
  if (!customCursorEnabled) return;
  const related = event.relatedTarget;
  const oldInteractive = event.target.closest('a, button, input, textarea, select, label, .btn, .nav-link, .mobile-menu-toggle, .project-card, .icon-link, .terminal-body, .terminal-input, .terminal-input-line, .timeline-item, .contact-panel, .form-panel, .hero, img');

  if (oldInteractive && oldInteractive.closest('.project-card')) {
    oldInteractive.closest('.project-card').classList.remove('project-hovered');
  }
  if (!related || !isInteractiveElement(related)) {
    setCursorState('');
  }
}

function updateCursorTarget(event) {
  cursorTargetX = event.clientX;
  cursorTargetY = event.clientY;

  const dx = cursorTargetX - lastPointerX;
  const dy = cursorTargetY - lastPointerY;
  const speed = Math.hypot(dx, dy);

  if (speed > 8) {
    createCursorSplash(cursorTargetX, cursorTargetY);
  }

  lastPointerX = cursorTargetX;
  lastPointerY = cursorTargetY;
}

function createCursorSplash(x, y) {
  if (!customCursorEnabled) return;
  const now = performance.now();
  if (now - lastSplashTime < 40) return;
  lastSplashTime = now;

  if (cursorSplashPool.length >= 14) {
    const oldest = cursorSplashPool.shift();
    oldest.remove();
  }

  const splash = document.createElement('span');
  splash.className = 'cursor-splash';
  const diameter = 14 + Math.random() * 8;
  splash.style.width = `${diameter}px`;
  splash.style.height = `${diameter}px`;
  splash.style.left = `${x}px`;
  splash.style.top = `${y}px`;
  splash.style.opacity = `${0.16 + Math.random() * 0.14}`;
  document.body.appendChild(splash);
  cursorSplashPool.push(splash);

  splash.addEventListener('animationend', () => {
    splash.remove();
    cursorSplashPool = cursorSplashPool.filter((item) => item !== splash);
  });
}

function handleCursorClick() {
  if (!customCursorEnabled) return;
  document.body.classList.add('cursor-click');
  cursorRipple.classList.add('cursor-ripple-active');
  window.setTimeout(() => {
    document.body.classList.remove('cursor-click');
    cursorRipple.classList.remove('cursor-ripple-active');
  }, 180);
}

function createHeroParticle(hero, x, y) {
  if (heroParticlePool.length >= 10) return;
  const rect = hero.getBoundingClientRect();
  const particle = document.createElement('span');
  const size = 4 + Math.random() * 6;
  particle.className = 'hero-particle';
  particle.style.left = `${x - rect.left}px`;
  particle.style.top = `${y - rect.top}px`;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.opacity = '0.9';
  hero.appendChild(particle);
  heroParticlePool.push(particle);

  particle.addEventListener('animationend', () => {
    particle.remove();
    heroParticlePool = heroParticlePool.filter((item) => item !== particle);
  });
}

function initHeroCopyMotion() {
  const heroCopy = document.querySelector('.hero-copy');
  if (!heroCopy) return;

  let rafId = 0;

  const resetHeroMotion = () => {
    heroCopy.style.removeProperty('--hero-tilt-x');
    heroCopy.style.removeProperty('--hero-tilt-y');
    heroCopy.style.removeProperty('--hero-name-shift');
    heroCopy.style.removeProperty('--hero-text-shift');
    heroCopy.style.removeProperty('--hero-glow-x');
    heroCopy.style.removeProperty('--hero-glow-y');
  };

  heroCopy.addEventListener('pointermove', (event) => {
    const rect = heroCopy.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    if (rafId) window.cancelAnimationFrame(rafId);
    rafId = window.requestAnimationFrame(() => {
      heroCopy.style.setProperty('--hero-tilt-x', `${x * 6}deg`);
      heroCopy.style.setProperty('--hero-tilt-y', `${y * -6}deg`);
      heroCopy.style.setProperty('--hero-name-shift', `${x * 14}px`);
      heroCopy.style.setProperty('--hero-text-shift', `${y * -12}px`);
      heroCopy.style.setProperty('--hero-glow-x', `${50 + x * 22}%`);
      heroCopy.style.setProperty('--hero-glow-y', `${50 + y * 22}%`);
    });
  });

  heroCopy.addEventListener('pointerleave', () => {
    if (rafId) window.cancelAnimationFrame(rafId);
    resetHeroMotion();
  });
}

function updateHeroMagnetism(event) {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const rect = hero.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  hero.querySelectorAll('.hero-background span').forEach((bubble, index) => {
    bubble.style.transform = `translate3d(${x * (index + 1) * 3}px, ${y * (index + 1) * 3}px, 0)`;
  });
}

function renderCursor() {
  cursorDotX = lerp(cursorDotX, cursorTargetX, 0.55);
  cursorDotY = lerp(cursorDotY, cursorTargetY, 0.55);
  cursorRingX = lerp(cursorRingX, cursorTargetX, 0.25);
  cursorRingY = lerp(cursorRingY, cursorTargetY, 0.25);

  cursorDot.style.transform = `translate3d(${cursorDotX}px, ${cursorDotY}px, 0) translate(-50%, -50%)`;
  cursorRing.style.transform = `translate3d(${cursorRingX}px, ${cursorRingY}px, 0) translate(-50%, -50%)`;
  cursorRipple.style.transform = `translate3d(${cursorDotX}px, ${cursorDotY}px, 0) translate(-50%, -50%)`;
  window.requestAnimationFrame(renderCursor);
}

function initCustomCursor() {
  if (!customCursorEnabled) {
    document.documentElement.classList.add('custom-cursor-disabled');
    document.body.classList.add('custom-cursor-disabled');
    return;
  }

  cursorDot.className = 'cursor-dot';
  cursorRing.className = 'cursor-ring';
  cursorRipple.className = 'cursor-ripple';

  // Add corner tick marks for the targeting reticle
  const corners = ['ct-tl', 'ct-tr', 'ct-bl', 'ct-br'];
  corners.forEach((cls) => {
    const tick = document.createElement('span');
    tick.className = cls;
    cursorRing.appendChild(tick);
  });

  document.body.appendChild(cursorRing);
  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorRipple);
  document.documentElement.classList.add('custom-cursor-enabled');
  document.body.classList.add('custom-cursor-enabled');

  document.addEventListener('pointermove', (event) => {
    updateCursorTarget(event);
    if (event.target.closest('.hero')) {
      updateHeroMagnetism(event);
      createHeroParticle(event.target.closest('.hero'), event.clientX, event.clientY);
    }
  });

  document.addEventListener('pointerdown', handleCursorClick);
  document.addEventListener('pointerenter', () => document.body.classList.remove('cursor-hidden'));
  document.addEventListener('pointerleave', () => document.body.classList.add('cursor-hidden'));
  document.addEventListener('pointerover', updateInteractiveState);
  document.addEventListener('pointerout', resetInteractiveState);

  renderCursor();
}

const roles = [
  'Cybersecurity Enthusiast',
  'Ethical Hacking Learner',
  'CTF Competitor'
];
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

const startupCommands = [
  {
    command: 'whoami',
    output: ['Subramaniam B']
  },
  {
    command: 'role',
    output: ['Cybersecurity Enthusiast | Ethical Hacking Learner | CTF Competitor']
  },
  {
    command: 'education',
    output: ['Master of Computer Applications (MCA)']
  },
  {
    command: 'interests',
    output: ['• Web Security', '• Penetration Testing', '• Secure Coding', '• CTF Challenges']
  },
  {
    command: 'currently_learning',
    output: ['Cloud Computing', 'Python Automation', 'Web Application Security']
  },
  {
    command: 'skills',
    output: [
      'Languages:', 'Python', 'Java', 'JavaScript', 'HTML', 'CSS', 'SQL',
      '',
      'Tools:', 'Git', 'Linux', 'Burp Suite', 'Wireshark', 'Nmap', 'VS Code'
    ]
  },
  {
    command: 'projects',
    output: ['Type \'projects\' to view my featured work.']
  },
  {
    command: 'help',
    output: [
      'Available commands:',
      'help', 'about', 'skills', 'projects', 'education', 'experience', 'certifications', 'resume', 'contact', 'socials', 'clear'
    ]
  }
];

const supportedCommands = {
  help: () => {
    return [
      'Available commands:',
      'help', 'about', 'skills', 'projects', 'education', 'experience', 'certifications', 'resume', 'contact', 'socials', 'clear'
    ];
  },
  about: () => {
    return [
      'I am a cybersecurity-focused developer with experience in web security, secure coding, and penetration testing.',
      'I build polished, professional interfaces while thinking like a defender.'
    ];
  },
  skills: () => {
    return [
      'Languages:', 'Python', 'Java', 'JavaScript', 'HTML', 'CSS', 'SQL',
      '',
      'Tools:', 'Git', 'Linux', 'Burp Suite', 'Wireshark', 'Nmap', 'VS Code'
    ];
  },
  projects: () => {
    return [
      'Featured Projects:',
      'Portfolio Website — A modern cybersecurity portfolio with terminal-style interaction.',
      'Web Guard — Secure landing pages built with responsive design and polished UX.',
      'CTF Notes — Practical write-ups and defense-oriented vulnerability analysis.'
    ];
  },
  education: () => {
    return ['Master of Computer Applications (MCA)'];
  },
  experience: () => {
    return ['Internships and relevant experience will be added here shortly.'];
  },
  certifications: () => {
    return ['Certifications will appear here once they are finalized.'];
  },
  resume: () => {
    window.open('Subramaniam_Bhavimane_Resume_New.pdf', '_blank', 'noopener,noreferrer');
    return ['Opening resume...'];
  },
  contact: () => {
    return ['Email: subbu@cyber.dev', 'Phone: +91 12345 67890', 'Location: Chennai, India'];
  },
  socials: () => {
    return ['GitHub: https://github.com/subramaniam004', 'LinkedIn: https://linkedin.com/in/subbu', 'Twitter: https://twitter.com/subbu'];
  }
};

window.supportedCommands = supportedCommands;

let commandHistory = [];
let historyIndex = -1;
let isTypingStartup = true;
let startupIndex = 0;
let startupCharIndex = 0;
let currentStartupLine = null;

function updateActiveNav() {
  if (!sections.length) return;
  const fromTop = window.scrollY + 120;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const id = section.getAttribute('id');

    if (fromTop >= sectionTop && fromTop < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}

function openMobileMenu() {
  siteNav.classList.toggle('open');
}

function smoothScroll(event) {
  const link = event.currentTarget;
  const href = link.getAttribute('href');

  // Only intercept pure hash links (e.g. #about, #skills)
  // Let full URLs like index.html or index.html#about navigate normally
  if (!href || !href.startsWith('#')) return;

  event.preventDefault();
  const targetSection = document.querySelector(href);

  if (targetSection) {
    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    siteNav?.classList.remove('open');
  }
}

function initTyping() {
  if (!typingText) return;

  function type() {
    const currentRole = roles[roleIndex];

    if (!deleting) {
      charIndex += 1;
      typingText.textContent = currentRole.slice(0, charIndex);
      if (charIndex === currentRole.length) {
        deleting = true;
        setTimeout(type, 1200);
        return;
      }
      setTimeout(type, 70);
    } else {
      charIndex -= 1;
      typingText.textContent = currentRole.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(type, 300);
        return;
      }
      setTimeout(type, 40);
    }
  }

  type();
}

function createOutputLine(text, type = 'output-text') {
  const line = document.createElement('div');
  line.className = type;
  line.textContent = text;
  terminalOutput.appendChild(line);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function createCommandLine(command) {
  const line = document.createElement('div');
  line.innerHTML = `<span class="terminal-prompt">$</span> <span class="output-command">${command}</span>`;
  terminalOutput.appendChild(line);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function typeStartup() {
  if (startupIndex >= startupCommands.length) {
    isTypingStartup = false;
    terminalInput.focus();
    return;
  }

  const commandBlock = startupCommands[startupIndex];

  if (!currentStartupLine) {
    createCommandLine('');
    currentStartupLine = terminalOutput.lastChild.querySelector('.output-command');
  }

  const commandText = commandBlock.command;
  startupCharIndex += 1;
  currentStartupLine.textContent = commandText.slice(0, startupCharIndex);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;

  if (startupCharIndex < commandText.length) {
    setTimeout(typeStartup, 80 + Math.random() * 40);
    return;
  }

  startupCharIndex = 0;
  currentStartupLine = null;
  startupIndex += 1;
  setTimeout(() => {
    commandBlock.output.forEach((line) => createOutputLine(line));
    setTimeout(typeStartup, 600);
  }, 400);
}

function processCommand(command) {
  const normalized = command.trim().toLowerCase();

  if (!normalized) {
    return;
  }

  createCommandLine(normalized);

  if (normalized === 'clear') {
    terminalOutput.innerHTML = '';
    return;
  }

  if (supportedCommands[normalized]) {
    const output = supportedCommands[normalized]();
    output.forEach((line) => createOutputLine(line, line.startsWith('•') ? 'output-bullet' : 'output-text'));
  } else {
    createOutputLine('Command not found.', 'output-warning');
    createOutputLine("Type 'help' to see available commands.", 'output-text');
  }
}

function handleTerminalInput(event) {
  if (isTypingStartup) {
    event.preventDefault();
    return;
  }

  const key = event.key;

  if (key === 'Enter') {
    event.preventDefault();
    const command = terminalInput.textContent;
    commandHistory.unshift(command);
    historyIndex = -1;
    processCommand(command);
    terminalInput.textContent = '';
    return;
  }

  if (key === 'ArrowUp') {
    event.preventDefault();
    if (commandHistory.length > 0) {
      historyIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
      terminalInput.textContent = commandHistory[historyIndex];
      placeCaretAtEnd(terminalInput);
    }
    return;
  }

  if (key === 'ArrowDown') {
    event.preventDefault();
    if (historyIndex > 0) {
      historyIndex -= 1;
      terminalInput.textContent = commandHistory[historyIndex];
    } else {
      historyIndex = -1;
      terminalInput.textContent = '';
    }
    placeCaretAtEnd(terminalInput);
    return;
  }
}

function placeCaretAtEnd(element) {
  element.focus();
  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(false);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

function handleInputFocus() {
  if (terminalInput.textContent.trim() === '') {
    terminalInput.textContent = '';
  }
}

function initTerminal() {
  if (!terminalOutput || !terminalInput) return;

  terminalInput.addEventListener('keydown', handleTerminalInput);
  terminalInput.addEventListener('focus', handleInputFocus);
  terminalBody.addEventListener('click', () => terminalInput.focus());
  terminalInput.setAttribute('data-placeholder', 'Type a command...');
  terminalInput.textContent = '';
  terminalInput.focus();
  setTimeout(typeStartup, 600);
}

function fadeOnScroll() {
  const fadeItems = document.querySelectorAll('.fade-item:not(.is-visible)');
  if (!fadeItems.length) return;
  const windowBottom = window.innerHeight + window.scrollY;

  fadeItems.forEach((item) => {
    const elementTop = item.offsetTop + 90;
    if (windowBottom > elementTop) {
      item.classList.add('is-visible');
    }
  });
}

function handleForm(event) {
  event.preventDefault();

  if (!formSuccess) return;
  formSuccess.textContent = "Thanks for reaching out! I'll get back to you soon.";
  contactForm.reset();

  setTimeout(() => {
    formSuccess.textContent = '';
  }, 5000);
}

function updateThemeIcon(theme) {
  themeIcon.textContent = theme === 'light' ? '☀️' : '🌙';
}

function setTheme(theme, save = true) {
  document.documentElement.classList.toggle('light-theme', theme === 'light');
  document.documentElement.classList.toggle('dark-theme', theme === 'dark');
  if (save) {
    localStorage.setItem('portfolio-theme', theme);
  }
  updateThemeIcon(theme);
}

function initTheme() {
  const savedTheme = localStorage.getItem('portfolio-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme === 'light' || savedTheme === 'dark'
    ? savedTheme
    : (systemPrefersDark ? 'dark' : 'light');
  setTheme(theme, false);
}

function toggleTheme() {
  const activeTheme = document.documentElement.classList.contains('light-theme') ? 'light' : 'dark';
  const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
  setTheme(nextTheme);
  if (themeToggle) {
    themeToggle.classList.add('theme-rotating');
    window.setTimeout(() => themeToggle.classList.remove('theme-rotating'), 360);
  }
}

if (mobileMenuToggle && siteNav) {
  mobileMenuToggle.addEventListener('click', openMobileMenu);
}

if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
}

navLinks.forEach((link) => link.addEventListener('click', smoothScroll));
internalLinks.forEach((link) => link.addEventListener('click', smoothScroll));
let scrollRafId = null;
function onScroll() {
  if (scrollRafId) return;
  scrollRafId = requestAnimationFrame(() => {
    updateActiveNav();
    fadeOnScroll();
    scrollRafId = null;
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('load', () => {
  updateActiveNav();
  fadeOnScroll();
});

if (contactForm) {
  contactForm.addEventListener('submit', handleForm);
}

if (backToTopButton) {
  backToTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  });
}

// ── Matrix Rain Effect ──────────────────────────────
function initMatrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;

  const hero = document.querySelector('.hero');
  if (!hero) return;

  const ctx = canvas.getContext('2d');
  let animId = null;
  let drops = [];
  let columns = 0;
  const fontSize = 13;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ｦｧｨｩｪｫｬｭｮｯｰ';

  function getMatrixColor() {
    const isLight = document.documentElement.classList.contains('light-theme');
    return isLight ? '#0b7285' : '#00f0ff';
  }

  function getFadeColor() {
    const isLight = document.documentElement.classList.contains('light-theme');
    return isLight ? 'rgba(248,250,254,0.12)' : 'rgba(5,8,17,0.12)';
  }

  function resizeCanvas() {
    const rect = hero.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(0);
  }

  function drawMatrix() {
    ctx.fillStyle = getFadeColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = getMatrixColor();
    ctx.font = fontSize + 'px "JetBrains Mono", monospace';

    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      // Slow down by only incrementing every other frame
      if (Math.random() > 0.5) {
        drops[i]++;
      }
    }

    animId = requestAnimationFrame(drawMatrix);
  }

  function startMatrix() {
    if (window.innerWidth < 768) {
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
      canvas.style.display = 'none';
      return;
    }

    canvas.style.display = 'block';
    resizeCanvas();
    if (animId) cancelAnimationFrame(animId);
    animId = requestAnimationFrame(drawMatrix);
  }

  // Observe theme changes to update colors dynamically
  const themeObserver = new MutationObserver(() => {
    if (animId) {
      // Colors will update on next frame automatically via getMatrixColor/getFadeColor
    }
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });

  // Handle resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(startMatrix, 150);
  });

  // Initial start
  startMatrix();
}

// Fix brand marks that may have been auto-formatted
document.querySelectorAll('.brand-mark').forEach(el => {
  if (el.textContent.trim() === '</>') {
    el.textContent = '</>';
  }
});

initTheme();
initTyping();
initTerminal();
initCustomCursor();
initHeroCopyMotion();
initMatrixRain();

// Initialize certifications section (homepage featured)
const certContainer = document.getElementById('certifications-container');
if (certContainer) {
  renderFeaturedCertifications(certContainer);
}

// Initialize achievements section
const achievementsContainer = document.getElementById('achievements-container');
if (achievementsContainer) {
  renderAchievements(achievementsContainer);
}

// Initialize profiles section
const profilesContainer = document.getElementById('profiles-container');
if (profilesContainer) {
  renderProfiles(profilesContainer);
}

// Initialize resume card
const resumeContainer = document.getElementById('resume-container');
if (resumeContainer) {
  renderResumeCard(resumeContainer);
}

// Copy email button
const copyEmailBtn = document.getElementById('copy-email-btn');
if (copyEmailBtn) {
  copyEmailBtn.addEventListener('click', () => {
    const email = document.getElementById('contact-email')?.textContent?.trim();
    if (email) {
      navigator.clipboard.writeText(email).then(() => {
        const originalText = copyEmailBtn.textContent;
        copyEmailBtn.textContent = '✅ Copied!';
        setTimeout(() => { copyEmailBtn.textContent = originalText; }, 2000);
      }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        const originalText = copyEmailBtn.textContent;
        copyEmailBtn.textContent = '✅ Copied!';
        setTimeout(() => { copyEmailBtn.textContent = originalText; }, 2000);
      });
    }
  });
}

// ════════════════════════════════════════════════════════════════
// Name Hover Effect — Premium Portfolio Interaction
// Inspired by Awwwards-winning developer portfolios.
// Features: animated gradient text, cursor-reactive glow,
// magnetic hover, smooth easing, subtle chromatic aberration,
// glossy light sweep.
// ════════════════════════════════════════════════════════════════

function initNameHover() {
  const nameEl = document.getElementById('name-hover');
  if (!nameEl) return;

  // Respect reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Disable on touch devices
  const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  if (prefersReduced || isTouchDevice) return;

  // Set data-text attribute for CSS pseudo-elements (light sweep, chromatic)
  nameEl.setAttribute('data-text', nameEl.textContent.trim());

  // ── Create cursor-reactive glow overlay ──────────────────────
  const glowEl = document.createElement('span');
  glowEl.className = 'nh-glow';
  nameEl.appendChild(glowEl);

  // Mouse tracking state
  let mouseX = 50; // percentage
  let mouseY = 50;
  let rafId = null;
  let isHovering = false;

  // ── Track pointer position inside element ────────────────────
  function onPointerMove(event) {
    const rect = nameEl.getBoundingClientRect();
    // Clamp between 0 and 100%
    mouseX = Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100));
    mouseY = Math.min(100, Math.max(0, ((event.clientY - rect.top) / rect.height) * 100));

    if (!rafId) {
      rafId = requestAnimationFrame(updateGlow);
    }
  }

  function updateGlow() {
    if (!isHovering) {
      rafId = null;
      return;
    }
    // Update the gradient center position — this is the only DOM write per frame
    glowEl.style.setProperty('--glow-x', `${mouseX}%`);
    glowEl.style.setProperty('--glow-y', `${mouseY}%`);
    rafId = null;
  }

   // ── Hover enter ──────────────────────────────────────────────
   function onPointerEnter() {
     isHovering = true;
     nameEl.classList.add('active');
     nameEl.classList.add('wave-active');
   }

  // ── Hover leave ──────────────────────────────────────────────
  function onPointerLeave() {
    isHovering = false;
    nameEl.classList.remove('active');
    nameEl.classList.remove('wave-active');
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // Bind events
  nameEl.addEventListener('pointerenter', onPointerEnter);
  nameEl.addEventListener('pointerleave', onPointerLeave);
  nameEl.addEventListener('pointermove', onPointerMove);

  // ── Cleanup on element removal via MutationObserver ──────────
  // (Not strictly needed since this is a static element, but good practice)
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initNameHover();
    initWavyTextEffect();
  });
} else {
  initNameHover();
  initWavyTextEffect();
}

function initWavyTextEffect() {
  const containers = document.querySelectorAll('.wavy-hover-container');
  containers.forEach(container => {
    // Wrap text nodes into individual spans with class wavy-char
    wrapTextNodes(container);

    const spans = container.querySelectorAll('.wavy-char');

    // Track mousemove on the container to calculate real-time cursor distance to each character
    container.addEventListener('mousemove', (event) => {
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      spans.forEach(span => {
        const rect = span.getBoundingClientRect();
        // Calculate center of the character span
        const charX = rect.left + rect.width / 2;
        const charY = rect.top + rect.height / 2;

        // Calculate Euclidean distance from cursor to character center
        const distance = Math.hypot(mouseX - charX, mouseY - charY);

        // Define an interactive radius (e.g., 120px)
        const maxDistance = 120;

        if (distance < maxDistance) {
          // Calculate proximity factor (1 at center, 0 at edge of radius)
          const proximity = (maxDistance - distance) / maxDistance;
          
          // Smooth easing curve for a more organic feel
          const easeProximity = Math.sin(proximity * Math.PI / 2);

          // Calculate dynamic translation (up to -18px) and scale
          const translateY = easeProximity * -18;
          const scale = 1 + (easeProximity * 0.25);
          
          // Dynamic color shift towards the accent color
          span.style.transform = `translateY(${translateY}px) scale(${scale})`;
          span.style.color = `var(--accent)`;
          span.style.textShadow = `0 ${Math.abs(translateY)/2}px ${Math.abs(translateY)}px rgba(0, 212, 170, 0.4)`;
        } else {
          // Reset styles smoothly if outside the radius
          span.style.transform = '';
          span.style.color = '';
          span.style.textShadow = '';
        }
      });
    });

    // Reset all characters when the mouse leaves the container
    container.addEventListener('mouseleave', () => {
      spans.forEach(span => {
        span.style.transform = '';
        span.style.color = '';
        span.style.textShadow = '';
      });
    });
  });
}

function wrapTextNodes(element) {
  // If it's a span with class name-hover, it already has individual spans for letters.
  // We can just add the wavy-char class to those existing spans!
  if (element.classList && element.classList.contains('name-hover')) {
    const childSpans = element.querySelectorAll('span');
    childSpans.forEach(span => {
      span.classList.add('wavy-char');
    });
    return;
  }

  const childNodes = Array.from(element.childNodes);
  childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (text.trim() === '') return;

      const fragment = document.createDocumentFragment();
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === ' ') {
          fragment.appendChild(document.createTextNode(' '));
        } else {
          const span = document.createElement('span');
          span.className = 'wavy-char';
          span.textContent = char;
          fragment.appendChild(span);
        }
      }
      element.replaceChild(fragment, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      wrapTextNodes(node);
    }
  });
}

function animateWave(spans, centerIndex) {
  // We apply a wave effect by translating characters up and down with a delay/offset based on distance
  const maxDistance = 5; // How many characters to each side are affected
  
  spans.forEach((span, idx) => {
    const distance = Math.abs(idx - centerIndex);
    if (distance <= maxDistance) {
      // Calculate a delay or intensity based on distance
      const intensity = (maxDistance - distance) / maxDistance;
      const delay = distance * 0.05;
      
      // Reset any existing animation
      span.style.animation = 'none';
      // Trigger reflow
      span.offsetHeight; 
      
      // Apply the wave animation
      span.style.setProperty('--wave-intensity', intensity);
      span.style.animation = `wavy-bounce 0.6s cubic-bezier(0.35, 0, 0.25, 1) ${delay}s`;
      
      // Clean up animation style after it finishes so it can be re-triggered
      setTimeout(() => {
        span.style.animation = '';
      }, (0.6 + delay) * 1000);
    }
  });
}


