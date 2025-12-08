class LayerManager {
  constructor({ canvas, svg, stage, viewport }) {
    this.canvas = canvas;
    this.svg = svg;
    this.stage = stage;
    this.viewport = viewport;

    // keep the "base" z-index in case you need to temporarily boost one
    // Use balanced z-index where stage is on top by default for DOM elements
    // Canvas (ink) should be above SVG (grid) for better UX
    this.base = { svg: 1, canvas: 2, stage: 3 };
    this.restoreBaseZ();
  }

  restoreBaseZ() {
    this.canvas.style.zIndex = this.base.canvas;
    this.svg.style.zIndex = this.base.svg;
    this.stage.style.zIndex = this.base.stage;
  }

  // helper to set pointer-events on elements
  _setPointerEvents({ canvas = "none", svg = "none", stage = "none" } = {}) {
    // Use CSSOM priority to override any global !important rules
    this.canvas.style.setProperty("pointer-events", canvas, "important");
    this.svg.style.setProperty("pointer-events", svg, "important");
    this.stage.style.setProperty("pointer-events", stage, "important");
  }

  // Make one layer top visually (optional)
  _bringToFront(layer) {
    // do not overuse; only when visual top is required
    this.restoreBaseZ();
    if (layer === "canvas") {
      this.canvas.style.zIndex = 100;
      // ensure canvas is interactive when brought to front
      this.canvas.style.setProperty("pointer-events", "auto", "important");
    }
    if (layer === "svg") this.svg.style.zIndex = 100;
    if (layer === "stage") this.stage.style.zIndex = 100;
  }

  // Activate layer behavior for the named tool
  activateTool(tool) {
    // common mapping: pen -> canvas; shape/arrow/line -> svg; note -> stage;
    switch (tool) {
      case "arrow":
      case "pen":
      case "eraser":
        // Canvas must receive pointerdown so InkManager can capture pointer.
        this._setPointerEvents({ canvas: "auto", svg: "none", stage: "none" });
        // optional: bring canvas visually above others so stroke looks on top
        this._bringToFront("canvas");
        break;

      case "shape":
      case "line":
        // Create shapes on SVG
        this._setPointerEvents({ canvas: "none", svg: "auto", stage: "none" });
        this._bringToFront("svg");
        break;

      case "text":
      case "note":
      case "comment":
        // Create or edit notes on DOM stage
        this._setPointerEvents({ canvas: "none", svg: "none", stage: "auto" });
        this._bringToFront("stage");
        break;

      case "mind-map":
        // Mind map nodes are rendered in SVG, need SVG layer to receive events
        this._setPointerEvents({ canvas: "none", svg: "auto", stage: "none" });
        this._bringToFront("svg");
        break;

      case "pan":
        // Pan is normally managed by ZoomPanController; keep pointer-events on viewport,
        // but disable layers intercepting pointer down so viewport receives drag.
        // Make everything pass-through so viewport gets pointerdown
        this._setPointerEvents({ canvas: "none", svg: "none", stage: "none" });
        // don't change z-indices here
        this.restoreBaseZ();
        break;

      case "select":
      default:
        // SMART SELECTION: Canvas should be pointer-events none to allow clicks through to SVG
        // The capture-phase handler in WhiteboardApp will handle ink selection programmatically
        this._setPointerEvents({ canvas: "none", svg: "auto", stage: "none" });
        this.restoreBaseZ();

        // Ensure SVG interactive elements have pointer-events enabled
        const svgInteractiveElements = this.svg.querySelectorAll(".mindmap-node, .mindmap-plus-button, .shape-group");
        svgInteractiveElements.forEach((el) => {
          el.style.setProperty("pointer-events", "auto", "important");
        });

        // Enable pointer events only on actual stage elements, not the stage background
        // This allows SVG clicks to pass through empty stage areas
        const stageElements = this.stage.querySelectorAll("*");
        stageElements.forEach((el) => {
          // Only enable pointer events on actual content elements
          if (el.classList.contains("text-item") || el.classList.contains("note-item") || el.classList.contains("card-item") || el.classList.contains("flip-card-item") || el.classList.contains("frame-item") || el.classList.contains("person-item") || el.classList.contains("codeblock-item") || el.classList.contains("grid-table-item")) {
            el.style.setProperty("pointer-events", "auto", "important");
          }
        });
        break;
    }
  }
}
