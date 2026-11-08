/* ═══════════════════════════════════════════════════════════════
   common.js — Shared utilities for every page
   Diwali Apology Website (Optimized & Mobile Smooth)
   ═══════════════════════════════════════════════════════════════ */

// ─── Music Controller ────────────────────────────────────────────────
class MusicController {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.gainNode = null;
    this.oscillators = [];
    this.intervalId = null;
    this.wasPlaying = localStorage.getItem('diwali-music') === 'playing';
  }

  init() {
    if (this.audioCtx) return;

    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
      this.gainNode.gain.linearRampToValueAtTime(0.025, this.audioCtx.currentTime + 0.5);
      this.gainNode.connect(this.audioCtx.destination);

      // Indian-inspired pentatonic: Sa Re Ga Pa Dha (C4 D4 E4 G4 A4)
      const notes = [261.63, 293.66, 329.63, 392.0, 440.0];
      const lowNotes = notes.map(f => f / 2);

      // Drone (tanpura-like)
      const droneFreqs = [lowNotes[0], lowNotes[4]];
      droneFreqs.forEach(freq => {
        const osc = this.audioCtx.createOscillator();
        const oscGain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
        oscGain.gain.setValueAtTime(0.35, this.audioCtx.currentTime);
        osc.connect(oscGain);
        oscGain.connect(this.gainNode);
        osc.start();
        this.oscillators.push({ osc, gain: oscGain });
      });

      // Melodic voice — sitar-like with gentle vibrato
      const melodyOsc = this.audioCtx.createOscillator();
      const melodyGain = this.audioCtx.createGain();
      const vibrato = this.audioCtx.createOscillator();
      const vibratoGain = this.audioCtx.createGain();

      melodyOsc.type = 'triangle';
      melodyGain.gain.setValueAtTime(0.28, this.audioCtx.currentTime);

      vibrato.type = 'sine';
      vibrato.frequency.setValueAtTime(5.5, this.audioCtx.currentTime);
      vibratoGain.gain.setValueAtTime(3, this.audioCtx.currentTime);

      vibrato.connect(vibratoGain);
      vibratoGain.connect(melodyOsc.frequency);
      melodyOsc.connect(melodyGain);
      melodyGain.connect(this.gainNode);

      vibrato.start();
      melodyOsc.start();

      this.oscillators.push({ osc: melodyOsc, gain: melodyGain });
      this.oscillators.push({ osc: vibrato, gain: vibratoGain });

      // Melody sequence
      const pattern = [0, 2, 4, 3, 2, 0, 1, 3, 4, 2, 0, 1, 0, 3, 4, 2];
      let step = 0;
      this.intervalId = setInterval(() => {
        if (!this.isPlaying || !this.audioCtx) return;
        const note = notes[pattern[step % pattern.length]];
        const now = this.audioCtx.currentTime;
        melodyOsc.frequency.setValueAtTime(melodyOsc.frequency.value, now);
        melodyOsc.frequency.linearRampToValueAtTime(note, now + 0.15);
        melodyGain.gain.setValueAtTime(0.32, now);
        melodyGain.gain.linearRampToValueAtTime(0.12, now + 1.2);
        step++;
      }, 1400);

      this.isPlaying = true;
      localStorage.setItem('diwali-music', 'playing');
    } catch (e) {
      console.warn('AudioContext not supported or restricted', e);
    }
  }

  toggle() {
    if (!this.audioCtx) {
      this.init();
      this._updateButton();
      return;
    }

    if (this.isPlaying) {
      if (this.gainNode) {
        this.gainNode.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 0.3);
      }
      this.isPlaying = false;
      localStorage.setItem('diwali-music', 'muted');
    } else {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      if (this.gainNode) {
        this.gainNode.gain.linearRampToValueAtTime(0.025, this.audioCtx.currentTime + 0.3);
      }
      this.isPlaying = true;
      localStorage.setItem('diwali-music', 'playing');
    }
    this._updateButton();
  }

  createButton() {
    const btn = document.createElement('button');
    btn.className = 'music-toggle';
    btn.setAttribute('aria-label', 'Toggle background music');
    btn.textContent = '🔇';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });
    document.body.appendChild(btn);
    this._btn = btn;

    if (this.wasPlaying) {
      btn.classList.add('hint');
      btn.textContent = '🎵';
      setTimeout(() => btn.classList.remove('hint'), 3000);
    }
  }

  _updateButton() {
    if (!this._btn) return;
    this._btn.textContent = this.isPlaying ? '🎵' : '🔇';
  }
}

// ─── Scroll Reveal (Robust & Never Stuck) ─────────────────────────────
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '40px 0px 40px 0px' }
    );

    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  // Failsafe timer: ensures content is NEVER stuck invisible on mobile
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => el.classList.add('visible'));
  }, 700);
}

// ─── Throttled Touch / Click Sparkles ─────────────────────────────────
let lastSparkleTime = 0;
function initSparkle() {
  const triggerSparkle = (x, y) => {
    const now = Date.now();
    if (now - lastSparkleTime < 180) return; // throttle to avoid mobile lag
    lastSparkleTime = now;

    const count = 4;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div');
      dot.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 4px;
        height: 4px;
        background: #FFD783;
        border-radius: 50%;
        pointer-events: none;
        z-index: 99999;
        box-shadow: 0 0 6px 2px rgba(255, 215, 131, 0.6);
        transition: transform 0.5s cubic-bezier(.25,.46,.45,.94), opacity 0.5s ease;
        opacity: 1;
      `;
      document.body.appendChild(dot);

      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const dist = 20 + Math.random() * 25;
      requestAnimationFrame(() => {
        dot.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0)`;
        dot.style.opacity = '0';
      });

      setTimeout(() => dot.remove(), 550);
    }
  };

  document.addEventListener('click', (e) => {
    if (e.target.closest('button, a, .nav-buttons, .music-toggle, input, textarea, select')) return;
    triggerSparkle(e.clientX, e.clientY);
  }, { passive: true });
}

// ─── Ensure Overlay Clears (Fix Stuck Transitions) ───────────────────
function clearPageOverlay() {
  const overlay = document.querySelector('.page-transition-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    overlay.style.pointerEvents = 'none';
  }
}

// ─── Page Initialization ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const music = new MusicController();
  music.createButton();

  initScrollReveal();
  initSparkle();

  if (typeof initParticles === 'function') {
    initParticles();
  }

  clearPageOverlay();
});

// Clear overlay on pageshow (Safari / Chrome back-forward cache)
window.addEventListener('pageshow', () => {
  clearPageOverlay();
});

// Window load safety check
window.addEventListener('load', () => {
  clearPageOverlay();
  // Ensure all reveals are active
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => el.classList.add('visible'));
  }, 400);
});
