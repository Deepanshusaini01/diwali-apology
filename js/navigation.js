/* ═══════════════════════════════════════════════════════════════
   navigation.js — Page navigation system (Fast & Reliable)
   Diwali Apology Website
   ═══════════════════════════════════════════════════════════════ */

const PAGES = [
  'index.html',
  'message.html',
  'apology.html',
  'reflection.html',
  'diya.html',
  'wishes.html',
  'final.html'
];

let isNavigating = false;

// ─── Get Current Page Index ──────────────────────────────────────────
function getCurrentPageIndex() {
  const path = window.location.pathname;
  const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

  const idx = PAGES.indexOf(filename);
  return idx >= 0 ? idx : 0;
}

// ─── Progress Indicator ─────────────────────────────────────────────
function createProgressIndicator() {
  // Avoid duplicate creation
  if (document.querySelector('.progress-bar-top')) return;

  const currentIndex = getCurrentPageIndex();

  // Top progress bar
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar-top';
  const pct = ((currentIndex + 1) / PAGES.length) * 100;
  progressBar.innerHTML = `<div class="progress-bar-fill" style="width: ${pct}%"></div>`;
  document.body.prepend(progressBar);

  // Dot indicators
  const container = document.createElement('div');
  container.className = 'progress-indicator';

  const dotsWrap = document.createElement('div');
  dotsWrap.className = 'progress-dots';

  for (let i = 0; i < PAGES.length; i++) {
    const dot = document.createElement('span');
    dot.className = 'progress-dot';
    if (i < currentIndex) {
      dot.classList.add('completed');
      dot.setAttribute('title', `Go to page ${i + 1}`);
      dot.style.cursor = 'pointer';
      dot.addEventListener('click', () => navigateTo(PAGES[i]));
    }
    if (i === currentIndex) dot.classList.add('active');
    dotsWrap.appendChild(dot);
  }

  const label = document.createElement('div');
  label.className = 'progress-label';
  label.textContent = `${currentIndex + 1} of ${PAGES.length}`;

  container.appendChild(dotsWrap);
  container.appendChild(label);

  progressBar.after(container);
}

// ─── Safe Navigate Function (No Sticking) ───────────────────────────
function navigateTo(url) {
  if (isNavigating) return;
  isNavigating = true;

  try {
    sessionStorage.setItem('diwali-prev-page', window.location.href);
  } catch (e) {}

  let overlay = document.querySelector('.page-transition-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    document.body.appendChild(overlay);
  }

  overlay.style.pointerEvents = 'all';
  overlay.classList.add('active');

  setTimeout(() => {
    window.location.href = url;
  }, 350);

  // Safety fallback if page change stalls
  setTimeout(() => {
    isNavigating = false;
    if (overlay) {
      overlay.classList.remove('active');
      overlay.style.pointerEvents = 'none';
    }
  }, 2000);
}

// Expose globally
window.navigateTo = navigateTo;

// ─── Auto-Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  createProgressIndicator();
  isNavigating = false;
});

window.addEventListener('pageshow', () => {
  isNavigating = false;
});
