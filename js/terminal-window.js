const terminalWindowOutput = document.getElementById('window-terminal-output');
const terminalWindowInput = document.getElementById('window-terminal-input');
const terminalWindowBody = document.getElementById('window-terminal-body');

const windowSupportedCommands = {
  help: () => [
    'Available commands:',
    'help', 'about', 'skills', 'projects', 'education', 'experience', 'certifications', 'resume', 'contact', 'socials', 'clear'
  ],
  about: () => [
    'I am a cybersecurity-focused developer with experience in web security, secure coding, and penetration testing.',
    'I build polished, professional interfaces while thinking like a defender.'
  ],
  skills: () => [
    'Languages:', 'Python', 'Java', 'JavaScript', 'HTML', 'CSS', 'SQL',
    '',
    'Tools:', 'Git', 'Linux', 'Burp Suite', 'Wireshark', 'Nmap', 'VS Code'
  ],
  projects: () => [
    'Featured Projects:',
    'Portfolio Website — A modern cybersecurity portfolio with terminal-style interaction.',
    'Web Guard — Secure landing pages built with responsive design and polished UX.',
    'CTF Notes — Practical write-ups and defense-oriented vulnerability analysis.'
  ],
  education: () => ['Master of Computer Applications (MCA)'],
  experience: () => ['Internships and relevant experience will be added here shortly.'],
  certifications: () => ['Certifications will appear here once they are finalized.'],
  resume: () => {
    window.open('Subramaniam_Bhavimane_Resume_New.pdf', '_blank', 'noopener,noreferrer');
    return ['Opening resume...'];
  },
  contact: () => ['Email: subramaniambhavimane01@gmail.com', 'Location: Belgaum, India'],
  socials: () => ['GitHub: https://github.com/Subramaniam004', 'LinkedIn: https://www.linkedin.com/in/subramaniam-bhavimane004/', 'Instagram: https://www.instagram.com/subramaniambhavimane/']
};

let windowCommandHistory = [];
let windowHistoryIndex = -1;

function writeWelcome() {
  const welcome = document.createElement('div');
  welcome.style.cssText = 'color: var(--accent); font-family: "JetBrains Mono", monospace; margin-bottom: 1rem; line-height: 1.8;';
  welcome.innerHTML = `
    <div>Welcome to Subbu's Portfolio Terminal</div>
    <div style="color: var(--text-muted); margin-top: 0.3rem;">Type <span style="color: var(--accent);">help</span> to view available commands.</div>
  `;
  terminalWindowOutput.appendChild(welcome);
}

function addCommandLine(command) {
  const line = document.createElement('div');
  line.innerHTML = `<span class="terminal-prompt">$</span> <span class="output-command">${escapeHtml(command)}</span>`;
  terminalWindowOutput.appendChild(line);
}

function addResultLines(lines) {
  lines.forEach((line) => {
    const outputLine = document.createElement('div');
    outputLine.className = line.startsWith('•') ? 'output-bullet' : 'output-text';
    outputLine.textContent = line;
    terminalWindowOutput.appendChild(outputLine);
  });
  terminalWindowOutput.scrollTop = terminalWindowOutput.scrollHeight;
}

function processWindowCommand(command) {
  const normalized = command.trim().toLowerCase();

  if (normalized === 'clear') {
    terminalWindowOutput.innerHTML = '';
    writeWelcome();
    return;
  }

  const handler = windowSupportedCommands[normalized] || (window.opener && window.opener.supportedCommands && window.opener.supportedCommands[normalized]);

  if (typeof handler === 'function') {
    addResultLines(handler());
    return;
  }

  addResultLines([
    'Command not found.',
    "Type 'help' to see available commands."
  ]);
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

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function initWindowTerminal() {
  if (!terminalWindowOutput || !terminalWindowInput || !terminalWindowBody) return;

  writeWelcome();
  terminalWindowInput.addEventListener('keydown', (event) => {
    const input = event.currentTarget;

    if (event.key === 'Enter') {
      event.preventDefault();
      const command = input.textContent.trim();
      if (!command) return;

      addCommandLine(command);
      windowCommandHistory.unshift(command);
      windowHistoryIndex = -1;
      processWindowCommand(command);
      input.textContent = '';
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (windowCommandHistory.length > 0) {
        windowHistoryIndex = Math.min(windowHistoryIndex + 1, windowCommandHistory.length - 1);
        input.textContent = windowCommandHistory[windowHistoryIndex];
        placeCaretAtEnd(input);
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (windowHistoryIndex > 0) {
        windowHistoryIndex -= 1;
        input.textContent = windowCommandHistory[windowHistoryIndex];
      } else {
        windowHistoryIndex = -1;
        input.textContent = '';
      }
      placeCaretAtEnd(input);
    }
  });

  terminalWindowBody.addEventListener('click', () => terminalWindowInput.focus());

  document.querySelector('.terminal-popup-close')?.addEventListener('click', () => window.close());
  document.querySelector('.terminal-popup-minimize')?.addEventListener('click', () => window.blur());
  document.querySelector('.terminal-popup-expand')?.addEventListener('click', (event) => {
    const shell = document.querySelector('.terminal-popup');
    shell?.classList.toggle('terminal-popup-expanded');
    event.currentTarget.classList.toggle('terminal-popup-expand-active', shell?.classList.contains('terminal-popup-expanded'));
  });

  terminalWindowInput.textContent = '';
  setTimeout(() => terminalWindowInput.focus(), 100);
}

window.addEventListener('DOMContentLoaded', initWindowTerminal);