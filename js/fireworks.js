/* ═══════════════════════════════════════
   fireworks.js — Canvas-based fireworks system
   Diwali Apology Website
   ═══════════════════════════════════════ */

class FireworksEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.fireworks = [];
    this.particles = [];
    this.running = false;
    this.spawnRate = 0.02;
    this.resize();
    this._resizeHandler = () => this.resize();
    window.addEventListener('resize', this._resizeHandler);
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  start(spawnRate = 0.02) {
    if (!this.canvas) return;
    this.running = true;
    this.spawnRate = spawnRate;
    this.animate();
  }

  stop() {
    this.running = false;
  }

  addRocket() {
    if (!this.canvas) return;
    this._spawnFirework();
    if (!this.running) {
      this.running = true;
      this.animate();
    }
  }

  _randomColor() {
    const colors = ['#FFD783', '#C74728', '#D4A64A', '#FFF1D6', '#ff69b4', '#ff8c00', '#FFB347'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  _spawnFirework() {
    const x = Math.random() * this.canvas.width;
    const targetY = 60 + Math.random() * (this.canvas.height * 0.4);
    this.fireworks.push({
      x: x,
      y: this.canvas.height,
      targetY: targetY,
      speed: 3 + Math.random() * 3,
      color: this._randomColor(),
      trail: [],
      alive: true
    });
  }

  _explode(fw) {
    const count = 40 + Math.floor(Math.random() * 21); // 40-60
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
      const speed = 1 + Math.random() * 3.5;
      const life = 60 + Math.floor(Math.random() * 41); // 60-100
      this.particles.push({
        x: fw.x,
        y: fw.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: fw.color,
        life: life,
        maxLife: life,
        size: 1.5 + Math.random() * 2,
        trail: []
      });
    }
  }

  burst(x, y, count = 50) {
    if (!this.canvas) return;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 1.5 + Math.random() * 4;
      const life = 60 + Math.floor(Math.random() * 41);
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: this._randomColor(),
        life: life,
        maxLife: life,
        size: 1.5 + Math.random() * 2.5,
        trail: []
      });
    }
    if (!this.running) {
      this.running = true;
      this._drainOnly = true;
      this.animate();
    }
  }

  animate() {
    if (!this.running) return;
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;

    // Clear with semi-transparent black for trail effect
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';

    // Maybe spawn new firework
    if (!this._drainOnly && Math.random() < this.spawnRate) {
      this._spawnFirework();
    }

    // Update and draw fireworks (ascending rockets)
    this.fireworks = this.fireworks.filter(fw => {
      fw.trail.push({ x: fw.x, y: fw.y });
      if (fw.trail.length > 8) fw.trail.shift();

      fw.y -= fw.speed;

      // Draw trail
      for (let i = 0; i < fw.trail.length; i++) {
        const t = fw.trail[i];
        const alpha = (i + 1) / fw.trail.length * 0.6;
        ctx.beginPath();
        ctx.arc(t.x, t.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = fw.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Draw head
      ctx.beginPath();
      ctx.arc(fw.x, fw.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = fw.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = fw.color;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Check if reached target
      if (fw.y <= fw.targetY) {
        this._explode(fw);
        return false;
      }
      return true;
    });

    // Update and draw explosion particles
    this.particles = this.particles.filter(p => {
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 6) p.trail.shift();

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.03; // gravity
      p.vx *= 0.99;
      p.life--;

      const alpha = p.life / p.maxLife;

      // Draw trail
      for (let i = 0; i < p.trail.length; i++) {
        const t = p.trail[i];
        const ta = (i + 1) / p.trail.length * alpha * 0.4;
        ctx.beginPath();
        ctx.arc(t.x, t.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = ta;
        ctx.fill();
      }

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.shadowBlur = 6;
      ctx.shadowColor = p.color;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      return p.life > 0;
    });

    // If drain-only mode and nothing left, stop
    if (this._drainOnly && this.fireworks.length === 0 && this.particles.length === 0) {
      this.running = false;
      this._drainOnly = false;
      // Clear canvas fully
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, W, H);
      return;
    }

    requestAnimationFrame(() => this.animate());
  }
}

// ─── Global Export ───────────────────────────────────────────────────
window.FireworksEngine = FireworksEngine;

function initFireworks(canvasId, spawnRate) {
  const engine = new FireworksEngine(canvasId);
  if (engine.canvas) engine.start(spawnRate);
  return engine;
}

window.initFireworks = initFireworks;
