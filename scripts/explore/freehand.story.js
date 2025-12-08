import { getStroke } from "https://cdn.skypack.dev/perfect-freehand";

// showFlashMessage("Text copied to clipboard successfully!", "", "success", 2000);

class FreehandDrawing {
  constructor(options = {}) {
    // Default options
    this.options = {
      size: 16,
      thinning: 0.5,
      smoothing: 0.6,
      strokeColor: "#000000",
      ...options,
    };

    // inside constructor or init
    this.brushPresets = {
      marker: {
        // chunky, soft semi-transparent marker-like fill
        pf: { size: 24, thinning: 0.6, smoothing: 0.7 },
        svg: { render: "fill", opacity: 0.85, filter: "marker-blur", blend: "normal" },
      },
      ink: {
        // sharp ink pen — smaller, less thinning so edges are crisp
        pf: { size: 8, thinning: 0.1, smoothing: 0.5 },
        svg: { render: "stroke", strokeWidthFactor: 1.0, strokeLineCap: "round", strokeLineJoin: "round", opacity: 1 },
      },
      pencil: {
        // faint stroke, a little jitter — use stroke with lower opacity
        pf: { size: 6, thinning: 0.4, smoothing: 0.45 },
        svg: { render: "stroke", strokeWidthFactor: 0.8, opacity: 0.6, filter: "pencil-grain" },
      },
      calligraphy: {
        // thick variable-width lines — increase thinning negative-ish for contrast
        pf: { size: 28, thinning: -0.2, smoothing: 0.6 },
        svg: { render: "fill", opacity: 1, blend: "normal" },
      },
      dashed: {
        pf: { size: 12, thinning: 0.5, smoothing: 0.6 },
        svg: { render: "stroke", strokeDasharray: "8 6", strokeWidthFactor: 1, strokeLineCap: "round", opacity: 1 },
      },
    };
    this.currentPreset = "marker";

    const { element, canvasEditorContainer } = this._getActiveEditingFreehandElement();
    this.svg = element;
    this.wrap = canvasEditorContainer;

    this.drawing = false;
    this.rawPoints = [];
    this.paths = []; // Store all drawn paths

    this.init();
  }

  init() {
    if (!this.svg || !this.wrap) {
      console.error("SVG or canvas wrap element not found");
      return;
    }

    // cache references to committed group + live path
    this.committedGroup = this.svg.querySelector(".committed-paths");
    this.livePath = this.svg.querySelector(".live-preview");

    this.initializeDrawingTool();
    this.bindEvents();
  }

  //
  _getActiveEditingFreehandElement() {
    const canvasEditorContainer = document.querySelector(`[data-canvas-media-id="${currentStoryEditingMedia.id}"]`);
    const svgElement = canvasEditorContainer.querySelector("svg.story_drawing_svg");

    let element = svgElement;

    if (!svgElement) {
      const svg = this._createSVGElement();
      canvasEditorContainer.appendChild(svg);
      element = svg;
    }

    return { element, canvasEditorContainer };
  }

  initializeDrawingTool() {
    // Brush controls
    document.querySelectorAll("[data-brush]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".brush-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const brushType = btn.dataset.brush;
        this.applyPreset(brushType);
      });
    });

    // Brush size
    const brushSize = document.getElementById("brush-size");
    const sizeDisplay = document.getElementById("size-display");

    brushSize?.addEventListener("input", (e) => {
      const size = e.target.value;
      if (sizeDisplay) {
        sizeDisplay.textContent = size + "px";
      }
      this.handleBrushSizeChange(size);
    });

    // Drawing color picker
    document.querySelectorAll('[data-tool-container="drawing-scribbles"] .color-option').forEach((color) => {
      color.addEventListener("click", () => {
        document.querySelectorAll('[data-tool="drawing-scribbles"] .color-option').forEach((c) => c.classList.remove("selected"));
        color.classList.add("active");

        const selectedColor = color.dataset.color;
        this.handleDrawingColorChange(selectedColor);
      });
    });

    // Custom Color Picker
    const drawCustomColorPicker = document.getElementById("drawCustomColorPicker");
    const drawColorPickerBtn = document.getElementById("drawColorPickerBtn");
    drawColorPickerBtn.addEventListener("click", () => {
      drawCustomColorPicker.click();
    });

    //
    drawCustomColorPicker.addEventListener("change", (e) => {
      const customColor = e.target.value;
      this.handleDrawingColorChange(customColor);
    });
  }

  handleBrushChange(type) {
    this.currentBrushType = type;
  }

  handleBrushSizeChange(size) {
    this.options.size = Number(size);
    this._syncLivePathStyle();
  }

  handleDrawingColorChange(color) {
    this.options.strokeColor = color;
    this._syncLivePathStyle();
  }

  _createSVGElement() {
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "story_drawing_svg");
    svg.setAttribute("xmlns", NS);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.style.position = "absolute";
    svg.style.left = "0";
    svg.style.top = "0";
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.pointerEvents = "auto";
    svg.style.zIndex = "3";

    // defs
    const defs = document.createElementNS(NS, "defs");

    // soft blur used by marker
    const f = document.createElementNS(NS, "filter");
    f.setAttribute("id", "marker-blur");
    f.innerHTML = `<feGaussianBlur stdDeviation="1.2" result="b"/> <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>`;
    defs.appendChild(f);

    // simple grain/noise for pencil (light)
    const grain = document.createElementNS(NS, "filter");
    grain.setAttribute("id", "pencil-grain");
    grain.innerHTML = `<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="1" stitchTiles="stitch" result="noise"/>
       <feColorMatrix type="saturate" values="0" in="noise" result="mono"/>
       <feBlend in="SourceGraphic" in2="mono" mode="multiply" />`;
    defs.appendChild(grain);

    // add defs
    svg.appendChild(defs);

    // committed and live nodes (as before)
    const committed = document.createElementNS(NS, "g");
    committed.setAttribute("class", "committed-paths");
    svg.appendChild(committed);

    const live = document.createElementNS(NS, "path");
    live.setAttribute("class", "live-preview");
    live.setAttribute("fill", this.options.strokeColor);
    live.setAttribute("stroke", "none");
    svg.appendChild(live);

    return svg;
  }

  _syncLivePathStyle() {
    if (!this.livePath) return;
    const preset = this.brushPresets[this.currentPreset] || this.brushPresets.marker;
    const svgCfg = preset.svg || {};

    if (svgCfg.render === "stroke") {
      this.livePath.setAttribute("fill", "none");
      this.livePath.setAttribute("stroke", this.options.strokeColor);
      const sw = (svgCfg.strokeWidthFactor || 1) * (this.options.size || 1);
      this.livePath.setAttribute("stroke-width", sw);
      if (svgCfg.strokeDasharray) this.livePath.setAttribute("stroke-dasharray", svgCfg.strokeDasharray);
      else this.livePath.removeAttribute("stroke-dasharray");
    } else {
      this.livePath.setAttribute("fill", this.options.strokeColor);
      this.livePath.removeAttribute("stroke");
    }

    this.livePath.setAttribute("opacity", svgCfg.opacity ?? 1);
    if (svgCfg.filter) this.livePath.setAttribute("filter", `url(#${svgCfg.filter})`);
    else this.livePath.removeAttribute("filter");
  }

  bindEvents() {
    this.wrap.addEventListener("pointerdown", this.handlePointerDown.bind(this));
    this.wrap.addEventListener("pointermove", this.handlePointerMove.bind(this));
    this.wrap.addEventListener("pointerup", this.handlePointerUp.bind(this));
    this.wrap.addEventListener(
      "pointercancel",
      this.handlePointerCancel?.bind(this) ||
        ((e) => {
          if (this.drawing) this.handlePointerUp(e);
        })
    );
  }

  _handlePointerCoords(e) {
    const rect = this.wrap.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // clamp inside container
    return {
      x: Math.max(0, Math.min(rect.width, x)),
      y: Math.max(0, Math.min(rect.height, y)),
    };
  }

  handlePointerDown(e) {
    if (activeEditingTool !== "drawing-scribbles" && e.button !== 0) return;

    this.drawing = true;
    const { x, y } = this._handlePointerCoords(e);
    this.rawPoints = [{ x, y, pressure: typeof e.pressure === "number" ? e.pressure : 0.5 }];

    // set SVG viewBox to container size in case not set
    const rect = this.wrap.getBoundingClientRect();
    if (!this.svg.getAttribute("viewBox")) {
      this.svg.setAttribute("viewBox", `0 0 ${Math.round(rect.width)} ${Math.round(rect.height)}`);
    }

    this.wrap.setPointerCapture?.(e.pointerId);
  }

  handlePointerMove(e) {
    if (activeEditingTool !== "drawing-scribbles") return;

    if (!this.drawing) return;
    const { x, y } = this._handlePointerCoords(e);

    this.rawPoints.push({ x, y, pressure: typeof e.pressure === "number" ? e.pressure : 0.5 });
    this.renderCurrentStroke();
  }

  handlePointerUp(e) {
    if (activeEditingTool !== "drawing-scribbles") return;

    if (!this.drawing) return;
    this.drawing = false;
    try {
      this.wrap.releasePointerCapture?.(e.pointerId);
    } catch (_) {}
    this.finalizePath();
  }

  renderCurrentStroke() {
    if (!this.rawPoints.length) return;

    const pts = this.rawPoints.map((p) => [p.x, p.y, p.pressure]);

    if (typeof getStroke !== "function") {
      console.error("getStroke not available");
      return;
    }

    const stroke = getStroke(pts, {
      size: this.options.size,
      thinning: this.options.thinning,
      smoothing: this.options.smoothing,
    });

    const path = this.getSvgPathFromStroke(stroke);

    if (!path) {
      // draw a small circle for very short strokes
      const last = this.rawPoints[this.rawPoints.length - 1];
      const r = Math.max(1, this.options.size / 4);
      this.livePath.setAttribute("d", `M ${last.x} ${last.y} m -${r},0 a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0`);
      this.livePath.setAttribute("fill", this.options.strokeColor);
      return;
    }

    this.livePath.setAttribute("d", path);
    this.livePath.setAttribute("fill", this.options.strokeColor);
  }

  finalizePath() {
    if (this.rawPoints.length < 2) {
      // ensure live preview cleared for tiny strokes
      this.livePath.setAttribute("d", "");
      this.rawPoints = [];
      return;
    }

    const pts = this.rawPoints.map((p) => [p.x, p.y, p.pressure]);
    const stroke = getStroke(pts, {
      size: this.options.size,
      thinning: this.options.thinning,
      smoothing: this.options.smoothing,
    });

    const path = this.getSvgPathFromStroke(stroke);

    this.paths.push({
      d: path,
      color: this.options.strokeColor,
      preset: this.currentPreset,
      size: this.options.size,
    });

    // update committed group and clear live preview
    this.renderAllPaths();
    this.livePath.setAttribute("d", "");
    this.rawPoints = [];
  }
  renderAllPaths() {
    const NS = "http://www.w3.org/2000/svg";
    const frag = document.createDocumentFragment();

    for (const p of this.paths) {
      const pathEl = document.createElementNS(NS, "path");
      pathEl.setAttribute("d", p.d);
      const preset = this.brushPresets[p.preset] || this.brushPresets.marker;
      const svgCfg = preset.svg || {};
      if (svgCfg.render === "stroke") {
        pathEl.setAttribute("fill", "none");
        const sw = (svgCfg.strokeWidthFactor || 1) * (p.size || this.options.size);
        pathEl.setAttribute("stroke-width", sw);
        pathEl.setAttribute("stroke", p.color || this.options.strokeColor);
        if (svgCfg.strokeDasharray) pathEl.setAttribute("stroke-dasharray", svgCfg.strokeDasharray);
        pathEl.setAttribute("stroke-linecap", svgCfg.strokeLineCap || "round");
        pathEl.setAttribute("stroke-linejoin", svgCfg.strokeLineJoin || "round");
      } else {
        pathEl.setAttribute("fill", p.color || this.options.strokeColor);
        pathEl.setAttribute("stroke", "none");
      }
      if (svgCfg.opacity) pathEl.setAttribute("opacity", svgCfg.opacity);
      if (svgCfg.filter) pathEl.setAttribute("filter", `url(#${svgCfg.filter})`);
      frag.appendChild(pathEl);
    }

    while (this.committedGroup.firstChild) this.committedGroup.removeChild(this.committedGroup.firstChild);
    this.committedGroup.appendChild(frag);
  }

  getSvgPathFromStroke(points) {
    if (!points || !points.length) return "";

    // if perfect-freehand returns a polygon of points [[x,y],...], produce a continuous path
    // points is an array of [x,y]
    const len = points.length;
    if (len === 1) {
      return `M ${points[0][0]} ${points[0][1]} L ${points[0][0]} ${points[0][1]}`;
    }
    // simple polyline-style path for predictable behavior
    let d = `M ${points[0][0]} ${points[0][1]}`;
    for (let i = 1; i < len; i++) {
      d += ` L ${points[i][0]} ${points[i][1]}`;
    }
    d += " Z"; // close the polygon so fill works nicely
    return d;
  }

  applyPreset(name) {
    if (!this.brushPresets[name]) return;
    this.currentPreset = name;
    const p = this.brushPresets[name];
    // merge perfect-freehand options
    this.options = { ...this.options, ...p.pf, preset: name };
    // apply live preview svg style too
    if (this.livePath) {
      // keep attributes consistent during live drawing
      if (p.svg.render === "stroke") {
        this.livePath.setAttribute("fill", "none");
        this.livePath.setAttribute("stroke", this.options.strokeColor);
        this.livePath.setAttribute("stroke-linecap", p.svg.strokeLineCap || "round");
        this.livePath.setAttribute("stroke-linejoin", p.svg.strokeLineJoin || "round");
        const sw = (p.svg.strokeWidthFactor || 1) * (this.options.size || 1);
        this.livePath.setAttribute("stroke-width", sw);
        if (p.svg.strokeDasharray) this.livePath.setAttribute("stroke-dasharray", p.svg.strokeDasharray);
        else this.livePath.removeAttribute("stroke-dasharray");
        this.livePath.removeAttribute("fill");
      } else {
        this.livePath.setAttribute("fill", this.options.strokeColor);
        this.livePath.removeAttribute("stroke");
      }
      this.livePath.setAttribute("opacity", p.svg.opacity ?? 1);
      if (p.svg.filter) this.livePath.setAttribute("filter", `url(#${p.svg.filter})`);
      else this.livePath.removeAttribute("filter");
      if (p.svg.blend) this.livePath.style.mixBlendMode = p.svg.blend;
    }
  }

  // Public methods for external control
  clear() {
    this.paths = [];
    this.rawPoints = [];
    if (this.committedGroup) {
      while (this.committedGroup.firstChild) this.committedGroup.removeChild(this.committedGroup.firstChild);
    }
    if (this.livePath) this.livePath.setAttribute("d", "");
  }

  setOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
  }

  undo() {
    if (this.paths.length > 0) {
      this.paths.pop();
      this.renderAllPaths();
    }
  }

  getPaths() {
    return [...this.paths];
  }

  setPaths(paths) {
    this.paths = [...paths];
    this.renderAllPaths();
  }
}

window.FreehandDrawing = FreehandDrawing;
