class Tooltip {
  constructor(tooltipSelector = "#global-tooltip") {
    this.tooltip = document.querySelector(tooltipSelector);
    if (!this.tooltip) {
      throw new Error(`Tooltip container not found: ${tooltipSelector}`);
    }

    // bind methods
    this._onMouseOver = this._onMouseOver.bind(this);
    this._onMouseOut = this._onMouseOut.bind(this);

    // attach global listeners
    document.addEventListener("mouseover", this._onMouseOver);
    document.addEventListener("mouseout", this._onMouseOut);
  }

  _onMouseOver(e) {
    const el = e.target.closest("[data-tooltip]");
    if (!el) return;

    this.tooltip.textContent = el.dataset.tooltip;
    this.tooltip.setAttribute("data-show", "true");
    this.tooltip.setAttribute("aria-hidden", "false");

    this._position(el);
  }

  _onMouseOut(e) {
    const el = e.target.closest("[data-tooltip]");
    if (!el) return;

    this.tooltip.removeAttribute("data-show");
    this.tooltip.setAttribute("aria-hidden", "true");
  }

  _position(el) {
    const rect = el.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    // directly set style props on the fixed tooltip
    Object.assign(this.tooltip.style, {
      left: `${x}px`,
      top: `${y - 25}px`,
    });
  }

  // If you ever want to destroy the tooltip:
  destroy() {
    document.removeEventListener("mouseover", this._onMouseOver);
    document.removeEventListener("mouseout", this._onMouseOut);
    this.tooltip.remove();
  }
}

// --- initialize it once, anywhere in your app ---
document.addEventListener("DOMContentLoaded", () => {
  new Tooltip();
});
