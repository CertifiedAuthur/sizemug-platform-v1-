class GridManager {
  constructor(svgDefs, svgGroup, initialSize = 20) {
    this.defs = svgDefs;
    this.svgGroup = svgGroup;
    this.gridSize = initialSize;
    this.gridVisible = true;
    this.snapToGrid = true;
    this.gridRect = null;
    this.createPattern();
    this.ensureGridRect();
  }

  createPattern() {
    this.defs.select("#gridPattern").remove();
    const size = this.gridSize;
    const pat = this.defs.append("pattern").attr("id", "gridPattern").attr("width", size).attr("height", size).attr("patternUnits", "userSpaceOnUse");
    pat.append("path").attr("d", `M ${size} 0 L 0 0 0 ${size}`).attr("fill", "none").attr("stroke", "#e6e6e6").attr("stroke-width", 1);
  }

  ensureGridRect() {
    if (this.gridRect) this.gridRect.remove();
    this.gridRect = this.svgGroup
      .insert("rect", ":first-child")
      .attr("x", -20000)
      .attr("y", -20000)
      .attr("width", 40000)
      .attr("height", 40000)
      .attr("fill", this.gridVisible ? "url(#gridPattern)" : "none");
  }

  setGridSize(size) {
    this.gridSize = Math.max(4, Math.round(size));
    this.createPattern();
    this.updateGridVisibility();
  }

  updateGridVisibility() {
    if (!this.gridRect) this.ensureGridRect();
    this.gridRect.attr("fill", this.gridVisible ? "url(#gridPattern)" : "none");
  }

  setGridVisible(on) {
    this.gridVisible = !!on;
    this.updateGridVisibility();
  }
  setSnap(on) {
    this.snapToGrid = !!on;
  }

  worldSnap(x, y) {
    if (!this.snapToGrid) return { x, y };
    return { x: Math.round(x / this.gridSize) * this.gridSize, y: Math.round(y / this.gridSize) * this.gridSize };
  }
}
