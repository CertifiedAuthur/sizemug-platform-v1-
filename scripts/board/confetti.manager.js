class ConfettiManager {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animationId = null;
    this.isActive = false;

    this.createCanvas();
    this.bindEvents();
  }

  createCanvas() {
    // Create canvas for confetti
    this.canvas = document.createElement("canvas");
    this.canvas.id = "confetti-canvas";
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 10000;
      background: transparent;
    `;

    this.ctx = this.canvas.getContext("2d");
    this.resizeCanvas();

    document.body.appendChild(this.canvas);
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  bindEvents() {
    window.addEventListener("resize", () => this.resizeCanvas());
  }

  createParticle(x, y, type = "confetti") {
    const colors = {
      wave: ["#4FC3F7", "#29B6F6", "#03A9F4", "#0288D1", "#0277BD"],
      smile: ["#FFD54F", "#FFCA28", "#FFC107", "#FFB300", "#FFA000"],
      heart: ["#F06292", "#EC407A", "#E91E63", "#D81B60", "#C2185B"],
      confetti: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"],
    };

    const particleColors = colors[type] || colors.confetti;

    return {
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 10,
      vy: Math.random() * -15 - 5,
      gravity: 0.3,
      life: 1.0,
      decay: Math.random() * 0.02 + 0.01,
      size: Math.random() * 8 + 4,
      color: particleColors[Math.floor(Math.random() * particleColors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      type: type,
      shape: Math.random() > 0.5 ? "circle" : "square",
    };
  }

  createEmojiParticle(x, y, emoji) {
    return {
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * -12 - 3,
      gravity: 0.2,
      life: 1.0,
      decay: Math.random() * 0.015 + 0.008,
      size: Math.random() * 20 + 15,
      emoji: emoji,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
      type: "emoji",
    };
  }

  drawParticle(particle) {
    this.ctx.save();
    this.ctx.globalAlpha = particle.life;
    this.ctx.translate(particle.x, particle.y);
    this.ctx.rotate((particle.rotation * Math.PI) / 180);

    if (particle.type === "emoji") {
      this.ctx.font = `${particle.size}px Arial`;
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(particle.emoji, 0, 0);
    } else {
      this.ctx.fillStyle = particle.color;

      if (particle.shape === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        this.ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
      }
    }

    this.ctx.restore();
  }

  updateParticle(particle) {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += particle.gravity;
    particle.life -= particle.decay;
    particle.rotation += particle.rotationSpeed;

    return particle.life > 0;
  }

  animate() {
    if (!this.isActive) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw particles
    this.particles = this.particles.filter((particle) => {
      const alive = this.updateParticle(particle);
      if (alive) {
        this.drawParticle(particle);
      }
      return alive;
    });

    // Continue animation if particles exist
    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      this.stop();
    }
  }

  start() {
    console.log("ConfettiManager: Starting animation with", this.particles.length, "particles");
    this.isActive = true;
    this.canvas.style.display = "block";
    this.animate();
  }

  stop() {
    this.isActive = false;
    this.canvas.style.display = "none";
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.particles = [];
  }

  // Main confetti effects
  showWaveConfetti(x = window.innerWidth / 2, y = window.innerHeight / 2) {
    console.log(`ConfettiManager: showWaveConfetti called at (${x}, ${y})`);
    this.stop(); // Clear any existing animation

    // Create wave-like burst pattern
    for (let i = 0; i < 50; i++) {
      const angle = (i / 50) * Math.PI * 2;
      const radius = Math.random() * 100 + 50;
      const particleX = x + Math.cos(angle) * radius;
      const particleY = y + Math.sin(angle) * radius;

      this.particles.push(this.createParticle(particleX, particleY, "wave"));
    }

    // Add some wave emojis
    for (let i = 0; i < 8; i++) {
      const offsetX = (Math.random() - 0.5) * 200;
      const offsetY = (Math.random() - 0.5) * 100;
      this.particles.push(this.createEmojiParticle(x + offsetX, y + offsetY, "👋"));
    }

    console.log(`Created ${this.particles.length} particles`);
    this.start();
  }

  showSmileConfetti(x = window.innerWidth / 2, y = window.innerHeight / 2) {
    console.log(`ConfettiManager: showSmileConfetti called at (${x}, ${y})`);
    this.stop(); // Clear any existing animation

    // Create happy burst pattern
    for (let i = 0; i < 60; i++) {
      this.particles.push(this.createParticle(x + (Math.random() - 0.5) * 300, y + (Math.random() - 0.5) * 200, "smile"));
    }

    // Add smile emojis
    for (let i = 0; i < 10; i++) {
      const offsetX = (Math.random() - 0.5) * 250;
      const offsetY = (Math.random() - 0.5) * 150;
      this.particles.push(this.createEmojiParticle(x + offsetX, y + offsetY, "😊"));
    }

    console.log(`Created ${this.particles.length} particles`);
    this.start();
  }

  showHeartConfetti(x = window.innerWidth / 2, y = window.innerHeight / 2) {
    console.log(`ConfettiManager: showHeartConfetti called at (${x}, ${y})`);
    this.stop(); // Clear any existing animation

    // Create heart-shaped burst
    for (let i = 0; i < 40; i++) {
      // Heart shape mathematics
      const t = (i / 40) * Math.PI * 2;
      const heartX = 16 * Math.pow(Math.sin(t), 3);
      const heartY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

      this.particles.push(this.createParticle(x + heartX * 3 + (Math.random() - 0.5) * 50, y + heartY * 3 + (Math.random() - 0.5) * 50, "heart"));
    }

    // Add heart emojis
    for (let i = 0; i < 12; i++) {
      const offsetX = (Math.random() - 0.5) * 200;
      const offsetY = (Math.random() - 0.5) * 150;
      this.particles.push(this.createEmojiParticle(x + offsetX, y + offsetY, "❤️"));
    }

    console.log(`Created ${this.particles.length} particles`);
    this.start();
  }

  // Generic confetti burst
  showConfetti(x = window.innerWidth / 2, y = window.innerHeight / 2, count = 50) {
    this.stop(); // Clear any existing animation

    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle(x + (Math.random() - 0.5) * 100, y + (Math.random() - 0.5) * 50, "confetti"));
    }

    this.start();
  }

  destroy() {
    this.stop();
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    window.removeEventListener("resize", () => this.resizeCanvas());
  }
}

// Create global instance
window.confettiManager = new ConfettiManager();
