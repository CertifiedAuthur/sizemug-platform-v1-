// --- Emoji Particle ---
class Particle {
  constructor(width, height, emojis) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.emojis = emojis;
    this.reset(true); // Initial reset with random y-position
  }

  reset(initial = false) {
    this.x = Math.random() * this.canvasWidth;
    this.y = initial ? Math.random() * this.canvasHeight : -30;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = Math.random() * 5 + 5; // Increased falling speed (5-10px/frame)
    this.size = Math.random() * 30 + 20;
    this.rotation = Math.random() * 360;
    this.spin = (Math.random() - 0.5) * 10;
    this.char = this.emojis[Math.floor(Math.random() * this.emojis.length)];
    this.opacity = Math.random() * 0.5 + 0.5;
    this.hasFallen = false; // Track if particle has completed its fall
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.spin;

    // Mark as fallen when below canvas, but don't reset
    if (this.y - this.size > this.canvasHeight) {
      this.hasFallen = true;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.font = `${this.size}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(this.char, 0, 0);
    ctx.restore();
  }
}

// --- Emoji Confetti ---
class Confetti {
  constructor(canvas, { count = 100, emojis = ["🎉", "✨", "💥", "🎊", "🧨"] } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.count = count;
    this.emojis = emojis;
    this.particles = [];
    this._running = false;

    this._onResize = this._onResize.bind(this);
    this._frame = this._frame.bind(this);

    this._init();
  }

  _init() {
    window.addEventListener("resize", this._onResize);
    this._onResize();
    this._createParticles();
  }

  _onResize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    if (this.particles.length) {
      this.particles.forEach((p) => {
        p.canvasWidth = this.width;
        p.canvasHeight = this.height;
      });
    }
  }

  _createParticles() {
    this.particles = [];
    for (let i = 0; i < this.count; i++) {
      this.particles.push(new Particle(this.width, this.height, this.emojis));
    }
  }

  start() {
    if (!this._running) {
      this._running = true;
      requestAnimationFrame(this._frame);
    }
  }

  stop() {
    this._running = false;
  }

  _frame() {
    if (!this._running) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    let allFallen = true;
    for (const p of this.particles) {
      if (!p.hasFallen) {
        p.update();
        p.draw(this.ctx);
        allFallen = false;
      }
    }

    // Stop animation when all particles have fallen
    if (allFallen) {
      this.stop();
    } else {
      requestAnimationFrame(this._frame);
    }
  }
}

// --- Rectangle Confetti ---
class RectParticle {
  constructor(w, h, colors) {
    this.canvasWidth = w;
    this.canvasHeight = h;
    this.colors = colors;
    this.reset();
  }

  reset() {
    // start somewhere just above the top
    this.x = Math.random() * this.canvasWidth;
    this.y = -Math.random() * 20;
    // size variation
    this.w = Math.random() * 8 + 4;
    this.h = Math.random() * 16 + 8;
    // velocity (px/sec)
    this.vx = (Math.random() - 0.5) * 100;
    this.vy = Math.random() * 200 + 200;
    // rotation & tilt speeds
    this.rot = Math.random() * Math.PI * 2;
    this.spin = (Math.random() - 0.5) * 10; // radians/sec
    this.tilt = (Math.random() - 0.5) * 0.5; // small angle change
    // color front/back
    this.front = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.back = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.flipped = false;
  }

  update(delta) {
    // move
    this.x += this.vx * delta;
    this.y += this.vy * delta;
    // rotate & tilt flip
    this.rot += this.spin * delta;
    this.tilt += 4 * delta; // control flip speed
    // flip color every half‑turn
    if (Math.sin(this.tilt) < 0) this.flipped = true;
    else this.flipped = false;

    // if off bottom or sides, reset
    if (this.y - this.h > this.canvasHeight || this.x + this.w < 0 || this.x - this.w > this.canvasWidth) {
      this.reset();
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    // simulate tilt by squashing height
    const tiltFactor = Math.abs(Math.sin(this.tilt));
    ctx.scale(1, tiltFactor);
    ctx.fillStyle = this.flipped ? this.back : this.front;
    ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
    ctx.restore();
  }
}

// --- Rectangle Confetti ---
class RectangleConfetti {
  constructor(canvas, { count = 300, colors } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.count = count;
    this.colors = colors || ["#FFC107", "#FF3D00", "#4CAF50", "#2196F3", "#9C27B0", "#FFEB3B"];
    this.particles = [];
    this.running = false;
    this.lastTime = null;
    this._resize = this._resize.bind(this);
    this._frame = this._frame.bind(this);
    window.addEventListener("resize", this._resize);
    this._resize();
    this._makeParticles();
  }

  _resize() {
    this.W = this.canvas.width = window.innerWidth;
    this.H = this.canvas.height = window.innerHeight;
    if (this.particles.length) {
      this.particles.forEach((p) => {
        p.canvasWidth = this.W;
        p.canvasHeight = this.H;
      });
    }
  }

  _makeParticles() {
    this.particles = [];
    for (let i = 0; i < this.count; i++) {
      this.particles.push(new RectParticle(this.W, this.H, this.colors));
    }
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = null;
    requestAnimationFrame(this._frame);
  }

  stop() {
    this.running = false;
  }

  _frame(timestamp) {
    if (!this.running) return;
    if (!this.lastTime) this.lastTime = timestamp;
    const delta = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    this.ctx.clearRect(0, 0, this.W, this.H);
    for (let p of this.particles) {
      p.update(delta);
      p.draw(this.ctx);
    }
    requestAnimationFrame(this._frame);
  }
}

// Burst Confetti: Burst Rectangle and emoji
class BurstConfetti {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.particles = [];
    this.running = false;
    this.lastTime = null;

    this._onResize = this._onResize.bind(this);
    this._frame = this._frame.bind(this);
    window.addEventListener("resize", this._onResize);
    this._onResize();
  }

  _onResize() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.floor(window.innerWidth * dpr);
    this.canvas.height = Math.floor(window.innerHeight * dpr);
    this.canvas.style.width = window.innerWidth + "px";
    this.canvas.style.height = window.innerHeight + "px";
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.W = window.innerWidth;
    this.H = window.innerHeight;
  }

  // options: count, origin {x,y} in px (default center), spread (deg, 0..360),
  // angle (deg, center direction), speed (min,max px/s), gravity, decay, colors, emojis, shape ('rect'|'emoji')
  burst({
    count = 120,
    origin = { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    spread = 360,
    angle = -90, // degrees, if spread < 360 this is centre direction
    speed = { min: 200, max: 700 },
    gravity = 800, // px/s^2 downward
    decay = 0.9, // per second multiplier on speed (air resistance-ish)
    colors = ["#FFC107", "#FF3D00", "#4CAF50", "#2196F3", "#9C27B0", "#FFEB3B"],
    emojis = ["🎉", "✨", "💥", "🎊", "🧨"],
    shape = "rect",
    size = { min: 6, max: 14 }, // for rect: width/height, for emoji: font size
    duration = 3000, // max life ms
  } = {}) {
    this.stop(); // clear any current run
    this.particles = [];

    const now = performance.now();
    for (let i = 0; i < count; i++) {
      const ang = angle - spread / 2 + Math.random() * spread;
      const rad = (ang * Math.PI) / 180;
      const sp = speed.min + Math.random() * (speed.max - speed.min);
      const vx = Math.cos(rad) * sp;
      const vy = Math.sin(rad) * sp;
      const life = 800 + Math.random() * (duration - 800);
      const s = size.min + Math.random() * (size.max - size.min);

      const p = {
        x: origin.x,
        y: origin.y,
        vx,
        vy,
        ax: 0,
        ay: gravity,
        spin: (Math.random() - 0.5) * 6, // rad/s
        rot: Math.random() * Math.PI * 2,
        size: s,
        born: now,
        life,
        decay,
        shape,
        color: colors[Math.floor(Math.random() * colors.length)],
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        opacity: 1,
      };
      this.particles.push(p);
    }

    this.running = true;
    this.lastTime = null;
    requestAnimationFrame(this._frame);
  }

  stop() {
    this.running = false;
    this.particles = [];
    this.clearCanvas();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.W, this.H);
    // this.canvas.remove();
  }

  _frame(ts) {
    if (!this.running) return;
    if (!this.lastTime) this.lastTime = ts;
    const dt = (ts - this.lastTime) / 1000; // seconds
    this.lastTime = ts;

    // Clear with slight alpha fade (optional). For crisp, fully clear:
    this.ctx.clearRect(0, 0, this.W, this.H);

    const now = performance.now();
    // Update and draw
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      const age = now - p.born;
      if (age > p.life) {
        this.particles.splice(i, 1);
        continue;
      }

      // Integrate
      // apply acceleration
      p.vx += p.ax * dt;
      p.vy += p.ay * dt;
      // apply decay (simple damping)
      const damp = Math.pow(p.decay, dt);
      p.vx *= damp;
      p.vy *= damp;

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.spin * dt;

      // fade out near end of life
      p.opacity = Math.max(0, 1 - age / p.life);

      // draw
      this.ctx.save();
      this.ctx.globalAlpha = p.opacity;
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rot);

      if (p.shape === "rect") {
        // simple rectangle with front/back illusion by rotation
        const w = p.size;
        const h = p.size * (1.3 + Math.sin(age / 100) * 0.2);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-w / 2, -h / 2, w, h);
      } else {
        // emoji
        this.ctx.font = `${p.size}px sans-serif`;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(p.emoji, 0, 0);
      }

      this.ctx.restore();
    }

    if (this.particles.length === 0) {
      this.running = false;
      this.clearCanvas();
      return;
    }

    requestAnimationFrame(this._frame);
  }

  destroy() {
    this.stop();
    window.removeEventListener("resize", this._onResize);
    this.clearCanvas();
  }
}

// --- Scaling Center Emoji Animation ---
class ScalingEmojiAnimation {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    // Animation state
    this.running = false;
    this.phase = "scaling"; // 'scaling', 'bursting', 'finished'
    this.startTime = null;
    this.lastTime = null;

    // Scaling emoji properties
    this.emoji = null;
    this.baseSize = 60;
    this.currentSize = 0;
    this.maxSize = 120;
    this.scalePhase = 0;
    this.centerX = 0;
    this.centerY = 0;
    this.opacity = 1;

    // Burst particles
    this.particles = [];

    // Configuration
    this.config = {
      scaleDuration: 3000, // 3 seconds of scaling
      scaleSpeed: 2, // Speed of pulsing
      burstCount: 150,
      burstSpeed: { min: 200, max: 700 },
      burstGravity: 800,
      burstDuration: 2500,
      ...options,
    };

    // Bind methods
    this._onResize = this._onResize.bind(this);
    this._frame = this._frame.bind(this);

    // Setup
    this.setupCanvas();
    window.addEventListener("resize", this._onResize);
  }

  setupCanvas() {
    this._onResize();
    this.canvas.style.position = "fixed";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.pointerEvents = "none";
    this.canvas.style.zIndex = "9999";
    this.canvas.style.background = "transparent";
  }

  _onResize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.floor(window.innerWidth * dpr);
    this.canvas.height = Math.floor(window.innerHeight * dpr);
    this.canvas.style.width = window.innerWidth + "px";
    this.canvas.style.height = window.innerHeight + "px";
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;

    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = "high";
  }

  // Start the scaling animation
  startScaling(emoji, config = {}) {
    // Merge config
    Object.assign(this.config, config);

    // Reset state
    this.emoji = emoji;
    this.phase = "scaling";
    this.currentSize = 0;
    this.scalePhase = 0;
    this.opacity = 1;
    this.particles = [];
    this.startTime = null;
    this.lastTime = null;

    // Start animation
    this.running = true;
    requestAnimationFrame(this._frame);
  }

  // Create burst particles from the center emoji
  createBurstParticles() {
    const particles = [];
    const colors = this.getEmojiColors(this.emoji);

    for (let i = 0; i < this.config.burstCount; i++) {
      const angle = (360 / this.config.burstCount) * i + Math.random() * 30;
      const rad = (angle * Math.PI) / 180;
      const speed = this.config.burstSpeed.min + Math.random() * (this.config.burstSpeed.max - this.config.burstSpeed.min);

      const particle = {
        x: this.centerX,
        y: this.centerY,
        vx: Math.cos(rad) * speed,
        vy: Math.sin(rad) * speed,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        emoji: this.getRandomBurstEmoji(this.emoji),
        shape: Math.random() > 0.3 ? "emoji" : "rect", // 70% emoji, 30% rect
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 10,
        life: this.config.burstDuration,
        born: performance.now(),
        opacity: 1,
        gravity: this.config.burstGravity,
        bounce: 0.6,
        decay: 0.98,
      };

      particles.push(particle);
    }

    return particles;
  }

  // Get colors based on emoji type
  getEmojiColors(emoji) {
    const colorMap = {
      "❤️": ["#ff69b4", "#ff1493", "#dc143c", "#ff6b6b"],
      "💖": ["#ff69b4", "#ff1493", "#dc143c", "#ff6b6b"],
      "💕": ["#ff69b4", "#ff1493", "#dc143c", "#ff6b6b"],
      "💗": ["#ff69b4", "#ff1493", "#dc143c", "#ff6b6b"],
      "😊": ["#ffd700", "#ffeb3b", "#ff9800", "#4caf50"],
      "🤗": ["#ffd700", "#ffeb3b", "#ff9800", "#4caf50"],
      "😋": ["#ffd700", "#ffeb3b", "#ff9800", "#4caf50"],
      "😝": ["#ffd700", "#ffeb3b", "#ff9800", "#4caf50"],
      "👋": ["#4ecdc4", "#45b7d1", "#96ceb4", "#26a69a"],
      "🙌": ["#4ecdc4", "#45b7d1", "#96ceb4", "#26a69a"],
      "👏": ["#4ecdc4", "#45b7d1", "#96ceb4", "#26a69a"],
      "🚀": ["#ff6b35", "#ffd700", "#ff69b4", "#4ecdc4"],
      "⚡": ["#ffd700", "#ffeb3b", "#ff9800"],
      "🔥": ["#ff6b35", "#ff5722", "#ff9800"],
      "💥": ["#ff6b6b", "#4ecdc4", "#45b7d1"],
    };

    return colorMap[emoji] || ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7"];
  }

  // Get smaller emojis for burst effect
  getRandomBurstEmoji(mainEmoji) {
    const burstMap = {
      "❤️": ["💕", "💖", "💗", "💓", "❣️"],
      "💖": ["💕", "❤️", "💗", "💓", "❣️"],
      "💕": ["💖", "❤️", "💗", "💓", "❣️"],
      "💗": ["💕", "💖", "❤️", "💓", "❣️"],
      "😊": ["😁", "🙂", "😄", "😃", "🥰"],
      "🤗": ["😊", "😁", "🙂", "😄", "😃"],
      "😋": ["😊", "😁", "🙂", "😄", "😃"],
      "😝": ["😊", "😁", "🙂", "😄", "😃"],
      "👋": ["✋", "🤚", "🖐️", "👌", "👍"],
      "🙌": ["👋", "✋", "🤚", "🖐️", "👏"],
      "👏": ["👋", "🙌", "✋", "🤚", "👍"],
      "🚀": ["⭐", "🌟", "✨", "💫", "🔥"],
      "⚡": ["🚀", "⭐", "🌟", "✨", "💫"],
      "🔥": ["🚀", "⚡", "⭐", "🌟", "✨"],
      "💥": ["🚀", "⚡", "🔥", "⭐", "🌟"],
    };

    const burstEmojis = burstMap[mainEmoji] || ["✨", "💫", "⭐", "🌟"];
    return burstEmojis[Math.floor(Math.random() * burstEmojis.length)];
  }

  _frame(timestamp) {
    if (!this.running) return;

    if (!this.startTime) this.startTime = timestamp;
    if (!this.lastTime) this.lastTime = timestamp;

    const totalTime = timestamp - this.startTime;
    const deltaTime = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.phase === "scaling") {
      // Scaling phase
      if (totalTime < this.config.scaleDuration) {
        // Animate scaling with pulsing effect
        this.scalePhase += deltaTime * this.config.scaleSpeed;
        const progress = totalTime / this.config.scaleDuration;
        const baseScale = Math.min(progress * 2, 1); // Grow to full size in first half
        const pulse = 1 + Math.sin(this.scalePhase) * 0.15; // ±15% pulsing
        this.currentSize = this.baseSize * baseScale * pulse;

        // Slight opacity pulsing for extra effect
        this.opacity = 0.9 + Math.sin(this.scalePhase * 1.5) * 0.1;

        this.drawCenterEmoji();
      } else {
        // Transition to burst phase
        this.phase = "bursting";
        this.particles = this.createBurstParticles();
        this.startTime = timestamp; // Reset timer for burst phase
      }
    } else if (this.phase === "bursting") {
      // Draw fading center emoji briefly
      if (totalTime < 300) {
        // Show for 300ms while bursting
        const fadeProgress = totalTime / 300;
        this.opacity = 1 - fadeProgress;
        this.currentSize = this.baseSize * (1 + fadeProgress * 0.5); // Slight grow
        this.drawCenterEmoji();
      }

      // Update and draw burst particles
      let aliveParticles = 0;
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const particle = this.particles[i];
        const age = timestamp - particle.born;

        if (age > particle.life) {
          this.particles.splice(i, 1);
          continue;
        }

        aliveParticles++;

        // Update particle physics
        particle.vy += particle.gravity * deltaTime;
        particle.vx *= Math.pow(particle.decay, deltaTime);
        particle.vy *= Math.pow(particle.decay, deltaTime);

        particle.x += particle.vx * deltaTime;
        particle.y += particle.vy * deltaTime;
        particle.rotation += particle.spin * deltaTime;

        // Boundary bouncing
        if (particle.y > this.height - particle.size && particle.vy > 0) {
          particle.y = this.height - particle.size;
          particle.vy *= -particle.bounce;
        }

        // Fade out over time
        const lifeProgress = age / particle.life;
        particle.opacity = Math.max(0, 1 - lifeProgress);

        // Draw particle
        this.drawBurstParticle(particle);
      }

      // End animation when all particles are gone
      if (aliveParticles === 0) {
        this.phase = "finished";
        this.running = false;
        return;
      }
    }

    if (this.running) {
      requestAnimationFrame(this._frame);
    }
  }

  drawCenterEmoji() {
    this.ctx.save();
    this.ctx.globalAlpha = this.opacity;
    this.ctx.translate(this.centerX, this.centerY);

    // Add glow effect for special emojis
    if (["❤️", "💖", "🔥", "✨", "⚡"].includes(this.emoji)) {
      const glowColor = this.emoji === "🔥" ? "#ff6b35" : this.emoji === "✨" || this.emoji === "⚡" ? "#ffd700" : "#ff69b4";
      this.ctx.shadowColor = glowColor;
      this.ctx.shadowBlur = 20;
      this.ctx.shadowOffsetX = 0;
      this.ctx.shadowOffsetY = 0;
    }

    this.ctx.font = `${this.currentSize}px sans-serif`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(this.emoji, 0, 0);

    this.ctx.restore();
  }

  drawBurstParticle(particle) {
    this.ctx.save();
    this.ctx.globalAlpha = particle.opacity;
    this.ctx.translate(particle.x, particle.y);
    this.ctx.rotate(particle.rotation);

    if (particle.shape === "emoji") {
      this.ctx.font = `${particle.size}px sans-serif`;
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(particle.emoji, 0, 0);
    } else {
      this.ctx.fillStyle = particle.color;
      const w = particle.size;
      const h = particle.size * 1.5;
      this.ctx.fillRect(-w / 2, -h / 2, w, h);
    }

    this.ctx.restore();
  }

  stop() {
    this.running = false;
    this.particles = [];
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  destroy() {
    this.stop();
    window.removeEventListener("resize", this._onResize);
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// --- Enhanced Manager for Scaling Animation ---
class ScalingBurstManager {
  constructor() {
    this.instance = null;
    this.emojiMap = {
      heart: "❤️",
      smile: "😊",
      wave: "👋",
      boost: "🚀",
    };
  }

  triggerScalingBurst(emojiType, config = {}) {
    // Create canvas if needed
    if (!this.instance) {
      let canvas = document.getElementById("scalingBurstCanvas");
      if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.id = "scalingBurstCanvas";
        document.body.appendChild(canvas);
      }

      this.instance = new ScalingEmojiAnimation(canvas);
    }

    // Get the emoji for this type
    const emoji = this.emojiMap[emojiType] || "❤️";

    // Custom configurations for each type
    const typeConfigs = {
      heart: {
        baseSize: 80,
        maxSize: 140,
        scaleDuration: 3500,
        burstCount: 120,
        scaleSpeed: 1.8,
      },
      smile: {
        baseSize: 75,
        maxSize: 130,
        scaleDuration: 3000,
        burstCount: 150,
        scaleSpeed: 2.2,
      },
      wave: {
        baseSize: 70,
        maxSize: 125,
        scaleDuration: 3200,
        burstCount: 100,
        scaleSpeed: 2.0,
      },
      boost: {
        baseSize: 85,
        maxSize: 150,
        scaleDuration: 4000,
        burstCount: 200,
        scaleSpeed: 1.5,
      },
    };

    const finalConfig = { ...typeConfigs[emojiType], ...config };

    // Start the scaling animation
    this.instance.startScaling(emoji, finalConfig);
  }

  destroy() {
    if (this.instance) {
      this.instance.destroy();
      this.instance = null;
    }
  }
}

const scalingBurstManager = new ScalingBurstManager();

// Expose classes globally for use in other scripts
window.RectangleConfetti = RectangleConfetti;
window.BurstConfetti = BurstConfetti;
window.Confetti = Confetti;
window.ScalingEmojiAnimation = ScalingEmojiAnimation;
window.ScalingBurstManager = ScalingBurstManager;
window.scalingBurstManager = scalingBurstManager;
