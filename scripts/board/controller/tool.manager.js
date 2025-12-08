class ToolManager extends EventTarget {
  constructor(initial = "select") {
    super();
    this._active = initial;
    this._prevNonPen = "select";
  }

  set(tool) {
    if (!tool || tool === this._active) return;
    const prev = this._active;
    this._active = tool;
    if (tool !== "pen") this._prevNonPen = tool;
    this.dispatchEvent(new CustomEvent("change", { detail: { tool, previous: prev } }));
  }

  get() {
    return this._active;
  }

  getPreviousNonPen() {
    return this._prevNonPen;
  }

  onChange(cb) {
    // convenience: return an unsubscribe function
    const handler = (e) => cb(e.detail);
    this.addEventListener("change", handler);
    return () => this.removeEventListener("change", handler);
  }
}
