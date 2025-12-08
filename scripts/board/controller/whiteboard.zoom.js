class ZoomPanController {
  constructor(viewportNode, onTransform) {
    this.viewport = d3.select(viewportNode);
    this.onTransform = onTransform;
    this.panEnabled = true;
    this.tool = "select";
    this.drawingMode = false;
    this.zoom = d3
      .zoom()
      .scaleExtent([0.2, 6])
      .on("zoom", (event) => {
        const t = event.transform;
        if (this.onTransform) this.onTransform(t);
      });
    this.zoom.filter(this._filter.bind(this));
    this.viewport.call(this.zoom);
  }

  _filter(event) {
    if (event.type === "wheel") return true;
    if (event.type === "touchstart" && event.touches && event.touches.length > 1) return true;
    if (event.type === "pointerdown" || event.type === "mousedown" || event.type === "touchstart") {
      if (!this.panEnabled) return false;
      if (this.drawingMode) return false;
      // Only allow drag panning when the active tool is explicit pan
      if (this.tool !== "pan") return false;
      const target = event.target;
      const tag = target && target.tagName && target.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || target.isContentEditable) return false;
      return true;
    }
    return false;
  }

  setPanEnabled(on) {
    this.panEnabled = !!on;
    this.zoom.filter(this._filter.bind(this));
  }
  setTool(tool) {
    this.tool = tool;
    this.zoom.filter(this._filter.bind(this));
  }
  setDrawingMode(on) {
    this.drawingMode = !!on;
    this.zoom.filter(this._filter.bind(this));
  }
  setTransform(transform) {
    this.viewport.transition().call(this.zoom.transform, transform);
  }
  getTransform() {
    return d3.zoomTransform(this.viewport.node());
  }
}
