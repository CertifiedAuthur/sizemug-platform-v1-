/**
 * Live Stream Fullscreen Mode Handler
 * - Robust cross-browser Fullscreen API detection
 * - Proper event binding/unbinding so exit works reliably
 * - CSS-based fallback (enter/exit) when native API is unavailable
 */
class LiveStreamFullscreenMode {
  constructor() {
    this.isFullscreen = false;
    this.originalStyles = null;
    this.fullscreenContainer = null;
    this.fullscreenButton = null;

    // Bind handlers so we can remove them later
    this._onFullscreenChange = this._onFullscreenChange.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onVisibilityChange = this._onVisibilityChange.bind(this);
    this._onResize = this._onResize.bind(this);

    // Detect API
    this.fullscreenAPI = this.getFullscreenAPI();

    this.init();
  }

  // Return an object with helper functions and the correct event name
  getFullscreenAPI() {
    const doc = document;
    const el = document.documentElement;

    const api = {
      request: null, // function to request full screen on an element (call with .call(el))
      exit: null, // function to exit fullscreen (call with .call(document))
      isEnabled: () => !!(doc.fullscreenEnabled || doc.webkitFullscreenEnabled || doc.mozFullScreenEnabled || doc.msFullscreenEnabled),
      getElement: () => doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement || null,
      eventName: "fullscreenchange",
    };

    // request
    api.request = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen || null;

    // exit
    api.exit = doc.exitFullscreen || doc.webkitExitFullscreen || doc.mozCancelFullScreen || doc.msExitFullscreen || null;

    // event name detection (prefer browser-specific if available)
    if ("onfullscreenchange" in doc) api.eventName = "fullscreenchange";
    else if ("onwebkitfullscreenchange" in doc) api.eventName = "webkitfullscreenchange";
    else if ("onmozfullscreenchange" in doc) api.eventName = "mozfullscreenchange";
    else if ("onmsfullscreenchange" in doc) api.eventName = "MSFullscreenChange";

    return api;
  }

  init() {
    this.fullscreenContainer = document.getElementById("liveScreenView");
    this.fullscreenButton = document.getElementById("requestLiveStreamFullscreenMode");

    if (!this.fullscreenContainer || !this.fullscreenButton) {
      console.warn("Fullscreen elements not found");
      return;
    }

    this.addEventListeners();
  }

  addEventListeners() {
    // Button click
    this.fullscreenButton.addEventListener("click", () => this.toggleFullscreen());

    // Keydown handler
    document.addEventListener("keydown", this._onKeyDown);

    // Visibility change
    document.addEventListener("visibilitychange", this._onVisibilityChange);

    // Fullscreen change event (cross-browser)
    document.addEventListener(this.fullscreenAPI.eventName, this._onFullscreenChange);

    // Resize (useful for CSS fallback adjustments)
    window.addEventListener("resize", this._onResize);
  }

  // Toggle
  toggleFullscreen() {
    if (this.isFullscreen) this.exitFullscreen();
    else this.enterFullscreen();
  }

  // Enter full screen: prefer native API, fallback to CSS
  async enterFullscreen() {
    try {
      if (!this.fullscreenContainer) return;

      if (this.fullscreenAPI.request && this.fullscreenAPI.isEnabled()) {
        // call request on the actual element (some prefixed implementations need element context)
        await this.fullscreenAPI.request.call(this.fullscreenContainer);
        // Browser will dispatch the fullscreenchange event which will set isFullscreen
      } else {
        // CSS fallback
        this.enterCSSFullscreen();
        this.isFullscreen = true;
      }
    } catch (err) {
      console.warn("Fullscreen request failed, using CSS fallback:", err);
      this.enterCSSFullscreen();
      this.isFullscreen = true;
    }
  }

  // Exit full screen: prefer native API, fallback to CSS exit
  async exitFullscreen() {
    try {
      if (this.fullscreenAPI.exit && this.fullscreenAPI.getElement()) {
        // call the exit on document context
        await this.fullscreenAPI.exit.call(document);
        // browser will dispatch fullscreenchange -> _onFullscreenChange will run
      } else if (this.isCSSFullscreen()) {
        this.exitCSSFullscreen();
        this.isFullscreen = false;
      } else {
        // If native exit isn't available but we still consider ourselves fullscreen, try CSS exit
        if (this.isFullscreen) {
          this.exitCSSFullscreen();
          this.isFullscreen = false;
        }
      }
    } catch (err) {
      console.warn("Exit fullscreen failed:", err);
      // Ensure CSS fallback cleanup
      if (this.isCSSFullscreen()) {
        this.exitCSSFullscreen();
        this.isFullscreen = false;
      }
    }
  }

  // Handler for cross-browser fullscreen change events
  _onFullscreenChange() {
    const current = this.fullscreenAPI.getElement();
    this.isFullscreen = !!current;

    // Update UI class on the container if needed
    if (this.isFullscreen) {
      this.fullscreenContainer.classList.add("is-fullscreen");
    } else {
      this.fullscreenContainer.classList.remove("is-fullscreen");
      // If we fell back to CSS earlier, ensure cleanup
      if (this.isCSSFullscreen()) {
        this.exitCSSFullscreen();
      }
    }
  }

  _onKeyDown(e) {
    // Esc: if browser exits, fullscreenchange will run; but we can proactively call exit
    if (e.key === "Escape" && this.isFullscreen) {
      this.exitFullscreen();
    }

    // F11 toggles
    if (e.key === "F11") {
      e.preventDefault();
      this.toggleFullscreen();
    }
  }

  _onVisibilityChange() {
    if (document.hidden && this.isFullscreen) {
      // If page hidden, exit fullscreen for safety
      this.exitFullscreen();
    }
  }

  _onResize() {
    // If CSS fallback is active, we might want to keep it full viewport (no-op if handled by CSS)
    if (this.isCSSFullscreen()) {
      // no-op but placeholder for further logic
    }
  }

  /* -------------------- CSS Fullscreen fallback -------------------- */

  // helper: detect if we previously set css-fullscreen on container
  isCSSFullscreen() {
    return !!(this.fullscreenContainer && this.fullscreenContainer.classList.contains("css-fullscreen"));
  }

  enterCSSFullscreen() {
    if (!this.fullscreenContainer || this.isCSSFullscreen()) return;

    // Save inline styles we will overwrite
    this.originalStyles = {
      position: this.fullscreenContainer.style.position || "",
      top: this.fullscreenContainer.style.top || "",
      left: this.fullscreenContainer.style.left || "",
      width: this.fullscreenContainer.style.width || "",
      height: this.fullscreenContainer.style.height || "",
      zIndex: this.fullscreenContainer.style.zIndex || "",
    };

    // Apply full viewport styles
    Object.assign(this.fullscreenContainer.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      zIndex: "99999",
    });

    // Prevent body scroll while in CSS fullscreen
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    this.fullscreenContainer.classList.add("css-fullscreen");
    this.fullscreenContainer.classList.add("is-fullscreen");
  }

  exitCSSFullscreen() {
    if (!this.fullscreenContainer || !this.isCSSFullscreen()) return;

    // Restore original inline styles
    const s = this.originalStyles || {};
    Object.assign(this.fullscreenContainer.style, {
      position: s.position,
      top: s.top,
      left: s.left,
      width: s.width,
      height: s.height,
      zIndex: s.zIndex,
    });

    // Restore body scroll
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";

    this.fullscreenContainer.classList.remove("css-fullscreen", "is-fullscreen");
    this.originalStyles = null;
  }

  /* -------------------- Cleanup -------------------- */

  destroy() {
    // Exit fullscreen if active
    if (this.isFullscreen) {
      try {
        // prefer native exit
        if (this.fullscreenAPI.exit && this.fullscreenAPI.getElement()) {
          this.fullscreenAPI.exit.call(document);
        } else if (this.isCSSFullscreen()) {
          this.exitCSSFullscreen();
        }
      } catch (err) {
        // swallow
      }
    }

    // Remove bound listeners
    document.removeEventListener(this.fullscreenAPI.eventName, this._onFullscreenChange);
    document.removeEventListener("keydown", this._onKeyDown);
    document.removeEventListener("visibilitychange", this._onVisibilityChange);
    window.removeEventListener("resize", this._onResize);

    // Remove any added classes or styles
    if (this.isCSSFullscreen()) this.exitCSSFullscreen();

    // Null references
    this.fullscreenContainer = null;
    this.fullscreenButton = null;
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.liveStreamFullscreen = new LiveStreamFullscreenMode();
});

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = LiveStreamFullscreenMode;
}
