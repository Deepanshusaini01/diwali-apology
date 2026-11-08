/* ═══════════════════════════════════════════════════════════════
   PARTICLES.JS — Floating Particles, Marigolds, Petals & Lanterns
   Diwali Apology Website
   ═══════════════════════════════════════════════════════════════ */

/**
 * Creates falling rose or marigold petals
 */
function createFallingPetals(container, count = 12, colors = ['#f7a8b8', '#e05577', '#ff9aa2', '#C74728', '#D4A64A']) {
  if (!container) container = document.querySelector('.floating-container') || document.body;

  for (let i = 0; i < count; i++) {
    const petal = document.createElement('div');
    petal.className = 'floating-petal';

    const size = Math.random() * 10 + 8;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const duration = Math.random() * 10 + 12;
    const delay = Math.random() * 15;
    const startLeft = Math.random() * 100;

    petal.style.cssText = `
      position: absolute;
      top: -30px;
      left: ${startLeft}%;
      width: ${size}px;
      height: ${size * 1.2}px;
      background: radial-gradient(ellipse at 30% 30%, #fff, ${color});
      border-radius: 50% 0 50% 50%;
      opacity: 0.65;
      pointer-events: none;
      filter: blur(0.5px);
      animation: petalFall ${duration}s linear ${delay}s infinite;
      z-index: 1;
    `;

    container.appendChild(petal);
  }
}

/**
 * Creates golden marigold petals
 */
function createMarigoldPetals(container, count = 12) {
  const marigoldColors = ['#D4A64A', '#FFD783', '#ff8c00', '#C74728', '#ffa500'];
  createFallingPetals(container, count, marigoldColors);
}

/**
 * Creates gently floating lanterns
 */
function createFloatingLanterns(container, count = 4) {
  if (!container) container = document.querySelector('.floating-container') || document.body;

  for (let i = 0; i < count; i++) {
    const lantern = document.createElement('div');
    lantern.className = 'floating-lantern';
    lantern.textContent = '🏮';

    const duration = Math.random() * 15 + 25;
    const delay = Math.random() * 20;
    const startLeft = Math.random() * 90 + 5;
    const size = Math.random() * 0.8 + 1.2;

    lantern.style.cssText = `
      position: absolute;
      bottom: -60px;
      left: ${startLeft}%;
      font-size: ${size}rem;
      opacity: 0.55;
      pointer-events: none;
      filter: drop-shadow(0 0 12px rgba(255, 180, 0, 0.6));
      animation: floatUpSlow ${duration}s ease-in-out ${delay}s infinite, lanternSwing 4s ease-in-out infinite;
      z-index: 1;
    `;

    container.appendChild(lantern);
  }
}

/**
 * Creates subtle twinkling golden particles
 */
function createGoldenParticles(container, count = 25) {
  if (!container) container = document.querySelector('.floating-container') || document.body;

  for (let i = 0; i < count; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'golden-sparkle';

    const size = Math.random() * 3 + 2;
    const duration = Math.random() * 3 + 2;
    const delay = Math.random() * 5;
    const top = Math.random() * 100;
    const left = Math.random() * 100;

    sparkle.style.cssText = `
      position: absolute;
      top: ${top}%;
      left: ${left}%;
      width: ${size}px;
      height: ${size}px;
      background: #FFD783;
      border-radius: 50%;
      box-shadow: 0 0 8px #FFD783, 0 0 16px #D4A64A;
      opacity: 0.4;
      pointer-events: none;
      animation: sparkleTwinkle ${duration}s ease-in-out ${delay}s infinite;
      z-index: 1;
    `;

    container.appendChild(sparkle);
  }
}

// Aliases for compatibility
function initGoldenParticles() {
  const container = document.querySelector('.floating-container') || document.body;
  createGoldenParticles(container, 25);
}

function addFloatingLanterns(count = 3) {
  const container = document.querySelector('.floating-container') || document.body;
  createFloatingLanterns(container, count);
}

// Add animation keyframe for upward floating lanterns dynamically if not present
if (!document.getElementById('lantern-keyframe-style')) {
  const style = document.createElement('style');
  style.id = 'lantern-keyframe-style';
  style.textContent = `
    @keyframes floatUpSlow {
      0% {
        transform: translateY(0);
        opacity: 0;
      }
      10% {
        opacity: 0.55;
      }
      90% {
        opacity: 0.55;
      }
      100% {
        transform: translateY(-115vh);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// Global exposure
window.createFallingPetals = createFallingPetals;
window.createMarigoldPetals = createMarigoldPetals;
window.createFloatingLanterns = createFloatingLanterns;
window.createGoldenParticles = createGoldenParticles;
window.initGoldenParticles = initGoldenParticles;
window.addFloatingLanterns = addFloatingLanterns;

