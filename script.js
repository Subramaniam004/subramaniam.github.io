const themeToggle = document.getElementById('theme-toggle');
const typingRoleEl = document.getElementById('typing-role');
const visitorCountEl = document.getElementById('visitor-count');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const siteNav = document.getElementById('site-nav');
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

const themeKey = 'portfolio-theme';

function setTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    themeToggle.textContent = '☀️';
    themeToggle.setAttribute('aria-label', 'Switch to dark theme');
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeToggle.textContent = '🌙';
    themeToggle.setAttribute('aria-label', 'Switch to light theme');
  }
  localStorage.setItem(themeKey, theme);
}

function initTheme() {
  const storedTheme = localStorage.getItem(themeKey);
  if (storedTheme === 'light') {
    setTheme('light');
  } else {
    setTheme('dark');
  }
}

function initRoleTyping() {
  if (!typingRoleEl) return;

  const roles = ['Coder', 'Web Developer', 'CTF Player', 'Security Enthusiast'];
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeLoop() {
    const currentRole = roles[roleIndex];
    if (!deleting) {
      charIndex += 1;
      typingRoleEl.textContent = currentRole.slice(0, charIndex);
      if (charIndex === currentRole.length) {
        deleting = true;
        setTimeout(typeLoop, 1000);
        return;
      }
      setTimeout(typeLoop, 80);
    } else {
      charIndex -= 1;
      typingRoleEl.textContent = currentRole.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeLoop, 200);
        return;
      }
      setTimeout(typeLoop, 40);
    }
  }

  typeLoop();
}

function fetchVisitorCount() {
  const count = localStorage.getItem('visitor-count');
  const currentCount = count ? Number(count) : 0;
  const nextCount = currentCount + 1;
  localStorage.setItem('visitor-count', String(nextCount));
  if (visitorCountEl) {
    visitorCountEl.textContent = `Visitor count: ${nextCount}`;
  }
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    setTheme(isLight ? 'dark' : 'light');
  });
}

if (mobileMenuToggle && siteNav) {
  mobileMenuToggle.addEventListener('click', () => {
    siteNav.classList.toggle('open');
  });
}

const loader = document.getElementById('loader');
const audio = document.createElement('audio');
audio.src = 'startup-sound.mp3';
audio.volume = 0.45;

audio.addEventListener('canplaythrough', () => {
  audio.play().catch(() => {
    console.warn('Audio playback blocked until user interaction.');
  });
});

audio.addEventListener('error', () => {
  console.warn('Unable to load audio.');
});

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    formSuccess.textContent = 'Thank you! Your message has been received.';
    contactForm.reset();
    setTimeout(() => {
      formSuccess.textContent = '';
    }, 5000);
  });
}

const navLinks = document.querySelectorAll('.site-nav a');
navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const targetId = link.getAttribute('href');
    const section = targetId ? document.querySelector(targetId) : null;
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

window.addEventListener('load', () => {
  setTimeout(() => {
    if (loader) {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 500);
    }
  }, 1800);
});

initTheme();
initRoleTyping();
fetchVisitorCount();
