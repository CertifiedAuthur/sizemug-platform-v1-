/* ============================================
   Colloquial Toggle Handler
   Handles orb color changes based on toggle state
   ============================================ */

class ColloquialToggleHandler {
  constructor() {
    this.mainToggle = null;
    this.sidebarToggle = null;
    this.isColloquialMode = true;
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setupToggles());
    } else {
      this.setupToggles();
    }
  }

  setupToggles() {
    // Get both toggle switches
    this.mainToggle = document.getElementById("switch-to-colloqual");
    this.sidebarToggle = document.getElementById("switch-to-colloqual-sidebar");

    if (!this.mainToggle && !this.sidebarToggle) {
      console.warn("Colloquial toggles not found");
      return;
    }

    // Set initial state based on main toggle (checked by default = normal colors)
    if (this.mainToggle) {
      this.isColloquialMode = this.mainToggle.checked;
      this.updateOrbColors(this.isColloquialMode);
    }

    // Listen for main toggle changes
    if (this.mainToggle) {
      this.mainToggle.addEventListener("change", (e) => {
        this.isColloquialMode = e.target.checked;
        this.updateOrbColors(this.isColloquialMode);
        // Sync sidebar toggle
        if (this.sidebarToggle) {
          this.sidebarToggle.checked = this.isColloquialMode;
        }
      });
    }

    // Listen for sidebar toggle changes
    if (this.sidebarToggle) {
      this.sidebarToggle.addEventListener("change", (e) => {
        this.isColloquialMode = e.target.checked;
        this.updateOrbColors(this.isColloquialMode);
        // Sync main toggle
        if (this.mainToggle) {
          this.mainToggle.checked = this.isColloquialMode;
        }
      });
    }
  }

  updateOrbColors(isColloquial) {
    // Get all gradient orbs inside the AI modal only
    const modalOrbs = document.querySelectorAll(".ai_modal .gradient-orb");
    const sgWavyToneSelector = document.getElementById("sgWavyToneSelector");
    const colloquialContentToggles = document.querySelectorAll(".colloquial-content-toggle");

    if (isColloquial) {
      // Checked = Normal colors (default gradient colors)
      modalOrbs.forEach((orb) => {
        orb.classList.remove("orb-red");
      });

      if (sgWavyToneSelector) {
        sgWavyToneSelector.setAttribute("data-title", "colloquial");
      }
      colloquialContentToggles.forEach((content) => (content.textContent = "Colloquial Tone"));
    } else {
      // Unchecked = Red colors
      modalOrbs.forEach((orb) => {
        orb.classList.add("orb-red");
      });

      if (sgWavyToneSelector) {
        sgWavyToneSelector.setAttribute("data-title", "normal");
      }
      colloquialContentToggles.forEach((content) => (content.textContent = "Normal Tone"));
    }
  }

  // Public method to manually toggle state
  setColloquialState(isColloquial) {
    this.isColloquialMode = isColloquial;
    if (this.mainToggle) {
      this.mainToggle.checked = isColloquial;
    }
    if (this.sidebarToggle) {
      this.sidebarToggle.checked = isColloquial;
    }
    this.updateOrbColors(isColloquial);
  }

  // Public method to get current state
  getColloquialState() {
    return this.isColloquialMode;
  }

  // Public method to toggle between states
  toggleColloquialState() {
    this.setColloquialState(!this.isColloquialMode);
  }
}

// Make it globally available
window.ColloquialToggleHandler = ColloquialToggleHandler;

// Auto-initialize
window.colloquialToggle = new ColloquialToggleHandler();
