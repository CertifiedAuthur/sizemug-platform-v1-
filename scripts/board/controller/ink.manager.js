class InkManager {
  constructor(canvas, getTransform, options = {}, app) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.getTransform = getTransform;
    this.app = app || window.app;

    // subscribe to tool changes
    if (this.app && this.app.toolManager) {
      if (typeof this.app.toolManager.onChange === "function") {
        this._unsubTool = this.app.toolManager.onChange(({ tool }) => this._onAppToolChange(tool));
      } else {
        this._onToolChangeHandler = (e) => this._onAppToolChange(e.detail.tool);
        this.app.toolManager.addEventListener("change", this._onToolChangeHandler);
      }
    }

    // ===== ENHANCED STORAGE SYSTEM =====
    this.strokes = []; // drawing order
    this.strokesById = new Map(); // O(1) lookups
    this.counter = 0; // numeric ids

    // runtime state
    this.current = null;
    this.attached = false;
    this.selectedStroke = null;
    this.selectionBox = null;
    this.interactInstance = null;

    // flags
    this.active = false;
    this.drawingEnabled = false;
    this.activeTool = "pen"; // 'pen'|'select'|...

    // eraser settings (whole-stroke erase by default)
    this.eraser = {
      radius: options.eraserRadius || 12, // world-space radius
      mode: options.eraserMode || "stroke", // "stroke" | "partial" (partial not implemented here)
    };
    this._erasing = false;

    // defaults
    this.defaults = {
      color: options.color || "#096582FF",
      width: options.width || 3,
      lineCap: options.lineCap || "round",
      lineDash: options.lineDash || [],
      smoothing: true,
      pressureSensitive: true,
    };

    this.canvas.style.touchAction = "none";

    this._configureCanvasForQuality();
    this._initializeInteract();

    // color normalizer
    this._normalizeColor = (c) => {
      if (!c) return c;
      const str = String(c).trim();
      if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(str)) return str;
      if (/^([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(str)) return `#${str}`;
      return str;
    };

    // UI listeners and bound handlers
    this._setupUIEventListeners();
    this._setupBoundHandlers();
  }

  // !---------------------------- Eraser Logic ----------------------------!
  setEraserRadius(px) {
    this.eraser.radius = Math.max(1, Number(px) || this.eraser.radius);
    if (this.activeTool === "eraser" && this._eraserPreview) {
      this._updateEraserPreviewSize();
    }
  }

  setEraserMode(mode) {
    if (mode === "stroke" || mode === "partial") this.eraser.mode = mode;
  }

  // Erase at a world coordinate. Returns number of strokes removed.
  _eraseAt(x, y) {
    const radius = this.eraser.radius || 12;
    let removed = 0;
    // iterate backwards so removing from array is safe
    for (let i = this.strokes.length - 1; i >= 0; i--) {
      const stroke = this.strokes[i];
      // quick bounds check first
      const bounds = stroke.bounds || this._calculateStrokeBounds(stroke);
      if (!bounds) continue;
      // expand bounds by radius
      if (x < bounds.x - radius || x > bounds.x + bounds.width + radius || y < bounds.y - radius || y > bounds.y + bounds.height + radius) {
        continue;
      }
      // precise check: distance to segments
      if (this._isPointOnStroke(x, y, stroke)) {
        // whole-stroke erase behavior
        this._removeStroke(stroke);
        removed++;
        // inform listeners (toolbar will hide)
        window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type: null } }));
      }
    }
    if (removed) this.redrawAll();
    return removed;
  }

  _createEraserPreview() {
    if (this._eraserPreview) return;

    const preview = document.createElement("div");
    preview.className = "eraser-preview";
    preview.style.position = "fixed";
    preview.style.pointerEvents = "none";
    preview.style.borderRadius = "50%";
    preview.style.border = "2px solid rgba(255, 0, 0, 0.6)";
    preview.style.backgroundColor = "rgba(255, 0, 0, 0.1)";
    preview.style.zIndex = "100001";
    preview.style.transform = "translate(-50%, -50%)";
    preview.style.display = "none";

    document.body.appendChild(preview);
    this._eraserPreview = preview;
    this._updateEraserPreviewSize();
  }

  _updateEraserPreviewSize() {
    if (!this._eraserPreview) return;
    const transform = this.getTransform() || { x: 0, y: 0, k: 1 };
    const screenRadius = this.eraser.radius * transform.k * 2; // diameter
    this._eraserPreview.style.width = `${screenRadius}px`;
    this._eraserPreview.style.height = `${screenRadius}px`;
  }

  _showEraserPreview(clientX, clientY) {
    if (!this._eraserPreview) this._createEraserPreview();
    this._eraserPreview.style.display = "block";
    this._eraserPreview.style.left = `${clientX}px`;
    this._eraserPreview.style.top = `${clientY}px`;
  }

  _hideEraserPreview() {
    if (this._eraserPreview) {
      this._eraserPreview.style.display = "none";
    }
  }

  _removeEraserPreview() {
    if (this._eraserPreview) {
      this._eraserPreview.remove();
      this._eraserPreview = null;
    }
  }
  // !---------------------------- Eraser Logic ----------------------------!

  _onAppToolChange(tool) {
    this.activeTool = tool;

    if (tool === "pen") {
      // Listen + allow drawing
      this.setActive(true); // allows pointer handlers to run
      this.drawingEnabled = true; // allows starting new strokes
      this._hideEraserPreview();
      this._updateCursor();
      this.app.ui && this.app.ui._setActive && this.app.ui._setActive(document.getElementById("penToolbarButton"));
    } else if (tool === "select") {
      // Listen but DO NOT draw: allow hit testing and show selection boxes
      this.setActive(true);
      this.drawingEnabled = false;
      this._hideEraserPreview();
      this._updateCursor();
    } else if (tool === "eraser") {
      // Listen for eraser interactions
      this.setActive(true);
      this.drawingEnabled = false;
      this._createEraserPreview(); // ensure preview exists
      this._updateCursor();
    } else {
      // other tools: ignore canvas (e.g., pan, text)
      this.setActive(false);
      this.drawingEnabled = false;
      this._hideEraserPreview();
      this._updateCursor();
    }
  }

  // ===== ID Helpers =====
  _generateStrokeId() {
    return "ink-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
  }

  _generateNumericId() {
    return ++this.counter;
  }

  // ===== Centralized stroke store helpers =====
  _addStroke(stroke) {
    if (!stroke.id) stroke.id = this._generateStrokeId();
    if (!stroke.numericId) stroke.numericId = this._generateNumericId();
    this.strokes.push(stroke);
    this.strokesById.set(stroke.id, stroke);
    return stroke;
  }

  // Public method to add a stroke (for undo/redo)
  addStroke(strokeData) {
    const stroke = {
      id: strokeData.id,
      numericId: strokeData.numericId,
      points: [...strokeData.points],
      color: strokeData.color,
      width: strokeData.width,
      lineCap: strokeData.lineCap,
      lineDash: strokeData.lineDash,
      bounds: strokeData.bounds,
      locked: false,
    };

    this.strokes.push(stroke);
    this.strokesById.set(stroke.id, stroke);
    this.redrawAll();
    return stroke;
  }

  _removeStroke(strokeOrId) {
    const stroke = typeof strokeOrId === "string" ? this.strokesById.get(strokeOrId) : strokeOrId;
    if (!stroke) return false;

    const idx = this.strokes.indexOf(stroke);
    if (idx > -1) this.strokes.splice(idx, 1);
    this.strokesById.delete(stroke.id);

    // if selected, clear selection
    if (this.selectedStroke === stroke) this.clearSelection();
    return true;
  }

  getStrokeById(id) {
    return this.strokesById.get(id) || null;
  }

  getStrokeByNumericId(numericId) {
    return this.strokes.find((s) => s.numericId === numericId) || null;
  }

  getAllStrokes() {
    return [...this.strokes];
  }

  getStrokeCount() {
    return this.strokes.length;
  }

  // ===== Interact.js integration =====
  _initializeInteract() {
    if (typeof interact === "undefined") {
      console.warn('Interact.js not found. Include it if you want selection handles: <script src="https://unpkg.com/interactjs/dist/interact.min.js"></script>');
      this.interactAvailable = false;
      return;
    }
    this.interactAvailable = true;
  }

  _initializeInteractOnBox(element, stroke) {
    console.log(stroke.locked);
    if (!this.interactAvailable || stroke.locked) return;

    // Cleanup previous instance if any
    if (this.interactInstance) {
      try {
        this.interactInstance.unset();
      } catch (err) {}
      this.interactInstance = null;
    }

    // Cache canvas rect and transform on start to convert viewport->world safely
    this.interactInstance = interact(element)
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
          start: (event) => {
            this._originalBounds = Object.assign({}, stroke.bounds || this._calculateStrokeBounds(stroke) || { x: 0, y: 0, width: 1, height: 1 });
            this._originalPoints = (stroke.points || []).map((p) => ({ x: p.x, y: p.y, pressure: p.pressure }));
            this._cachedCanvasRect = this.canvas.getBoundingClientRect();
            this._cachedTransform = this.getTransform() || { x: 0, y: 0, k: 1 };
          },
          move: (event) => {
            if (stroke.locked) return;
            const rect = event.rect || {};
            if (!rect.width || !rect.height) return;

            const canvasRect = this._cachedCanvasRect || this.canvas.getBoundingClientRect();
            const transform = this._cachedTransform || this.getTransform() || { x: 0, y: 0, k: 1 };
            const k = transform.k || 1;

            const newWorldLeft = (rect.left - canvasRect.left - transform.x) / k;
            const newWorldTop = (rect.top - canvasRect.top - transform.y) / k;
            const newWorldW = rect.width / k;
            const newWorldH = rect.height / k;

            const ob = this._originalBounds || { x: 0, y: 0, width: 1e-3, height: 1e-3 };
            const safeW = Math.max(1e-6, ob.width);
            const safeH = Math.max(1e-6, ob.height);

            const scaleX = newWorldW / safeW;
            const scaleY = newWorldH / safeH;

            const translateX = newWorldLeft - ob.x;
            const translateY = newWorldTop - ob.y;

            // apply transform from snapshot (non-cumulative)
            this._applyTransformToStrokeFromSnapshot(stroke, scaleX, scaleY, translateX, translateY, this._originalPoints, ob);

            // update selection box viewport rect so it remains under mouse
            element.style.left = `${rect.left}px`;
            element.style.top = `${rect.top}px`;
            element.style.width = `${rect.width}px`;
            element.style.height = `${rect.height}px`;

            // redraw
            this.redrawAll();
            this._updateSelectionBoxPosition();
            if (this.app && typeof this.app._scheduleToolbarReposition === "function") {
              this.app._scheduleToolbarReposition();
            }
          },
          end: (event) => {
            stroke.bounds = this._calculateStrokeBounds(stroke);
            this._originalPoints = null;
            this._originalBounds = null;
            this._cachedCanvasRect = null;
            this._cachedTransform = null;

            // ensure selection box final position matches stroke bounds
            const t = this.getTransform() || { x: 0, y: 0, k: 1 };
            const canvasRect = this.canvas.getBoundingClientRect();
            element.style.left = `${canvasRect.left + stroke.bounds.x * t.k + t.x}px`;
            element.style.top = `${canvasRect.top + stroke.bounds.y * t.k + t.y}px`;
            element.style.width = `${stroke.bounds.width * t.k}px`;
            element.style.height = `${stroke.bounds.height * t.k}px`;

            this.redrawAll();
            this._updateSelectionBoxPosition();
            if (this.app && typeof this.app._scheduleToolbarReposition === "function") {
              this.app._scheduleToolbarReposition();
            }
          },
        },
      })
      .draggable({
        listeners: {
          move: (event) => {
            if (stroke.locked) return;
            const transform = this.getTransform() || { x: 0, y: 0, k: 1 };
            const k = transform.k || 1;
            const worldDx = event.dx / k;
            const worldDy = event.dy / k;

            for (const p of stroke.points) {
              p.x += worldDx;
              p.y += worldDy;
            }

            stroke.bounds = this._calculateStrokeBounds(stroke);

            const left = parseFloat(element.style.left || 0) + event.dx;
            const top = parseFloat(element.style.top || 0) + event.dy;
            element.style.left = `${left}px`;
            element.style.top = `${top}px`;

            this.redrawAll();
            this._updateSelectionBoxPosition();
            if (this.app && typeof this.app._scheduleToolbarReposition === "function") {
              this.app._scheduleToolbarReposition();
            }
          },
        },
      });
  }

  // ===== Drawing quality config =====
  _configureCanvasForQuality() {
    const ctx = this.ctx;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.globalCompositeOperation = "source-over";
  }

  // ===== Bounds & hit-testing =====
  _calculateStrokeBounds(stroke) {
    if (!stroke.points || stroke.points.length === 0) return null;
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    const padding = (stroke.width || this.defaults.width) / 2 + 5;
    for (const p of stroke.points) {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    }
    return {
      x: minX - padding,
      y: minY - padding,
      width: maxX - minX + padding * 2,
      height: maxY - minY + padding * 2,
    };
  }

  _pointInStrokeBounds(x, y, stroke) {
    const bounds = stroke.bounds || this._calculateStrokeBounds(stroke);
    if (!bounds) return false;
    return x >= bounds.x && x <= bounds.x + bounds.width && y >= bounds.y && y <= bounds.y + bounds.height;
  }

  _getStrokeAtPoint(x, y) {
    for (let i = this.strokes.length - 1; i >= 0; i--) {
      const stroke = this.strokes[i];
      if (this._pointInStrokeBounds(x, y, stroke)) {
        if (this._isPointOnStroke(x, y, stroke)) return stroke;
      }
    }
    return null;
  }

  _isPointOnStroke(x, y, stroke) {
    if (!stroke.points || stroke.points.length < 2) return false;
    const threshold = Math.max((stroke.width || this.defaults.width) / 2 + 2, 8);
    for (let i = 0; i < stroke.points.length - 1; i++) {
      const p1 = stroke.points[i];
      const p2 = stroke.points[i + 1];
      if (this._distanceToLineSegment(x, y, p1.x, p1.y, p2.x, p2.y) <= threshold) return true;
    }
    return false;
  }

  _distanceToLineSegment(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length2 = dx * dx + dy * dy;
    if (length2 === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * dx + (py - y1) * dy) / length2;
    t = Math.max(0, Math.min(1, t));
    const projX = x1 + t * dx;
    const projY = y1 + t * dy;
    return Math.hypot(px - projX, py - projY);
  }

  // ===== Selection box UI =====
  _createSelectionBox(stroke) {
    if (!stroke.bounds || !this.interactAvailable) return;
    this._removeSelectionBox();

    const bounds = stroke.bounds;
    const transform = this.getTransform() || { x: 0, y: 0, k: 1 };
    const canvasRect = this.canvas.getBoundingClientRect();
    const screenX = bounds.x * transform.k + transform.x;
    const screenY = bounds.y * transform.k + transform.y;
    const screenWidth = bounds.width * transform.k;
    const screenHeight = bounds.height * transform.k;

    const selectionBox = document.createElement("div");
    selectionBox.className = "selection-box";
    selectionBox.style.position = "fixed";
    selectionBox.style.left = canvasRect.left + screenX + "px";
    selectionBox.style.top = canvasRect.top + screenY + "px";
    selectionBox.style.width = screenWidth + "px";
    selectionBox.style.height = screenHeight + "px";
    selectionBox.style.pointerEvents = "auto";
    selectionBox.style.zIndex = 100000;

    // handles
    const handles = ["nw", "ne", "sw", "se"];
    handles.forEach((handle) => {
      const handleEl = document.createElement("div");
      handleEl.className = `resize-handle resize-${handle}`;
      handleEl.style.position = "absolute";
      handleEl.style.borderRadius = "50%";
      handleEl.style.pointerEvents = "auto";
      handleEl.style.cursor = this._getCursorForHandle(handle);
      this._positionHandle(handleEl, handle);
      selectionBox.appendChild(handleEl);
    });

    document.body.appendChild(selectionBox);
    this.selectionBox = selectionBox;

    this._initializeInteractOnBox(selectionBox, stroke);

    this.selectedStroke = stroke;
    window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type: "ink", id: stroke.id, locked: !!stroke.locked } }));
  }

  _positionHandle(handle, position) {
    switch (position) {
      case "nw":
        handle.style.left = "-4px";
        handle.style.top = "-4px";
        break;
      case "ne":
        handle.style.right = "-4px";
        handle.style.top = "-4px";
        break;
      case "sw":
        handle.style.left = "-4px";
        handle.style.bottom = "-4px";
        break;
      case "se":
        handle.style.right = "-4px";
        handle.style.bottom = "-4px";
        break;
      default:
        handle.style.left = "-4px";
        handle.style.top = "-4px";
    }
  }

  _getCursorForHandle(handle) {
    const cursors = { nw: "nw-resize", ne: "ne-resize", sw: "sw-resize", se: "se-resize" };
    return cursors[handle] || "default";
  }

  _removeSelectionBox() {
    if (this.selectionBox) {
      if (this.interactInstance) {
        try {
          this.interactInstance.unset();
        } catch (err) {}
        this.interactInstance = null;
      }
      this.selectionBox.remove();
      this.selectionBox = null;
      window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type: null } }));
    }
    this.selectedStroke = null;
  }

  // ===== Locking & Deleting (enhanced) =====
  toggleLockSelected() {
    if (!this.selectedStroke) return false;

    // flip lock bit
    this.selectedStroke.locked = !this.selectedStroke.locked;

    // If we have a selection box, update interact accordingly.
    if (this.selectionBox) {
      try {
        if (this.selectedStroke.locked) {
          // If an interact instance exists, unset it and null it.
          if (this.interactInstance) {
            try {
              this.interactInstance.unset();
            } catch (err) {
              /* ignore */
            }
            this.interactInstance = null;
          }
          this.selectionBox.classList.add("locked");
        } else {
          // Unlock: remove locked class and (re)initialize interact handlers.
          this.selectionBox.classList.remove("locked");

          // If interact is available, reinitialize. _initializeInteractOnBox
          // will itself clear any previous this.interactInstance safely.
          if (this.interactAvailable) {
            this._initializeInteractOnBox(this.selectionBox, this.selectedStroke);
          } else {
            // optional: warn so you can include Interact.js if needed
            console.warn("Interact.js not available; cannot re-enable resize/drag on unlocked selection.");
          }
        }
      } catch (err) {
        console.warn("toggleLockSelected: interact toggle failed", err);
      }
    }

    return !!this.selectedStroke.locked;
  }

  deleteSelected() {
    if (!this.selectedStroke) return false;
    const stroke = this.selectedStroke;
    this.clearSelection();
    this._removeStroke(stroke);
    this.redrawAll();
    return true;
  }

  deleteStrokeById(id) {
    const s = this.getStrokeById(id);
    if (!s) return false;

    // Record deletion for undo/redo before removing
    if (typeof HistoryManager !== "undefined") {
      HistoryManager.recordOperation("delete", "ink", "delete", {
        id: s.id,
        numericId: s.numericId,
        points: [...s.points],
        color: s.color,
        width: s.width,
        lineCap: s.lineCap,
        lineDash: s.lineDash,
        bounds: s.bounds,
      });
    }

    if (this.selectedStroke === s) this.clearSelection();
    this._removeStroke(s);
    this.redrawAll();
    return true;
  }

  deleteStrokeByNumericId(n) {
    const s = this.getStrokeByNumericId(n);
    if (!s) return false;
    return this.deleteStrokeById(s.id);
  }

  isStrokeLocked(strokeOrId) {
    const s = typeof strokeOrId === "string" ? this.getStrokeById(strokeOrId) : strokeOrId;
    return !!(s && s.locked);
  }

  // ===== Public API: attach/detach & active/tool =====
  attach() {
    if (this.attached) return;
    this.canvas.addEventListener("pointerdown", this._onPointerDown);
    this.canvas.addEventListener("pointerenter", this._onPointerEnter);
    this.canvas.addEventListener("pointerleave", this._onPointerLeave);
    this.attached = true;
  }
  detach() {
    if (!this.attached) return;
    this.canvas.removeEventListener("pointerdown", this._onPointerDown);
    this.canvas.removeEventListener("pointerenter", this._onPointerEnter);
    this.canvas.removeEventListener("pointerleave", this._onPointerLeave);
    document.removeEventListener("pointermove", this._onPointerMove);
    document.removeEventListener("pointerup", this._onPointerUp);
    this._removeSelectionBox();
    this._hideEraserPreview();
    this.attached = false;
  }

  setActive(on) {
    this.active = !!on;
  }

  setActiveTool(tool) {
    this.activeTool = tool;
    if (tool !== "select") this.clearSelection();
    if (tool !== "eraser") this._hideEraserPreview();
    this._updateCursor();
  }

  _updateCursor() {
    const cursors = {
      pen: "crosshair",
      select: "default",
      eraser: "none", // hide cursor, show custom preview
      pan: "grab",
    };
    this.canvas.style.cursor = cursors[this.activeTool] || "default";
  }

  clearSelection() {
    this._removeSelectionBox();
  }

  // ===== UI setup helpers (thickness, colors) =====
  _setupUIEventListeners() {
    const widthContainer = document.getElementById("managePenStrokeWidth");
    if (widthContainer) {
      widthContainer.addEventListener("click", (e) => {
        const button = e.target.closest("button");
        if (!button || !widthContainer.contains(button)) return;
        e.stopPropagation();
        widthContainer.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
        button.classList.add("active");
        const { thickness } = button.dataset;
        this.setWidth(thickness);
        if (window.app && typeof window.app.setStrokeWidth === "function") {
          window.app.setStrokeWidth(thickness);
          window.app.setTool("pen");
        }
      });
    }

    const colorContainer = document.getElementById("managePenStrokeColor");
    if (colorContainer) {
      colorContainer.addEventListener("click", (e) => {
        const button = e.target.closest("button");
        if (!button || !colorContainer.contains(button)) return;
        e.stopPropagation();
        colorContainer.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
        button.classList.add("active");
        const { color } = button.dataset;
        const normalized = this._normalizeColor(color);
        this.setColor(normalized);
        if (window.app && typeof window.app.setStrokeColor === "function") {
          window.app.setStrokeColor(normalized);
          window.app.setTool("pen");
        }
      });
    }

    const customColorEl = document.getElementById("managePenStrokeCustomColor");
    if (customColorEl) {
      customColorEl.addEventListener("click", (e) => {
        const input = customColorEl.querySelector("input");
        if (input) input.click();
      });
      const input = customColorEl.querySelector("input");
      if (input) {
        input.addEventListener("change", (e) => {
          const color = e.target.value;
          if (colorContainer) colorContainer.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
          const normalized = this._normalizeColor(color);
          this.setColor(normalized);
          if (window.app && typeof window.app.setStrokeColor === "function") {
            window.app.setStrokeColor(normalized);
            window.app.setTool("pen");
          }
        });
      }
    }
  }

  _setupBoundHandlers() {
    this._onPointerDown = this._onPointerDown.bind(this);
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);
    this._onPointerEnter = this._onPointerEnter.bind(this);
    this._onPointerLeave = this._onPointerLeave.bind(this);
  }

  _onPointerEnter(e) {
    if (this.activeTool === "eraser") {
      this._showEraserPreview(e.clientX, e.clientY);
    }
  }

  _onPointerLeave(e) {
    if (this.activeTool === "eraser") {
      this._hideEraserPreview();
    }
  }

  // ===== pointer event handling =====
  _handleSelectionBoxPointerDown(e) {
    if (e.target && e.target.closest && (e.target.closest(".selection-box") || e.target.closest(".resize-handle"))) {
      e.stopPropagation();
      e.preventDefault();
      return true;
    }
    return false;
  }

  _onPointerDown(e) {
    if (!this.active) return;
    if (e.button && e.button !== 0) return;

    // If clicking selection box, let interact handle it
    if (this._handleSelectionBoxPointerDown(e)) return;

    const worldPoint = this._worldPoint(e.clientX, e.clientY);

    if (this.activeTool === "select") {
      const clicked = this._getStrokeAtPoint(worldPoint.x, worldPoint.y);
      if (clicked) {
        this.selectedStroke = clicked;
        // ensure it has bounds
        clicked.bounds = clicked.bounds || this._calculateStrokeBounds(clicked);
        this._createSelectionBox(clicked);
        this.redrawAll();
        return;
      } else {
        this.clearSelection();
        return;
      }
    }

    // Eraser handling
    if (this.activeTool === "eraser") {
      // capture pointer so move/up still fire
      try {
        this.canvas.setPointerCapture && this.canvas.setPointerCapture(e.pointerId);
      } catch (err) {}
      this._erasing = true;
      this._showEraserPreview(e.clientX, e.clientY);
      // erase at initial point
      this._eraseAt(worldPoint.x, worldPoint.y);
      // ensure we listen for move/up to continue erasing
      document.addEventListener("pointermove", this._onPointerMove);
      document.addEventListener("pointerup", this._onPointerUp);
      return;
    }

    // Pen handling
    if (this.activeTool === "pen") {
      // clear any selection
      this.clearSelection();

      try {
        this.canvas.setPointerCapture && this.canvas.setPointerCapture(e.pointerId);
      } catch (err) {}

      const stroke = {
        id: this._generateStrokeId(),
        numericId: this._generateNumericId(),
        points: [{ x: worldPoint.x, y: worldPoint.y, pressure: e.pressure || 0.5 }],
        color: this.defaults.color,
        width: this.defaults.width,
        lineCap: this.defaults.lineCap,
        lineDash: this.defaults.lineDash.slice(),
        smoothing: this.defaults.smoothing,
        pressureSensitive: this.defaults.pressureSensitive,
        bounds: null,
      };

      this.current = this._addStroke(stroke);

      // immediate render for tiny-click feedback
      const ctx = this.ctx;
      ctx.lineCap = stroke.lineCap;
      ctx.lineJoin = "round";
      ctx.setLineDash(stroke.lineDash || []);
      this._drawStrokeSegment(ctx, stroke, stroke.points[0], stroke.points[0], stroke.points[0].pressure);

      document.addEventListener("pointermove", this._onPointerMove);
      document.addEventListener("pointerup", this._onPointerUp);
    }
  }

  _onPointerMove(e) {
    // if erasing active, do continuous erase
    if (this._erasing && this.activeTool === "eraser") {
      this._showEraserPreview(e.clientX, e.clientY);
      const worldPoint = this._worldPoint(e.clientX, e.clientY);
      this._eraseAt(worldPoint.x, worldPoint.y);
      return;
    }

    // show eraser preview on hover (not erasing yet)
    if (this.activeTool === "eraser" && !this._erasing) {
      this._showEraserPreview(e.clientX, e.clientY);
      return;
    }

    // existing pen drawing logic unchanged
    if (!this.active || !this.current || this.activeTool !== "pen") return;

    const worldPoint = this._worldPoint(e.clientX, e.clientY);
    const pressure = e.pressure || 0.5;
    const point = { x: worldPoint.x, y: worldPoint.y, pressure };

    const pts = this.current.points;
    const prevPoint = pts[pts.length - 1];
    pts.push(point);

    // draw incremental segment immediately for snappy feedback
    try {
      this._drawStrokeSegment(this.ctx, this.current, prevPoint, point, pressure);
    } catch (err) {
      // fall back to full redraw if incremental draw fails
      // console.warn("incremental draw failed, scheduling full redraw", err);
    }

    // let app do a scheduled redraw so smoothing/curves are applied on high-quality render
    if (this.app && typeof this.app.redrawCanvas === "function") {
      this.app.redrawCanvas();
    } else {
      // fallback: local redrawAll
      this.redrawAll();
    }
  }

  _onPointerUp(e) {
    if (this._erasing && this.activeTool === "eraser") {
      try {
        this.canvas.releasePointerCapture && this.canvas.releasePointerCapture(e.pointerId);
      } catch (err) {}
      this._erasing = false;
      this._showEraserPreview(e.clientX, e.clientY); // keep showing preview after erase
      document.removeEventListener("pointermove", this._onPointerMove);
      document.removeEventListener("pointerup", this._onPointerUp);
      return;
    }

    if (!this.active || this.activeTool !== "pen") return;

    try {
      this.canvas.releasePointerCapture && this.canvas.releasePointerCapture(e.pointerId);
    } catch (err) {}

    if (this.current) {
      this.current.bounds = this._calculateStrokeBounds(this.current);

      // Record stroke creation for undo/redo
      if (typeof HistoryManager !== "undefined") {
        HistoryManager.recordOperation("create", "ink", "create", {
          id: this.current.id,
          numericId: this.current.numericId,
          points: [...this.current.points],
          color: this.current.color,
          width: this.current.width,
          lineCap: this.current.lineCap,
          lineDash: this.current.lineDash,
          bounds: this.current.bounds,
        });
      }

      this.current = null;
    }

    document.removeEventListener("pointermove", this._onPointerMove);
    document.removeEventListener("pointerup", this._onPointerUp);
  }

  // ===== stroke drawing helpers =====
  _drawStrokeSegment(ctx, stroke, fromPoint, toPoint, pressure) {
    if (!fromPoint || !toPoint) return;
    ctx.save();

    ctx.lineCap = stroke.lineCap || "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = stroke.color || this.defaults.color;

    const basePressure = stroke.pressureSensitive ? pressure : 1;
    const lineWidth = Math.max(1, (stroke.width || this.defaults.width) * basePressure);
    ctx.lineWidth = lineWidth;

    ctx.setLineDash(stroke.lineDash || []);

    if (stroke.width > 2) {
      ctx.shadowColor = "rgba(0,0,0,0.1)";
      ctx.shadowBlur = 1;
      ctx.shadowOffsetX = 0.5;
      ctx.shadowOffsetY = 0.5;
    }

    ctx.beginPath();
    ctx.moveTo(fromPoint.x, fromPoint.y);
    ctx.lineTo(toPoint.x, toPoint.y);
    ctx.stroke();

    ctx.restore();
  }

  _drawFullStroke(stroke) {
    const pts = stroke.points;
    if (!pts || pts.length < 1) return;

    const ctx = this.ctx;
    ctx.save();

    ctx.lineCap = stroke.lineCap || "round";
    ctx.lineJoin = "round";
    ctx.setLineDash(stroke.lineDash || []);
    ctx.strokeStyle = stroke.color || this.defaults.color;

    if (stroke.width > 2) {
      ctx.shadowColor = "rgba(0,0,0,0.1)";
      ctx.shadowBlur = 1;
      ctx.shadowOffsetX = 0.5;
      ctx.shadowOffsetY = 0.5;
    }

    if (stroke.smoothing && pts.length >= 3) {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length - 1; i++) {
        const pressure = stroke.pressureSensitive ? pts[i].pressure || 0.5 : 1;
        ctx.lineWidth = Math.max(1, (stroke.width || this.defaults.width) * pressure);
        const xc = (pts[i].x + pts[i + 1].x) / 2;
        const yc = (pts[i].y + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
      }
      if (pts.length > 2) {
        const lastPressure = stroke.pressureSensitive ? pts[pts.length - 1].pressure || 0.5 : 1;
        ctx.lineWidth = Math.max(1, (stroke.width || this.defaults.width) * lastPressure);
        ctx.quadraticCurveTo(pts[pts.length - 1].x, pts[pts.length - 1].y, pts[pts.length - 1].x, pts[pts.length - 1].y);
      }
      ctx.stroke();
    } else {
      for (let i = 1; i < pts.length; i++) {
        const pressure = stroke.pressureSensitive ? pts[i].pressure || 0.5 : 1;
        ctx.lineWidth = Math.max(1, (stroke.width || this.defaults.width) * pressure);
        ctx.beginPath();
        ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
        ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  // Convenience for app's redraw loop: draws every stroke
  drawAll() {
    const ctx = this.ctx;
    for (const stroke of this.strokes) {
      this._drawFullStroke(stroke);
    }
    if (this.selectedStroke && this.selectionBox) this._updateSelectionBoxPosition();
  }

  redrawAll() {
    if (this.app && typeof this.app.redrawCanvas === "function") {
      this.app.redrawCanvas();
    } else {
      // fallback: clear and draw here synchronously
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawAll();
    }
  }

  // non-cumulative transform from snapshot -> stroke (used by interact resize)
  _applyTransformToStrokeFromSnapshot(stroke, scaleX, scaleY, translateX, translateY, originalPoints, originalBounds) {
    if (!originalPoints || !originalBounds) return;
    const ob = originalBounds;
    stroke.points = originalPoints.map((pt) => {
      const relX = pt.x - ob.x;
      const relY = pt.y - ob.y;
      return {
        x: ob.x + translateX + relX * scaleX,
        y: ob.y + translateY + relY * scaleY,
        pressure: pt.pressure,
      };
    });
    stroke.bounds = this._calculateStrokeBounds(stroke);
  }

  // NOTE: removed the buggy reference to this.originalBounds in older _applyTransformToStroke.
  // If you still need a cumulative transform function, implement with explicit params.

  // ===== helpers =====
  _worldPoint(clientX, clientY) {
    const t = this.getTransform() || { x: 0, y: 0, k: 1 };
    return { x: (clientX - t.x) / t.k, y: (clientY - t.y) / t.k };
  }

  // Call this when zoom/transform changes to update eraser preview size
  onTransformChange() {
    if (this.activeTool === "eraser" && this._eraserPreview && this._eraserPreview.style.display !== "none") {
      this._updateEraserPreviewSize();
    }
    if (this.selectedStroke && this.selectionBox) {
      this._updateSelectionBoxPosition();
    }
  }

  _updateSelectionBoxPosition() {
    if (!this.selectedStroke || !this.selectionBox) return;
    const bounds = this.selectedStroke.bounds || this._calculateStrokeBounds(this.selectedStroke);
    if (!bounds) return;
    const transform = this.getTransform() || { x: 0, y: 0, k: 1 };
    const canvasRect = this.canvas.getBoundingClientRect();
    const screenX = bounds.x * transform.k + transform.x;
    const screenY = bounds.y * transform.k + transform.y;
    const screenWidth = bounds.width * transform.k;
    const screenHeight = bounds.height * transform.k;
    this.selectionBox.style.left = screenX + canvasRect.left + "px";
    this.selectionBox.style.top = screenY + canvasRect.top + "px";
    this.selectionBox.style.width = screenWidth + "px";
    this.selectionBox.style.height = screenHeight + "px";
  }

  // ===== setters =====
  setColor(c) {
    this.defaults.color = this._normalizeColor(c);
  }
  setWidth(w) {
    this.defaults.width = Math.max(0.5, Number(w) || 1);
  }
  setLineCap(cap) {
    this.defaults.lineCap = cap;
  }
  setLineDash(arr) {
    this.defaults.lineDash = Array.isArray(arr) ? arr : [];
  }
  setSmoothing(on) {
    this.defaults.smoothing = !!on;
  }
  setPressureSensitive(on) {
    this.defaults.pressureSensitive = !!on;
  }

  // ===== selection helpers used by toolbar =====
  selectStrokeById(id) {
    const stroke = this.getStrokeById(id);
    if (!stroke) return false;
    this.clearSelection();
    this.selectedStroke = stroke;
    stroke.bounds = stroke.bounds || this._calculateStrokeBounds(stroke);
    this._createSelectionBox(stroke);
    this.redrawAll();
    return true;
  }
  selectStrokeByNumericId(n) {
    const s = this.getStrokeByNumericId(n);
    if (!s) return false;
    return this.selectStrokeById(s.id);
  }
  getSelectedStroke() {
    return this.selectedStroke || null;
  }
  getSelectionBoxScreenRect() {
    if (!this.selectionBox) return null;
    return this.selectionBox.getBoundingClientRect();
  }

  // ===== clear & misc =====
  clear() {
    this.strokes = [];
    this.strokesById.clear();
    this.clearSelection();
    this.redrawAll();
  }
}
