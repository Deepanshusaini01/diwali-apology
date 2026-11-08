/* ═══════════════════════════════════════════════════════════════
   DIYA.JS — Interactive Diya Lighting Experience (Mobile Friendly)
   Diwali Apology Website (diya.html)
   ═══════════════════════════════════════════════════════════════ */

class DiyaExperience {
  constructor() {
    this.isLit = false;
    this.flame = document.getElementById('diya-flame');
    this.ambient = document.getElementById('diya-ambient');
    this.button = document.getElementById('light-diya-btn');
    this.continueBtn = document.getElementById('diya-continue-btn');
    this.message = document.getElementById('diya-message');
    this.stage = document.getElementById('diya-stage');
    this.canvas = document.getElementById('diya-particle-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.particles = [];
    this.animating = false;

    this.init();
  }

  init() {
    if (this.button) {
      this.button.addEventListener('click', () => this.light());
    }
    if (this.stage) {
      this.stage.style.cursor = 'pointer';
      this.stage.addEventListener('click', () => {
        if (!this.isLit) this.light();
      });
    }
  }

  light() {
    if (this.isLit) return;
    this.isLit = true;

    // 1. Animate flame & ambient light
    if (this.flame) this.flame.classList.add('lit');
    if (this.ambient) this.ambient.classList.add('lit');

    // 2. Update button state
    if (this.button) {
      this.button.disabled = true;
      this.button.innerHTML = '🪔 Diya Is Glowing';
      this.button.style.background = 'linear-gradient(135deg, #7a5a2a, #4a3818)';
      this.button.style.borderColor = 'rgba(212, 166, 74, 0.4)';
      this.button.style.boxShadow = '0 0 15px rgba(255, 180, 0, 0.2)';
      this.button.style.cursor = 'default';
    }

    // 3. Trigger Particle Burst on canvas
    this.createBurst();

    // 4. Reveal heartfelt message
    setTimeout(() => {
      if (this.message) this.message.classList.add('visible');
    }, 500);

    // 5. Unlock and highlight Continue button
    setTimeout(() => {
      if (this.continueBtn) {
        this.continueBtn.style.opacity = '1';
        this.continueBtn.style.pointerEvents = 'all';
        this.continueBtn.style.filter = 'none';
        this.continueBtn.style.boxShadow = '0 0 30px rgba(255, 215, 131, 0.7)';
      }
    }, 1100);

    // 6. Fireworks celebration trigger if available
    if (window.fireworksInstance) {
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          if (typeof window.fireworksInstance.addRocket === 'function') {
            window.fireworksInstance.addRocket();
          }
        }, i * 350);
      }
    }
  }

  createBurst() {
    if (!this.canvas || !this.ctx) return;

    this.canvas.width = 500;
    this.canvas.height = 500;

    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2 - 20;
    const colors = ['#FFF1D6', '#FFD783', '#D4A64A', '#ff9900', '#ff6600'];

    this.particles = [];
    const count = window.innerWidth < 600 ? 50 : 80;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1;
      this.particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: Math.random() * 2.8 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: Math.random() * 50 + 50
      });
    }

    if (!this.animating) {
      this.animating = true;
      this.animateParticles();
    }
  }

  animateParticles() {
    if (!this.animating || !this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let activeCount = 0;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (p.life < p.maxLife) {
        activeCount++;
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
        p.vx *= 0.985;

        const progress = p.life / p.maxLife;
        const alpha = Math.max(0, 1 - progress);

        this.ctx.save();
        this.ctx.globalAlpha = alpha;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = p.color;
        this.ctx.fill();
        this.ctx.restore();
      }
    }

    if (activeCount > 0) {
      requestAnimationFrame(() => this.animateParticles());
    } else {
      this.animating = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new DiyaExperience();
});
