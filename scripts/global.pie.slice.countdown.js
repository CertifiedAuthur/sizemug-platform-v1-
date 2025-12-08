class PieCountdown {
  /**
   * @param {HTMLElement} el  — .countdown element
   * @param {number} seconds  — total duration in seconds
   */
  constructor(el, seconds) {
    this.el = el;
    //     this.label = el.querySelector(".label");
    this.totalMs = seconds * 1000;
    this.startTime = null;
    this.rafId = null;
  }

  start() {
    // record when we begin
    this.startTime = performance.now();
    // kick off the loop
    this.rafId = requestAnimationFrame(this._animate.bind(this));
  }

  _animate(now) {
    const elapsed = now - this.startTime;
    const remainingMs = Math.max(this.totalMs - elapsed, 0);
    // compute fraction [0..1]
    const frac = remainingMs / this.totalMs;
    // update CSS var and label
    this.el.style.setProperty("--pct", frac * 100);
    //     this.label.textContent = `${Math.ceil(remainingMs / 1000)}s`;

    if (remainingMs > 0) {
      // keep going next frame
      this.rafId = requestAnimationFrame(this._animate.bind(this));
    } else {
      // done
      cancelAnimationFrame(this.rafId);
    }
  }

  stop() {
    cancelAnimationFrame(this.rafId);
    this.el.style.setProperty("--pct", 0);
    //     this.label.textContent = "0s";
  }
}

// initialize all countdowns on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".pie-slice-countdown").forEach((div) => {
    const secs = parseInt(div.dataset.seconds, 10) || 0;
    const cd = new PieCountdown(div, secs);
    cd.start();
  });
});
