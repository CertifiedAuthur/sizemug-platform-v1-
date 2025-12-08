class FireInstance {
  constructor(container) {
    this.container = container;
    this.element = null;
    this.particles = [];
    this.id = Date.now() + Math.random().toString(36).substr(2, 5);
    this.timeout = null;
    this.animation = null;
  }

  start() {
    // Create the fire animation element
    this.element = document.createElement("div");
    this.element.className = "fire-animation";

    // Position randomly within the container
    const posX = 20 + Math.random() * 60;
    const posY = 20 + Math.random() * 60;
    this.element.style.left = `${posX}%`;
    this.element.style.top = `${posY}%`;

    // Generate random user
    const users = [
      "Annette Black",
      "Alex Johnson",
      "Taylor Swift",
      "Chris Evans",
      "Emma Watson",
    ];
    const user = users[Math.floor(Math.random() * users.length)];
    const avatars = [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
      "https://images.unsplash.com/photo-1484515991647-c5760fcecfc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
    ];
    const avatar = avatars[Math.floor(Math.random() * avatars.length)];

    this.element.innerHTML = `
      <div class="fire-animation-text">
        <span>${user} Boosted the live!</span>
      </div>
      <div class="item-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 128 128">
          <radialGradient id="fireGradient0-${this.id}" cx="68.884" cy="124.296" r="70.587" gradientTransform="matrix(-1 -.00434 -.00713 1.6408 131.986 -79.345)" gradientUnits="userSpaceOnUse">
            <stop offset=".314" stop-color="#ff9800" />
            <stop offset=".662" stop-color="#ff6d00" />
            <stop offset=".972" stop-color="#f44336" />
          </radialGradient>
          <path fill="url(#fireGradient0-${this.id})" d="M35.56 40.73c-.57 6.08-.97 16.84 2.62 21.42c0 0-1.69-11.82 13.46-26.65c6.1-5.97 7.51-14.09 5.38-20.18c-1.21-3.45-3.42-6.3-5.34-8.29c-1.12-1.17-.26-3.1 1.37-3.03c9.86.44 25.84 3.18 32.63 20.22c2.98 7.48 3.2 15.21 1.78 23.07c-.9 5.02-4.1 16.18 3.2 17.55c5.21.98 7.73-3.16 8.86-6.14c.47-1.24 2.1-1.55 2.98-.56c8.8 10.01 9.55 21.8 7.73 31.95c-3.52 19.62-23.39 33.9-43.13 33.9c-24.66 0-44.29-14.11-49.38-39.65c-2.05-10.31-1.01-30.71 14.89-45.11c1.18-1.08 3.11-.12 2.95 1.5"/>
          <radialGradient id="fireGradient1-${this.id}" cx="64.921" cy="54.062" r="73.86" gradientTransform="matrix(-.0101 .9999 .7525 .0076 26.154 -11.267)" gradientUnits="userSpaceOnUse">
            <stop offset=".214" stop-color="#fff176" />
            <stop offset=".328" stop-color="#fff27d" />
            <stop offset=".487" stop-color="#fff48f" />
            <stop offset=".672" stop-color="#fff7ad" />
            <stop offset=".793" stop-color="#fff9c4" />
            <stop offset=".822" stop-color="#fff8bd" stop-opacity="0.804" />
            <stop offset=".863" stop-color="#fff6ab" stop-opacity="0.529" />
            <stop offset=".91" stop-color="#fff38d" stop-opacity="0.209" />
            <stop offset=".941" stop-color="#fff176" stop-opacity="0" />
          </radialGradient>
          <path fill="url(#fireGradient1-${this.id})" d="M76.11 77.42c-9.09-11.7-5.02-25.05-2.79-30.37c.3-.7-.5-1.36-1.13-.93c-3.91 2.66-11.92 8.92-15.65 17.73c-5.05 11.91-4.69 17.74-1.7 24.86c1.8 4.29-.29 5.2-1.34 5.36c-1.02.16-1.96-.52-2.71-1.23a16.1 16.1 0 0 1-4.44-7.6c-.16-.62-.97-.79-1.34-.28c-2.8 3.87-4.25 10.08-4.32 14.47C40.47 113 51.68 124 65.24 124c17.09 0 29.54-18.9 19.72-34.7c-2.85-4.6-5.53-7.61-8.85-11.88"/>
        </svg>
        <img src="${avatar}" />
      </div>
    `;

    this.container.appendChild(this.element);

    // Add fire animation effects
    this.animateFire();
    this.createFireParticles();

    // Remove after 3 seconds
    this.timeout = setTimeout(() => {
      this.removeFire();
    }, 3000);
  }

  animateFire() {
    const fireSvg = this.element.querySelector("svg");

    // Create pulsing animation
    this.animation = fireSvg.animate(
      [
        {
          transform: "scale(1)",
          filter: "drop-shadow(0 0 5px rgba(255, 100, 0, 0.7))",
        },
        {
          transform: "scale(1.2)",
          filter: "drop-shadow(0 0 15px rgba(255, 60, 0, 0.9))",
        },
        {
          transform: "scale(1)",
          filter: "drop-shadow(0 0 5px rgba(255, 100, 0, 0.7))",
        },
      ],
      { duration: 1000, iterations: 3 }
    );
  }

  createFireParticles() {
    const container = this.element.querySelector(".item-1");
    const colors = ["#ff6d00", "#ff9800", "#ff5722", "#ffeb3b"];

    for (let i = 0; i < 15; i++) {
      const particle = document.createElement("div");
      particle.classList.add("fire-particle");

      const size = Math.random() * 10 + 15;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const animationName = `fire-particle-${this.id}-${i}`;

      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        animation: ${animationName} ${
        Math.random() * 1000 + 500
      }ms ease-out forwards;
      `;

      container.appendChild(particle);
      this.particles.push(particle);

      const keyframes = `
        @keyframes ${animationName} {
          0% { transform: translate(0, 0); opacity: 1; }
          100% { 
            transform: translate(
              ${(Math.random() - 0.5) * 100}px, 
              ${Math.random() * -80 - 20}px
            ); 
            opacity: 0; 
          }
        }
      `;

      const style = document.createElement("style");
      style.textContent = keyframes;
      document.head.appendChild(style);
      this.particles.push(style);

      // Remove after animation
      setTimeout(() => {
        if (particle.parentNode) particle.parentNode.removeChild(particle);
        if (style.parentNode) style.parentNode.removeChild(style);
      }, 1500);
    }
  }

  removeFire() {
    // Remove the main element
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }

    // Cancel animation
    if (this.animation) {
      this.animation.cancel();
    }

    // Clear timeout
    clearTimeout(this.timeout);

    // Remove all particles
    this.particles.forEach((item) => {
      if (item.parentNode) {
        item.parentNode.removeChild(item);
      }
    });
  }
}

class CollaborationSendFire {
  constructor() {
    this.fireButton = document.querySelector(
      ".xo-header-right .xo-header-right-boost"
    );
    this.container = document.querySelector(".send-something-modal-wrapper");
    this.sendSomethingModal = document.getElementById("sendSomethingModal");
    this.activeFires = [];

    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.fireButton.addEventListener("click", () => this.sendFire());
  }

  sendFire() {
    // Show the modal if it's hidden
    this.sendSomethingModal.classList.remove("xo-hidden");

    // Create a new fire animation
    const fire = new FireInstance(this.container);
    fire.start();
    this.activeFires.push(fire);

    // Remove fire from activeFires when it's done
    setTimeout(() => {
      this.activeFires = this.activeFires.filter((f) => f !== fire);
      if (this.activeFires.length === 0) {
        this.sendSomethingModal.classList.add("xo-hidden");
      }
    }, 3000);
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new CollaborationSendFire();
});
