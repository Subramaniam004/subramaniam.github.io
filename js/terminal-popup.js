/**
 * ── Floating Terminal Popup ─────────────────────────
 * Creates an in-site draggable terminal panel.
 */

let terminalPopupInstance = null;
let isTerminalOpen = false;
let terminalNeverOpened = true;
let terminalDragState = null;
let terminalDragMoveHandler = null;
let terminalDragUpHandler = null;

/**
 * Creates the floating launcher button and appends it to the body.
 */
function createTerminalLauncher() {
  const launcher = document.createElement('div');
  launcher.className = 'terminal-launcher';
  launcher.setAttribute('aria-label', 'Open Terminal');
  launcher.setAttribute('role', 'button');
  launcher.setAttribute('tabindex', '0');
  launcher.title = 'Open Terminal (Ctrl+K)';

  // Terminal icon (chevron/angle brackets)
  launcher.innerHTML = `
    <span class="terminal-launcher-icon">>_</span>
    <span class="terminal-launcher-badge">Terminal</span>
    <span class="terminal-launcher-dot"></span>
  `;

  launcher.addEventListener('click', openTerminalPopup);
  launcher.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openTerminalPopup();
    }
  });

  document.body.appendChild(launcher);
  return launcher;
}

/**
 * Creates the terminal popup modal structure.
 */
function createTerminalPopup() {
  if (terminalPopupInstance) return;

  const overlay = document.createElement('div');
  overlay.className = 'terminal-popup-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Portfolio Terminal');

  overlay.innerHTML = `
    <div class="terminal-popup" role="document">
      <div class="terminal-popup-header">
        <div class="terminal-popup-traffic">
          <span class="terminal-popup-btn terminal-popup-close" data-action="close" aria-label="Close terminal"></span>
          <span class="terminal-popup-btn terminal-popup-minimize" data-action="minimize" aria-label="Minimize terminal"></span>
          <span class="terminal-popup-btn terminal-popup-expand" data-action="expand" aria-label="Expand terminal"></span>
        </div>
        <span class="terminal-popup-title">subbu@portfolio</span>
        <div class="terminal-popup-spacer"></div>
      </div>
      <div class="terminal-body" id="popup-terminal-body">
        <div class="terminal-output" id="popup-terminal-output"></div>
        <div class="terminal-input-line">
          <span class="terminal-prompt">$</span>
          <span class="terminal-cursor" id="popup-terminal-cursor"></span>
          <span class="terminal-input" id="popup-terminal-input" contenteditable="true" spellcheck="false" data-placeholder="Type a command..."></span>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Close handlers
  const closeBtn = overlay.querySelector('.terminal-popup-close');
  closeBtn.addEventListener('click', closeTerminalPopup);

  const minimizeBtn = overlay.querySelector('.terminal-popup-minimize');
  minimizeBtn.addEventListener('click', closeTerminalPopup);

  const expandBtn = overlay.querySelector('.terminal-popup-expand');
  expandBtn.addEventListener('click', () => {
    const popup = overlay.querySelector('.terminal-popup');
    popup.classList.toggle('terminal-popup-expanded');
    const isExpanded = popup.classList.contains('terminal-popup-expanded');
    expandBtn.classList.toggle('terminal-popup-expand-active', isExpanded);
  });

  const popup = overlay.querySelector('.terminal-popup');
  const header = overlay.querySelector('.terminal-popup-header');
  header.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button, .terminal-popup-btn')) return;
    if (popup.classList.contains('terminal-popup-expanded')) return;
    if (event.button !== 0) return;

    const popupRect = popup.getBoundingClientRect();
    terminalDragState = {
      offsetX: event.clientX - popupRect.left,
      offsetY: event.clientY - popupRect.top,
      width: popupRect.width,
      height: popupRect.height
    };

    popup.classList.add('dragging');
    popup.style.left = `${popupRect.left}px`;
    popup.style.top = `${popupRect.top}px`;
    popup.style.transform = 'none';
    popup.style.position = 'fixed';
    event.preventDefault();

    terminalDragMoveHandler = (moveEvent) => {
      if (!terminalDragState) return;
      const maxLeft = Math.max(12, window.innerWidth - terminalDragState.width - 12);
      const maxTop = Math.max(12, window.innerHeight - terminalDragState.height - 12);
      const nextLeft = Math.min(Math.max(12, moveEvent.clientX - terminalDragState.offsetX), maxLeft);
      const nextTop = Math.min(Math.max(12, moveEvent.clientY - terminalDragState.offsetY), maxTop);
      popup.style.left = `${nextLeft}px`;
      popup.style.top = `${nextTop}px`;
    };

    terminalDragUpHandler = () => {
      if (!terminalDragState) return;
      terminalDragState = null;
      popup.classList.remove('dragging');
      window.removeEventListener('pointermove', terminalDragMoveHandler);
      window.removeEventListener('pointerup', terminalDragUpHandler);
      terminalDragMoveHandler = null;
      terminalDragUpHandler = null;
    };

    window.addEventListener('pointermove', terminalDragMoveHandler);
    window.addEventListener('pointerup', terminalDragUpHandler);
  });
  header.addEventListener('pointercancel', () => {
    if (terminalDragUpHandler) terminalDragUpHandler();
  });

  // Click outside to close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeTerminalPopup();
  });

  terminalPopupInstance = overlay;
  return overlay;
}

function openTerminalPopup() {
  if (isTerminalOpen) return;
  isTerminalOpen = true;
  terminalNeverOpened = false;

  // Remove launcher dot indicator
  const dot = document.querySelector('.terminal-launcher-dot');
  if (dot) dot.style.display = 'none';

  const overlay = createTerminalPopup();
  initPopupTerminal();

  requestAnimationFrame(() => {
    overlay.classList.add('active');
    const popup = overlay.querySelector('.terminal-popup');
    const popupRect = popup.getBoundingClientRect();
    popup.style.left = `${Math.max(16, (window.innerWidth - popupRect.width) / 2)}px`;
    popup.style.top = `${Math.max(16, (window.innerHeight - popupRect.height) / 2)}px`;
    popup.style.transform = 'none';
  });

  setTimeout(() => {
    const input = document.getElementById('popup-terminal-input');
    if (input) input.focus();
  }, 260);
}

function closeTerminalPopup() {
  if (!isTerminalOpen) return;
  isTerminalOpen = false;

  terminalDragState = null;

  const dot = document.querySelector('.terminal-launcher-dot');
  if (dot) dot.style.display = '';

  const overlay = terminalPopupInstance;
  if (!overlay) return;

  overlay.classList.remove('active');

  const launcher = document.querySelector('#terminal-popout-btn') || document.querySelector('.terminal-launcher');
  if (launcher) launcher.focus();

  setTimeout(() => {
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    terminalPopupInstance = null;
  }, 300);
}

function toggleTerminalPopup() {
  if (isTerminalOpen) {
    closeTerminalPopup();
  } else {
    openTerminalPopup();
  }
}

/**
 * Initializes the popup terminal by reusing the existing command engine.
 * This mirrors the exact logic from script.js's initTerminal() but
 * uses the popup's DOM elements.
 */
function initPopupTerminal() {
  const output = document.getElementById('popup-terminal-output');
  const input = document.getElementById('popup-terminal-input');
  const body = document.getElementById('popup-terminal-body');

  if (!output || !input || !body) return;

  // Redirect the global terminal references for command processing
  // We store originals and override
  const origOutput = document.getElementById('terminal-output');
  const origInput = document.getElementById('terminal-input');
  const origBody = document.getElementById('terminal-body');

  // Temporarily make popup elements the active terminal
  // by creating a proxy that the existing functions use
  window.__popupTerminalActive = true;
  window.__popupOutput = output;
  window.__popupInput = input;
  window.__popupBody = body;

  // Clear any previous content
  output.innerHTML = '';

  // Show welcome screen
  showPopupWelcome(output, input);

  // Set up input handlers
  input.addEventListener('keydown', popupHandleTerminalInput);
  input.addEventListener('focus', popupHandleInputFocus);
  body.addEventListener('click', () => input.focus());
  input.setAttribute('data-placeholder', 'Type a command...');
  input.textContent = '';

  // Focus
  setTimeout(() => input.focus(), 100);
}

function showPopupWelcome(output, input) {
  const welcome = document.createElement('div');
  welcome.style.cssText = 'color: var(--accent); font-family: "JetBrains Mono", monospace; margin-bottom: 1rem; line-height: 1.8;';
  welcome.innerHTML = `
    <div>Welcome to Subbu's Portfolio Terminal</div>
    <div style="color: var(--text-muted); margin-top: 0.3rem;">Type <span style="color: var(--accent);">help</span> to view available commands.</div>
  `;
  output.appendChild(welcome);
}

/**
 * Handles keyboard input for the popup terminal.
 * Reuses the same command processing logic from script.js.
 */
function popupHandleTerminalInput(event) {
  const input = event.currentTarget;
  const output = document.getElementById('popup-terminal-output');

  const key = event.key;

  if (key === 'Enter') {
    event.preventDefault();
    const command = input.textContent.trim();
    
    if (!command) return;

    // Create command line
    createPopupCommandLine(output, command);
    
    // Add to history
    if (typeof commandHistory !== 'undefined') {
      commandHistory.unshift(command);
      window.__popupHistoryIndex = -1;
    }

    // Process the command using existing logic
    processPopupCommand(output, command);

    input.textContent = '';
    return;
  }

  if (key === 'ArrowUp') {
    event.preventDefault();
    if (typeof commandHistory !== 'undefined' && commandHistory.length > 0) {
      if (typeof window.__popupHistoryIndex === 'undefined') window.__popupHistoryIndex = -1;
      window.__popupHistoryIndex = Math.min(window.__popupHistoryIndex + 1, commandHistory.length - 1);
      input.textContent = commandHistory[window.__popupHistoryIndex];
      placeCaretAtEnd(input);
    }
    return;
  }

  if (key === 'ArrowDown') {
    event.preventDefault();
    if (typeof window.__popupHistoryIndex !== 'undefined' && window.__popupHistoryIndex > 0) {
      window.__popupHistoryIndex -= 1;
      input.textContent = commandHistory[window.__popupHistoryIndex];
    } else {
      window.__popupHistoryIndex = -1;
      input.textContent = '';
    }
    placeCaretAtEnd(input);
    return;
  }

  if (key === 'Tab') {
    event.preventDefault();
    // Simple autocomplete: suggest first matching command
    const partial = input.textContent.trim().toLowerCase();
    if (partial && typeof supportedCommands !== 'undefined') {
      const match = Object.keys(supportedCommands).find(cmd => cmd.startsWith(partial));
      if (match) {
        input.textContent = match;
        placeCaretAtEnd(input);
      }
    }
    return;
  }

  if (key === 'l' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    output.innerHTML = '';
    showPopupWelcome(output, input);
    return;
  }
}

function popupHandleInputFocus() {
  const input = document.getElementById('popup-terminal-input');
  if (input && input.textContent.trim() === '') {
    input.textContent = '';
  }
}

function createPopupCommandLine(output, command) {
  const line = document.createElement('div');
  line.innerHTML = `<span class="terminal-prompt">$</span> <span class="output-command">${escapeHtml(command)}</span>`;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

function processPopupCommand(output, command) {
  const normalized = command.trim().toLowerCase();

  if (normalized === 'clear') {
    output.innerHTML = '';
    showPopupWelcome(output);
    return;
  }

  if (typeof supportedCommands !== 'undefined' && supportedCommands[normalized]) {
    const result = supportedCommands[normalized]();
    result.forEach(line => {
      const div = document.createElement('div');
      div.className = line.startsWith('•') ? 'output-bullet' : 'output-text';
      div.textContent = line;
      output.appendChild(div);
    });
  } else {
    const notFound = document.createElement('div');
    notFound.className = 'output-warning';
    notFound.textContent = 'Command not found.';
    output.appendChild(notFound);

    const hint = document.createElement('div');
    hint.className = 'output-text';
    hint.textContent = "Type 'help' to see available commands.";
    output.appendChild(hint);
  }

  output.scrollTop = output.scrollHeight;
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

/**
 * Initialize keyboard shortcuts.
 */
function initTerminalShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl+K or Cmd+K to toggle
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      toggleTerminalPopup();
      return;
    }

    // Backtick key to open
    if (e.key === '`' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const tag = document.activeElement?.tagName;
      if (tag !== 'INPUT' && tag !== 'TEXTAREA' && !document.activeElement?.isContentEditable) {
        e.preventDefault();
        openTerminalPopup();
      }
      return;
    }

    // ESC to close
    if (e.key === 'Escape' && isTerminalOpen) {
      closeTerminalPopup();
      return;
    }
  });
}

/**
 * ── Glitter Cursor Effect ────────────────────────────
 */
function initGlitterCursor() {
  if (!customCursorEnabled) return;

  let lastGlitterTime = 0;
  const glitterColors = [
    'rgba(0, 212, 170, 0.9)',
    'rgba(59, 130, 246, 0.9)',
    'rgba(52, 211, 153, 0.9)',
    'rgba(248, 250, 252, 0.8)',
    'rgba(0, 255, 145, 0.9)'
  ];

  document.addEventListener('pointermove', (event) => {
    const now = performance.now();
    if (now - lastGlitterTime < 50) return;
    lastGlitterTime = now;

    const particle = document.createElement('span');
    particle.className = 'glitter-particle';
    const size = 3 + Math.random() * 5;
    const color = glitterColors[Math.floor(Math.random() * glitterColors.length)];
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${event.clientX + (Math.random() - 0.5) * 12}px`;
    particle.style.top = `${event.clientY + (Math.random() - 0.5) * 12}px`;
    particle.style.background = `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)`;
    particle.style.boxShadow = `0 0 ${4 + Math.random() * 4}px ${color}`;

    document.body.appendChild(particle);

    particle.addEventListener('animationend', () => {
      particle.remove();
    });
  });
}

/**
 * Initialize everything: launcher, shortcuts, glitter cursor.
 */
function initTerminalPopup() {
  createTerminalLauncher();
  initTerminalShortcuts();
  initGlitterCursor();

  const popoutButton = document.getElementById('terminal-popout-btn');
  if (popoutButton) {
    popoutButton.addEventListener('click', openTerminalPopup);
  }
}
