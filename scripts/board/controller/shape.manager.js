class ShapeManager {
  constructor(svgGroup, gridManager, app) {
    this.svgGroup = svgGroup; // d3 selection of <g> container for shapes
    this.grid = gridManager; // optional: should expose worldSnap(x,y) and snapToGrid boolean
    this.shapes = new Map();
    this.counter = 0;
    this.selectedShapeId = null;
    this.editingTextId = null;
    this.selectionBox = null;
    this.interactInstance = null;

    // app reference (WhiteboardApp), used to set tools and read transform if needed
    this.app = app || window.app;

    // toolbar container with buttons (expects markup discussed below)
    this.shapesManagerContainer = document.getElementById("shapesManagerContainer");
    if (!this.shapesManagerContainer) {
      console.warn("ShapeManager: #shapesManagerContainer not found in DOM");
      return;
    }

    // current selection state for the toolbar
    this._activeTool = null; // 'rect' | 'circle' | 'triangle' | ...
    this._activeFill = "transparent"; // current fill color (string)
    this._activeStroke = "#111"; // optional: current stroke color
    this._activeStrokeWidth = 2; // optional: current stroke width

    // map some friendly names (in case your HTML used 'rectangle' etc)
    this._shapeAlias = {
      rectangle: "rect",
      rect: "rect",
      roundedrect: "roundedRect",
      roundedRect: "roundedRect",
      circle: "circle",
      triangle: "triangle",
      diamond: "diamond",
      chevron: "chevron",
    };

    // Initialize Interact.js availability check
    this.interactAvailable = typeof interact !== "undefined";
    if (!this.interactAvailable) {
      console.warn('Interact.js library not found. Please include it: <script src="https://unpkg.com/interactjs/dist/interact.min.js"></script>');
    }

    // click handler on the toolbar container (delegation)
    this.shapesManagerContainer.addEventListener("click", (e) => {
      const btnShape = e.target.closest("button.shape");
      if (btnShape) {
        // read shape from data-shape attribute
        const raw = btnShape.dataset.shape;
        if (raw) {
          const key = (raw || "").trim();
          const normalized = this._shapeAlias[key] || key;
          console.log(normalized);
          this.setActiveShape(normalized);

          // update UI active classes
          this._updateActiveButtonUI(btnShape);
          return;
        }
      }

      const btnCircle = e.target.closest("button[data-color]");
      if (btnCircle) {
        const color = btnCircle.dataset.color;
        if (color) {
          if (this.selectedShapeId) {
            this.changeSelectedShapeFill(color);
          } else {
            this.setActiveFill(color);
          }

          // Update active class on color swatches
          const parent = btnCircle.parentElement;
          if (parent) {
            parent.querySelectorAll("[data-color].active").forEach((b) => b.classList.remove("active"));
          }
          btnCircle.classList.add("active");
        }
        return;
      }
    });
  }

  // helper: set active shape programmatically
  setActiveShape(shape) {
    if (!shape) return;
    const normalized = this._shapeAlias[shape] || shape;
    this._activeTool = normalized;
  }

  // get active tool
  getActiveTool() {
    return this._activeTool;
  }

  setActiveFill(color) {
    if (!color) return;
    this._activeFill = color;
  }

  changeSelectedShapeFill(color) {
    if (!this.selectedShapeId) return;
    const shapeInfo = this.shapes.get(this.selectedShapeId);
    if (shapeInfo && shapeInfo.el) {
      shapeInfo.el.attr("fill", color);
    }
    // Also update the active fill for the next shape
    this.setActiveFill(color);
  }

  getActiveFill() {
    return this._activeFill;
  }

  setActiveStroke(color) {
    this._activeStroke = color;
  }

  getActiveStroke() {
    return this._activeStroke;
  }

  setActiveStrokeWidth(w) {
    this._activeStrokeWidth = w;
  }

  getActiveStrokeWidth() {
    return this._activeStrokeWidth;
  }

  // small UI helper to mark the clicked button active and clear siblings
  _updateActiveButtonUI(clickedBtn) {
    // clear previous active
    this.shapesManagerContainer.querySelectorAll("button.shape.active").forEach((b) => b.classList.remove("active"));
    // set new active if button has class shape
    if (clickedBtn && clickedBtn.classList.contains("shape")) clickedBtn.classList.add("active");
  }

  // Generate unique ID for shapes
  _generateShapeId() {
    return "shape-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
  }

  // Calculate bounding box for a shape
  _calculateShapeBounds(shapeEl) {
    if (!shapeEl || !shapeEl.node) return null;

    const bbox = shapeEl.node().getBBox();
    const padding = 5; // Add some padding

    return {
      x: bbox.x - padding,
      y: bbox.y - padding,
      width: bbox.width + padding * 2,
      height: bbox.height + padding * 2,
    };
  }

  // create a new shape entry and return { id, el }
  create(type, start, attrs = {}) {
    const id = ++this.counter;
    let el; // d3 selection

    // create shape elements and initialize minimal attributes
    if (type === "rect" || type === "roundedRect") {
      el = this.svgGroup.append("rect").attr("x", start.x).attr("y", start.y).attr("width", 0).attr("height", 0);
      if (type === "roundedRect") el.attr("rx", attrs.rx || 8).attr("ry", attrs.ry || 8);
    } else if (type === "circle") {
      // circle: start as zero radius circle; we'll set cx, cy, r
      el = this.svgGroup.append("circle").attr("cx", start.x).attr("cy", start.y).attr("r", 0);
    } else if (type === "triangle" || type === "diamond" || type === "chevron") {
      // polygons and chevron use <polygon> or <path> for chevron
      if (type === "chevron") {
        el = this.svgGroup.append("path");
      } else {
        el = this.svgGroup.append("polygon");
      }
      // set initial points to a tiny box
      const pts = this._boxToPolygonPoints(start.x, start.y, start.x + 1, start.y + 1, type);
      if (type === "chevron") el.attr("d", this._pointsToChevronPath(pts));
      else el.attr("points", pts.map((p) => `${p.x},${p.y}`).join(" "));
    } else {
      throw new Error("unsupported shape type: " + type);
    }

    // common attrs
    el.attr("stroke", attrs.stroke || "#111")
      .attr("stroke-width", attrs["stroke-width"] || 2)
      .attr("fill", attrs.fill !== undefined ? attrs.fill : "transparent")
      .attr("cursor", "move")
      // explicitly clear any stroke dash (overrides CSS that adds animated dashed border)
      .attr("stroke-dasharray", null)
      .attr("stroke-dashoffset", null)
      .classed("shape", true);

    const shapeId = this._generateShapeId();
    const meta = {
      id: shapeId,
      numericId: id,
      type,
      el,
      startBox: { x: start.x, y: start.y, x2: start.x, y2: start.y },
      text: "",
      textEl: null,
      locked: false,
      bounds: null,
    };
    this.shapes.set(shapeId, meta);
    this.attachBehavior(shapeId);

    // Calculate initial bounds
    meta.bounds = this._calculateShapeBounds(el);

    // Record creation for undo/redo
    if (typeof HistoryManager !== "undefined") {
      HistoryManager.recordOperation("create", "shapes", "create", {
        id: meta.numericId,
        shapeId,
        type,
        startBox: meta.startBox,
        attrs,
      });
    }

    return { id: shapeId, el };
  }

  // update a temporary shape while user drags
  updateTemp(shapeId, to) {
    const s = this.shapes.get(shapeId);
    if (!s) return;
    const el = s.el;
    const type = s.type;
    const start = s.startBox; // x,y,x2,y2 (x2,y2 update on every move)

    // update end coords
    start.x2 = to.x;
    start.y2 = to.y;

    // normalized box (x = left, y = top)
    const left = Math.min(start.x, start.x2),
      top = Math.min(start.y, start.y2),
      right = Math.max(start.x, start.x2),
      bottom = Math.max(start.y, start.y2),
      w = Math.max(0, right - left),
      h = Math.max(0, bottom - top),
      cx = left + w / 2,
      cy = top + h / 2;

    if (type === "rect" || type === "roundedRect") {
      el.attr("x", left).attr("y", top).attr("width", w).attr("height", h);
    } else if (type === "circle") {
      // make circle fit the bounding box: r = min(w,h)/2, center = center of box
      const r = Math.max(0, Math.min(w, h) / 2);
      el.attr("cx", cx).attr("cy", cy).attr("r", r);
    } else if (type === "triangle" || type === "diamond") {
      const pts = this._boxToPolygonPoints(left, top, right, bottom, type);
      el.attr("points", pts.map((p) => `${p.x},${p.y}`).join(" "));
    } else if (type === "chevron") {
      const pts = this._boxToPolygonPoints(left, top, right, bottom, type);
      el.attr("d", this._pointsToChevronPath(pts));
    }

    if (s.textEl) {
      s.textEl.attr("x", cx).attr("y", cy);
      this.adjustTextSize(shapeId);
    }

    // Update bounds after shape modification
    s.bounds = this._calculateShapeBounds(el);
  }

  // finalize the shape (called on pointerup). returns id or null if removed due to small size
  finalize(shapeId) {
    const s = this.shapes.get(shapeId);
    if (!s) return null;

    // small-size guard: if bounding box too small, delete
    const box = s.startBox;
    const left = Math.min(box.x, box.x2),
      top = Math.min(box.y, box.y2),
      right = Math.max(box.x, box.x2),
      bottom = Math.max(box.y, box.y2),
      w = Math.abs(right - left),
      h = Math.abs(bottom - top);

    const minDim = 6; // threshold - tweakable
    if (w < minDim && h < minDim) {
      s.el.remove();
      this.shapes.delete(shapeId);
      return null;
    }

    // apply grid snapping if requested
    if (this.grid?.snapToGrid) {
      if (s.type === "rect" || s.type === "roundedRect") {
        const a = this.grid.worldSnap(left, top);
        const b = this.grid.worldSnap(right, bottom);
        s.el
          .attr("x", a.x)
          .attr("y", a.y)
          .attr("width", Math.abs(b.x - a.x))
          .attr("height", Math.abs(b.y - a.y));
      } else if (s.type === "circle") {
        // snap center
        const cx = parseFloat(s.el.attr("cx")),
          cy = parseFloat(s.el.attr("cy"));
        const c = this.grid.worldSnap(cx, cy);
        s.el.attr("cx", c.x).attr("cy", c.y);
      } else if (s.type === "triangle" || s.type === "diamond" || s.type === "chevron") {
        // compute polygon from current points and snap each point
        const pts = this._parsePointsAttr(s);
        const snapped = pts.map((p) => this.grid.worldSnap(p.x, p.y));
        if (s.type === "chevron") s.el.attr("d", this._pointsToChevronPath(snapped));
        else s.el.attr("points", snapped.map((p) => `${p.x},${p.y}`).join(" "));
      }
    }

    // Update bounds after finalization
    s.bounds = this._calculateShapeBounds(s.el);

    return shapeId;
  }

  // attach behavior to element
  attachBehavior(shapeId) {
    const info = this.shapes.get(shapeId);
    if (!info) return;
    const el = info.el;

    // The selection system now handles text editing on the second click of a selected shape.
    // Double-click is no longer used for this.
    // Retaining this method for any future event handling needs.
  }

  _snapOnEnd(shapeId) {
    const info = this.shapes.get(shapeId);
    if (!info) return;
    const el = info.el;
    const t = info.type;
    if (t === "rect" || t === "roundedRect") {
      const x = parseFloat(el.attr("x")),
        y = parseFloat(el.attr("y"));
      const s = this.grid.worldSnap(x, y);
      el.attr("x", s.x).attr("y", s.y);
    } else if (t === "circle") {
      const cx = parseFloat(el.attr("cx")),
        cy = parseFloat(el.attr("cy"));
      const s = this.grid.worldSnap(cx, cy);
      el.attr("cx", s.x).attr("cy", s.y);
    } else {
      const pts = this._parsePointsAttr(info);
      const snapped = pts.map((p) => this.grid.worldSnap(p.x, p.y));
      if (t === "chevron") info.el.attr("d", this._pointsToChevronPath(snapped));
      else info.el.attr("points", snapped.map((p) => `${p.x},${p.y}`).join(" "));
    }
  }

  // convert bounding box to polygon points for triangle/diamond/chevron
  _boxToPolygonPoints(left, top, right, bottom, type) {
    const w = Math.max(0.0001, right - left);
    const h = Math.max(0.0001, bottom - top);
    const cx = left + w / 2;
    const cy = top + h / 2;

    if (type === "triangle") {
      // isosceles triangle with apex at top
      return [
        { x: cx, y: top }, // top apex
        { x: left, y: bottom }, // bottom-left
        { x: right, y: bottom }, // bottom-right
      ];
    } else if (type === "diamond") {
      // diamond (rhombus) centered in box
      return [
        { x: cx, y: top }, // top
        { x: right, y: cy }, // right
        { x: cx, y: bottom }, // bottom
        { x: left, y: cy }, // left
      ];
    } else if (type === "chevron") {
      // A chevron shape pointing to the right
      return [
        { x: left + w * 0.25, y: top },
        { x: left + w * 0.75, y: cy },
        { x: left + w * 0.25, y: bottom },
        { x: left, y: bottom },
        { x: left + w * 0.5, y: cy },
        { x: left, y: top },
      ];
    } else {
      // fallback: rectangle polygon points
      return [
        { x: left, y: top },
        { x: right, y: top },
        { x: right, y: bottom },
        { x: left, y: bottom },
      ];
    }
  }

  // create a chevron path string from points array (expects an ordered set)
  _pointsToChevronPath(points) {
    // points is an array of {x,y} forming chevron geometry; connect them smoothly
    if (!points || points.length < 3) return "";
    // We'll just polygonally connect, closing path
    const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
    return d;
  }

  // parse points attribute from stored info (handles polygon or path)
  _parsePointsAttr(infoOrElem) {
    const el = infoOrElem.el ? infoOrElem.el : infoOrElem;
    const node = el.node ? el.node() : el;
    if (node.tagName.toLowerCase() === "polygon") {
      const ptsStr = d3.select(node).attr("points") || "";
      return ptsStr
        .split(/\s+/)
        .filter(Boolean)
        .map((pair) => {
          const [x, y] = pair.split(",").map(parseFloat);
          return { x, y };
        });
    } else if (node.tagName.toLowerCase() === "path") {
      // crude fallback: try to extract numeric coords from "d"
      const d = d3.select(node).attr("d") || "";
      const nums = d.match(/-?[\d.]+/g) || [];
      const pts = [];
      for (let i = 0; i < nums.length; i += 2) {
        pts.push({ x: parseFloat(nums[i]), y: parseFloat(nums[i + 1]) });
      }
      return pts;
    } else {
      return [];
    }
  }

  // Native HTML selection system (similar to InkManager)
  select(shapeId) {
    console.log(shapeId);
    if (this.selectedShapeId === shapeId) {
      this.startEditingText(shapeId);
      return;
    }

    // Clear existing selection
    this.clearSelection();

    this.selectedShapeId = shapeId;
    const s = this.shapes.get(shapeId);
    if (s) {
      // Remove any CSS-based selection styling and force solid border
      s.el
        .classed("shape-selected", false) // Remove the CSS class that causes animation
        .attr("stroke-dasharray", "none") // Force solid line
        .attr("stroke-dashoffset", "0") // Reset offset
        .style("animation", "none") // Remove any CSS animation
        .attr("filter", null);

      // Create native HTML selection box
      this._createSelectionBox(s);
    }

    if (this.editingTextId && this.editingTextId !== shapeId) {
      this.stopEditingText();
    }

    // Broadcast selection event
    const shapeInfo = this.shapes.get(shapeId);
    if (shapeInfo) {
      const detail = {
        type: "shape",
        id: shapeInfo.numericId, // Use numeric ID for compatibility with existing toolbar
        locked: shapeInfo.locked || false,
        preferBottom: false,
      };
      window.dispatchEvent(new CustomEvent("board-selection-changed", { detail }));
    }
  }

  // Create DOM selection box with native HTML and Interact.js (mirrors InkManager approach)
  _createSelectionBox(shapeInfo) {
    if (!shapeInfo.bounds || !this.interactAvailable) return;
    this._removeSelectionBox();

    const bounds = shapeInfo.bounds;
    const transform = this.app.getTransform();
    const canvasRect = this.app.viewportNode.getBoundingClientRect();

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
    selectionBox.style.pointerEvents = "none"; // Allow zoom/pan through the box
    selectionBox.style.zIndex = 100000;
    selectionBox.style.background = "transparent";

    // Add resize handles
    const handles = ["nw", "ne", "sw", "se"];
    handles.forEach((handle) => {
      const handleEl = document.createElement("div");
      handleEl.className = `resize-handle resize-${handle}`;
      handleEl.style.position = "absolute";
      handleEl.style.width = "8px";
      handleEl.style.height = "8px";
      handleEl.style.borderRadius = "50%";
      handleEl.style.backgroundColor = "white";
      handleEl.style.border = "1px solid #666";
      handleEl.style.pointerEvents = "auto"; // Only handles should catch events
      handleEl.style.cursor = this._getCursorForHandle(handle);
      this._positionHandle(handleEl, handle);
      selectionBox.appendChild(handleEl);
    });

    document.body.appendChild(selectionBox);
    this.selectionBox = selectionBox;

    selectionBox.addEventListener("click", (e) => {
      // We need to make sure we're not clicking a resize handle
      if (e.target.classList.contains("resize-handle")) {
        return;
      }
      e.stopPropagation();
      if (this.selectedShapeId) {
        this.startEditingText(this.selectedShapeId);
      }
    });

    // Initialize Interact.js for this selectionBox & shape
    this._initializeInteractOnBox(selectionBox, shapeInfo);

    // Broadcast selection event with preferBottom: true for shapes
    const detail = {
      type: "shape",
      id: shapeInfo.numericId,
      locked: shapeInfo.locked || false,
      preferBottom: true, // Position toolbar below shape
    };
    window.dispatchEvent(new CustomEvent("board-selection-changed", { detail }));
  }

  // Initialize Interact.js on selection box (mirrors InkManager)
  _initializeInteractOnBox(element, shapeInfo) {
    if (!this.interactAvailable) return;

    // Ensure element is positioned in viewport coordinates
    element.style.position = "fixed";

    // Clear any previous instance
    if (this.interactInstance) {
      try {
        this.interactInstance.unset();
      } catch (err) {}
      this.interactInstance = null;
    }

    // If shape is locked, show locked state but don't enable interactions
    if (shapeInfo.locked) {
      element.classList.add("locked");
      return;
    } else {
      element.classList.remove("locked");
    }

    this.interactInstance = interact(element)
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
          start: (event) => {
            // Snapshot original shape bounds & geometry
            this._originalShapeBBox = shapeInfo.el.node().getBBox();
            this._originalShapeType = shapeInfo.type;

            // Cache different shape types' geometry
            if (shapeInfo.type === "triangle" || shapeInfo.type === "diamond" || shapeInfo.type === "chevron") {
              this._originalShapePoints = this._parsePointsAttr(shapeInfo);
            } else if (shapeInfo.type === "rect" || shapeInfo.type === "roundedRect") {
              const bbox = this._originalShapeBBox;
              this._originalShapeParams = {
                x: parseFloat(shapeInfo.el.attr("x")),
                y: parseFloat(shapeInfo.el.attr("y")),
                width: parseFloat(shapeInfo.el.attr("width")),
                height: parseFloat(shapeInfo.el.attr("height")),
              };
            } else if (shapeInfo.type === "circle") {
              this._originalShapeParams = {
                cx: parseFloat(shapeInfo.el.attr("cx")),
                cy: parseFloat(shapeInfo.el.attr("cy")),
                r: parseFloat(shapeInfo.el.attr("r")),
              };
            }

            this._cachedCanvasRect = this.app.viewportNode.getBoundingClientRect();
            this._cachedTransform = this.app.getTransform() || { x: 0, y: 0, k: 1 };
          },

          move: (event) => {
            if (shapeInfo.locked) return;

            const rect = event.rect || {};
            if (!rect.width || !rect.height) return;

            const canvasRect = this._cachedCanvasRect || this.app.viewportNode.getBoundingClientRect();
            const transform = this._cachedTransform || this.app.getTransform() || { x: 0, y: 0, k: 1 };
            const k = transform.k || 1;

            // Convert viewport rect -> world coords
            const newWorldLeft = (rect.left - canvasRect.left - transform.x) / k;
            const newWorldTop = (rect.top - canvasRect.top - transform.y) / k;
            const newWorldW = rect.width / k;
            const newWorldH = rect.height / k;

            const ob = this._originalShapeBBox || { x: 0, y: 0, width: 1e-3, height: 1e-3 };
            const safeW = Math.max(1e-6, ob.width);
            const safeH = Math.max(1e-6, ob.height);

            const scaleX = newWorldW / safeW;
            const scaleY = newWorldH / safeH;
            const translateX = newWorldLeft - ob.x;
            const translateY = newWorldTop - ob.y;

            // Apply transform to shape from snapshot
            this._applyTransformToShapeFromSnapshot(shapeInfo, scaleX, scaleY, translateX, translateY);

            // Update selection box in viewport coords
            element.style.left = `${rect.left}px`;
            element.style.top = `${rect.top}px`;
            element.style.width = `${rect.width}px`;
            element.style.height = `${rect.height}px`;

            // Update text if present
            if (shapeInfo.textEl) {
              const bbox = shapeInfo.el.node().getBBox();
              shapeInfo.textEl.attr("x", bbox.x + bbox.width / 2).attr("y", bbox.y + bbox.height / 2);
            }

            // Schedule toolbar reposition
            if (this.app && typeof this.app._scheduleToolbarReposition === "function") {
              this.app._scheduleToolbarReposition();
            }
          },

          end: (event) => {
            // Finalize: recompute shape bounds and clear cache
            shapeInfo.bounds = this._calculateShapeBounds(shapeInfo.el);

            // Clear cached snapshots
            this._originalShapeBBox = null;
            this._originalShapePoints = null;
            this._originalShapeParams = null;
            this._cachedCanvasRect = null;
            this._cachedTransform = null;

            // Update selection box to reflect final shape bounds
            const t = this.app.getTransform() || { x: 0, y: 0, k: 1 };
            const canvasRect = this.app.viewportNode.getBoundingClientRect();
            const bounds = shapeInfo.bounds;

            element.style.left = `${canvasRect.left + bounds.x * t.k + t.x}px`;
            element.style.top = `${canvasRect.top + bounds.y * t.k + t.y}px`;
            element.style.width = `${bounds.width * t.k}px`;
            element.style.height = `${bounds.height * t.k}px`;
          },
        },
      })
      .draggable({
        // Only allow dragging from the selection box itself, not the handles
        ignoreFrom: ".resize-handle",
        listeners: {
          move: (event) => {
            if (shapeInfo.locked) return;

            const transform = this.app.getTransform() || { x: 0, y: 0, k: 1 };
            const k = transform.k || 1;
            const worldDx = event.dx / k;
            const worldDy = event.dy / k;

            // Move shape
            this.moveBy(shapeInfo.id, worldDx, worldDy);

            // Update selection box screen position
            const left = parseFloat(element.style.left || 0) + event.dx;
            const top = parseFloat(element.style.top || 0) + event.dy;
            element.style.left = `${left}px`;
            element.style.top = `${top}px`;

            // Update shape bounds
            shapeInfo.bounds = this._calculateShapeBounds(shapeInfo.el);

            // Schedule toolbar reposition
            if (this.app && typeof this.app._scheduleToolbarReposition === "function") {
              this.app._scheduleToolbarReposition();
            }
          },
        },
      });

    // Enable pointer events only on the selection box when dragging is needed
    element.style.pointerEvents = "auto";
  }

  // Apply transform to shape from snapshot (non-cumulative, mirrors InkManager approach)
  _applyTransformToShapeFromSnapshot(shapeInfo, scaleX, scaleY, translateX, translateY) {
    const ob = this._originalShapeBBox || shapeInfo.el.node().getBBox();

    if (shapeInfo.type === "rect" || shapeInfo.type === "roundedRect") {
      const params = this._originalShapeParams || {
        x: parseFloat(shapeInfo.el.attr("x")),
        y: parseFloat(shapeInfo.el.attr("y")),
        width: parseFloat(shapeInfo.el.attr("width")),
        height: parseFloat(shapeInfo.el.attr("height")),
      };

      const newX = ob.x + translateX;
      const newY = ob.y + translateY;
      const newW = Math.max(1e-6, ob.width * scaleX);
      const newH = Math.max(1e-6, ob.height * scaleY);

      shapeInfo.el.attr("x", newX).attr("y", newY).attr("width", newW).attr("height", newH);

      if (shapeInfo.type === "roundedRect") {
        // Scale rx/ry proportionally
        const rx = parseFloat(shapeInfo.el.attr("rx") || 8);
        const ry = parseFloat(shapeInfo.el.attr("ry") || rx);
        const avgScale = (scaleX + scaleY) / 2;
        shapeInfo.el.attr("rx", Math.max(0, rx * avgScale)).attr("ry", Math.max(0, ry * avgScale));
      }
    } else if (shapeInfo.type === "circle") {
      const params = this._originalShapeParams || {
        cx: parseFloat(shapeInfo.el.attr("cx")),
        cy: parseFloat(shapeInfo.el.attr("cy")),
        r: parseFloat(shapeInfo.el.attr("r")),
      };

      // Transform circle center and radius
      const newCx = ob.x + (params.cx - ob.x) * scaleX + translateX;
      const newCy = ob.y + (params.cy - ob.y) * scaleY + translateY;
      const avgScale = (scaleX + scaleY) / 2;
      const newR = Math.max(0.5, params.r * avgScale);

      shapeInfo.el.attr("cx", newCx).attr("cy", newCy).attr("r", newR);
    } else if (shapeInfo.type === "triangle" || shapeInfo.type === "diamond" || shapeInfo.type === "chevron") {
      // Transform polygon/path points from snapshot
      const originalPoints = this._originalShapePoints || this._parsePointsAttr(shapeInfo);
      const transformedPoints = originalPoints.map((pt) => {
        const relX = pt.x - ob.x;
        const relY = pt.y - ob.y;
        return {
          x: ob.x + translateX + relX * scaleX,
          y: ob.y + translateY + relY * scaleY,
        };
      });

      if (shapeInfo.type === "chevron") {
        shapeInfo.el.attr("d", this._pointsToChevronPath(transformedPoints));
      } else {
        shapeInfo.el.attr("points", transformedPoints.map((p) => `${p.x},${p.y}`).join(" "));
      }
    }

    // Update shape bounds after transformation
    shapeInfo.bounds = this._calculateShapeBounds(shapeInfo.el);
  }

  // Position resize handles
  _positionHandle(handle, position) {
    const handleSize = "4px";
    switch (position) {
      case "nw":
        handle.style.left = `-${handleSize}`;
        handle.style.top = `-${handleSize}`;
        break;
      case "ne":
        handle.style.right = `-${handleSize}`;
        handle.style.top = `-${handleSize}`;
        break;
      case "sw":
        handle.style.left = `-${handleSize}`;
        handle.style.bottom = `-${handleSize}`;
        break;
      case "se":
        handle.style.right = `-${handleSize}`;
        handle.style.bottom = `-${handleSize}`;
        break;
    }
  }

  // Get cursor for handle
  _getCursorForHandle(handle) {
    const cursors = {
      nw: "nw-resize",
      ne: "ne-resize",
      sw: "sw-resize",
      se: "se-resize",
    };
    return cursors[handle] || "default";
  }

  // Remove selection box
  _removeSelectionBox() {
    if (this.selectionBox) {
      if (this.interactInstance) {
        try {
          this.interactInstance.unset();
        } catch (err) {
          /* ignore */
        }
        this.interactInstance = null;
      }
      this.selectionBox.remove();
      this.selectionBox = null;
    }
  }

  // Update selection box position after canvas transforms (called by app)
  updateSelectionBoxPositionOnTransform() {
    if (!this.selectedShapeId || !this.selectionBox) return;

    const shapeInfo = this.shapes.get(this.selectedShapeId);
    if (!shapeInfo || !shapeInfo.bounds) return;

    const bounds = shapeInfo.bounds;
    const transform = this.app.getTransform();
    const canvasRect = this.app.viewportNode.getBoundingClientRect();

    // Convert world coordinates to screen coordinates
    const screenX = bounds.x * transform.k + transform.x;
    const screenY = bounds.y * transform.k + transform.y;
    const screenWidth = bounds.width * transform.k;
    const screenHeight = bounds.height * transform.k;

    this.selectionBox.style.left = screenX + canvasRect.left + "px";
    this.selectionBox.style.top = screenY + canvasRect.top + "px";
    this.selectionBox.style.width = screenWidth + "px";
    this.selectionBox.style.height = screenHeight + "px";
  }

  // Keep the active text editor overlay aligned with the shape during zoom/pan
  updateTextEditorPositionOnTransform() {
    if (!this.editingTextId) return;
    const shapeInfo = this.shapes.get(this.editingTextId);
    if (!shapeInfo || !shapeInfo.textEditorOverlay) return;
    // Refresh world bbox from live shape geometry
    const bbox = shapeInfo.el.node().getBBox();
    shapeInfo.textEditorOverlay.worldBBox = { x: bbox.x, y: bbox.y, width: bbox.width, height: bbox.height };
    this._updateTextEditorOverlayPosition(shapeInfo);
  }

  _updateTextEditorOverlayPosition(shapeInfo) {
    const overlay = shapeInfo && shapeInfo.textEditorOverlay;
    if (!overlay || !overlay.el) return;
    const t = this.app.getTransform() || { x: 0, y: 0, k: 1 };
    const b = overlay.worldBBox || { x: 0, y: 0, width: 0, height: 0 };
    const left = b.x * t.k + t.x;
    const top = b.y * t.k + t.y;
    const width = Math.max(0, b.width * t.k);
    const height = Math.max(0, b.height * t.k);

    const el = overlay.el;
    el.style.left = left + "px";
    el.style.top = top + "px";
    el.style.width = width + "px";
    el.style.height = height + "px";

    // Use a fixed default font size for the editor, scaled by zoom
    const defaultFontSize = 16;
    const scaledFontSize = Math.max(8, defaultFontSize * t.k); // Ensure font size doesn't get too small
    el.style.fontSize = scaledFontSize + "px";
  }

  // Get selection box screen rect (for toolbar positioning)
  getShapeScreenRect(numericId) {
    if (!this.selectedShapeId || !this.selectionBox) return null;

    const shapeInfo = this.shapes.get(this.selectedShapeId);
    if (!shapeInfo || shapeInfo.numericId !== numericId) return null;

    return this.selectionBox.getBoundingClientRect();
  }

  // Toggle lock state for selected shape
  toggleLockShape(numericId) {
    if (!this.selectedShapeId) return false;

    const shapeInfo = this.shapes.get(this.selectedShapeId);
    if (!shapeInfo || shapeInfo.numericId !== numericId) return false;

    shapeInfo.locked = !shapeInfo.locked;

    // Update interact instance if selection box exists
    if (this.selectionBox && this.interactInstance) {
      try {
        if (shapeInfo.locked) {
          this.interactInstance.unset();
          this.interactInstance = null;
          this.selectionBox.classList.add("locked");
        } else {
          this.selectionBox.classList.remove("locked");
          this._initializeInteractOnBox(this.selectionBox, shapeInfo);
        }
      } catch (err) {
        console.warn("toggleLockShape: interact toggle failed", err);
      }
    }

    return shapeInfo.locked;
  }

  startEditingText(shapeId) {
    console.log(shapeId);
    const shapeInfo = this.shapes.get(shapeId);
    if (!shapeInfo) return;
    if (shapeInfo.locked) return;

    if (this.editingTextId) {
      this.stopEditingText();
    }
    this.editingTextId = shapeId;
    // Remove any rendered SVG text while editing to avoid overlap
    if (shapeInfo.textEl) {
      shapeInfo.textEl.remove();
      delete shapeInfo.textEl;
    }

    // Remove selection box while editing to prevent blocking
    this._removeSelectionBox();

    const shapeNode = shapeInfo.el.node();
    const bbox = shapeNode.getBBox(); // world-space bbox

    // Create DOM overlay in #stage so it stays above SVG and is readable
    const stage = this.app && this.app.stage;
    if (!stage) return;

    const editor = document.createElement("div");
    editor.className = "shape_text_editor_overlay";
    editor.contentEditable = "true";
    editor.style.position = "absolute";
    editor.style.left = "0px";
    editor.style.top = "0px";
    editor.style.width = "0px";
    editor.style.height = "0px";
    editor.style.display = "flex";
    editor.style.alignItems = "center";
    editor.style.justifyContent = "center";
    editor.style.textAlign = "center";
    editor.style.outline = "none";
    editor.style.border = "none";
    editor.style.background = "transparent";
    editor.style.color = "#111";
    editor.style.fontFamily = "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial";
    editor.style.lineHeight = "1.2";
    editor.style.boxSizing = "border-box";
    editor.style.padding = "4px";
    editor.style.zIndex = "100001";
    editor.style.userSelect = "text";
    editor.style.whiteSpace = "pre-wrap";
    editor.style.wordBreak = "break-word";
    editor.style.overflow = "hidden";

    // Seed value
    editor.innerText = (shapeInfo.text || "").trim();

    stage.appendChild(editor);

    // Store overlay ref & bbox in world coords for transform updates
    shapeInfo.textEditorOverlay = {
      el: editor,
      worldBBox: { x: bbox.x, y: bbox.y, width: bbox.width, height: bbox.height },
    };

    // Initial placement
    this._updateTextEditorOverlayPosition(shapeInfo);

    // Focus caret at end
    setTimeout(() => {
      try {
        editor.focus();
        const sel = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(editor);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      } catch (err) {}
    }, 0);

    // Prevent selection system from handling events on the editor
    editor.addEventListener("pointerdown", (ev) => ev.stopPropagation(), true);
    editor.addEventListener("mousedown", (ev) => ev.stopPropagation(), true);

    // Commit editing when clicking outside or on Escape
    const commit = () => {
      const value = editor.innerText.replace(/\u200B/g, "").trim();
      shapeInfo.text = value;
      if (editor && editor.parentNode) editor.parentNode.removeChild(editor);
      delete shapeInfo.textEditorOverlay;
      if (shapeInfo.text) {
        this.renderText(this.editingTextId);
        this.adjustTextSize(this.editingTextId);
      }
      this.editingTextId = null;
    };

    const onPointerDownOutside = (event) => {
      if (!editor.contains(event.target)) {
        document.removeEventListener("pointerdown", onPointerDownOutside, true);
        commit();
      }
    };
    // Defer listener to avoid immediate close from the same opening event
    setTimeout(() => {
      document.addEventListener("pointerdown", onPointerDownOutside, true);
    }, 0);

    const onKeyDown = (ev) => {
      if (ev.key === "Escape") {
        ev.preventDefault();
        document.removeEventListener("pointerdown", onPointerDownOutside, true);
        commit();
      }
    };
    editor.addEventListener("keydown", onKeyDown);
  }

  stopEditingText() {
    if (!this.editingTextId) return;

    const shapeInfo = this.shapes.get(this.editingTextId);
    if (shapeInfo && shapeInfo.textEditorOverlay) {
      const editor = shapeInfo.textEditorOverlay.el;
      shapeInfo.text = editor.innerText.replace(/\u200B/g, "").trim();
      if (editor && editor.parentNode) editor.parentNode.removeChild(editor);
      delete shapeInfo.textEditorOverlay;

      // adjustTextSize will now handle rendering the text.
      this.adjustTextSize(this.editingTextId);
    }
    this.editingTextId = null;
  }

  adjustTextSize(shapeId) {
    const shapeInfo = this.shapes.get(shapeId);
    if (!shapeInfo) return;

    if (!shapeInfo.text) {
      // If there's no text, ensure any old text element is removed.
      if (shapeInfo.textEl) {
        shapeInfo.textEl.remove();
        shapeInfo.textEl = null;
      }
      return;
    }

    const shapeBBox = shapeInfo.el.node().getBBox();
    const padding = 10;
    const maxHeight = shapeBBox.height - padding;
    const maxWidth = shapeBBox.width - padding;

    let fontSize = 32;

    while (fontSize >= 8) {
      const textEl = this.renderText(shapeId, fontSize);
      if (!textEl) break;

      const textBBox = textEl.node().getBBox();

      if (textBBox.width <= maxWidth && textBBox.height <= maxHeight) {
        break;
      }

      fontSize--;
    }

    if (fontSize < 8) {
      this.renderText(shapeId, 8);
    }
  }

  renderText(shapeId, fontSize = 16) {
    const shapeInfo = this.shapes.get(shapeId);
    if (!shapeInfo) return null;

    // Always remove the old text element if it exists
    if (shapeInfo.textEl) {
      shapeInfo.textEl.remove();
      shapeInfo.textEl = null;
    }

    // If there's no text, we're done
    if (!shapeInfo.text) {
      return null;
    }

    const bbox = shapeInfo.el.node().getBBox();
    const padding = 10;
    const maxWidth = bbox.width - padding;
    const lineHeight = 1.2;

    const textEl = this.svgGroup
      .append("text")
      .attr("x", bbox.x + padding)
      .attr("y", bbox.y + bbox.height / 2)
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "central")
      .style("pointer-events", "none")
      .style("font-family", "Arial, sans-serif")
      .style("font-size", `${fontSize}px`)
      .style("fill", "black");

    const userLines = shapeInfo.text.split("\n");
    const wrappedLines = [];
    const tempTspan = textEl.append("tspan");

    userLines.forEach((userLine) => {
      const words = userLine.split(" ");
      let currentLine = "";
      for (const word of words) {
        const testLine = currentLine ? currentLine + " " + word : word;
        tempTspan.text(testLine);
        if (tempTspan.node().getComputedTextLength() > maxWidth && currentLine !== "") {
          wrappedLines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      wrappedLines.push(currentLine);
    });

    tempTspan.remove();

    const startDy = -((wrappedLines.length - 1) / 2) * lineHeight;

    wrappedLines.forEach((line, i) => {
      const tspan = textEl
        .append("tspan")
        .attr("x", bbox.x + padding)
        .text(line || " ");

      if (i === 0) {
        tspan.attr("dy", `${startDy}em`);
      } else {
        tspan.attr("dy", `${lineHeight}em`);
      }
    });

    shapeInfo.textEl = textEl;
    return textEl;
  }

  // Delete shape by ID (called from toolbar)
  deleteShapeById(numericId) {
    // Find shape by numeric ID
    let targetShapeId = null;
    for (const [shapeId, shapeInfo] of this.shapes) {
      if (shapeInfo.numericId === numericId) {
        targetShapeId = shapeId;
        break;
      }
    }

    if (!targetShapeId) return;

    const shapeInfo = this.shapes.get(targetShapeId);
    if (shapeInfo) {
      // Record deletion for undo/redo before removing
      if (typeof HistoryManager !== "undefined") {
        const attrs = {
          stroke: shapeInfo.el.attr("stroke"),
          "stroke-width": shapeInfo.el.attr("stroke-width"),
          fill: shapeInfo.el.attr("fill"),
        };

        HistoryManager.recordOperation("delete", "shapes", "delete", {
          id: numericId,
          shapeId: targetShapeId,
          type: shapeInfo.type,
          startBox: shapeInfo.startBox,
          text: shapeInfo.text,
          attrs,
        });
      }
      // Remove text element if exists
      if (shapeInfo.textEl) {
        shapeInfo.textEl.remove();
      }

      // Remove SVG element
      shapeInfo.el.remove();

      // Remove from shapes map
      this.shapes.delete(targetShapeId);

      // Clear selection if this was the selected shape
      if (this.selectedShapeId === targetShapeId) {
        this.selectedShapeId = null;
        this._removeSelectionBox();
      }
    }
  }

  moveBy(shapeId, dx, dy) {
    const info = this.shapes.get(shapeId);
    if (!info) return;
    const el = info.el;
    const type = info.type;

    if (type === "rect" || type === "roundedRect") {
      el.attr("x", parseFloat(el.attr("x") || 0) + dx).attr("y", parseFloat(el.attr("y") || 0) + dy);
    } else if (type === "circle") {
      el.attr("cx", parseFloat(el.attr("cx") || 0) + dx).attr("cy", parseFloat(el.attr("cy") || 0) + dy);
    } else if (type === "triangle" || type === "diamond" || type === "chevron") {
      const pts = this._parsePointsAttr(info);
      const moved = pts.map((p) => ({ x: p.x + dx, y: p.y + dy }));
      if (type === "chevron") {
        info.el.attr("d", this._pointsToChevronPath(moved));
      } else {
        info.el.attr("points", moved.map((p) => `${p.x},${p.y}`).join(" "));
      }
    }

    if (info.textEl) {
      // Move the main <text> container
      info.textEl.attr("x", parseFloat(info.textEl.attr("x")) + dx).attr("y", parseFloat(info.textEl.attr("y")) + dy);

      // Also move each tspan inside, since they have their own x attributes for wrapping
      info.textEl.selectAll("tspan").each(function () {
        const tspan = d3.select(this);
        tspan.attr("x", parseFloat(tspan.attr("x")) + dx);
      });
    }

    // Update bounds after move
    info.bounds = this._calculateShapeBounds(info.el);
  }

  clearSelection() {
    if (this.selectedShapeId) {
      const shapeInfo = this.shapes.get(this.selectedShapeId);
      if (shapeInfo) {
        shapeInfo.el.classed("shape-selected", false);
      }
      this.selectedShapeId = null;
      this._removeSelectionBox();
      window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type: null } }));
    }
  }

  deleteSelected() {
    if (!this.selectedShapeId) return;
    const shapeInfo = this.shapes.get(this.selectedShapeId);
    if (shapeInfo) {
      if (shapeInfo.textEl) {
        shapeInfo.textEl.remove();
      }
      shapeInfo.el.remove();
      this.shapes.delete(this.selectedShapeId);
      this.selectedShapeId = null;
      this._removeSelectionBox();
    }
  }

  hitTest(worldX, worldY) {
    // Check shapes from top to bottom (most recent first)
    const shapes = Array.from(this.shapes.values()).reverse();
    for (const shapeInfo of shapes) {
      const bbox = shapeInfo.el.node().getBBox();
      if (worldX >= bbox.x && worldX <= bbox.x + bbox.width && worldY >= bbox.y && worldY <= bbox.y + bbox.height) {
        return shapeInfo.id; // Return string ID for unified selection system
      }
    }
    return null;
  }

  // Select shape by string ID (called by unified selection system)
  // selectById(shapeId) {
  //   console.log(shapeId);

  //   const shapeInfo = this.shapes.get(shapeId);
  //   if (shapeInfo) {
  //     this.select(shapeId);
  //   }
  // }
}
